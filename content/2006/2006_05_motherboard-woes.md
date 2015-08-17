Title: Motherboard Woes
Date: 2006-05-07
Author: Seppe "Macuyiko" vanden Broucke

Recenty I added a second Opteron CPU and 2GB more RAM to my Tyan Thunder motherboard, bringing the total to 4GB.
Windows however, decided that it would only detect 2,75GB. While booting, the BIOS nicely displayed 4GB. What the...?  
Booting with Linux live CD: same problem.  
Searching a lot with Google: 'memory hole' setting in the 'hammer configuration'. A lot of people are having this problem and proposing various solutions.
What worked for me:1. Flash motherboard to latest version, finding a working Win98 boot disk was a real pain
2. If your CPU has a stepping 'Cx' ('x' standing for any letter), put 'memory hole' option in BIOS on 'software', otherwise, put it on 'hardware'  3. After booting Windows XP Professional: same problem. Trying with an Ubuntu 64 bit live CD... it works! Installing Windows x64. Now it works in Windows too
So main problem was a 32 bit OS. Bottom line: if you have a 64bit CPU, do not bother to install a 32 bit OS anymore (like I did).  
I hope my experience was useful to anyone (I had a much nicer post written out, but due to Internet Explorer's popup blocker while spell-checking, I've lost it. Firefox' blocker is much better, it doesn't automatically reload the page after allowing popups, but silently waits until you try again.)  
P.S.: indeed, my Windows x64 came with pre-baked SP2... Damn. Patching TCP half-open connection limit, completely disabling security center. Stupid new Internet Explorer settings... I hate SP2.  
I also had to but the 'MAC LAN Bridge' options to 'Enable' in the BIOS for the Windows drivers to detect my Ethernet controllers. I had not to do this in Windows XP (32 bit).  