Title: Ubuntu 12.04: "fixed channel mon0: -1"
Date: 2012-05-22
Author: Seppe "Macuyiko" vanden Broucke

Still having problems in Ubuntu with the fixed channel being -1 when using `aircrack` and friends? Luckily, the solution does not require patching this time (as it [used to](|filename|/2010/2010_11_ubuntu-1010-fixed-channel-mon0-1.md)), as the following solution (obtained from [this forum post](http://ubuntuforums.org/showpost.php?p=10550806&postcount=6)) now works for me. The problem is basically that the channel can not be changed while the card is in monitor mode.

Just create a bash script as such:

    #!/bin/bash
    # Change this to the interface you wish to change:
    IFACE="wlan0"

    ifconfig $IFACE down
    iwconfig $IFACE mode managed
    ifconfig $IFACE up
    iwconfig $IFACE channel $@
    ifconfig $IFACE down
    iwconfig $IFACE mode monitor
    ifconfig $IFACE up
    iwconfig $IFACE

And everything should work just fine. Just continue to use `$IFACE` (e.g. `wlan0`) in all subsequent commands (`airodump`,...) you use. Naturally, you do not need to use `airmon-ng` anymore to put the network card in monitor mode (as `$IFACE` now already is in monitor mode).

