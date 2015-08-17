Title: Replacing BibTeX References With DBLP Entries
Author: Seppe "Macuyiko" vanden Broucke
Date: 2014-06-29 16:05

- *Update (2014-08-08):* commenters on [Twitter](https://twitter.com/macuyiko) have notified me about [this script](http://www.snowelm.com/~t/doc/tips/makebib.en.html) which aims to accomplish something similar, without DBLP, however. Fellow researcher Joos Buijs has also started working on a DBLP-enabled BibTeX cleaner over [here](https://github.com/joosbuijs/bibcleaner).
- *Update (2014-10-17):* all code is now up on a separate [GitHub repository](http://blog.macuyiko.com/post/2014/replacing-bibtex-references-with-dblp-entries.html). [Let me know](https://twitter.com/macuyiko) any cool stuff you end up doing with this.

This post is a kind of a follow-up for [this one](|filename|/2014/2014_02_converting-plain-text-references-to-bibtex.md).

I am currently busy writing up my dissertation, and apart from creating a bunch-of-script to do the following:

* Merge BiBTeX files
* Rekey all of them (the same keys can refer to actual different entries)
* Remove duplicates

I also wanted to clean up the resulting reference list by using as much as possible information from [DBLP](http://www.dblp.org/search/index.php), a computer science bibliography repository. Not all of the references I use are on there, most most of them are, and I prefer DBLP's structured bibliography above any other sources (they're very clean and complete).

Getting to a BibTeX entry in DBLP is pretty easy. Performing a search for [my name](http://www.dblp.org/search/index.php#query=seppe vanden broucke), for instance, provides a list of results from which it is easy to find a [particular entry](http://www.dblp.org/rec/bibtex/conf/caise/BrouckeWBV12). A like how the same resource identifier serves as BibTeX key (e.g. "DBLP:conf/caise/BrouckeWBV12") and as part of the URL on DBLP (e.g. "http://www.dblp.org/rec/bibtex/conf/caise/BrouckeWBV12"), making it easy to go navigate around.

I also like how DBLP provides a search api over at [http://www.dblp.org/search/api/](http://www.dblp.org/search/api/).

After fiddling for half an hour I put together the following Java script to fetch entries from DBLP and replace existing ones when possible:

<script src="https://gist.github.com/Macuyiko/3a7231681a251fc812f0.js"></script>

A caveat though: the script is very messy and not really an exercise in clean coding. In any case, it got the job done and might serve helpful for those trying to do something similar. The script is user driven in order to make sure the right entry gets selected (most of the time, it will be the number one entry). It's also possible to change the automatic query string to a manual one and perform the search again for tricky entries.

Finally, running this will result in some crossrefs being added twice, but since they will have the same key, the duplicates can be easily filtered out in a post-filtering step.
