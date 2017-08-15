Title: Nokia N95, 3G, Bluetooth, And Ubuntu Intrepid - 3G Tethering Howto
Date: 2009-01-16
Author: Seppe "Macuyiko" vanden Broucke

The following steps are instructions to surf the web using a Nokia N95 with 3G, connected to your Intrepid laptop via Bluetooth.

#### 1. Make sure you have the required packages installed:

    sudo apt-get install bluez-utils bluez-pin ppp

#### 2. Find out the phone's MAC address. Enable Bluetooth on phone and laptop, and enter the following command:

    hcitool scan

Output example:

    $ hcitool scan
    Scanning ...
    00:1C:9A:26:F5:DD Macuyiko N95

And note your MAC-address of your phone.

#### 3. Find out the phone's channel, with the N95, this might change from time to time:

    sdptool search --bdaddr MAC DUN | grep Channel

Replace MAC with your phone's MAC address.

Output example:

    $ sudo sdptool search --bdaddr 00:1C:9A:26:F5:DD DUN | grep Channel
    Channel: 4

Note this channel.

#### 4. Edit `/etc/ppp/peers/BluetoothDialup`:

    sudo gedit /etc/ppp/peers/BluetoothDialup

Paste the following:

    /dev/rfcomm1 115200
    local
    nocrtscts
    connect "/usr/sbin/chat -v -f /etc/chatscripts/proximus-gprs"
    noauth
    defaultroute
    usepeerdns
    novj
    remotename proximus
    debug
    #user
    lcp-restart 5
    ms-dns 195.238.2.21

There are a few lines which you might need to change. I'm using the Belgium Proximus operator.

First of all, change `/etc/chatscripts/proximus-gprs` to something more related to your provider (e.g.: `/etc/chatscripts/myprovider-gprs`). We're going to create this script in the next step. Also: you might need to change the `ms-dns` entry as well (in most cases you can leave it out, but I had to add it though). Also notice that I have used `/dev/rfcomm1` as the used device, we'll use this in the next steps as well.

#### 5. Create a chatscript at `/etc/chatscripts/proximus-gprs`

    sudo gedit /etc/chatscripts/proximus-gprs

Note that you may have chosen a different name for your chatscript in the previous step.

Paste:

    ABORT BUSY
    ABORT 'NO CARRIER'
    ABORT VOICE
    ABORT 'NO DIALTONE'
    ABORT 'NO DIAL TONE'
    ABORT 'NO ANSWER'
    "" ATZ
    OK AT+CGDCONT=1,"IP","internet.proximus.be"
    OK ATDT*99#
    CONNECT ""

You need to change these entries for your provider. Look up your APN and data profile number. If you google for "APN 3g [yourprovider]" you will often find the correct results, or look [here](http://www.iphoneuserguide.com/apple/2008/06/04/iphone3g/apn-settings-for-iphone-3g/) for APNs for many providers. The data profile number line will often be `OK ATDT*99#` or `OK ATDT*99***1#`, so try them both.

#### 6. Try it out

Enter the following command:

    rfcomm connect RFCOMM# MAC CHANNEL

Replace `RFCOMM#` with the `/dev/rfcomm`-number you've used before (only the number!), I've used 1. `MAC` is your phone's MAC address again, and `CHANNEL` is the channel you found earlier.

If all went well it should say:

    $ rfcomm connect 1 00:1C:9A:26:F5:DD 4
    Connected /dev/rfcomm1 to 00:1C:9A:26:F5:DD on channel 4
    Press CTRL-C for hangup

Now we're going to enable the PPP connection, in a _new_ terminal window (keep the "CTRL-C for hangup"-one open), enter:

    pon BluetoothDialup

`BluetoothDialup` is the filename of the file we have created in `/etc/ppp/peers/` earlier in step 4.

If all went well you should see an entry now in your ifconfig output:

    $ ifconfig
      ppp0 Â  Â  Â Link encap:Point-to-Point Protocol
        inet addr:81.169.31.99Â  P-t-P:10.6.6.6Â  Mask:255.255.255.255
        UP POINTOPOINT RUNNING NOARP MULTICASTÂ  MTU:1500Â  Metric:1
        RX packets:3 errors:0 dropped:0 overruns:0 frame:0
        TX packets:4 errors:0 dropped:0 overruns:0 carrier:0
        collisions:0 txqueuelen:3
        RX bytes:54 (54.0 B)Â  TX bytes:69 (69.0 B)`

If you're done surfing the internet, turn off PPP:

    poff

Press CTRL-C in that other terminal window to break the Bluetooth/3G-connection.

**Note:** if you've done something wrong (e.g.: used the wrong channel), you can release rfcomm's with:

    rfcomm release RFCOMM#

With `RFCOMM#`Â equal to the `/dev/rfcomm`-number you've used before.

#### Optional steps: use gnome-ppp to connect

If you have `gnome-ppp` installed, you can also use a graphical interface to configure the above steps.

First of all, you still have to execute:

    rfcomm connect RFCOMM# MAC CHANNEL

But you _don't_ have to create the files from steps 4 and 5. We could automate the connect-step as well, but since the N95's channel changes from time to time, this wouldn't be very convenient. Also, I like having a terminal open to notify me that I'm still surfing via my phone.

Then open up `gnome-ppp`. If you have to enter a blank username and password for your provider, just enter some dummy values. I used "blank" and "blank".

Phone number: I tried `*99***1#` this time. And it also seemed to work, great!

Then press `Setup`. Enter the following values:

  - Device: `/dev/rfcomm1` (or the other rfcomm you defined earlier)
  - Type: `USB Modem` (yes, USB!)
  - Speed: `460800` works here, this probably means I could have used this value in the previous configuration files as well, instead of `115200`
  - Phone Line: `Tone` (default)
  - Volume: `High` (default)

Then press `Init Strings`.

  - Leave `Init 2` unchanged (`ATQ0 V1 E1 S0=0 &C1 &D2 +FCLASS=0`)
  - Enter this in `Init 3`: `AT+CGDCONT=1,"IP","internet.proximus.be"`

Again, change this for your provider! I also had to manually define a DNS in the `Networking` tab, just like in the previous steps. This might not be the case for you.

You're done, make sure you're not wired or wirelessly connected to test this :).

Screenshot:

![](http://2.bp.blogspot.com/_X4W-h82Vgjw/SXD_Jdo-kuI/AAAAAAAAPIg/k5UvfUx-Gv4/s400/97214235_6ee4d4a9c4_o.png)

Final note: some people have to add `novj` to `/etc/ppp/options` as well. I didn't, tho. Check the Ubuntu forums/Google for information about your specific operator and/or hardware.

These instructions were only tested with my Thinkpad, my N95, and my operator. I've set up laptops with Vodafone cards before, and you can use `gnome-ppp` for those as well, just make sure you're using the correct device. Often the device will be at `/dev/ttyS0`, but use `dmesg` to find out the exact location.

