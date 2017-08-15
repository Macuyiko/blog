Title: Replacing BibTeX References with DBLP Entries, Updated
Author: Seppe "Macuyiko" vanden Broucke
Date: 2016-09-24 15:31

This blog post is an update for [this one](|filename|/2014/2014_02_converting-plain-text-references-to-bibtex.md). I was recently contacted regarding the original post no longer working. Indeed, the `scholar.py` version used there is being blocked by Google Scholar.

Looking at the [scholar.py](https://github.com/ckreibich/scholar.py) GitHub page, we do find an updated version from about 8 months ago, with apparently support for fetching a plain text citation built-in.

Sadly, upon trying out the new library, Google Scholar was quickly throwing captcha checks up our face. The issue seems to be the way cookie handling is performed in the library.

Instead of trying to fix the library once more, I realized that we don't need its full feature-set in order to accomplish what we're trying to do here. The reason why I went hunting for such a library in the original post is probably due to a mixture of tiredness and/or having plans to do more with it in the future. `BeautifulSoup` and `requests` are enough to get the job done.

So, the updated Python 3 script:

	import sys
	import os.path
	import re
	import string
	import requests
	from bs4 import BeautifulSoup
	from urllib.parse import quote


	def uprint(*objects, sep=' ', end='\n', file=sys.stdout):
	    enc = file.encoding
	    if enc == 'UTF-8':
	        print(*objects, sep=sep, end=end, file=file)
	    else:
	        f = lambda obj: str(obj).encode(enc, errors='backslashreplace').decode(enc)
	        print(*map(f, objects), sep=sep, end=end, file=file)


	SESSION = requests.Session()
	SESSION.headers.update({'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36'})

	URL_SEARCH = 'https://scholar.google.be/scholar?hl=en&q={q}&btnG=&as_sdt=1%2C5&as_sdtp='
	URL_CITE = 'https://scholar.google.be/scholar?q=info:{ident}:scholar.google.com/&output=cite&scirp=0&hl=en'

	def http_get(url):
	    r = SESSION.get(url)
	    return BeautifulSoup(r.text)

	def make_query(reference, l=3):
	    f =  string.ascii_lowercase + ' '
	    q = reference
	    q = q.lower()
	    q = q.replace('-', ' ')
	    q = ''.join(c for c in q if c in f)
	    q = q.split(' ')
	    q = ' '.join(c for c in q if len(c) >= l)
	    return q

	def make_query_year(reference, l=3):
	    f =  string.ascii_lowercase + ' '
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

	def get_articles(query, count=1):
	    url = URL_SEARCH.format(q=query)
	    soup = http_get(url)
	    articles = []
	    for tag in soup.findAll("div", { "class" : "gs_r" }):
	        a = tag.find('a', text='Cite', attrs={ "class" : "gs_nph" })
	        ident = re.search(r'gs_ocit\(event,\'(.*?)\',', a.get('onclick', '')).group(1)
	        articles.append(ident)
	    if count > 0:
	        articles = articles[:count]
	    return articles

	def get_citations(ident, resolve=True):
	    url = URL_CITE.format(ident=ident)
	    soup = http_get(url)
	    citations = {}
	    for tag in soup.findAll('tr'):
	        citations[tag.th.text] = tag.td.text
	    for tag in soup.findAll('a', { "class": "gs_citi" }):
	        citations[tag.text] = tag.get('href')
	        if resolve:
	            citations[tag.text] = http_get(citations[tag.text]).text
	    return citations

	# Put references here:
	references = """Ribeiro, Bruno, and Towsley. Don. “Estimating and sampling graphs with multidimensional random walks”, Proceedings of the 10th ACM SIGCOMM conference on Internet measurement. ACM, 2010.
	Wang, Tianyi, et al. “Understanding graph sampling algorithms for social network analysis”, 31st International Conference on Distributed Computing Systems Workshops. IEEE, 2011."""

	myFile = open('bibliography.bib', 'w', encoding='utf-8')

	for reference in references.split('\n'):
	    reference = reference.strip()
	    uprint ("\n---------------------------------------------------------")
	    uprint ("Doing reference:", reference)
	    q = make_query(reference)
	    uprint ("Query used:", q)
	    r = get_articles(q)
	    if len(r) == 0:
	        q = make_query_year(reference)
	        uprint ("No results -- trying again with:", q)
	        r = get_articles(q)
	    if len(r) == 0:
	        uprint ("Still no results -- skipping")
	        continue
	    uprint ("Result written")
	    myFile.write('\n\n%%% '+ r[0] + '  '+ q +'\n')
	    myFile.write(get_citations(r[0]).get('BibTeX'))

	myFile.close()



