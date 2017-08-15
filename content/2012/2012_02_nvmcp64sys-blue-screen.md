Title: The nvmcp64.sys Blue Screen
Date: 2012-02-28
Author: Seppe "Macuyiko" vanden Broucke

This issue has beenÂ plaguingÂ my Windows 7 installation since the beginning of time, or, well -- the beginning of this particular Windows 7 installation...

Every once in a while, my computer would blue screen displaying a `DRIVER_IRQL_NOT_LESS_OR_EQUAL` error due to a certain `nvmcp64.sys`, often with any playing audio looping the same fragment over and over again until I would grudgingly press the reset button.

`DRIVER_IRQL_NOT_LESS_OR_EQUAL` is one of those typical cryptic "STOP errors"Â that actually tell you almost nothing. The only reasonable thing to deduce is that it's probably a driver acting up, or some hardware gone bad. Searching around on forums quickly leads one to downloading Memtest86 to check if your RAM has gone bad, or to advice telling you that you should try removing your graphics card/audio card/memory/hard drives/and every other peripheral imaginable one by one, trying every possible combination of hardware until your computer boots up again or you die from boredom -- whichever comes first. Meh. Checking your memory is a good idea once in a while, but once your memory has been working for a year, chances are it will remain working perfectly until you build or buy your next machine.

Another thing you could do (especially if you've seen your fair share of blue screens) is to take a look at the Â dump files Windows creates when it crashes (look in `C:\Windows\Minidump\`). Since we won't do that here, I won't go over [the](http://support.microsoft.com/kb/315263) [details](http://www.networkworld.com/news/2005/041105-windows-crash.html) on how toÂ analyseÂ these dumps. The reason why we won't explore the dump is because we already have a clear idea about which process, library, or - in this case - driver is causing the problem: `nvmcp64.sys`. So what isÂ `nvmcp64.sys` exactly?

The prefix "`nv`" leads us to a plausible candidate: Nvidia! You might think that updating your graphics drivers are in order (another advice so commonly encountered), but you would be wrong, since the driver in this case is related to theÂ nForce (Nvidia's bus architecture to handle IDE, RAID, networking and audio) chipset found on the motherboard. While searching around, some sites will advice you to disable your RAID controller or some such, which would again be incorrect, sinceÂ `nvmcp64.sys`' job is also... to handle audio.

**The solution**Â is in fact pretty simple. Uninstall the Nvidia audio driver and go to Realtek's website to download a [general AC'97 audio driver](http://www.realtek.com.tw/downloads/downloadsCheck.aspx?Langid=1&PNid=23&PFid=23&Level=4&Conn=3&DownTypeID=3&GetDown=false#AC) (an audio standard used by virtually any motherboard manufacturer, now replaced by Realtek's High Definition Audio standard). Realtek warns you that their general purpose drivers "may not offer the customizations made by your system/motherboard manufacturer", which is acceptable.

After doing this, audio now works fine, and the blue screens areÂ completelyÂ gone. I've indeed lost some customizations/features offered by Nvidia (such as the record what you hear functionality), but these can be replaced by other software tools and were not really used that much by meÂ anyway. Audio itself plays fine, without causing blue screens any longer.

