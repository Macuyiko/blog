#!/usr/bin/env python
# -*- coding: utf-8 -*- #
from __future__ import unicode_literals

AUTHOR = u'Seppe "Macuyiko" vanden Broucke'
SITENAME = u'Bed Against The Wall'
SITEURL = 'http://blog.macuyiko.com'

TIMEZONE = 'Europe/Brussels'

DEFAULT_LANG = u'en'

TYPOGRIFY = True

DIRECT_TEMPLATES = ('index', 'archives')
ARTICLE_URL = 'post/{date:%Y}/{slug}.html'
ARTICLE_SAVE_AS = 'post/{date:%Y}/{slug}.html'
MONTH_ARCHIVE_SAVE_AS = 'archives/{date:%Y}/{date:%m}/index.html'
YEAR_ARCHIVE_SAVE_AS = 'archives/{date:%Y}/index.html'

# Feed generation
FEED_ATOM = 'feeds/atom.xml'
FEED_RSS = 'feeds/rss.xml'
FEED_ALL_ATOM = None
CATEGORY_FEED_ATOM = None
TRANSLATION_FEED_ATOM = None

# Blogroll
LINKS =  (	('Old Blog Location', 'http://bedagainstthewall.blogspot.com'),
         )

# Social widget
SOCIAL = (('Twitter', 'http://twitter.com/macuyiko'),
          ('Personal Site', 'http://seppe.net'),
          ('LinkedIn', 'http://www.linkedin.com/profile/view?id=26422505'),
          ('E-mail', 'mailto:macuyiko@gmail.com'),
          ('Tumblr', 'http://macuyiko.tumblr.com/'),
          ('Google+', 'http://profiles.google.com/macuyiko'),)

DEFAULT_PAGINATION = 10

# Template

THEME = "themes/mu_theme"

