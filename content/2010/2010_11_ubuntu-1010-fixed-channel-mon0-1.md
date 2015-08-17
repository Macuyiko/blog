Title: Ubuntu 10.10: "fixed channel mon0: -1" Aircrack Problem With iwl3945
Date: 2010-11-03
Author: Seppe "Macuyiko" vanden Broucke

**Update for Ubuntu 12.04 users:** [see this post](|filename|/2012/2012_05_ubuntu-1204-fixed-channel-mon0-1.md).  

After upgrading to Ubuntu Maverick recently, the Aircrack suite stopped working for me.  

After setting `airodump` to a channel (like usual):  

    airodump --channel **X**   

It still displayed its status as:  

    fixed channel mon0: -1   

Some forum users advised to use:  

    airodump --channel X,X   

But this didn't work. For the record, I'm using a Thinkpad X60, with the `iwl3945` driver. `lshw` output:  

    *-network
           description: Wireless interface
           product: PRO/Wireless 3945ABG [Golan] Network Connection
           vendor: Intel Corporation
           physical id: 0
           bus info: pci@0000:03:00.0
           logical name: eth1
           version: 02
           width: 32 bits
           clock: 33MHz
           capabilities: bus_master cap_list ethernet physical wireless

Luckily, there is an easy to follow [thread](http://ubuntuforums.org/showthread.php?t=1598930) on the forums which fixes the problem for a similar card. This solution also worked with my 3945ABG.  

Here are the commands:  

    wget http://wireless.kernel.org/download/compat-wireless-2.6/compat-wireless-2010-10-16.tar.bz2
    tar -jxf compat-wireless-2010-10-16.tar.bz2
    cd compat-wireless-2010-10-16
    wget http://patches.aircrack-ng.org/mac80211.compat08082009.wl_frag+ack_v1.patch
    patch -p1 < mac80211.compat08082009.wl_frag+ack_v1.patch
    wget http://patches.aircrack-ng.org/channel-negative-one-maxim.patch
    patch ./net/wireless/chan.c channel-negative-one-maxim.patch
    gedit scripts/update-initramfs
    
    #*** FIND LINE 13: KLIB=/lib/modules/2.6.31-wl/build
    #*** REPLACE WITH: KLIB=/lib/modules/$(uname -r)/build
    
    make
    sudo make install
    sudo make unload
    sudo modprobe iwl3945

Alternatively you can also use `sudo reboot` instead of `sudo modprobe` if you're unsure which driver module you need to load.  

Aircrack should work fine again now. Note that kernel updates might overwrite the module again (and, hopefully, fix the bug at the same time). 

