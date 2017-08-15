Title: Installing Heroes Of Might And Magic III (3) On Linux (Ubuntu)
Date: 2010-04-23
Author: Seppe "Macuyiko" vanden Broucke

...to remind myself because I always seem to forget how to.

**1.** Put the contents of the CD somewhere (e.g. `/tmp/heroes`).

**2.** Install:

    /tmp/heroes$ ./setup.sh

**3.** Download and run patch with `--keep`:

    /tmp/heroes$ wget ftp://mirrors.dotsrc.org/lokigames/updates/heroes3/heroes3-1.3.1a-unified-x86.run
    /tmp/heroes$ _POSIX2_VERSION=199209 ./heroes3-1.3.1a-unified-x86.run --keep

**4.** Download the patch for the patch:

Dowload `http://downloads.sourceforge.net/goldenfiles/loki_patch-fix-0.1.tar.gz`

    /tmp/heroes$ tar xvfz loki_patch-fix-0.1.tar.gz
    /tmp/heroes$ cp Loki_patch-fix/fixedpatch heroes3-1.3.1a-unified-x86/bin/Linux/x86/loki_patch

**5.** Now update:

    /tmp/heroes$ ./heroes3-1.3.1a-unified-x86/update.sh

**6.** Get the compatibility libs:

    wget http://www.swanson.ukfsn.org/loki/loki_compat_libs-1.3.tar.bz2

Extract them to a directory you can remember (e.g. `HEROES3_INSTALL_PATH/lib`).

**7.** Start the game with (assuming you used `HEROES3_INSTALL_PATH/lib`):

    LD_PRELOAD=HEROES3_INSTALL_PATH/lib/libstdc++-3-libc6.2-2-2.10.0.so:HEROES3_INSTALL_PATH/lib/libsmpeg-0.4.so.0.1.3:HEROES3_INSTALL_PATH/lib/libsmjpeg-0.2.so.0 HEROES3_INSTALL_PATH/heroes3 -w

Now to get the sound working...

