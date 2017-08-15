Title: Converting Plain Text References To BibTeX (or Endnote, or...)
Author: Seppe "Macuyiko" vanden Broucke
Date: 2014-02-26 20:21

**Update:** [new post and source code here](|filename|/2016/2016_10_plain-text-to-bibtex.md).

So last weekend, I'd almost finished editing a Word manuscript draft to submit to a particular journal, except for one final item on the todo list: converting the existing list of references (inserted and formatted as a plain text list) to another style.

I planned on using Word's built-in reference manager to add all 40+ references to the bibliography, but even in Word's latest incarnation, the "Here are 20 text boxes squished together, have fun!"-interface remains a pain to use.

So then, switching to BibTeX first. This involves hunting down BibTeX entries for all references, putting them in a tool like [Jabref](http://jabref.sourceforge.net/), and then exporting the list to a -- properly formatted -- plain text list, which can be pasted back into Word.

After doing this for three or so reference entries, feelings of boredom and frustration welled up inside me, and my mind drifted off pondering the greater questions of life...

> Are we alone in the universe?
> ...
> Is there a god?
> ...
> Why can't I convert a list of plain text references to a BibTeX list automatically?

The latter questions really isn't that ridiculous. With sources like DBLP and Web of Science allowing plain text search, it shouldn't be too hard to automagically get this task done, right?

So I had a look at Endnote. Quote [this page](http://kbportal.thomson.com/display/2/searchDirect/index.aspx?searchstring=TS_ENIMPORTFAQ8&searchtype=8&searchby=referenceword&Catid=&SubCatid=&att=&remotesite=&search=):

> EndNote: Cannot import bibliography not created with EndNote
> Unfortunately, EndNote was not designed to import information in a bibliography format. EndNote can import text files that are in a tagged data format, as well as tab-delimited files that are in the exact right format.
> Some customers have had success at converting an existing text file into a tagged data file that can be imported into EndNote, however the process is difficult and may take more time than finding another source for the references, or even copying and pasting the text into new references by hand. More information on preparing text files for importing can be found in the "Importing Reference Data" section of the Help File.

That's just great. One of these "some customers" can be found at [this blog](http://deborahfitchett.blogspot.be/2011/02/converting-plaintext-bibliography-to.html)... Ten steps, including a bunch of arcane editing and Linux commands... There has to be a better way. If Mendeley can parse information from a PDF (not perfect, but still), a plain text reference list should be convertable to a BibTeX entry, right?

So instead of spending two hours creating a BibTeX file manually, I spent two days coming up with some automatic way.

## Hour 1: Finding a Source

The first hour of this experiment was spent finding a literature corpus source where I'd be able to download a structured reference file from. Web of Science looks like a good candidate, but their website is hellish to parse, requires juggling with cookies and viewstates, and going through my university's proxy to gain access, something I've all experimented with in the past and didn't want to go through again.

Next possibility: Google Scholar. A few test runs with some edited queries came up with the right articles alright, and Google Scholar allows to export Endnote, BibTeX and other files. Even though the quality of the entry is not always perfect, this seemed like a good starting point.

## Hours 2-3: Finding an API

First issue: Google Scholar does not provide an API. Luckily, there's `scholar.py` on [GitHub](https://github.com/ckreibich/scholar.py) which seems to be working fine (as long as you don't hammer Google's servers too much):

	macuyiko$ python scholar.py -c 3 --author "vanden broucke" --txt "artificial"
		        ID PktWS3Llix8J
		     Title Improved artificial negative event generation to enhance process event logs
		       URL http://link.springer.com/chapter/10.1007/978-3-642-31095-9_17
		 Citations 4
		  Versions 5
	Citations list http://scholar.google.com/scholar?cites=2273162715991526206&as_sdt=2005&sciodt=1,5&hl=en&num=3
	 Versions list http://scholar.google.com/scholar?cluster=2273162715991526206&hl=en&num=3&as_sdt=1,5
		  Cite URL http://scholar.google.com/scholar?q=info:PktWS3Llix8J:scholar.google.com/&output=cite&scirp=0&hl=en
	  Related list http://scholar.google.com/scholar?q=related:PktWS3Llix8J:scholar.google.com/&hl=en&num=3&as_sdt=1,5
		      Year 2012

		        ID 1_9CU_-bcNEJ
		     Title An Improved Process Event Log Artificial Negative Event Generator
		       URL http://papers.ssrn.com/sol3/papers.cfm?abstract_id=2165204
		 Citations 0
		  Versions 0
	Citations list None
	 Versions list None
		  Cite URL http://scholar.google.com/scholar?q=info:1_9CU_-bcNEJ:scholar.google.com/&output=cite&scirp=0&hl=en
	  Related list None
		      Year 2012

		        ID EE_4eP8NmncJ
		     Title Third International Business Process Intelligence Challenge (BPIC'13): Volvo IT Belgium VINST
		       URL http://ceur-ws.org/Vol-1052/paper3.pdf
		 Citations 0
		  Versions 0
	Citations list None
	 Versions list None
		  Cite URL http://scholar.google.com/scholar?q=info:EE_4eP8NmncJ:scholar.google.com/&output=cite&scirp=0&hl=en
	  Related list http://scholar.google.com/scholar?q=related:EE_4eP8NmncJ:scholar.google.com/&hl=en&num=3&as_sdt=1,5
		      Year None

## Hours 4-5: Getting Citation Results

Second issue, `scholar.py` does not provide support to retrieve citation entries from Google Scholar (i.e. what you see when you click the "Cite" link under an article).

Getting this information is a little bit tricky, because we first have to retrieve the Google Scholar ID for the article, and then perform a second HTTP request using a unique token in the URL. I've modified `scholar.py` to look as follows (now also using the `requests` library instead of the whole `urllib` soup:

	#! /usr/bin/env python
	# Copyright 2010--2013 Christian Kreibich. All rights reserved.
	#
	# Redistribution and use in source and binary forms, with or without
	# modification, are permitted provided that the following conditions are
	# met:
	#
	#	1. Redistributions of source code must retain the above copyright
	#	   notice, this list of conditions and the following disclaimer.
	#
	#	2. Redistributions in binary form must reproduce the above
	#	   copyright notice, this list of conditions and the following
	#	   disclaimer in the documentation and/or other materials provided
	#	   with the distribution.
	#
	# THIS SOFTWARE IS PROVIDED "AS IS" AND ANY EXPRESS OR IMPLIED
	# WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
	# MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
	# DISCLAIMED. IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY DIRECT,
	# INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
	# (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
	# SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
	# HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT,
	# STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING
	# IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
	# POSSIBILITY OF SUCH DAMAGE.

	import optparse
	import sys
	import codecs
	import re
	try:
	    from urllib.parse import quote
	except ImportError:
	    from urllib import quote
	import requests

	# Import BeautifulSoup -- try 4 first, fall back to older
	try:
		from bs4 import BeautifulSoup
	except ImportError:
		try:
			from BeautifulSoup import BeautifulSoup
		except:
			print('We need BeautifulSoup, sorry...')
			sys.exit(1)

	# Support unicode in both Python 2 and 3. In Python 3, unicode is str.
	if sys.version_info[0] == 3:
		unicode = str # pylint: disable-msg=W0622
		encode = lambda s: s # pylint: disable-msg=C0103
	else:
		encode = lambda s: s.encode('utf-8') # pylint: disable-msg=C0103

	class CookieJar(object):
		COOKIE_JAR = {}

	class Article(object):
		def __init__(self):
			self.attrs = {'id':            [None, 'ID',              0],
						  'title':         [None, 'Title',           1],
						  'url':           [None, 'URL',             2],
						  'num_citations': [0,	  'Citations',       3],
						  'num_versions':  [0,	  'Versions',        4],
						  'url_citations': [None, 'Citations list',  5],
						  'url_versions':  [None, 'Versions list',   6],
						  'url_cite':      [None, 'Cite URL',        7],
						  'url_related':   [None, 'Related list',    8],
						  'year':          [None, 'Year',            9]}

		def __getitem__(self, key):
			if key in self.attrs:
				return self.attrs[key][0]
			return None

		def __len__(self):
			return len(self.attrs)

		def __setitem__(self, key, item):
			if key in self.attrs:
				self.attrs[key][0] = item
			else:
				self.attrs[key] = [item, key, len(self.attrs)]

		def __delitem__(self, key):
			if key in self.attrs:
				del self.attrs[key]

		def as_txt(self):
			# Get items sorted in specified order:
			items = sorted(list(self.attrs.values()), key=lambda item: item[2])
			# Find largest label length:
			max_label_len = max([len(str(item[1])) for item in items])
			fmt = '%%%ds %%s' % max_label_len
			return '\n'.join([fmt % (item[1], item[0]) for item in items])

		def as_csv(self, header=False, sep='|'):
			# Get keys sorted in specified order:
			keys = [pair[0] for pair in \
					sorted([(key, val[2]) for key, val in list(self.attrs.items())],
						   key=lambda pair: pair[1])]
			res = []
			if header:
				res.append(sep.join(keys))
			res.append(sep.join([unicode(self.attrs[key][0]) for key in keys]))
			return '\n'.join(res)

	class ScholarParser(object):
		SCHOLAR_SITE = 'http://scholar.google.com'

		def __init__(self, site=None):
			self.soup = None
			self.article = None
			self.site = site or self.SCHOLAR_SITE
			self.year_re = re.compile(r'\b(?:20|19)\d{2}\b')

		def handle_article(self, art):
			"""
			In this base class, the callback does nothing.
			"""

		def parse(self, html):
			"""
			This method initiates parsing of HTML content.
			"""
			self.soup = BeautifulSoup(html)
			for div in self.soup.findAll(ScholarParser._tag_checker):
				self._parse_article(div)

		def _parse_article(self, div):
			self.article = Article()

			for tag in div:
				if not hasattr(tag, 'name'):
					continue

				if tag.name == 'div' and self._tag_has_class(tag, 'gs_rt') and \
						tag.h3 and tag.h3.a:
					self.article['title'] = ''.join(tag.h3.a.findAll(text=True))
					self.article['url'] = self._path2url(tag.h3.a['href'])

				if tag.name == 'font':
					for tag2 in tag:
						if not hasattr(tag2, 'name'):
							continue
						if tag2.name == 'span' and self._tag_has_class(tag2, 'gs_fl'):
							self._parse_links(tag2)

			if self.article['title']:
				self.handle_article(self.article)

		def _parse_links(self, span):
			for tag in span:
				if not hasattr(tag, 'name'):
					continue
				if tag.name != 'a' or tag.get('href') == None:
					continue

				if tag.get('href').startswith('/scholar?cites'):
					if hasattr(tag, 'string') and tag.string.startswith('Cited by'):
						self.article['num_citations'] = \
							self._as_int(tag.string.split()[-1])
					self.article['url_citations'] = self._path2url(tag.get('href'))

				if tag.get('href').startswith('/scholar?cluster'):
					if hasattr(tag, 'string') and tag.string.startswith('All '):
						self.article['num_versions'] = \
							self._as_int(tag.string.split()[1])
					self.article['url_versions'] = self._path2url(tag.get('href'))

		@staticmethod
		def _tag_has_class(tag, klass):
			"""
			This predicate function checks whether a BeatifulSoup Tag instance
			has a class attribute.
			"""
			res = tag.get('class') or []
			if type(res) != list:
				# BeautifulSoup 3 can return e.g. 'gs_md_wp gs_ttss',
				# so split -- conveniently produces a list in any case
				res = res.split()
			return klass in res

		@staticmethod
		def _tag_checker(tag):
			return tag.name == 'div' and ScholarParser._tag_has_class(tag, 'gs_r')

		@staticmethod
		def _as_int(obj):
			try:
				return int(obj)
			except ValueError:
				return None

		def _path2url(self, path):
			if path.startswith('http://'):
				return path
			if not path.startswith('/'):
				path = '/' + path
			return self.site + path


	class ScholarParser120201(ScholarParser):
		def _parse_article(self, div):
			self.article = Article()

			for tag in div:
				if not hasattr(tag, 'name'):
					continue

				if tag.name == 'h3' and self._tag_has_class(tag, 'gs_rt') and tag.a:
					self.article['title'] = ''.join(tag.a.findAll(text=True))
					self.article['url'] = self._path2url(tag.a['href'])

				if tag.name == 'div' and self._tag_has_class(tag, 'gs_a'):
					year = self.year_re.findall(tag.text)
					self.article['year'] = year[0] if len(year) > 0 else None

				if tag.name == 'div' and self._tag_has_class(tag, 'gs_fl'):
					self._parse_links(tag)

			if self.article['title']:
				self.handle_article(self.article)


	class ScholarParser120726(ScholarParser):
		def _parse_article(self, div):
			self.article = Article()

			for tag in div:
				if not hasattr(tag, 'name'):
					continue
				if tag.name == 'div' and self._tag_has_class(tag, 'gs_ri'):
					if tag.a:
						self.article['title'] = ''.join(tag.a.findAll(text=True))
						self.article['url'] = self._path2url(tag.a['href'])

					if tag.find('div', {'class': 'gs_a'}):
						year = self.year_re.findall(tag.find('div', {'class': 'gs_a'}).text)
						self.article['year'] = year[0] if len(year) > 0 else None

					if tag.find('div', {'class': 'gs_fl'}):
						ltag = tag.find('div', {'class': 'gs_fl'})
						self._parse_links(ltag)

						id_re = re.compile(r'gs_ocit\(event,\'(.*?)\',')
						id = id_re.findall(str(ltag))
						self.article['id'] = id[0] if len(id) > 0 else None
						self.article['url_cite'] = self._path2url('/scholar?q=info:' + self.article['id'] + ':scholar.google.com/&output=cite&scirp=0&hl=en')

			if self.article['title']:
				self.handle_article(self.article)

		def _parse_links(self, span):
			for tag in span:
				if not hasattr(tag, 'name'):
					continue
				if tag.name != 'a' or tag.get('href') == None:
					continue

				if tag.get('href').startswith('/scholar?q=related'):
					self.article['url_related'] = self._path2url(tag.get('href'))

				if tag.get('href').startswith('/scholar?cites'):
					if hasattr(tag, 'string') and tag.string.startswith('Cited by'):
						self.article['num_citations'] = \
							self._as_int(tag.string.split()[-1])
					self.article['url_citations'] = self._path2url(tag.get('href'))

				if tag.get('href').startswith('/scholar?cluster'):
					if hasattr(tag, 'string') and tag.string.startswith('All '):
						self.article['num_versions'] = \
							self._as_int(tag.string.split()[1])
					self.article['url_versions'] = self._path2url(tag.get('href'))

	class CiteParser(ScholarParser):
		def __init__(self, site=None):
			self.site = site or self.SCHOLAR_SITE
			self.soup = None
			self.export = {}
			self.text = {}

		def parse(self, html):
			"""
			This method initiates parsing of HTML content.
			"""
			self.soup = BeautifulSoup(html)
			self._parse_text(self.soup.find("div", {"id": "gs_citt"}))
			self._parse_export(self.soup.find("div", {"id": "gs_citi"}))

		def _parse_text(self, div):
			for tag in div.findAll('tr'):
				self.text[tag.find('th').text] = tag.find('div').text

		def _parse_export(self, div):
			for tag in div.findAll('a'):
				if not hasattr(tag, 'name'):
					continue
				if tag.name != 'a' or tag.get('href') == None:
					continue

				if tag.get('href').startswith('/scholar'):
					if hasattr(tag, 'string') and tag.string.startswith('Import into'):
						n = tag.string.split()[-1]
						self.export[n] = self._path2url(tag.get('href'))

	class ScholarQuerier(object):
		SCHOLAR_URL = 'http://scholar.google.be/scholar?hl=en&q=%(query)s+author:%(author)s&btnG=Search&as_subj=eng&as_sdt=1,5&as_ylo=&as_vis=0'
		NOAUTH_URL = 'http://scholar.google.be/scholar?hl=en&q=%(query)s&btnG=Search&as_subj=eng&as_std=1,5&as_ylo=&as_vis=0'
		USER_AGENT = 'Mozilla/5.0 (Windows NT 6.2; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/32.0.1667.0 Safari/537.36'

		class Parser(ScholarParser120726):
			def __init__(self, querier):
				ScholarParser120726.__init__(self)
				self.querier = querier

			def handle_article(self, art):
				self.querier.add_article(art)

		def __init__(self, author='', scholar_url=None, count=0):
			self.articles = []
			self.author = author
			# Clip to 100, as Google doesn't support more anyway
			self.count = min(count, 100)

			if author == '':
				self.scholar_url = self.NOAUTH_URL
			else:
				self.scholar_url = scholar_url or self.SCHOLAR_URL

			if self.count != 0:
				self.scholar_url += '&num=%d' % self.count

		def query(self, search):
			self.clear_articles()
			url = self.scholar_url % {'query': quote(encode(search)), 'author': quote(self.author)}
			r = requests.get(url, headers={'User-Agent': self.USER_AGENT}, cookies=CookieJar.COOKIE_JAR)
			CookieJar.COOKIE_JAR = r.cookies
			if r.status_code != 200:
				self.status = False
				print "*** Google is throttling"
			else:
				self.parse(r.text)

		def parse(self, html):
			parser = self.Parser(self)
			parser.parse(html)

		def add_article(self, art):
			self.articles.append(art)

		def clear_articles(self):
			self.status = True
			self.articles = []

	class CiteQuerier(ScholarQuerier):
		CITE_URL = 'http://scholar.google.com/scholar?q=info:%(id)s:scholar.google.com/&output=cite&scirp=0&hl=en'

		class Parser(CiteParser):
			def __init__(self, querier):
				CiteParser.__init__(self)
				self.querier = querier

		def __init__(self, id):
			self.id = id
			self.parser = self.Parser(self)
			self.query()

		def query(self):
			url_cite = self.CITE_URL % {'id': quote(encode(self.id))}
			r = requests.get(url_cite, headers={'User-Agent': self.USER_AGENT}, cookies=CookieJar.COOKIE_JAR)
			CookieJar.COOKIE_JAR = r.cookies
			self.parse(r.text)

		def parse(self, html):
			self.parser.parse(html)

	def cite(id):
		querier = CiteQuerier(id)
		r = requests.get(querier.parser.export['EndNote'], headers={'User-Agent': querier.USER_AGENT}, cookies=CookieJar.COOKIE_JAR)
		myFile = codecs.open('end.enw', 'w','utf-8')
		myFile.write(r.text)
		myFile.close()

	def articles(query, author, count):
		querier = ScholarQuerier(author=author, count=count)
		querier.query(query)
		articles = querier.articles
		if count > 0:
			articles = articles[:count]
		return articles

	def txt(query, author, count):
		querier = ScholarQuerier(author=author, count=count)
		querier.query(query)
		articles = querier.articles
		if count > 0:
			articles = articles[:count]
		c = 1
		for art in articles:
			print('------------' + 'Article #' + str(c) + ':' + '------------')
			c += 1
			print(art.as_txt() + '\n')
		return articles

	def csv(query, author, count, header=False, sep='|'):
		querier = ScholarQuerier(author=author, count=count)
		querier.query(query)
		articles = querier.articles
		if count > 0:
			articles = articles[:count]
		for art in articles:
			result = art.as_csv(header=header, sep=sep)
			print(encode(result))
			header = False
		return articles

	def main():
		usage = """scholar.py [options] <query string>
	A command-line interface to Google Scholar.

	Example: scholar.py -c 1 --txt --author einstein quantum"""

		fmt = optparse.IndentedHelpFormatter(max_help_position=50, width=100)
		parser = optparse.OptionParser(usage=usage, formatter=fmt)
		parser.add_option('-a', '--author',
						  help='Author name')
		parser.add_option('--csv', action='store_true',
						  help='Print article data in CSV form (separator is "|")')
		parser.add_option('--csv-header', action='store_true',
						  help='Like --csv, but print header with column names')
		parser.add_option('--txt', action='store_true',
						  help='Print article data in text format')
		parser.add_option('--cite', help='Cite article')
		parser.add_option('-c', '--count', type='int',
						  help='Maximum number of results')
		parser.set_defaults(count=0, author='')
		options, args = parser.parse_args()

		# Show help if we have neither keyword search nor author name
		if len(args) == 0 and options.author == '':
			parser.print_help()
			return 1

		query = ' '.join(args)

		if options.csv:
			a = csv(query, author=options.author, count=options.count)
		elif options.csv_header:
			a = csv(query, author=options.author, count=options.count, header=True)
		elif options.txt:
			a = txt(query, author=options.author, count=options.count)
		elif options.cite:
			cite(options.cite)

		if options.cite:
			cite(a[int(options.cite)-1]['id'])

		return 0

	if __name__ == "__main__":
		sys.exit(main())

So now, we are able to get this:

	macuyiko$ python scholar.py -c 1 --cite 1 --author "vanden broucke" --txt "artificial" && cat end.enw
	------------Article #1:------------
		        ID PktWS3Llix8J
		     Title Improved artificial negative event generation to enhance process event logs
		       URL http://link.springer.com/chapter/10.1007/978-3-642-31095-9_17
		 Citations 4
		  Versions 5
	Citations list http://scholar.google.com/scholar?cites=2273162715991526206&as_sdt=2005&sciodt=1,5&hl=en&num=1
	 Versions list http://scholar.google.com/scholar?cluster=2273162715991526206&hl=en&num=1&as_sdt=1,5
		  Cite URL http://scholar.google.com/scholar?q=info:PktWS3Llix8J:scholar.google.com/&output=cite&scirp=0&hl=en
	  Related list http://scholar.google.com/scholar?q=related:PktWS3Llix8J:scholar.google.com/&hl=en&num=1&as_sdt=1,5
		      Year 2012

	%0 Conference Proceedings
	%T Improved artificial negative event generation to enhance process event logs
	%A vanden Broucke, Seppe KLM
	%A De Weerdt, Jochen
	%A Baesens, Bart
	%A Vanthienen, Jan
	%B Advanced Information Systems Engineering
	%P 254-269
	%@ 364231094X
	%D 2012
	%I Springer

## Hours 6-11: Wasting Time with Google's Appengine

Almost done. The final part which remains is to automate iterating through the plain references list, finding a way to extract a good search query for each entry, and getting out the Endnote (or BibTeX from Google Scholar).

In an impulse, I decided to try to whip up a Google Appengine page to provide this great service to the world. After creating a basic `index.html` with some jQuery on top off it I created a quick `Flask` app with the "magic" part looking something like this (disclaimer: not really that magical):

	@app.route('/guess', methods=['POST'])
	def guess():
		f = string.ascii_lowercase + ' '
		q = request.form['t']
		q = q.lower()
		q = q.replace('-', ' ')
		q = ''.join(c for c in q if c in f)
		q = q.split(' ')
		q = ' '.join(c for c in q if len(c) >= 3)
		# Use q as the Google Scholar search query

Really simple: convert to lowercase, leave only text and spaces, filter out all words smaller then three characters. This approached seemed to work well in initial tests.

What didn't work well, however, was getting `scholar.py` to work on Google Appengine. The library works fine, but Google Scholar is very picky towards handling requests coming from Google Appengine, due to reasons which are actually pretty obvious.

## Hour 12: Let's Just Finish This

After contemplating whether I should host this on my own server, I just decided to move on and built a quick and dirty script to do the work, as the likelihood of me getting popular/rich/famous/insert-attribute-here by a service like this one is small anyway, especially since Google's banhammer would strike quickly.

So the final "convertor" script looks like this:

	import sys
	import os.path
	import scholar
	import string
	import re
	import codecs
	import requests

	references = """Bang-Jensen, J., & Gutin, G. (2010) Diagraphs: theory, algorithms and applications. Springer-Verlag.
	Chandy, K., & Schulte, W. (2010) Event Processing - Designing IT Systems for Agile Companies, McGraw-Hill.
	<OTHER REFERENCES>"""

	def make_query(reference, l = 3):
		q = reference
		q = q.lower()
		q = q.replace('-', ' ')
		q = ''.join(c for c in q if c in f)
		q = q.split(' ')
		q = ' '.join(c for c in q if len(c) >= l)
		return q

	def make_query_year(reference, l = 3):
		q = reference
		id_re = re.compile(r'(\d\d\d\d)')
		id = id_re.findall(q)
		year = id[0] if len(id) > 0 else '('
		q = q.split(year)
		q = q[1:]
		q = ''.join(q)
		q = q.lower()
		q = q.replace('-', ' ')
		q = ''.join(c for c in q if c in f)
		q = q.split(' ')
		q = ' '.join(c for c in q if len(c) >= l)
		if year != '(':
			q = year + ' ' + q
		return q

	myFile = codecs.open('bibliography.bib', 'w','utf-8')
	for reference in references.split('\n'):
		reference = reference.strip()
		print "\n---------------------------------------------------------"
		print "Doing reference:", reference
		f = string.ascii_lowercase + ' '

		q = make_query(reference)
		print "Query used:", q
		r = scholar.articles(q, '', 1)

		if len(r) == 0 or r[0]['id'] is None:
			q = make_query_year(reference)
			print "Trying again with:", q
			r = scholar.articles(q, '', 1)

		print r[0].as_txt(), '\n'
		querier = scholar.CiteQuerier(r[0]['id'])
		req = requests.get(querier.parser.export['BibTeX'], headers={'User-Agent': querier.USER_AGENT}, cookies=scholar.CookieJar.COOKIE_JAR)
		myFile.write('\n\n%%% '+r[0]['id']+'  '+r[0]['title']+'\n')
		myFile.write(req.text)

	myFile.close()

Note that I had to include two querying strategies: `make_query` and `make_query_year`. The latter combines the year with the title but leaves out authors, this is to retrieve some problematic articles where the author name was formatted differently in Google Scholar than in my list. A hacky approach which could be improved, but it gets the point across.

Anyway, running this script returns a BibTeX list like this:

	macuyiko$ cat ./bibliography.bib

	%%% mr4JHn2auF8J  Theory, algorithms and applications
	@article{bang2007theory,
	  title={Theory, algorithms and applications},
	  author={Bang-Jensen, J{\o}rgen and Gutin, Gregory},
	  journal={Springer Monographs in Mathematics, Springer-Verlag London Ltd., London},
	  year={2007},
	  publisher={Springer}
	}

	%%% Odfz1prcWxEJ  Event Processing: Designing IT Systems for Agile Companies
	@book{chandy2009event,
	  title={Event Processing: Designing IT Systems for Agile Companies},
	  author={Chandy, K and Schulte, W},
	  year={2009},
	  publisher={McGraw-Hill, Inc.}
	}

Which is sufficient to import in a reference manager and edit/correct the remaining issues without much hassle.

## By the Way...

I realize I might be an idiot and there might exist some free or expensive reference management software providing this functionality already. If you know about such magnificent tool, feel free to point this out in the comments or [on Twitter](http://www.twitter.com/macuyiko) (both the software name, not the fact that I'm an idiot, please).

Anyway, I hope this proves to be useful to anyone encountering the same problem. Also, fellow researchers, can we agree on the fact that the functionality offered by reference management software and scholarly websites is still pretty much utter crap? We live in the future, this should not be painful anymore.
