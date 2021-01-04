#!/usr/bin/env python
# -*- coding: utf-8 -*- #
from __future__ import unicode_literals

LOCALE = ('en',)

AUTHOR = u'Seppe "Macuyiko" vanden Broucke'
SITENAME = u'Bed Against The Wall'
SITEURL = '//blog.macuyiko.com'
#SITEURL = '//localhost:8882'

TIMEZONE = 'Europe/Brussels'

DEFAULT_LANG = u'en'

TYPOGRIFY = True

STATIC_PATHS = ['images', 'iframes']
PAGE_EXCLUDES = ['iframes']
ARTICLE_EXCLUDES = ['iframes']

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
LINKS =  ()

# Social widget
SOCIAL = (
    ('Twitter', 'http://twitter.com/macuyiko'),
    ('Personal Site', 'http://seppe.net'),
    ('LinkedIn', 'http://www.linkedin.com/profile/view?id=26422505'),
    ('E-mail', 'mailto:macuyiko@gmail.com'),
    ('Tumblr', 'http://macuyiko.tumblr.com/'),
)

DEFAULT_PAGINATION = 10

# Template

THEME = "themes/mu2_theme"

