Title: Trying Arch Linux
Date: 2008-12-07
Author: Seppe "Macuyiko" vanden Broucke

I've been hearing some good things about [Arch Linux](http://www.archlinux.org/) lately, and I wanted to see how it compares to Ubuntu, which I've been using for a few years now. I loaded up a new VMWare virtual machine and mounted the iso. Let's see how this goes...

I'll be following directions from [this wiki page](http://wiki.archlinux.org/index.php/Beginners_Guide#Tweaks.2FFinishing_touches). So that I'm not completely lost.

  1. Boot menu comes up. Install? Okay. no graphical installer. We're going oldskool. Log in as root and run setup.

  2. Installation steps aren't too hard to follow. Partition the hard disk, let's use JFS for the first time (why not).

  3. Select packages, core packages are selected automatically, I press enter a few times, installation begins.

  4. Time to configure the system *yuck*, configuration files. Editing `/etc/rc.conf`. Make sure that `eth0="dhcp"`. All done.

  5. Reboot. Login? Works. `ping google.com`? Works.

  6. `pacman` is the package manager. `pacman -Syu` to sync and update. `klibc` is complaining: file exists. I check the forums. Turns out I have to do `rm /usr/lib/klibc/include/asm`. Minus one for user-friendliness.

  7. Update works now. Time to add a user. `useradd -m -G users,audio,lp,optical,storage,video,wheel,power -s /bin/bash archie`. `passwd archie`.

  8. `pacman -S sudo` (we want sudo). `EDITOR=nano visudo`. Add `archie ALL=(ALL) ALL`.

  9. Install Alsa, works (seems like Arch isn't using `pulseaudio` in their tutorials/beginner's guide).

  10. On to Xorg - installing lots of stuff. `Xorg -configure` should do the trick for the configuration. Copy example `xinitrc` to my home, add `exec xterm`. Test.

  11. Mouse and keyboard aren't working. Let's try `xorgconfig`.

  12. Even worse, `xorgcfg`? Nope, still nothing. Starting to miss Ubuntu.

  13. Oops! I'm stupid, forgot to copy new config file to `/etc/X11/xorg.conf`...

  14. ... but still nothing. Forums again. Looks like someone else had this problem (also using VMWare). Install `xf64-input-vmmouse`, and execute `hwd -x`.

  15. `hwd` generates wrong `xorg.conf` files. Remove the line with `RgbPath`.

  16. Still nothing. Add Option `"AllowEmptyInput" "false"` to `ServerLayout` section.

  17. Finally! X works, I'm learning stuff already, but still: again one minus point for friendliness (although the community seems nice, and the documentation is actually not bad for a fairly small distro).

  18. Worst part is over, on to installing a desktop environment. Let's keep it simple and try Gnome.

  19. First some fonts. I add `ttf-liberation` into the mix, glad to see it's there.

  20. `gnome`, `gnome-extra`, `gdm`, downloading and installing. Takes a while.

  21. `/etc/rc.conf` again: adding `hal`, `fam` and `gdm` to daemons, and fuse to modules.

  22. Installing a bunch of gnome themes.

  23. Installing vlc, firefox, flash, and some other things.

  24. Login as user, `edit xinit`, `exec gnome-session`. And: `startx`!

  25. Gnome pops up, clean background, very minimalistic. But fast indeed.

Screenshot:

![](http://4.bp.blogspot.com/_X4W-h82Vgjw/STsJWIjqvJI/AAAAAAAALIc/59jmigmYngc/s400/arch.jpg)


