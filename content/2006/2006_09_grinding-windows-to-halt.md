Title: Grinding Windows (To A Halt?)
Date: 2006-09-04
Author: Seppe "Macuyiko" vanden Broucke

Some of you have probably read [this post on Digg](http://digg.com/videos_educational/Video%3A_Ubuntu_Edgy_Eft_%28knot_2%29%2C_opens_40_apps_with_no_slowdown_instability). Someone apperantly made [a video about Edgy Eft running 40 processes without crashing](http://www.youtube.com/watch?v=q7DhOt_5NXA).

People basically replied with either "Windows [and Linux] can do this for ages!" or with "This is really neat!"

It is really cool though that the Ubuntu team has managed to quickly open Openoffice (around 3 seconds now), I am really looking forward to see that running on my laptop.

However, I wanted to prove that Windows will also not crash when doing this (not a recent version that is). So here it is: [my video response](http://macuyiko.googlepages.com/grindingwindows), using the following amazing batch script:

    :loopit
    start sol
    start mspaint
    start calc
    start notepad
    goto loopit

It's the loop of doom! Sorry for the bad quality, but it's better than YouTube. When I close the command line window, Windows was running around 140 instances of Notepad, Paint, Solitaire and Calculator each. During all this, it did slow down, but is was still quite manageable afterwards. I had to stop the loop because Paint was starting to spit out error messages (as you can see in the video).

Then, I closed the four groups from the taskbar. Windows seems to have a bug here: it doesn't close all programs and some had to be closed manually (fun!).

On which system this done? On my main Desktop: two Opterons and 4GB of RAM, so I agree that this is in fact not really fair towards that first Linux-video, but it was a fun thing to do (I was surprised that Camtasia could survive the heavy load).

I do not want to flame Ubuntu or Linux in general (I am running it myself so...), but running 40 processes at once is not such a formidable feat. Also: Windows is more stable than Mac/Linux/Whatever-zealots tend to believe*.

A, those lazy Sundays...

*: Except for Windows 3.1. And 95. And 98. 98SE too, a little. And ME. Especially ME. Stay away from ME... 2000 might work I think. Windows XP 32 bit too (I was running 64bit). And 2003 probably too.

