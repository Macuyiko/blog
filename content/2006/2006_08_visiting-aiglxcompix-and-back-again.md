Title: Visiting AIGLX/Compix And Back Again
Date: 2006-08-22
Author: Seppe "Macuyiko" vanden Broucke

Here it is, as promised...  
Yesterday I decided to "quickly give AIGLX/Compiz a go". I use AIGLX because I do this on my Thinkpad and it has an Intel card. AIGLX gives better performance with these cards.  
There are already nice how-to's at [this](http://doc.gwos.org/index.php/Xorg_Aiglx_Compiz) and [this](http://corvillus.com/2006/08/03/how-to-set-up-aiglx-and-compiz-on-ubuntu-606-running-gnome/) location, but I just wanted to share my experience, but also add some additional remarks. And: we will even revert back to the normal Gnome desktop...  
### 1. Add the following to your sources list:  
    sudo gedit /etc/apt/sources.list  
and add:

    ## AIGLX + COMPIZ...      deb http://ubuntu.compiz.net/ dapper aiglx       deb http://ubuntu.compiz.net/ dapper main      deb http://xgl.compiz.info/ dapper main aiglx      deb-src http://xgl.compiz.info/ dapper main aiglx      deb http://www.beerorkid.com/compiz dapper main aiglx      deb http://media.blutkind.org/xgl/ dapper main aiglx  
You might be wondering why I add a lot of repos here. In my configuration, apt-get complained about some missing packages when I used the repos mentioned in the wiki/docs.  
The following steps are exactly the same as the docs/wiki...  
    sudo apt-get update sudo apt-get dist-upgrade### 2. Install the latest dri modules:  
    sudo apt-get install linux-dri-modules-common linux-dri-modules-`uname -r`   
### 3. First purge Aiglx/Compiz:
    sudo aptitude purge compiz-aiglx compiz-aiglx-gnome  
### 4. Then install (I installed the Quinn packages, because I randomly read somewhere they were better):  
    sudo apt-get install compiz-quinn-aiglx compiz compiz-gnome  
### 5. Now let's  
    sudo gedit /etc/X11/xorg.confEdit the Screen section to 24bit mode:  
    DefaultDepth 24
Make sure your Modules section has the following loaded:  
    Section "Module"        # Load "GLcore"        Load "bitmap"        Load "ddc"        Load "dbe"        Load "dri"        Load "extmod"        Load "freetype"        Load "glx"        Load "int10"        Load "type1"        Load "vbe"      EndSection  
If you happen to have other modules: you may probably leave them in (I had one).  
Make sure there is only one option in the Device section:  
    Section "Device"        Identifier "Intel Corporation Intel Default Card"        Driver "i810"        Option "XAANoOffscreenPixmaps"        BusID "PCI:0:2:0"    EndSection  
Add Aiglx to your server layout:  
    Section "ServerLayout"        Option "AIGLX" "true"         Identifier "Default Layout"        Screen "Default Screen"        InputDevice "Generic Keyboard"        InputDevice "Configured Mouse"        InputDevice "Synaptics Touchpad"      EndSection  
Uncomment the DRI section:  
    Section "DRI"  
      Mode 0666  
    EndSection  
Finally, you must have:  
    Section "Extensions"        Option "Composite" "Enable"      EndSection  
### 6. Configure gdm:  
    sudo gedit /etc/gdm/gdm.conf-custom  
It must contain the following:  
    [servers]      0=aiglx      [server-aiglx]      name=aiglx server      command=/usr/bin/Xorg-air :0      flexible=true And restart gdm (pray):  
   sudo /etc/init.d/gdm restart  
Note: my gdm restart did not seem to work (it just gave me the cli). If this happens to you, just do a simple sudo gdm, it will work when you reboot of course.  
The following information is not in the docs/wiki...
Yes! It seems to boot. But my windows have no borders... see that new Compiz icon in the "taskbar" (top right), it looks like a red cube. Right click it, edit preferences, plugins, and enable most of them (test it out which ones work fine on your system). Make sure the first ones (`gconf`) are enabled. Save. Right click again and choose Restart Compiz. Your windows will now show borders and be wobbly and so (if you enabled the plugins).  
Now let's fix Totem. I had gstreamer so:  
    totem-gstreamer  
And then select on default video playback "XWindow (NoXv)" in video tab.  
Now for some themes, make sure the following is installed:  
    sudo apt-get install gcompizthemer      sudo apt-get install cgwd      sudo apt-get install cgwd-themes  
Note, you might also need to edit `/usr/bin/compiz-start` and replace all instances of gnome-window-decorator with cgwd (I had to do this). And restart Compiz.  
Now right click the Compiz-cube again and choose Themes. You will now see: themes. Use them.  
Some of the following information is in the docs/wiki...  
After playing with it a few days I notices I liked old ways better. My system was performing well but the idea of using these experimental packages on my work laptop was a bit scary... let's go back now.  
### Let's revert all we did. Speed style.  
- Uncomment all the repos you added in `/etc/apt/sources.list`.  
- Open the totem properties again and set the Video back to auto.  
- Open `/etc/gdm/gdm.conf-custom` and remove everything you added, it will probably just contain:

    [servers] 

- Open `xorg.conf` and uncomment/revert all your changes.  - Uninstall Compiz: 
 
    sudo apt-get remove compiz-quinn-aiglx compiz compiz-gnome      sudo apt-get remove cgwd cgwd-themes      sudo apt-get remove xserver-xgl compiz compiz-gnome gset-compiz
 
Yes there are doubles. Yes it will complain about downgrading, just choose yes... don't worry.  
- Make a file in `/etc/apt/preferences` and put the following in it:  
    Package: *    Pin: release o=Ubuntu    Pin-Priority: 1001
save it.
- Run:  
    sudo aptitude update      sudo aptitude upgrade  
It will downgrade all your packages.  
- Open `/etc/apt/preferences` again and remove the lines from step 6.  
- Open synaptic, go to Status: Local or Obsolete and remove all Compiz or Quinn or Aiglx related packages.  
Note: synaptic doesn't load? Probably a libcairo problem if I remember correctly (I had the same problem after installing Compiz Quinn). Make sure you followed the above steps correctly and do:  
sudo apt-get install libcairo2-dev libxft-dev libfontconfig1-dev  
- Reboot and hope that all goes well :).  
Wasn't that fun? And it only took 10 minutes...  
Does anyone however know a similar alt-tab feature and the "I move my mouse to the upper right and get a nice window overview" feature for Ubuntu without using Ubuntu? Because I liked those two...  
Didn't have the time for screenshots or screencasts. There are enough of them already. And you really have to experience it for yourself to really enjoy the full power. Compiz will be great when it's fully stable and in the main repos and easy installable...  
