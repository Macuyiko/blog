Title: Virtualbox: Expanding A Disk Drive
Date: 2008-09-07
Author: Seppe "Macuyiko" vanden Broucke

I love Virtualbox, it's definitely my virtualization platform of choice for daily tasks [1] on a Linux-host, and it's quickly replacing VMware on Windows hosts as well.

However, recently I had to expand a virtual partition of a Windows guest. There are already lots of options and methods available to do this:

  - <http://ubuntuforums.org/showthread.php?t=634880>: uses gparted and ntfsresize.
  - <http://forums.virtualbox.org/viewtopic.php?t=1966>: described lots of options to modify VDI files.
  - <http://forums.virtualbox.org/viewtopic.php?t=364>: gives some methods.
  - <http://forums.virtualbox.org/viewtopic.php?t=1404>: importing a native install into a VDI.

None of these actually offered a really good or quick solution, until I found this [blog post](http://crookedspoke.wordpress.com/2008/03/15/resize-disk-image/). Tom's statement of hostility to copyright allows me to provide a summary... However, I've added some extra steps and tips for both Windows and Linux guests.

You'll need:

  - [A Gparted LiveCD](http://gparted.sourceforge.net/livecd.php).
  - Two virtual disk images: the old one (the one you're currently using, the small one), and a new one, which you can easily create in Virtualbox, make sure it's "raw"Â (unpartitioned).

Steps:

1. Mount or burn the Gparted disk in Virtualbox so that it'll boot from it (make sure the "virtual bios" boots from it first).
2. Using VirtualBox, create a new VDI with a larger size that you want to expand the virtual machine to (see: "You'll need").
3. Leave your existing VDI as the primary IDE master. Set the new VDI to be the Primary IDE slave for the machine.
4. In Gparted: run `fdisk -l`Â or use Gparted GUI to view your partitions. You should get /dev/hda and /dev/hdb. /dev/hdb shouldn't be partitioned at this point. /dev/hda should be your primary master (the original VDI that is too small for your needs), and /dev/hdb should be the new image (virtual primary IDE slave).
5. Do not mount those (yet). Instead, use dd to copy the old image to the new one: `dd if=/dev/hda of=/dev/hdb`

Warning: don't despair, this may take some time, and the hard drive status icon of Virtualbox should indicate that something's happening.

Steps for Linux guests:

1. Launch GParted, and resize the partition on `/dev/hdb` (the new image) to take up the entire disk. This may take awhile. If you cannot move your partition because the swap partition is in the way, first remove the swap, then add a new swap partition add the end of the hard drive (linux-swap), and then extend the non-swap partition. The following screenshot shows how it should look after recreating the swap partition, right before extending the data-partition:

    [ ![](http://3.bp.blogspot.com/_X4W-h82Vgjw/SYo4jrQIXKI/AAAAAAAAPIo/xLipRm7H704/s400/right.png)](http://3.bp.blogspot.com/_X4W-h82Vgjw/SYo4jrQIXKI/AAAAAAAAPIo/xLipRm7H704/s1600-h/right.png)

2. Extra step (update - thanks to comments): modern Linux distributions use disk IDs to identify disks instead of sda, sdb,... This might give you the following message in a few steps:Â "Waiting for device /dev/disk/by-id/scsi-SATA_VBOX_HARDDISK_VB... to appear", like the user in the comments of this post. So before you continue with the following steps, open a Terminal window.

    I'm going to create two mount points for the old and new partition and mount them. You can use GParted to find out the exact device location (the new partition should probably be `/dev/hdb1`):

    mkdir /mnt/old_disk
    mkdir /mnt/new_disk
    mount /dev/hda1 /mnt/old_disk
    mount /dev/hdb1 /mnt/new_disk

    Screenshot:

    ![](http://3.bp.blogspot.com/_X4W-h82Vgjw/SYpAl5UjIYI/AAAAAAAAPIw/BotclqOvt2M/s400/right2.png)

    I'm now going to take a peek at the fstab-file on my old partition:

    cat /mnt/old_disk/etc/fstab

    With an Ubuntu partition, you get something like this:

    ![](http://4.bp.blogspot.com/_X4W-h82Vgjw/SYpBZG7LLII/AAAAAAAAPI4/gmkToO7FIrs/s400/right3.png)

    Ubuntu uses UUIDs to identify partitions. We'll have to edit our new partition's fstab file with the new UUIDs. Your distribution could use:

      - Device locations, like `/dev/sda1` (yes, you see this in my fstab file as well, but everything after a pound ('#') character is a comment, so it's not really using that). You can find out your new locations using GParted. Make sure you only change the numbers if you have to! So don't change `sda` to `sdb` or `hdb`! GParted might be showing you `/dev/hdb`, but when we'll make our new partition the master VDI, your Linux installation will see this as /dev/sda!
      - IDs, not common, you can find the new IDs by using `ls /dev/disk/by-id -lah`.
      - Paths, not common, you can find them by usingÂ `ls /dev/disk/by-path -lah`.
      - UUIDs (like me), more and more common. You can find your new UUIDs by usingÂ `ls /dev/disk/by-uuid -lah`. The new UUIDs will be listed next to `../../hdb`-lines (remember: `hda` is our old hard disk).

    Now let's edit our newÂ fstab. Open a new Terminal window (so you can still see the UUIDs) and enter:

    nano /mnt/new_disk/etc/fstab

    Nano is a Terminal text editor. Just use it like Notepad, use CTRL+O to save your changes, and CTRL+X to exit. You can use it to edit your UUIDs.

    Note:Â make sure you leave the proc-line intact! Also, note that the cdrom-line doesn't use an UUID but /dev/scd0.

    Extra note:Â the data-partition will probably have the same UUID as before (we have only extended it). The swap partition has a new UUID (because I deleted and recreated it).

    Following screenshot shows my edited fstab, I have removed the comments.

    ![](http://2.bp.blogspot.com/_X4W-h82Vgjw/SYpFKVZA9mI/AAAAAAAAPJA/cqwieXimuFk/s400/right4.png)

3. All done? Good. Poweroff with the GParted LiveCD.

4. Finally, set the new image (resized) as the primary master for the virtual machine. Uncheck the primary slave. Boot into the machine to verify that it worked. If everything works you may delete the small disk VDI.

    Screwed? Then make the small image master and the large one slave again, and use GParted with nano to double check. Don't be afraid making a mistake, if you only edit the large VDI, you can always rollback to your old small one and start over.

Steps for Windows guests:

1. Do not use gparted orÂ ntfsresize to resize the partition. I know you can, but I found it a tad risky. Instead, set the new image as the primary master for the virtual machine, uncheck the primary slave. Boot back into Windows.

2. You should be back into Windows, but still on a small partition. If you use Disk Management in Administrative Tools you should see that there is a lot of unallocated space now on the virtual hard disk, how can we expand our drive?

3. Open a `cmd`. Type `diskpart.exe`, this is a tool that comes built in with most Windows distributions.

    Type `extend` and press enter. This will extend your partition. The full command is `extend [size=n] [disk=n] [noerr]`, but we can leave all options to their defaults.

4. Once this is done, use `chkdsk` to make sure everything is okay.

[1]: For server-oriented platforms, Xen is the undisputable champion.

