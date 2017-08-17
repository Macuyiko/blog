Title: Thinkpad Stories 3: "Now for some colours..."
Date: 2006-08-11
Author: Seppe "Macuyiko" vanden Broucke

Ubuntu's finished installing. It all looks nice.

I picked a nice [wallpaper,](http://interfacelift.com/wallpaper/index.php) set my workspaces to 8, and installed gnome-art (sudo apt-get install gnome-art). Picked some nice decorations (I like the Human theme but not that much) and sat back for a few seconds to admire my new desktop.

Then: I installed [Automatix.](http://www.getautomatix.com/) Automatix had a reputation of being intrusive and all, but is very well maintained these days and I hadn't had the slightest problem. (Easyubuntu gave an error, and less options to install. Don't want to flame though: it's good too and my previous favorite.)

This took a while.

There were to other things I wanted to solve before being completely satisfied.

The first was WPA support since my home network uses that.

I found a lot of information on the forums, configure this and write that, but here is the most easy way to do it:

  - Make sure `wpa-supplier` and `gnome-network-tools` are installed
  - `sudo gedit /etc/network/interfaces`. Uncomment everything except local loopback entries
  - Note: you can use commands like

    `wpa_supplicant -w -i eth1 -c /etc/wpa_supplicant.conf -D wext`

    and write a configuration in `/etc/wpa_supplicant.conf`. But you do not have to

  - `sudo gedit /etc/default/wpasupplicant` and just enter this:

    `ENABLED=0`

  - Reboot (or re-init).

  - I now see an `eth0` icon in my Gnome taskbar. I also see an icon were I can choose from available wireless connections. I pick mine, enter my WPA password and set type to TKIP. I also have to enter a keyring password for gnome.

Waiting... authenticating... assigning address... done! I disconnect my network cable.

See next post for my second problem.
