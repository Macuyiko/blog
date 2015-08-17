Title: Ubuntu Feisty - Second Problem
Date: 2007-04-30
Author: Seppe "Macuyiko" vanden Broucke

Another problem (on another machine) was that it refused booting the new kernel.  
Also: the live cd didn't work either, with the same error. A lot of people have problems of this kind, and most of the times they get the following errors:  
    ata2 is slow to respond, please be patient      ata2 failed to respond (30 secs)      ata2: command 0xa0 timeout, stat 0xd0 host_stat 0x20  
And finally it quits to an initramfs shell:  
    /bin/sh: can't access tty; job control turned off  
Note that this last message is normal and has nothing to do with the actual problem. This caused some confusion with some people.  
So people have tried various things, here are a few suggestions, most of them came from users and developers:    - Is there a floppy in the drive? Remove it, otherwise, insert a floppy and see if that makes any difference. I didn't care much for this solution. However, it did work for some people...  - Check your IDE configuration in the BIOS, put it on Standard IDE.  - Boot with libata.ignore_hpa=0 added to boot options. (Press e to edit a menu item in the GRUB list, then go to the line which contains the kernel. Always remove quiet and splash and add the above command.) This didn't work with me.The solution which worked for me was the following one: add break=top to the boot parameters (see above), don't forget to delete splash and quiet. Once you boot, you will immediately break to an initramfs shell. Try the following commands.  
    modprobe piix      modprobe libata      modprobe pata_jmicron      modprobe ata_piix      modprobe ahci      modprobe ata_generic      modprobe ide-disk      modprobe ide-generic  
Then type exit to continue booting. You don't have to try them all at once. I first tried `ide-disk` and `ide-generic` but those didn't work, then I tried only `piix`, which worked! If that doesn't work, I would suggest trying `piix`, `libata`, `pata_jmicron`, `ata_piix`, `ahci` and `ata_generic`.  
Once you get it running, we must make sure these modules get loaded automatically (instead of always adding break=top). Edit the following file: `/etc/initramfs-tools/modules/`. E.g., type:  
    sudo gedit /etc/initramfs-tools/modules  
And add the modules which worked for you (without `modprobe`). In my case, I only had to add `piix`. Save and exit the editor, then execute the following command:  
    sudo update-initramfs -u  
Done. Try to restart normally. It should work now. If it doesn't, continue checking the forums and Launchpad.
