Title: Thinkpad Stories 4: "Render it dammit!"
Date: 2006-08-11
Author: Seppe "Macuyiko" vanden Broucke

i810... `glxinfo | grep direct` nothing. Not enabled because it has problems. (Something about 1.5.0 expected but 1.4.* found. I cannot remember it anymore but you will find users with similar problems on the forums).  
Anyhow: I could not get it to work. It seemed fine however, but glgears proved otherwise: slow as hell.  
I was giving up on it and decided to try and install AIGLX, so I followed the first steps on the forums: add this to /etc/apt/sources.list:  
    deb http://xgl.compiz.info/ dapper aiglx      deb http://xgl.compiz.info/ dapper main  
then do an          sudo apt-get update  
I was reading on what to do now when suddenly the "There are updates" notifier came up: I looked at it and it showed some ATI and Intel driver updates for my i910...  
Why not? Install.  
Then someone on the forums said doing an `dpkg-reconfigure xserver-xorg` could help. I did and followed all the steps (answering default, 1024x768 and 24bit, leaving everything else like it was). But pay extra attention when it asks you about kernel frame buffering (it is a yes or no question). It seems sometimes it works without it and sometimes with it. I went with what looked best and choose yes.  
Then I restarted my x-server (ctrl-alt-backspace). Did a `glxinfo | grep direct` again and ("what the hell?") direct rendering is enabled. Glgears goes really fast now too ;).  
All this without really installing AIGLX nor manual editing my xorg config. You should try it too.  
Now I'm completely happy, ACPI works like it should too, with a nice icon in the taskbar and all.  
I also installed SciTE (use apt-get) and [Aptana](http://www.aptana.com/) as my favorite editors.  
Be warned when you use Aptana in Ubuntu (see their docs). I wrote a script like this:  
    #!/bin/sh      export MOZILLA_FIVE_HOME=/usr/lib/mozilla      ./aptana  
And execute that when I want to start Aptana.  
Simple stuff - I know, but as a Linux/Ubuntu noob (well, not a complete noob but fairly noobish) I am proud that I have accomplished all this. It looks and runs nice and fast now, playing music in the background, a nice theme, a nice login screen... I'm loving Ubuntu in general and looking at my Windows desktop on my other computer just looks... ugly...  
I should still install Flash Player tho. But I'll probably wait until Player 8 (or was that 9 already?) finally gets released (hurry up guys).  
Well there it is: my "switching" story. That's right, this will be the first time I actually will use Linux for a desktop pc for more than a few days... I'm looking forward to it.  
 