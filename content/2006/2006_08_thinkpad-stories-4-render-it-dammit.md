Title: Thinkpad Stories 4: "Render it dammit!"
Date: 2006-08-11
Author: Seppe "Macuyiko" vanden Broucke

i810... `glxinfo | grep direct` is giving nothing. Something about 1.5.0 expected but 1.4.* found.

Anyhow: I could not get it to work. It seemed fine however, but glgears proved otherwise: slow as hell.

I was giving up on it and decided to try and install AIGLX, so I followed the first steps on the forums: add this to /etc/apt/sources.list:

    deb http://xgl.compiz.info/ dapper aiglx
    deb http://xgl.compiz.info/ dapper main

Then do a

    sudo apt-get update

I was reading on what to do now when suddenly the "There are updates" notifier came up: I looked at it and it showed some ATI and Intel driver updates for my i910...

Why not? Install.

Then someone on the forums said doing an `dpkg-reconfigure xserver-xorg` could help. I did and followed all the steps, but pay extra attention when it asks you about kernel frame buffering (it is a yes or no question). It seems sometimes it works without it and sometimes with it. I went with what looked best and picked yes.

Then I restarted my x-server (ctrl-alt-backspace). Did a `glxinfo | grep direct` again and direct rendering is enabled.

All this without really installing AIGLX nor manual editing my xorg config. You should try it too.

Now I'm completely happy, ACPI works like it should too, with a nice icon in the taskbar and all.

I also installed SciTE (use apt-get) and [Aptana](http://www.aptana.com/) as my favorite editors.

Be warned when you use Aptana in Ubuntu (see their docs). I wrote a script like this:

    #!/bin/sh
    export MOZILLA_FIVE_HOME=/usr/lib/mozilla
    ./aptana

And execute that when I want to start Aptana.



