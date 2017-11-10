Title: Building A Presenter View For Linux
Date: 2009-12-05
Author: Seppe "Macuyiko" vanden Broucke

Recently, I had to give a presentation and wanted to use a "presenter screen", allowing to view a clock, current and next slide, and slide notes on my laptop screen. Of course, the audience only sees the current slide fullscreened on the projector screen.

Powerpoint comes with this option built-in, but Openoffice users are out of luck. There's a [presenter screen plugin](http://wiki.services.openoffice.org/wiki/Presenter_Screen) in development, which works fine if you're using a recent version of Openoffice. I couldn't get it to work on my machine, however (I use xrandr to configure my dual screens). Users in [this forum](http://user.services.openoffice.org/en/forum/viewtopic.php?f=10&t=23863&start=0) report that Ubuntu requires some fiddling with the display options or installing Sun's packaged version of Openoffice. I didn't want to do that.

Instead I opted to use Impressive - a Python-powered presenter with some unique features (OpenGL transitions, zoom, spotlight, overview page,...). It also provides an option to Python-script your presentation. We will use that to build a custom made presenter screen.

### Step 1: download and test drive Impressive

Download Impressive from the [official web page](http://impressive.sourceforge.net/). Make sure you have Python installed. Extract it somewhere.

Note: you can follow along with the instructions and perform them yourself, or you can read on and download a packaged ZIP-file at the end if this post.

Test drive Impressive by running the following command in a terminal (make sure you're in the correct directory):

	~/Desktop/Impressive-0.10.2$ ./impressive.py demo.pdf

	Welcome to Impressive version 0.10.2
	./impressive.py:94: DeprecationWarning: the md5 module is deprecated; use hashlib instead
	import random, getopt, os, types, re, codecs, tempfile, glob, StringIO, md5, re
	Detected screen size: 1024x768 pixels
	OpenGL renderer: Mesa DRI Intel(R) 945GM GEM 20090712 2009Q2 RC3 x86/MMX/SSE2
	Using GL_ARB_texture_non_power_of_two.
	Note: pdftk failed, hyperlinks disabled.
	Total presentation time: 0:03.

Press ESC to close the presentation. Do you see the demo presentation? Good. Take some time to familiarize yourself with the features (they're explained in the demo slide, so you can test them out on the fly.

Don't worry about the DeprecationWarning and the pdftk error. We won't be using hyperlinks.

### Step 2: prepare our folder structure

We'll be doing some housekeeping now. In the Impressive folder (where you extracted into), delete everything except `impressive.py`.

Then create a new folder: `Presentation`.

In the Presentation-folder, create two new folders: `Slides` and `Text`.

You now have the following folder structure:

![](http://1.bp.blogspot.com/_X4W-h82Vgjw/SxqIGELL2AI/AAAAAAAAPRo/RxflM5iPh5o/s320/Screenshot.png)

### Step 3: create support scripts

In the top-folder (where `impressive.py` resides), we'll create some simple support scripts.

First: `start.sh` -- a simple script to start our presentation:

	#!/bin/bash
	python impressive.py ./Presentation/presentation.pdf

Next: `clone.sh` -- a simple script to clone our two screens:

	#!/bin/bash
	xrandr --output LVDS1 --mode 1024x768 --output VGA1 --same-as LVDS1 --mode 1024x768

Then: `dual.sh` -- a simple script to enable dualscreen (same resolution, screens above each other, which works best on most configurations):

	#!/bin/bash
	xrandr --output LVDS1 --mode 1024x768 --output VGA1 --above LVDS1 --mode 1024x768`

`converter.sh` -- script to make thumbnails for our presenter view, this needs ImageMagick:

	#!/bin/bash
	echo Removing old images...;
	rm ./Presentation/Slides/slide-*.png;
	echo Converting...;
	convert ./Presentation/presentation.pdf -density 100 slide.png
	for filename in slide-*.png
	do
	  echo Moving $filename;
	  mv $filename ./Presentation/Slides/$filename;
	done

`makeinfo.php` -- PHP script to generate our info file Impress will use, needs PHP CLI:

	<?php
	if (count($argv) != 2)
	  die ("Provide number of pages\n");
	$nrpages = $argv[1];
	ob_start();
	?>

	import json
	def UpdateInfo():
	  global FileName, FileList, PageCount
	  global DocumentTitle
	  global Pcurrent, Pnext, Tcurrent, Tnext, InitialPage
	  global RTrunning, RTrestart, StartTime, PageEnterTime, CurrentTime
	  io = open('./Presentation/json.txt', 'w')
	  json.dump(({"page_count": PageCount, "current_page": Pcurrent, "previous_page": Pnext, "start_time": StartTime, "pageenter_time": PageEnterTime, "current_time": CurrentTime}), io)
	  io.close

	  PageProps = {
	<?php for($page = 1; $page <= $nrpages; $page++): ?>
	  <?php echo $page; ?>: {
	  'transition': None,
	  'OnEnter': UpdateInfo
	  },
	<?php endfor; ?>
	  }

	<?php
	file_put_contents("./Presentation/presentation.pdf.info", ob_get_contents());
	ob_end_clean();
	?>

You now have the following folder structure:

![](http://1.bp.blogspot.com/_X4W-h82Vgjw/SxqK6fLyQEI/AAAAAAAAPRs/nFVKeMvDz_U/s320/Screenshot-1.png)

### Step 4: create the HTML page

In the Presentation-folder, we'll create an HTML page.

`PresenterView.html`:

	<html>
	<head>
	  <title>Presenter View</title>
	<style>
	#information {
	  text-align: center;
	  font-size: 300%;
	  border: 3px solid #ccc;
	  padding: 4px;
	}
	#val_time, #val_pagethis, #val_pagecount {
	  color: #444;
	  font-weight: bold;
	}
	#slideleft {
	  float: left;
	  padding: 4px;
	  border: 1px solid #ccc;
	}
	#slideright {
	  float: right;
	  padding: 4px;
	  border: 1px solid #ccc;
	}
	#text{
	  padding: 4px;
	  margin-top: 10px;
	  border-top: 3px solid #ccc;
	  height: 50px;
	}
	#pane{
	  margin-top: 10px;
	  font-size: 140%;
	}
	#time{
	  margin-top: 40px;
	  text-align: center;
	  font-size: 200%;
	  border: 3px solid #ccc;
	  padding: 4px;
	}
	</style>

	<script type="text/javascript" src="jquery-1.3.2.min.js"></script>
	<script>
	var mins = 0;
	var secs = 0;
	var clock = 0;
	var previousslide = 0;
	var refreshtime = 1000;

	function display_clock(){
	  min = Math.floor(clock/60);
	  secs= clock - mins*60;
	  $("#val_time").text(mins+ ":" + secs);
	}

	function update_clock(){
	  setTimeout ("update_clock()", 1000);
	  clock = clock + 1;
	  display_clock();
	}

	function make_call(){
	  $.ajaxSetup({'beforeSend': function(xhr){
	if (xhr.overrideMimeType){
	  xhr.overrideMimeType("text/plain");
	}
	  }
	  });
	  $.getJSON("json.txt",
	function(data){
	  $("#val_pagethis").text(data.current_page);
	  $("#val_pagecount").text(data.page_count);
	  if (previousslide != data.current_page){
	clock = data.current_time; //synchronize
	$("#val_slideleft").attr("src", "./Slides/slide-"+(data.current_page-1)+".png");
	  if (data.current_page < data.page_count)
	$("#val_slideright").attr("src", "./Slides/slide-"+(data.current_page)+".png");
	  $("#val_text").text(" ");
	  $.get("./Text/text-"+data.current_page+".txt",
	function(data){
	  $("#val_text").html(data);
	});
	}
	previousslide = data.current_page;
	display_clock();
	  });
	  setTimeout ("make_call()", refreshtime);
	}

	$(document).ready(function(){
	  make_call();
	  update_clock();
	});
	</script>
	</head>

	<body>
	  <div id="information">Currently at slide
	<span id="val_pagethis">?</span> of <span id="val_pagecount">?</span>
	  </div>
	  <div id="pane">
	<div id="slideright">
	  Next slide:<br />
	  <img height="360" id="val_slideright" src="./Slides/slide-1.png" /></div>
	  <div id="slideleft">
	Current slide:<br />
	<img height="360" id="val_slideleft" src="./Slides/slide-0.png" /></div>
	  </div>
	  <div style="clear:both;"> </div>
	  <div id="text"><span id="val_text">?</span></div>
	  <div id="time">Clock: <span id="val_time">?</span></div>
	</body>
	</html>

This page uses [jQuery](http://docs.jquery.com/Downloading_jQuery#Current_Release) for a bit of AJAX-magic. So make sure `jquery-1.3.2.min.js` is placed in the Presentation-folder as well.

And we're done. We can now start preparing and giving our presentation...

### Step 5: preparing your presentation

**(1 - Convert to PDF)** Create a nice presentation in Openoffice or Powerpoint. Save it as PDF-slides. Rename your PDF-file to `presentation.pdf` and put it in the Presentation-folder. You now have the following folder structure:

![](http://4.bp.blogspot.com/_X4W-h82Vgjw/SxqN-negDAI/AAAAAAAAPRw/o4inpHJvLZ4/s1600/Screenshot-2.png)

**(2 - Make thumbnails)** Open a terminal, cd to your top-folder, and execute the converter.sh-script:

	~/Desktop/Impressive-0.10.2$ ./converter.sh

	Removing old images...
	Converting...
	Moving slide-0.png
	Moving slide-1.png
	Moving slide-2.png

Your Presentation/Slides-folder should now contain a bunch of PNG-files.

**(3 - Make notes)** In the Presentation/Text folder, create `text-n.txt` files where *n* is the number of the slide. In the text file: write short notes you want to see for that slide (you may use HTML formatting).

**(4 - Create the Impress info script)** Run the PHP file:

	~/Desktop/Impressive-0.10.2$ php makeinfo.php 3

In my example, I have three slides, so I use `3` as the argument. Make sure the number you use is equal (or higher) than your number of slides!

This will have created a `presentation.pdf.info` file in the Presentation-folder:

	import json
	def UpdateInfo():
	  global FileName, FileList, PageCount
	  global DocumentTitle
	  global Pcurrent, Pnext, Tcurrent, Tnext, InitialPage
	  global RTrunning, RTrestart, StartTime, PageEnterTime, CurrentTime
	  io = open('./Presentation/json.txt', 'w')
	  json.dump(({"page_count": PageCount, "current_page": Pcurrent, "previous_page": Pnext, "start_time": StartTime, "pageenter_time": PageEnterTime, "current_time": CurrentTime}), io)
	  io.close

	  PageProps = {
	1: {
	  'transition': None,
	  'OnEnter': UpdateInfo
	},
	2: {
	  'transition': None,
	  'OnEnter': UpdateInfo
	},
	3: {
	  'transition': None,
	  'OnEnter': UpdateInfo
	},
	  }

This script provides Impressive with the necessary actions: every time we enter a script, we write some JSON-information (time, current slide, next slide,...) to `json.txt`. This file will be polled continuously by jQuery in our HTML-page. Also note that I'm not using transitions. (You can change that if you want.)

One last time, your structure should look like this:

![](http://4.bp.blogspot.com/_X4W-h82Vgjw/SxqQQAFnEHI/AAAAAAAAPR0/aKyzBwRB7-U/s400/Screenshot-3.png)

### Step 6: giving your presentation

**(1 - Dual screen)** Open a terminal in your top-folder. And run the `dual.sh` script to switch to dual screen.

**(2 - Open web browser)** Open `PresenterView.html` in a web browser (I like Chromium best). Move it to your laptop screen. Then set it to always stay on top (you can do that by right clicking on the browser-item in the window switcher applet on the Gnome panel). The put it on full screen (F11 in most browsers). Your presenter view is running.

**(3 - Start presentation)** On the main screen, run `start.sh` to start the presentation. The page in the web browser will automatically update depending on which slide you're on. This is what it looks like on the laptop screen:

![](http://1.bp.blogspot.com/_X4W-h82Vgjw/SxqRjx77BOI/AAAAAAAAPR4/i7pI19c3iFo/s400/Screenshot-4.png)

And on the projector, everything looks nice:

![](http://3.bp.blogspot.com/_X4W-h82Vgjw/SxqRqMLsE_I/AAAAAAAAPR8/YWXlCUV8nOQ/s400/Screenshot-5.png)

Also note that Impressive captures the mouse pointer. So once the presentation is going you won't have nasty situations when your mouse pointer leaves the screen and you press the button to advance a slide.

I've packed all the scripts, files, and a test presentation into a zip. You can download it [here](http://static.macuyiko.com/files/presenterview/Impressive-PresenterScreen.zip).
