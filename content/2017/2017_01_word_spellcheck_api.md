Title: Word Spellchecking in Python
Author: Seppe "Macuyiko" vanden Broucke
Date: 2017-01-10 8:36

In case you'd ever want to integrate Word's spell checking capabilities on top of your Python app, here's how you would do so:

<script src="https://gist.github.com/Macuyiko/a8a90554428064db98d73c65b30abb80.js"></script>

The only requirement is having Word installed (with the language packs installed for the languages you want to check), as well as the Python Windows extensions, which can be installed through [pip](https://pypi.python.org/pypi/pywin32), luckily. Flask is just being used here as an example how you'd wrap this up in an API.

Here's an example of how it works:

	>>> from workspellcheckerapi import get_corrections
	>>> get_corrections("Let's see if it catchez the spell errrors in this text. Their is also the option to do grammer checking.")

	{
		'text': "Let's see if it catchez the spell errrors in this text. Their is also the option to do grammer checking.", 

		'grammarcount': 1,
		'grammar': [{'end': 104, 'text': 'Their is also the option to do grammer checking.', 'start': 56, 'suggestions': ['There']}], 

		'spellingcount': 4, 
		'spelling': [{'end': 23, 'text': 'catchez', 'start': 16, 'suggestions': ['catches', 'catcher', "catches'"]}, {'end': 41, 'text': 'errrors', 'start': 34, 'suggestions': ['errors', "error's", "errors'"]}, {'end': 61, 'text': 'Their', 'start': 56, 'suggestions': ['There']}, {'end': 94, 'text': 'grammer', 'start': 87, 'suggestions': ['grammar', 'grimmer', 'grammars', 'gramper', 'rammer']}]
	}

Before you go off implementing this on top of your web stack, keep in mind that you're probably breaking all of Microsoft's end user agreements. [Bing's spell checker API](https://www.microsoft.com/cognitive-services/en-us/bing-spell-check-api) would be the official route, and allows for some free calls as well.