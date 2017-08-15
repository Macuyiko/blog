Title: I Almost Switched to Pelican, a Static Blog Engine
Date: 2013-06-20
Author: Seppe "Macuyiko" vanden Broucke

Visitors familiar with my blog will notice a pretty big change when viewing this post. The blog's been due for a redesign for some time now, so a few days ago I finally went through with it.

The redesign took more time than expected, since I spent quite a lot of time setting up [Pelican](http://blog.getpelican.com/) -- a static blog engine written in Python, including converting all my Blogger posts to Markdown. I will describe some of the reasoning behind this, together with the reason why I ultimately stayed with Blogger -- for now.

### What's Wrong with Blogger?

I've been using Blogger for many years. Delving into the archives of this site suggest I've been seriously using it since 2005, with my main blog being called "Macuyiko's Mindcube" back then. In fact, it's [still online](http://macuyiko.blogspot.be/), with the last post redirecting visitors to my new blog ("Bed Against The Wall").

Throughout the years, that -- this -- blog went through a series of redesigns and shifted through topics of interest. To be honest, I was never that good at consistently putting out content, but being able to keep the thing running for almost ten years now is an accomplishment in itself, I suppose.

Anyway, I've been getting somewhat disappointment with Blogger lately, something which started some two or three years ago, when I started putting out longer articles, containing also more code fragments. Don't get me wrong, I don't think Blogger is bad, but the following things were becoming an annoyance:

 * I've seen my fair share of Javascript WYSIWYG editors -- either bolted to your favorite blogging platform of choice or "that PHP Content Management System from the nineties". While libraries and frameworks such as JQuery have helped to clear out some of the mess, I honestly feel that 99% of them still behave like crap.

    I'll not go into details about all the things wrong with Javascript editors now. Still, there is one silver lining which is worth mentioning: the amount of great Markdown based Javascript editors which have appeared during the past years. For example, check out [EpicEditor](http://epiceditor.com/), [markItUp!](http://markitup.jaysalvat.com/home/), [markdown live editor](http://jrmoran.com/playground/markdown-live-editor/), [WMD](https://code.google.com/p/wmd/) (outdated) and its [many](http://blog.stackoverflow.com/2008/12/reverse-engineering-the-wmd-editor/) [spinoffs](https://code.google.com/p/pagedown/). I absolutely love Markdown, and have even forced it to users of websites I've built, using one of the aforementioned Javascript editors to make it clear how easy it is to write Markdown text.

    At this point you might be wondering what, exactly, is so messed up about the Blogger WYSIWYG editor. There isn't anything *really* wrong with it, but the following has been bothering me:

    - Inserting code is a problem. You have to deal with `pre`, `tt`, `code` tags together with installations of Pretty Print (or similar libraries). Don't forget to convert your `<`'s to `&lt;` or things won't work. Make sure your whitespace is correct, meaning that you alternate between tabs, spaces, or a bunch of `&nbsp;`'s.
    - So okay, maybe Blogger isn't great for code, but at least it's perfect for writing, right? Not really. It's okay, but the rise of recent "modern magazines" such as [Medium](https://medium.com/) and [SVBTLE](https://svbtle.com/) have made it clear that writing can be a much smoother process. Heck, even Wordpress' editor is nicer, and will apply many typographic fixes such as converting two dashes to an em-dash.
    - Blogger allows too many formatting options. Since its editor is a WYSIWYG on top of HTML, it's perfectly fine to copy-paste in ugly text coming from an e-mail message or that Word document you typed out... `<span>` with `mso-style`, anyone? Please, just allow me to apply headings, emphasis, lists and paragraphs to my text, but let the theme CSS do its thing and leave out the styling.

 * Making changes to the template is bothersome. Blogger's template system is fine as long as you keep using one of the default themes, maybe make some slight color or font changes, and leave the rest as is. Once you want to start moving stuff around however, add backgrounds or lots of custom CSS/JS, things get harder and you quickly and up in the middle of "tag soup". I didn't even manage to change the background of the final theme I was using once, even though I was initially planning to do so once in awhile. It's not hard, but my laziness outshines the difficulty.

That said, there are plenty of things which I do like about Blogger. It's very easy to set up a basic blog, there are many widgets to choose from, basic templating stuff is fine if you don't mind your blog having a common look and feel. Also, comment management and moderation works pretty well, especially now with the Google+ integration.

So, in short, what I wanted was:

 * The ability to write in Markdown
 * The ability to easy add in code, syntax highlighted if possible
 * Nice typographic options, beautiful text
 * Easy theming support

Blogger was starting to make this pretty hard.

### Solutions, Workarounds and Alternatives

#### Just continue to use Blogger?

I'm not alone in my desire to use Markdown with Blogger. The topic has actually been discussed to a great extent, with solutions including the following:

 * Write Markdown on your computer, [then convert to HTML](http://notely.blogspot.be/2011/08/how-to-use-markdown-in-blogspot-posts.html) with one of many tools out their. Cons: redundancy, no central "post" repository, making edits is hard. Not 100% web based.
 * Use one of these neat apps such as [Byword](http://mac.appstorm.net/reviews/productivity-review/byword-2-is-the-markdown-blogging-app-weve-been-waiting-for/) ([MarsEdit](http://www.red-sweater.com/marsedit/) as well?) which lets you publish to Blogger. Cons: not 100% web based, no central posts repository. Often Mac only...
 * Write a web app using Blogger's API which would allow me write posts using Markdown and publish them to Blogger after converting them to HTML. But this would've taken so much effort.
 * Include a bunch of magic Javascript scripts/parsers on your Blogger blog which will perform the conversion of Markdown to HTML client-side. This keeps your posts centrally stored, but relies on too much hacks to feel like a great solution. Still, it's [being](http://webreflection.blogspot.be/2013/04/writing-markdown-in-blogger.html) [used](http://blog.chukhang.com/2011/09/markdown-in-blogger.html). [mmd.js](https://github.com/p01/mmd.js) seems to be the preferred Javascript Markdown parser as of now.

#### Switch to another service

There has been a renaissance of writing on the web. When 2012 used to be about Tweets and short status updates, sites like [Neocities](http://neocities.org/) or [Medium](https://medium.com/) are putting the emphasis back on simple, well written web sites.

Indeed, the options for a minimalistic blog are many. Many of them support Markdown out of the box. Many of them do away with many typical overblown blogging features. No comments, no complex theming, just writing:

 * [Tumblr](http://tumblr.com)
 * [Medium](https://medium.com)
 * [SVBLTE](https://svbtle.com)
 * [Scriptogram](http://scriptogr.am/)
 * [Calepin](http://calepin.co/)
 * [GitHub Pages](http://pages.github.com/)

I will admin, these all look fantastic. I'm already using Tumblr for my [random stuff I find online blog](http://tumblr.macuyiko.com/); the Dropbox based options look like great Zen-like blogging experience. I have my invite for Medium, and the platform looks fantastic.

I would've gone with one of these options (in fact, I'm still on the fence), but I was a bit disappointed with (i) the lack of code formatting support on most of these platforms, (ii) the lack of any theming to make yourself stand out.

#### Host it yourself, static-like

A final alternative solution I was considering was hosting the blog myself using a static blog engine. I don't mind Wordpress, but think it's completely overkill for a simple use case such as mine. I considered the following options:

 * [Jekyll](http://jekyllrb.com/): Ruby, Markdown or Textile, robust, proven, powers GitHub Pages...
 * [Octopress](http://octopress.org/): sits on top of Jekyll to provide a more full featured blogging platform.
 * [Hyde](http://hyde.github.io/): "Jekyll's evil twin". Python, Jinja2, full-featured.
 * [Hakyll](http://jaspervdj.be/hakyll/): Haskell, robust, esoteric.
 * [Acrylamid](https://github.com/posativ/acrylamid/): Python, Markdown and reStructuredText, Jinja2. Fast, experimental.
 * [Utterson](https://github.com/stef/utterson): Unix, HTML. Basic, experimental.
 * [Rog](http://rog.rubyforge.org/): Ruby, simple, young.
 * [Cyrax](https://pypi.python.org/pypi/cyrax): Python, Jinja2, young.
 * [Second Crack](http://www.marco.org/secondcrack): PHP, one of the few PHP static blogging engines worth mentioning these days (shows how the language has evolved, actually...). Created by Marco Arment, so you know it can hold its own. Not suitable for everyone though.
 * [Pelican](http://pelican.readthedocs.org/): Python, Jinja2, Markdown and others, well-featured, easily usable.

Ultimately, I settled on Pelican. I liked Jekyll, but wanted a Python based engine since I didn't want to deal with installing Ruby on the server I'd be using. Installing Pelican is very simple. Just `pip install` `pelican`, `Markdown` and `typogrify` and you're set. [Typogrify](http://jeffcroft.com/blog/2007/may/29/typogrify-easily-produce-web-typography-doesnt-suc/) is a great Python library which helps you to prettify written text, mostly thanks to Gruber's fantastic [SmartyPants](http://daringfireball.net/projects/smartypants/) plug-in.

Configuration is just an easy step consisting of modifying `pelicanconf.py`:

	#!/usr/bin/env python
	# -*- coding: utf-8 -*- #
	from __future__ import unicode_literals

	AUTHOR = u'Your Name Here'
	SITENAME = u'Your Title Here'
	SITEURL = ''

	TIMEZONE = 'Europe/Brussels'
	DEFAULT_LANG = u'en'
	TYPOGRIFY = True

	# Generation
	DIRECT_TEMPLATES = ('index', 'archives')
	MONTH_ARCHIVE_SAVE_AS = 'archives/{date:%Y}/{date:%m}/index.html'
	YEAR_ARCHIVE_SAVE_AS = 'archives/{date:%Y}/index.html'

	# Feeds
	FEED_ATOM = 'feeds/atom.xml'
	FEED_RSS = 'feeds/rss.xml'
	FEED_ALL_ATOM = None
	CATEGORY_FEED_ATOM = None
	TRANSLATION_FEED_ATOM = None

	# Blogroll
	LINKS =  (('Name', 'http://url.com/'),
	    )

	# Social widget
	SOCIAL = (('Twitter', 'http://twitter.com/username'),
	     )

	DEFAULT_PAGINATION = 10

	# Template
	THEME = "themes/custom_theme"

I then picked the [TuxLite ZF](https://github.com/getpelican/pelican-themes/tree/master/tuxlite_zf) theme from `pelican-themes` as a starting point to put in `custom_theme`. I changed the color scheme, header sizes and spacings and fonts (making use of [Google's web fonts](http://www.google.com/fonts/) to pick out a nice heading font which would work well with large-sized OpenSans for the normal text, which I'm currently in love with -- it works great for slides as well, try it!). Editing the Jinja2 themes was a breeze and mostly consisted of taking stuff away -- like tags and categories -- which I didn't need. Finally, I made sure to made the background "pop" behind the single-column content, using inspirational, high resolution foto's.

Next up, the hard part, *converting all my Blogger posts to Markdown*... Luckily, Lars Kellogg-Stedman has had the same problem and describes possible approaches in [this post](http://blog.oddbit.com/post/converting-html-to-markdown). I thus created a folder with the following:

 * `blogger2md.py` from https://gist.github.com/larsks/4022537
 * `blogger-export.xml` from Blogger: an export of your blog
 * `html2text.py` from https://raw.github.com/aaronsw/html2text/master/html2text.py

You'll need to install `lxml` to get everything to work. This didn't work for me using `pip`, but `easy_install` did the job. Once this is setup, create a new directory `posts` and run:

	blogger2md.py --html2text --output-dir posts blogger-export.xml

The script will start crunching and convert everything. Afterwards, I went through every post to rename the file name, correct the meta data, fix the links (Pelican wants `(|filename|FILE_PATH)`) and clean up some formatting issues still present after the conversion (quite a lot of them). This took a few evenings, but I now have a collection of Markdown posts for this complete blog.

##### Side track: a trip down memory-lane

While I was converting all these posts, it struck me how long I've been blogging, and how "face-palmingly" bad my writings were as a kid. Luckily, my Geocities page has since long disappeared thanks to Yahoo! (actually, I should retrieve it from the archive for a laugh), but this wasn't that much better. ["This dog is gonna check out town"](http://blog.macuyiko.com/2005/07/back-and-right-into-summer.html)... really, young me? I wanted to keep everything intact, but made some modifications to the language where I really felt I had to (swearing, "hackz0r M$"-bashing, referenced to piracy... hey, I was a poor kid).

It's also funny to see the topics my blog has shifted through:

 * Games, with sad reviews of "classics" such as [Scarface](http://blog.macuyiko.com/2006/10/game-scarface.html)... and [Portal](http://blog.macuyiko.com/2007/10/game-portal.html).
 * Linkdumps, oftentimes based on what I'd read on Digg (yes, Digg!) that day. Is Digg still around? I almost forgot about the [HD-DVD "number gate"](http://blog.macuyiko.com/2007/05/number.html) back then.
 * Linux related posts. Mostly following after acquiring my now pre-historic [Thinkpad X60](http://blog.macuyiko.com/2006/08/welcome-thinkpad-x60.html) which is, in fact, still somewhat being used.
 * Hacking and thinkering... like [here](http://blog.macuyiko.com/2010/08/oldie-but-goodie-privilege-escalation.html) and [here](http://blog.macuyiko.com/2011/01/slowloris-and-mitigations-for-apache.html). Some of these are not that bad. The [Kippo](http://blog.macuyiko.com/2011/03/running-ssh-honeypot-with-kippo-lets.html) article has been pretty popular, together with the [PalettestealerSuspender](http://blog.macuyiko.com/p/palettestealersuspender.html) tool. Others just show off my [horrific PHP skills](http://blog.macuyiko.com/2006/08/realtime-monitoring-with-php.html).
 * [Puzzles](http://blog.macuyiko.com/2009/06/solving-tetris-cube-recursive.html), [algorithms](http://blog.macuyiko.com/2009/01/modern-genetic-and-other-algorithms.html), optimization. I like these as well, but they should be proofed for language, spelling, formatting.

Anyway, back to the main programming now.

#### Just stay with Blogger?

So here I was, ready to launch with Pelican. Admittedly, some of the posts needed some further formatting, some links has to be corrected and the Disqus comment system had to be implemented, but that could be done later. All there was left to do was relink the domain name ([blog.macuyiko.com](blog.macuyiko.com)) and put up a message on the old blog that things had moved.

Still, I wasn't feeling sure about things. Just to be sure, I decided to have another look around to see if things had improved on the Blogger side as of yet, since it'd been a while since I'd searched for solutions.

Turns out there is a web app called [StackEdit](http://benweet.github.io/stackedit/) which provides a great Markdown writing environment, is able to sync to Dropbox or Google Drive (sweet) and is able to publish to Blogger. Alright, maybe one more chance, then. I spent some time revamping the old theme to match the design I'd put together for the static site (you're probably looking at it now), using the same fonts and colors. I had also set out to be able to change the background every time I made a new post, so I made sure I'd be able to do that from now on as well. That's why you're currently looking at a summer-y "pelican" background. It'd be great if I could made the background post-dependent, but maybe that's going too far.

So I'm keeping things a bit longer with Blogger. As I said at the beginning, it offers some nice features, and this way I don't have to introduce yet another commenting system.

On the plus side, I'm now able to write and keep posts as Markdown (using StackEdit with Google Drive) and host at Blogger. The theme doesn't look too bad (will need some further fine tuning) either. Still, if it turns out that I'd rather go to Pelican anyway (or maybe one of the services mentioned above), I now have a collection of Markdown posts at the ready.

I realize this post didn't really offer any information. I guess this was an exercise in keeping things the same while still putting in lots of work. Still, it was nice reading up about static blog engines, and I'm still pretty intrigued by these hip, new services (Blogger certainly feels like the old guy in the block). In addition, the refresh of the Blogger theme has been inspiring in trying to conjure up some new content, so the remainder of the year will see the arrival of some other posts as well -- so long as this experiment goes right, this is a first test post after all. I should still go through the older posts to clean them up, but we'll see what we can manage.
