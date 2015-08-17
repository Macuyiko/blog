Title: Small jr.js (Junior) Modification
Author: Seppe "Macuyiko" vanden Broucke
Date: 2014-08-03 15:19

Just a small post. I've been using [this project](https://github.com/Xeoncross/jr) lately to set up some quick static-only-but-Markdown-enabled project pages for a while now.

Basically, it allows you to set up a static website with minimal theming, but with the content rendering offloaded to the browser (in Javascript) instead of relying on some script or program (such as I'm doing on this blog now with Pelican). It's a refreshingly simple way to set up something quickly, but also avoiding html tag soup at the same time.

I've made a fork of the repository which I've uploaded [here](https://github.com/Macuyiko/jr).

The reason for this is that an initial "page" looks like this:

	[Please enable Javascript to render MarkDown]: <pre>
	# My first Markdown page

	Enter you Markdown code here...

	<script src="js/jr.js"></script>

Which allows for a fallback in *most* browsers, but depending on how they render pre tags might look more or less nice. In addition, I kind of miss a simple html skeleton.

So after my minor modifications, I can write the above like this:

	<!DOCTYPE html>
	<html>
	<head>
		<meta charset=utf-8 />
		<title>My first Markdown page</title>
		<link rel="stylesheet" type="text/css" href="fallback.css">
	</head>
	<body><pre>

	# My first Markdown page

	Enter you Markdown code here...

	<script src="js/jr.js"></script>

	</pre></body>
	</html>

Which also allows to set a `fallback.css` which will be used in case Javascript is disabled, where you can include and set some basic styling for pre tags.

