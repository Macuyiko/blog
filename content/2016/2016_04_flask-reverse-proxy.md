Title: Fixing Flask url_for when Behind mod_proxy
Author: Seppe "Macuyiko" vanden Broucke
Date: 2016-04-22 10:01

Imagine you have an Apache server set up with a virtualhost configuration listening to some domain, e.g.

	my.domain:8080

You have a Flask app running at:

	localhost:5000

You want to add a mod_proxy directive so that:

	http://my.domain:8080/app_location/  --->  http://localhost:5000

Most resources will suggest the following:

	ProxyPass /app_location/  http://localhost:5000/
	# Wrong:
	ProxyPassReverse /app_location/ http://localhost:5000/

However, you should follow the advice from [this post](http://alex.eftimie.ro/2013/03/21/how-to-run-flask-application-in-a-subpath-using-apache-mod_proxy/) and use:

	ProxyPass /app_location/ http://localhost:5000/
	ProxyPassReverse /app_location/ http://my.domain:8080/app_location/

The first line remains the same (forward all requests at location `app_location` to this server over there), but the `ProxyPassReverse`-line changes changes (`ProxyPassReverse` will do a string replace in the HTTP Location headers). For Flask, however, you will have to use `http://my.domain:8080/app_location/` as the target and not just `http://my.domain:8080/` as the blog post above suggests.

Next up, you'll might notice that `url_for` is not working as expected, and is rewriting URLs without the `app_location` appended to it, or using `localhost` and not `my.domain`. Solution as [inspired by this snippet](http://flask.pocoo.org/snippets/35/). First, create a class as follows:

	from flask import Flask, flash, render_template, redirect, url_for, session, request, send_from_directory, abort
	from flask import Response, Blueprint
	from werkzeug.serving import run_simple
	from werkzeug.wsgi import DispatcherMiddleware
	import datetime

	class ReverseProxied(object):

	    def __init__(self, app, script_name=None, scheme=None, server=None):
	        self.app = app
	        self.script_name = script_name
	        self.scheme = scheme
	        self.server = server
	        
	    def __call__(self, environ, start_response):
	        script_name = environ.get('HTTP_X_SCRIPT_NAME', '') or self.script_name
	        if script_name:
	            environ['SCRIPT_NAME'] = script_name
	            path_info = environ['PATH_INFO']
	            if path_info.startswith(script_name):
	                environ['PATH_INFO'] = path_info[len(script_name):]
	        scheme = environ.get('HTTP_X_SCHEME', '') or self.scheme
	        if scheme:
	            environ['wsgi.url_scheme'] = scheme
	        server = environ.get('HTTP_X_FORWARDED_SERVER', '') or self.server
	        if server:
	            environ['HTTP_HOST'] = server
	        return self.app(environ, start_response)

Then set up your app using:

	app = Flask(__name__)
	app.wsgi_app = ReverseProxied(app.wsgi_app, script_name='/app_location')