Title: Crappy Scanners And Linux
Date: 2006-09-18
Author: Seppe "Macuyiko" vanden Broucke

Recently we got a new HP Scanner. It's a good, nice, and generally works without any complaints.  
The scanner I used before was a crappy scanner with a no-name brand nobody knows, picked up for almost nothing at some cheapskate-store (since I very rarely need to scan something). The installation of the drivers for the thing was always a pain, including copying files around, right clicking .inf files, reciting incantations and whatnot... And then hoping that it wouldn't throw a general "TWAIN error" at me.Seriously, what is that anyway? People who know something about this whole TWAIN thing know it's a pain. According to Wikipedia, it stands for **T**echnology (or Toolkit or Thing) **W**ithout **A**n (or Any) **I**ntelligent (or Important or Interesting) **N**ame, which is just cheesy. Hell, I even think that Microsoft's new WIA (or: Windows Imaging Acquisition) is better.  
Anyway: a few weeks ago, my Windows machine gave up scanning, maybe it had something to do with the fact that I was running Windows x64, I don't know. Reinstalling drivers: no dice. Moving files around: no dice. Installing drivers for other scanners (one can try): no dice. Unplugging the damn thing and throwing it out of the window... err... no dice.  
Until now. I was thinking: "Hey look, there's that stupid old scanner, maybe this will work on Linux..." So I promised myself that I would spent a few minutes (not more) trying to get this to work, before dumping it completely.  
I connect the scanner to a free USB port... nothing happens. No worries, after fiddling around I find out about `xsane` (hey, go easy on me, I'm still a bit of a Linux noob), so I try that, and get a nice bunch of error messages... perfect.  
    Failed to open device 'artec_eplus48u:libusb:001:002': invalid argument  
Really? So my crappy brand scanner is actually an Artec. Fine, after searching a bit on Google I find the following suggestions, export this:  
   export SANE_DEBUG_ARTEC_EPLUS48U=9  
And then run again, we now get some more information:  
    [artec_eplus48u] Try to open firmware file: "/usr/share/sane/artec_eplus48u/Artec48.usb"      
    [artec_eplus48u] Cannot open firmware file "/usr/share/sane/artec_eplus48u/1200.usb"      
    [artec_eplus48u] download_firmware_file failed  
Apparently, .usb is a Windows driver, so good luck getting it. Luckily, the drivers where still on my other machine, so I do a search for every .usb I can find. `Artec48.usb` gets found and copied over to the directory `xsane` suggests: `/usr/share/sane/artec_eplus48` (had to create it).  
I tried again... And it frickin' works! What a piece of cake.  
If you happen to have the same problem, and want the `Artec48.usb` driver, you may drop me a note.  
I'm happy, now this scanner still can be a little bit of use. This is what I like about Linux: if you have a problem: continue fiddling and trying without giving up. In the end it'll work out and you'll have learned a lot of things (which is great). 