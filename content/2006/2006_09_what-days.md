Title: What A Day(s)
Date: 2006-09-20
Author: Seppe "Macuyiko" vanden Broucke

Warning: the following post will probably contain swearing and profanity, this is because I am very mad at the moment... sorry.  
The day before yesterday, around 2 a.m.: I stop working for that day and shut down my PC.  
Yesterday: I start that PC (it's my Windows machine: be prepared for anything) and see 'One of your drives has to be checked for consistency...' yadda yadda. I am not woried, this has happened before, so I think: 'A check can't be bad.'.  
Yeah, right, around 50% of the first check: chkdsk hangs... I wait... I wait some more... I start looking on the Internet for some support... This is gonna be bad... I think, and I restart.  
I restart and restart and restart and the check keeps locking up. So I try to cancel it and start Windows.  
STOP: VOLUME_NOT_MOUNTABLE or something like that... What the fuck! Again! Windows loads this time, but the system is remarkable slow. This is bad.  
I grab an XP install disk and throw it in the drive... recovery console... trying to remember that !"£$ administrator password and running checkdisk as if there's no tomorrow...  
    Chkdsk is performing additional checks and fixes...          Chkdsk is performing additional checks and fixes...          Chkdsk is performing additional checks and fixes...  
Boom -- BSOD! A BSOD for god's sake! In a setup environment! How bad can things get? UNEXPECTED_CHECK_EXCEPTION what the!  
Okay: let's search for tools and trials for NTFS file checking. Back in the day, we had Norton. Then: Norton was still a friend for sysadmins. But back in the day, we also had FAT32, which was more open and more known than NTFS... (Did you know that 'NTFS Recovery' in Norton Tools today actually means: `chkdsk /r /f`? I'm not even joking.)  
Iolo Drivemedic Stuff Thingy Trial. I install quickly before Windows locks up again.  
Iolo has performed an illegal operation and has to... goddammit! Is this a tool or what, it doesn't even work (Windows 64 bit maybe?) After scrutinizing the install maps I find the image for a boot disk 'Which will fix every error you see and do your laundry too!', or so it says above the 'BUY ME!' button on their site.  
Turns out that boot floppy (Who has floppy's lying around the house? I'm glad I had.) is the result of a night filled with passion between MSDOS and FREEDOS: crappy mouse drivers are the result.  
I try navigating my way through the screens with my arrow keys, but when the second screen shows some nice circles to select the drive I want to check, Tab, Space, Enter, Arrows and all the other keys don't work! Who makes this crap? Esc: exit application. I could cry. So I search for a PS/2 mouse, and plug it in. Of course you have to restart, because the ctmouse.exe crap refuses to believe that there is a mouse (apart from the one it made up at COM1). Now the mouse works (and believe it or not, both the USB and the PS/2 mouses (or mice) work now, I don't get this). I click my drive and I am happy this problem will be solved.  
    ( ) Fix MBR.      ( ) Fix Partition Table.  
No shit Sherlock. All this trouble for this? Crap Iolo tools! I have news: the only tool which is a little bit fucking usable for fixing NTFS partitions is... chkdsk. That's right, MS had kept NTFS as their little dirty closed secret and now nobody can play with it. ntfsfix on Linux tries to give a little help, but doesn't do anything either. How bad is that? So chkdsk again... now from another install CD (you never know). After spinning and crunching the drive, it spits out:      The drive has one or more unrecoverable errors...  
Oh really? Time to backup stuff then. But don't try this in Windows. You see, when you drag and drop some files, 10 files for example, and number 5 can't get copied for some reason, then it drops all the next 5 too, so you can spend some hours figuring out which file is giving you problems.  
Luckily there is XCOPY, with it's /c flag (if i remember correctly) to continue copying if an error occurs, CLI tools still are the best tools. The only thing is that when there was an error: the whole fucking OS just crashed or froze. Great.  
But never will I give up my 9GB of important documents and data!  
I turn every CD and DVD I can find around: Knoppix 4.something, yes!  
I boot Knoppix (lovely DVD that is) and prepare for some copying. Of course, you can't write to other NTFS files, so I had to copy my files over the network to my laptop. I boot up SSH server and in Knoppix I try:  
    scp -rpv /mnt/sda1/Documents\ and\ Settings/Yaddayaddayadda myuser@192.168.111.5:/home/myuser/backup  
Which works. On some file I get an output/input error but at least it doesn't crash and saves what it can...  
Until... a large file came up... '- STALLED -'. What does that mean? The network isn't down, is it? I try a quick ifconfig on Knoppix: only `lo`? Where has `eth0` gone?  
Turns out, if you use a nForce motherboard, it causes scp and sftp to crap out (or the other way around?). You have to turn your PC off and then turn it on again to recognize the `eth0` again. (Restart? Forget it!)  
A Windows Share, then, I start Samba (which is easy in Knoppix) and connect with my Laptop. I successfully copy the remaining files... (That was a few hours ago.)  
Now I really want to know what has caused this behaviour. Since Scandisk Surface Scan isn't around anymore and replace with `chkdsk` over there, I try  
    badblocks -c 16000 -s -v -o ./out /dev/sda1  
Holy cow: are all these bad blocks? This drive is only three (3!) years old! Name to blame: Maxtor. I hope it's still under warranty. Never I will buy their shitty drives again, never! So at the end: it wasn't really Windows' fault, but they could've made my job a lot easier.  
Now I can go through the process of installing Windows all over again once more... I'm gonna take an aspirin now.  
What have we learned?  - Backup!  - Download the newest Knoppix DVD and burn it now!  - Maxtor is shitty.  - The only tool we have for fixing NTFS files and indexes and attributes is chkdsk.  - Luckily there's Linux, and SSH.
... goddammit!  

