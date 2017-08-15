Title: Fun with Audiosurf 2 and Mitmproxy
Author: Seppe "Macuyiko" vanden Broucke
Date: 2016-09-24 15:57

I enjoy firing up [Audiosurf 2](http://audiosurf2.com/) from time to time to have some rythmic musical fun. One of the things that has been bothering me, however, is the fact that Audiosurf 2 only integrates with Soundcloud for its music streaming. You can use local files, but since I stream all of my music from YouTube or Spotify, this always leaves me with a limited collection of songs to choose from, and I wondered whether there was a way to circumvent this.

Enter [`mitmproxy`](https://mitmproxy.org/), a powerful interactive console program that allows network traffic to be intercepted, inspected, modified and replayed. `mitmproxy` has a powerful [scripting API](http://docs.mitmproxy.org/en/stable/scripting/inlinescripts.html) that allows you to modify traffic on the fly using simple Python scripts. Perhaps we could use this to make Audiosurf 2 think it is connected to Soundcloud whilst we actually query and download music from YouTube instead.

Let's go through the script from top to bottom. First, we set up our imports and some constants...

	import youtube_dl
	import copy
	import json
	import requests
	from time import sleep
	from urlparse import urlparse, parse_qs
	from urllib import quote
	from mitmproxy.models import HTTPResponse
	from netlib.http import Headers

	ENABLED = True
	YOUTUBE_SHORT_ONLY = True
	YDL_OPTS = {
		'format': 'bestaudio[ext=mp3]/bestaudio[ext=m4a]/bestaudio',
		'progress_hooks': [],
	#	'postprocessors': [{
	#		'key': 'FFmpegExtractAudio',
	#		'preferredcodec': 'mp3',
	#		'preferredquality': '192',
	#	}],
	}

You can enable a postprocessor in `youtube_dl` (the Python library we'll be using to handle the actual downloads from YouTube) to convert any movie to an MP3 with FFmpeg, though this can take up a lot of time. The `'bestaudio[ext=mp3]/bestaudio[ext=m4a]/bestaudio'` format setting works better.

Next up, we need to set up a YouTube API key and a fake response dict representing a track as it would come from the Soundcloud API:

	YOUTUBE_API_KEY = '--- get a youtube api key and set this here ---'
	SOUNDCLOUD_TRACK_TEMPLATE = {
		"download_url":None,
		"key_signature":"",
		"user_favorite":False,
		"likes_count":1,
		"release":"",
		"attachments_uri":"https://api.soundcloud.com/tracks/{}/attachments",
		"waveform_url":"https://api.soundcloud.com/tracks/{}/waveform",
		"purchase_url":None,
		"video_url":None,
		"streamable":True,
		"artwork_url":"https://api.soundcloud.com/tracks/{}/artwork",
		"comment_count":1,
		"commentable":True,
		"description":"",
		"download_count":0,
		"downloadable":False,
		"embeddable_by":"all",
		"favoritings_count":0,
		"genre":"",
		"isrc":"",
		"label_id":None,
		"label_name":"",
		"license":"",
		"original_content_size":10000,
		"original_format":"mp3",
		"playback_count":10000,
		"purchase_title":None,
		"release_day":None,
		"release_month":None,
		"release_year":None,
		"reposts_count":10000,
		"state":"finished",
		"tag_list":"",
		"track_type":"",
		"user":{
			"avatar_url":"",
			"id":111111,
			"kind":"user",
			"permalink_url":"https://soundcloud.com/",
			"uri":"https://api.soundcloud.com/users/111111",
			"username":"",
			"permalink":"",
			"last_modified":"2010/02/16 17:41:26 +0000"},
		"bpm":None,
		"user_playback_count":None,
		"id":1,
		"kind":"track",
		"created_at":"2010/04/14 20:46:00 +0000",
		"last_modified":"2016/08/09 23:59:27 +0000",
		"permalink":"",
		"permalink_url":"",
		"title":"",
		"duration":253300,
		"sharing":"public",
		"stream_url":"https://api.soundcloud.com/tracks/{}/stream",
		"uri":"https://api.soundcloud.com/tracks/{}",
		"user_id":111111
	}

Next, we set up the actual hook to intercept all requests to `api.soundcloud.com`:

	def request(context, flow):
		YDL_OPTS['progress_hooks'].append(lambda d: youtube_download_hook(context, d))
		if ENABLED and flow.request.pretty_host.endswith("api.soundcloud.com"):
			context.log(flow.request.pretty_host + flow.request.path)
			if '/stream' in flow.request.path:
				flow.reply(make_reply_stream(context, flow))
			elif 'q=' in flow.request.path:
				flow.reply(make_reply_query(context, flow))

If the request contains `q=`, Audiosurf is performing a query. The other option we handle is `/stream` which whill stream back the track:

	def download_youtube_video(id):
		with youtube_dl.YoutubeDL(YDL_OPTS) as ydl:
			result = ydl.extract_info('http://www.youtube.com/watch?v='+id, download=True)
			video = result['entries'][0] if 'entries' in result else result
		return result, video


	def youtube_download_hook(context, d):
		if d['status'] == 'finished':
			context.__filename = d['filename']


	def make_reply_stream(context, flow):
		resp = HTTPResponse(b"HTTP/1.1", 200, b"OK",
				Headers(Content_Type="audio/mpeg"), b"")
		id = flow.request.path.split('/')[2]
		context.__filename = None
		context.log(id)
		result, video = download_youtube_video(id)
		while not context.__filename:
			sleep(200)
		context.log(context.__filename)
		resp.content = open(context.__filename, 'rb').read()
		return resp


	def make_reply_query(context, flow):
		resp = HTTPResponse(b"HTTP/1.1", 200, b"OK",
				Headers(Content_Type="application/json"), b"")
		bits = urlparse(flow.request.path)
		query = parse_qs(bits.query)['q'][0]
		list = make_song_list(query, context)
		resp.content = json.dumps(list).encode('utf-8')
		return resp

Note that we use some `youtube_dl` hook trickery to make sure we wait until the file is downloaded. (`youtube_dl` will spawn a separate process.)

Finally, we need to implement two more functions:


	def make_song_dict(id, title, artist, description='', artwork_url=None):
		d = copy.deepcopy(SOUNDCLOUD_TRACK_TEMPLATE)
		d['id'] = id
		d['title'] = title
		d['description'] = description
		d['attachments_uri'] = d['attachments_uri'].format(id)
		d['waveform_url'] = d['waveform_url'].format(id)
		d['artwork_url'] = d['artwork_url'].format(id)
		if artwork_url is not None:
			d['artwork_url'] = artwork_url
		d['stream_url'] = d['stream_url'].format(id)
		d['uri'] = d['uri'].format(id)
		d['user']['username'] = artist
		return d


	def make_song_list(query, context):
		q = quote(query)
		vd = 'short' if YOUTUBE_SHORT_ONLY else 'any'
		url = 'https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=50&q={q}&type=video&videoCategoryId=10&videoDuration={vd}&key={key}'.format(q=q, vd=vd, key=YOUTUBE_API_KEY)
		reply = requests.get(url).json()
		list = []
		for item in reply['items']:
			d = make_song_dict(item['id']['videoId'],
				title=item['snippet']['title'],
				artist=item['snippet']['channelTitle'],
				description=item['snippet']['description'],
				artwork_url=item['snippet']['thumbnails']['default']['url'])
			list.append(d)
		return list

And we're done! We can use Proxifier PE or another program to force connections from Audiosurf 2 to go through our man in the middle server. You can see the result in action here:

<iframe width="560" height="315" src="https://www.youtube.com/embed/K3LDeERn9Jw" frameborder="0" allowfullscreen></iframe>

Final warning: this is meant to be a fun weekend experiment and in no way provided to circumvent YouTube or other streaming provider's policies. Just as using `youtube_dl`, use this at your own risk!
