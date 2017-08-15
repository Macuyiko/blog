Title: Removing Background Color from a PDF Presentation
Author: Seppe "Macuyiko" vanden Broucke
Date: 2015-02-08

Ever ran across a PDF export of a Powerpoint which looks like this?

![Get ready to buy a new toner](http://blog.macuyiko.com/images/2015/pdfcleaner/presentation.png)

Turns out it is not so easy to convert this to printable design (at least not without having access to the original presentation file, that is). Adobe Reader already allows to do the following:

1. Press `Ctrl+K` to go to `Edit -> Preferences`.
2. Select `Accessibility`.
3. Check `Replace Document Colors` to set the page background to white and text colors to black.

At first sight, this works fine:

![Problem solved?](http://blog.macuyiko.com/images/2015/pdfcleaner/presentation2.png)

But when printing, Adobe Reader decides to just put the background back in, even although the white background shows up in the page preview... Call it the ultimate troll, but that exactly how we know Adobe by now.

Perhaps some alternative PDF readers such as Foxit or Sumatra can do this right, but I'm using Evince, and -- currently -- not in the mood to start trying out others.

Luckily, help is on the way. Step one: download [PDFClown](http://pdfclown.org/) for Java. You'll find a JAR file in the source code zip somewhere.

Step two, whip up a small script:

<script src="https://gist.github.com/Macuyiko/a170686e59a919ef49e6.js"></script>

Step three, you might need to make some changes to the following classes. They are part of PDFClown, so grab them off their GitHub repository, place them in your project and modify:

- `org.pdfclown.documents.contents.fonts.CMapParser`: uses `Integer.parseInt` to convert a hex string to an integer, but this fails for large numbers. Use BigInteger instead.
- `org.pdfclown.documents.contents.fonts.OpenFontParser`: some fonts inside of PDF's do totally not comply with standards. So sprinkle `if(tableOffset != null) { ... }` everywhere instead of throwing Exceptions to work around this issue.
- `org.pdfclown.documents.contents.fonts.SimpleFont`: change a line so it reads `if(code != null && glyphIndexes.get(code) != null)`.

I've also made a quick [runnable JAR over here](http://blog.macuyiko.com/images/2015/pdfcleaner/pdfcleaner.jar).

	java -jar pdfcleaner.jar "input.pdf" "output.pdf"

![The result...](http://blog.macuyiko.com/images/2015/pdfcleaner/presentation3.png)

Needless to say, I'm now an enormous PDFClown convert.

Note that this is pretty hacky code, it basically takes a chainsaw to your PDF file and fills everything it can with either black or white. Left as an exercise for the reader:

- Better determine the actual background box based on size information so only necessary Path objects are recolored.
- Also change stroke color.
- Allow to set desired colors.

Anyway, does the trick for me so far.
