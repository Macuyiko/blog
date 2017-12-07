Title: Note to Self: Using Tesseract to Extract Subtitles
Author: Seppe "Macuyiko" vanden Broucke
Date: 2017-11-13 14:30

Say you have video such as [this one](https://www.facebook.com/NowThisPolitics/videos/1778169845547831/) on Facebook. Most of these come with hardcoded subtitles, which we'd like to extract (for whatever reason).

Opening the page in Chrome and inspecting the network requests quickly uncovers the media URL:

	https://video-bru2-1.xx.fbcdn.net/v/t42.9040-2/10000000_703970666457205_4416008794480312320_n.mp4?efg=eyJ2ZW5jb2RlX3RhZyI6ImRhc2hfdjNfMTI4MF9jcmZfMjNfaGlnaF8zLjFfZnJhZ18yX3ZpZGVvIn0%3D&oh=40bbd0e0dd5367ed3a2d5ff0e7cbe081&oe=5A09D778&bytestart=0&byteend=953

By cutting off `&bytestart=0&byteend=953`, we can download the video file completely.

Next, we can use `ffmpeg` to create frames every half second:

	./ffmpeg -i .\23354483_145400712877976_2778300398300037120_n.mp4 -r 2 .\frames\image-%07d_original.png

And apply some cropping using Python:

	from PIL import Image
	from glob import glob

	for png_file in glob('./frames/*_original.png'):
		image = Image.open(png_file)
		cropped = image.crop((50, 850, 1080, 1080))
		cropped.save(png_file.replace('.png', '_cropped.png'))

As well as some leveling to only retain white and yellow text:

	from PIL import Image
	from glob import glob

	def level(img):
		copy = img.copy()
		for x in range(img.size[0]):
			for y in range(img.size[1]):
				pxl = list(copy.getpixel((x, y)))
				if pxl[0] < 220 and pxl[1] < 220: 
					pxl[0] = 0
					pxl[1] = 0
					pxl[2] = 0
				else:
					pxl[0] = 255
					pxl[1] = 255
					pxl[2] = 255
				copy.putpixel((x, y), tuple(pxl))
		return copy

	for png_file in glob('./frames/*_cropped.png'):
		image = Image.open(png_file)
		leveled = level(image)
		leveled.save(png_file.replace('_cropped.png', '_leveled.png'))

Next, download [Tesseract](https://github.com/UB-Mannheim/tesseract/wiki) (unzip the setup file using 7-Zip and just dump it somwhere, to prevent running the installer -- it works fine in a portable setup).

Extract the text for every file:

	from glob import glob
	from subprocess import run, PIPE
	from pickle import dump

	def get_ocr(file_name):
		out = run(["./tesseract/tesseract.exe", file_name, "stdout", "-psm", "11"], stdout=PIPE)
		return out.stdout

	lines = []
	for png_file in glob('./frames/*_leveled.png'):
		output = get_ocr(png_file)
		lines.append(output)

	dump(lines, open('lines.p', 'wb'))

Perform a little cleaning using some regex and the Levenshtein distance to remove duplicate lines:

	from pickle import load
	import re

	def levenshteinDistance(s1, s2):
	    if len(s1) > len(s2):
	        s1, s2 = s2, s1
	    dst = range(len(s1) + 1)
	    for i2, c2 in enumerate(s2):
	        dst_ = [i2+1]
	        for i1, c1 in enumerate(s1):
	            if c1 == c2:
	                dst_.append(dst[i1])
	            else:
	                dst_.append(1 + min((dst[i1], dst[i1 + 1], dst_[-1])))
	        dst = dst_
	    return dst[-1]

	lines = load(open('lines.p', 'rb'))

	cleaned = []

	for line in lines:
		clean = line.decode("utf-8")
		clean = clean.rpartition('telus')[2]
		clean = re.sub('\r\n', ' ', clean)
		clean = re.sub('\s\s+', ' ', clean)
		clean = re.sub('[^‘,\.\?!%a-zA-Z0-9\s]+', '', clean)
		if cleaned and cleaned[-1] in clean:
			del cleaned[-1]
		if cleaned and levenshteinDistance(clean, cleaned[-1]) <= 7:
			del cleaned[-1]
		cleaned.append(clean.strip())

	for clean in cleaned:
		print(clean)

The resulting strings should now be easy to manually clean and finalize:

	ENVIRONMENTAL ADVISER WAS A NATURAL DISASTER
	PRESSED HER ON CLIMATE SCIENCE
	It seems to me that you don‘t believe climate change is real.
	I  l am un
	I am uncertain.
	You‘re uncertain?
	No, I‘m not. I‘m sorry. I jumped ahead.
	Climate change is of course real.
	Human activity affect climate change?
	More than likely, but the extent to which,
	I think is very uncertain, and my  Would you rely on scientists
	to give you that answer, or not?
	[...]