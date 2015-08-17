Title: Thinkpad Stories 2: "Partitioning woes."
Date: 2006-08-11
Author: Seppe "Macuyiko" vanden Broucke

It was getting late when I finally figured out how to properly boot. Now: it was time for the actual install...  
Of course: I had to partition, but I wanted to keep Windows XP (on a smaller partition) and my Recovery partition. I was happy to see a resize option for my Windows XP drive, I picked it and try to execute.  
Nothing happens...  
Again? Nothing! Oh well, I had expected this. NTFS always gives me headaches in Linux (reading, writing, resizing, the works...).  
So I want to boot back into Windows and try some resizing tool.  
No operating system  
Great, the partition is messed up. Ah well, back to Ubuntu installer and execute plan B, I partition my harddrive as following:  
- First - 40 GB, FAT32: Windows XP, no mount point, bootable.  - Second - 50 GB, ext3: Ubuntu, mount point /, bootable.  - Third - MAX GB (around 4 GB), swap.  - Last - remaining size, my recovery partition: remains untouched.  
Save and format / and swap. Exit installer, and press the ThinkVantage button.  
Yes: the recovery partition still works. File recovery, back to factory settings ("oh no it is going to wipe my partitions"), keep nothing.  
"Do you want to install on C:\ and format. Or do you want to format the whole hard driver?"  
Yes! Only C:\ of course (the FAT32 partition I made in Ubuntu installer).  
Okay: this takes a lot of time. Really a lot. The first steps go fast (I was happy) but after that it has to perform a truckload of post-installation installs (that bullshitware again). It's passed midnight...  
Done: I wipe the crapware and go back to Ubuntu.  
    boot:  
I type "server" and press enter. I'm tired and fetching all that stuff now over the Internet will take too long. It installs. Grub's being nice and detects both my Windows XP and Recovery partition.  
I went to bed (2 am). And did a  
    sudo apt-get update      sudo apt-get upgrade      sudo apt-get install ubuntu-desktop  
this morning.  