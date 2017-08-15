Title: Thinkpad Stories 1: "So ya wanna boot Ubuntu?"
Date: 2006-08-11
Author: Seppe "Macuyiko" vanden Broucke

After quickly setting up Windows XP and removing all the unnecessary software (who wants Symantec for God's sake?) it was time to think about booting the Ubuntu installer.

This would be a non-trivial task for me, because my CD/DVD-burner/reader has not arrived yet and I could not wait (who could), I would have to do a PXE or network-install.

Logically, you need a client (the PC you want to install Ubuntu on), and a server. In my case, the server would be my Windows XP x64 machine.

This [Ubuntu Wiki entry](https://help.ubuntu.com/community/Installation/WindowsServerNetboot) gives a good starting point for setting up your server. But some things could be a bit clearer... let me drill down the steps:

Is your client able to do a PXE boot? My Thinkpad is (most of them are). (When showing the splash screen, press F12 to show a boot device list, pick the network PXE one.) So no floppies needed here.

On your server: create a folder like C:\cp or C:\ubuntu to store all the needed server stuff.

Download [Tftpd32.exe](http://perso.orange.fr/philippe.jounin/tftpd32.html) and place it in the folder you just created.

The Wiki entry advices to download a netbootkit, but since I already had my Dapper ISOs, I did it myself: go to the Dapper CD you want to use (this actually doesn't matter, but I picked the alternate-install CD). (You don't need to burn it: WinRAR can open ISO images or you can mount them with DaemonTools.)

Then go to the folder CD:\install\netboot\ubuntu-installer\i386\ (replace CD with your drive letter) and copy all the contents to FOLDER\netboot\ (replace FOLDER with the folder you created in step 2, and create the netboot folder). You may also use another location to put these files, but it's neat to put them in one spot under our working directory.

Note: don't be stupid (as I first was). Do NOT copy CD:\install\netboot! Yes, there is a pxelinux.0 file in that folder, but it will not work (it is 0 bytes large), you must copy the files from the location above.

Update: it seems you have to be extra careful. Apparently, you do not only have to copy the contents of **CD:\install\netboot\ubuntu-installer\i386\**, but also the _directory itself_ **CD:\install\netboot\ubuntu-installer\ **(the directory itself, not the contents!) to **FOLDER\netboot\**. This is probably not the best method, but works...

That was easy, right? Now open Tftpd32.exe. Here is were it got a bit tricky...

- Click the DHCP server tab. Yes we will configure this. I was wondering if this was necessary because my router-slash-firewall already has a DHCP server built in. The answer is: yes you have to do it!
- Set up the following fields: IP pool starting address: I picked 192.168.111.5. (My gateway is at 192.168.111.1.) Figure out what your gateway is, you can do that by running ipconfig from a Windows Command Line. Size of pool: 5, more than large enough. Boot file: in this example, I picked \netboot\pxelinux.0, but you could have placed it at another location. WINS/DNS Server: your gateway, in my case: 192.168.111.1. Default router: also your gateway. Mask: probably 255.255.255.0. Domain Name and Additional Option: leave all as is (blank).
- Press Save to save. Then press the Settings button. Make sure PXE Compatabilty, Translate Unix file names and Allow '\' As Virtual Root are enabled. Also, I had to enable Use Tftpd32 only on this interface: 192.168.111.2 because I have two network adapters (just to be safe).
- Press OK.

Done, restart Tftpd32.exe if that is necessary (it warns you).

Now: I had to disable my second network adapter. I went to Network Connections, right clicked and choose disable. This might not be necessary but better be safe...

Tutorials say you have to disable your router's DHCP server. This might be true! I did not have to do it but I advice to do it anyway so the network boot will surely use your server for DHCP/PXE booting. I cannot explain this process here, as it differs from router to router and from firewall to firewall. Consult your manuals or Google if you need to.

You're all set: boot your client into network boot. If you're lucky and did everything correctly, it gets assigned a DHCP address (you will see this in the Tftpd32 event list on your server). Then Tftpd32 will sent a few files over (you will see the process bars) and Ubuntu will splash. Press enter to begin install.

Important: a few users have had problems on the Ubuntuforums with the following. After the Pick a mirror step Ubuntu will not be able to connect. Here's how to solve it: when you are in the first installer steps (before setting up network with autodetect!) you must close Tftpd32 on the serverside. You must also again enable your router's DHCP server. Then let Ubuntu discover the network settings. It will not get an address from your router and go out on the Internet: the mirrors will be resolved now, and you can continue installation.

You don't need Tftpd32 anymore unless you want to start over. Just start Tftpd32 again and disable the router's DHCP server (again: I did not have to do this).

Up next: partitioning woes.
