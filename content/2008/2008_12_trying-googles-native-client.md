Title: Trying Google's Native Client
Date: 2008-12-09
Author: Seppe "Macuyiko" vanden Broucke

From [Google Blogoscoped](http://blogoscoped.com/archive/2008-12-09-n82.html):

> Google has released something to the open source world they call the [Native Client](http://code.google.com/p/nativeclient/). It is meant as a way for website developers to execute rich code faster within the browser... by having it run "natively" on the computer. This could help any program needing fast graphics; a web-based photo editor might be one of the use cases of this, Google explains. Right now, as a developer you're usually picking Flash or Java for that purpose. Google describes their efforts:

Following [the guide](http://nativeclient.googlecode.com/svn/trunk/nacl/googleclient/native_client/documentation/getting_started.html) in Ubuntu worked remarkably well. The result:

![](http://2.bp.blogspot.com/_X4W-h82Vgjw/ST6HI6yiLoI/AAAAAAAALIk/a62ynirA0Jw/s400/Screenshot-Quake+Demo+-+Mozilla+Firefox.png)

Nice, Quake in a browser. Note that this won't work with any program, you'll need:

  - A Firefox plugin.
  - The Native Client runtime.
  - Special `gcc` compilation tools to compile your program to make it work with Native Client.

Still, this is a great idea, I'm curious which applications or tools (or games) this will spawn.

