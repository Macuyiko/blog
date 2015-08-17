Title: Thinkpad Stories (5 already): "Bluetooth and Nokia phones."
Date: 2006-08-14
Author: Seppe "Macuyiko" vanden Broucke

Story number 5 already.  
Here is the background talk: now that I finally have bluetooth support (I never had an USB dongle) I could finally copy my pictures over from my Nokia phone (since I don't want to invest in an expensive non-standard USB cable).  
I followed some advice from the forums and other Internet resources... here is how I did it.  
Make sure the following packages are installed on your system:  
    sudo apt-get install gnome-bluetooth      sudo apt-get install obexserver      sudo apt-get install bluez-utils  
Then load the following modules into the kernel (I could skip this step).  
    sudo modprobe l2cap      sudo modprobe rfcomm  
Also, start your `bluez-utils`:  
    sudo /etc/init.d/bluez-utils start  
Since I am using my Thinkpad, I active the integrated bluetooth device:  
    sudo su      echo enable > /proc/acpi/ibm/bluetooth  
Activate bluetooth in your phone. Make sure it is visible to other devices.  
Now do:  
    hcitool scan  
You should see something like this:  
    Scanning ...  
    00:11:22:DD:EE:FF YOUR_PHONE_NAME  
Copy the address to the clipboard, you'll use it later.  
Now we edit a simple configuration file:  
    sudo gedit /etc/bluetooth/rfcomm.conf  
And save this (use your own address, leave the channel to 10):  
    rfcomm0 {  
    device ADDRESS_OF_YOUR_PHONE;  
    channel 10;  
    comment "Your description";  
    }  
You may wonder how we got this channel, you can find out by entering this command:  
    sdptool browse ADDRESS_OF_YOUR_PHONE  
Somewhere in the output you find the following:  
	Service Name: OBEX File Transfer  	Service RecHandle: 0x1000f  	Service Class ID List:  	"OBEX File Transfer" (0x1106)  	Protocol Descriptor List:  	"L2CAP" (0x0100)  	"RFCOMM" (0x0003)  	Channel: 10  	"OBEX" (0x0008)  	Language Base Attr List:  	code_ISO639: 0x656e  	encoding: 0x6a  	base_offset: 0x100  	Profile Descriptor List:  	"OBEX File Transfer" (0x1106)  	Version: 0x0100  
See?  
Now add the Nokia channel to communicate with the phone:  
	sudo sdptool add --channel=10 OPUSH  
And bind it with `rfcomm`:  
	sudo rfcomm bind /dev/rfcomm0 ADDRESS_OF_YOUR_PHONE 10  
You're all set up... now you can:  
**Send a file from your phone:**
(1) Start the obexserver with (stores files in /tmp, you must enter this command after every file send):  
    obexserver  
or (stays open, should store in your home dir, but didn't work with me):  
    gnome-obex-server  
(2) Use your phone, select a picture or video file, then Options -> Send -> Via Bluetooth, it should find your PC.
**Send a file to your phone:**
(1) `gnome-obex-send /path/to/file`  
It should find your phone and prompt you.
Don't forget that you must use these commands every reboot again (or you could make a script):  
	sudo modprobe l2cap  	sudo modprobe rfcomm  	# (re)start (if necessary):	sudo /etc/init.d/bluez-utils	echo enable > /proc/acpi/ibm/bluetooth  	sudo mknod /dev/rfcomm0 c 216 0  	sdptool add --channel=10 OPUSH  	sudo rfcomm bind /dev/rfcomm0 YOUR_PHONE_ADDRESS 10  
When you're done, I find it neat the disable the integrated bluetooth device (let's conserve power) this is easy as pie:  
	echo disable > /proc/acpi/ibm/bluetooth  
and you could also stop `bluez-utils`:  
	sudo /etc/init.d/bluez-utils stop  
if you want.  
This was one of my reasons why I kept a Windows partition. Now that I have figured out how to do this in Ubuntu, one partition has a greater change of being wiped and merged.