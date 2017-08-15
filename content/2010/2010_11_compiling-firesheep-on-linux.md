Title: Compiling Firesheep on Linux
Date: 2010-11-19
Author: Seppe "Macuyiko" vanden Broucke

If you follow the (security) news a bit, you'veÂ undoubtedlyÂ heart about Firesheep. This tool makes it very easy to listen in on public WiFi connections and intercept HTTP Cookies from a plethora of social networking sites and mail services.

This has been possible for a long time (some tcpdump filters and some cookie setting scripts and you're golden), but this tool makes it insanely easy. You can check out the tool and its description on the [main site](http://codebutler.com/firesheep).

The site mentions that Linux support is on the way, and recently it has become possible toÂ successfullyÂ compile the tool on Linux. This is what I did to get it running on Ubuntu 10.10.

    cd ~git clone git://github.com/mickflemm/firesheep.git
    cd firesheep/
    ./autogen.sh --with-xulrunner-sdk=/usr/lib/xulrunner-devel-1.9.2.12

This will configure the makefile and will probably fail until you have installed all the right dependencies. Below are the ones I was missing, yours might differ! Check the output for hints on which package you need to install.

    sudo apt-get install libxul-dev xulrunner-devsudo libpcap-devsudo libhal-dev

    # Now configure should succeed:
    ./autogen.sh --with-xulrunner-sdk=/usr/lib/xulrunner-devel-1.9.2.12

We now need to make a small change to the makefile.

    gedit mozpopen/Makefile

Change the `MOZ_CFLAGS = ...` line to:

    MOZ_CFLAGS = -fshort-wchar -I/usr/lib/xulrunner-devel-1.9.2.12/include -I/usr/include/nspr

Now we start compiling.

    make

This will probably fail too with the message:

    make[1]: *** No rule to make target `deps/http-parser/http_parser.c', needed by `../xpi/platform/.../firesheep-backend'.  Stop.

This is fixed by running a submodule update:

    git submodule update --init

And make again:

    make

You'll now have an extension in the `build` directory. Drag the `.xpi` to Firefox to install Firesheep, then close Firefox completely.

Firesheep expects your wireless interface to be in monitor mode. The easiest way to do this is to use `airmon-ng`:

    sudo airmon-ng start eth1 #Substitute your wireless interface name

Now start Firefox with root rights:

    sudo firefox

Go to `ToolsÂ ->Â Add-ons`, and open the Firesheep `Preferences` under the `Extensions` view. Another window opens. Set the `Capture Interface` to `mon0`.

Press `CTRL+SHIFT+S` to open the Firesheep sidebar and to start capturing.

Good luck. Also, be sure to check out [Blacksheep](http://research.zscaler.com/2010/11/blacksheep-tool-to-detect-firesheep.html), a tool to detect Firesheep tampering on your network.

