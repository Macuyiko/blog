Title: Sacrifice Revisited
Date: 2008-10-26
Author: Seppe "Macuyiko" vanden Broucke

[A while ago I posted](|filename|/2006/2006_07_sacrifice-ram-problem-or-fixing-old.md) on this blog how you could resolve the "Insufficient page file space" problem in Sacrifice. Since then a few people have emailed me, saying that the fix described in that post does not longer work. After trying various things with various people (thanks for all the help and input by the way), a solution was found.

**Problem**

The problem is that XP does not longer present GlobalMemoryStatusTrim when running QFixApp.

First the good news. If you have Vista, the game works out of the box. Not because Vista has better memory management or something like that, but because Vista comes with lots of Compatibility Profiles built-in. I've looked into these profiles to see which ones were used with Sacrifice, being:

1. GlobalMemoryStatusLie
2. GlobalMemoryStatus2GB (this replaces GlobalMemoryStatusTrim and is also available in QFixApp when running XP)

So the solution seems simple, enable GlobalMemoryStatusLie and GlobalMemoryStatus2GB, and try again. However, when trying this under XP SP3, almost everyone gets the following (new) error: "error while trying to initiate the application (0x000005)".

If you get this error, you now have the following options:

1. Upgrade to Vista (yuck);
2. You could disable virtual memory and/or use the `/BURNMEMORY=N` `boot.ini`-switch (adventurous and bad/ugly);
3. Use the solution below (clean and works).

**Solution**

It turns out there is a patch available [over here](http://aluigi.altervista.org/patches.htm) which removes the memory-check from the game. This patch was created a while ago by Luigi Auriemma, but is still quite difficult to find. Follow the following steps to get your game working:

1. Download and extract Lame Patcher [from here](http://aluigi.altervista.org/mytoolz.htm#lpatch).
2. Download and save the Sacrifice .lpatch file [from here](http://aluigi.org/patches.htm) (search for: "sacrifice" or [direct link](http://aluigi.org/patches/sacrifice_pagefile.lpatch) -- direct link is back thanks to a friendly e-mail from Luigi, the author, thanks!).
3. Open `lpatch.exe`.
4. The program will display a message asking you if you want to select a `.dat` or `.lpatch` file, choose "Yes".
5. Pick the `sacrifice_pagefile.lpatch` you have saved in step 2.
6. The program will display some information, press "OK".
7. Another file chooser dialog opens, locate your `Sacrifice.exe` and select it.

All done! You should be able to enjoy the game now.

One last thing. If you're too lazy to follow the steps above, or you don't have Sacrifice but would like to play this (and other old) games, then check out [Good Old Games](http://www.gog.com/en/frontpage/). They've just went into public beta and are offering MDK2, Giants: Citizen Kabuto and Sacrifice (for $5.99). They also offer support, so your game'll probably work without complaining out of the box;Â it seems they provide the Virtual Memory tip as well.
