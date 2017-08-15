Title: Neverwinter Nights On My Ubuntu-Laptop
Date: 2006-09-11
Author: Seppe "Macuyiko" vanden Broucke

Today I finally decided to spend some time and try to install Neverwinter Nights on my laptop, since I absolutely still love that game. Of course: you could follow [this howto](http://ubuntuforums.org/showthread.php?t=113259), but since I don't have NWN Platinum or Diamond, I had to follow other instructions. I didn't want to pirate the game (I legally own the original and the two expansions, so I figured that would work too).

Instead I followed the [instructions from Bioware](http://nwn.bioware.com/downloads/linuxclient.html), congrats to them for making this game available on a Linux (and Mac) platform!

### Step 1: "Installing Using Downloaded Linux Client Resources"

Download the [Linux Client Resources v1.29](http://files.bioware.com/neverwinternights/updates/linux/nwresources129.tar.gz) (from BioWare). Extract this archive somewhere (e.g.: /home/user/Programs/nwn).

We will do the English install, for other languages: follow the Bioware instructions, these instructions are just narrowed down and compressed...

Also download the [Linux Client 1.29 binaries](http://files.bioware.com/neverwinternights/updates/linux/nwclient129.tar.gz) (tar.gz, 5.3 MB). (Make sure you are logged in into the Bioware site, registering is free.) And also extract these into your installation folder. Make sure you overwrite all existing files - this is a rule for all further archives, unless stated otherwise.

If you have SoU and HoU, don't update to the latest version yet. And wait with playing the game ;).

### Step 2: "Installing Shadows of Undrentide Expansion Pack"

Make sure step 1 completed successfully. Since the Linux installer on the disk is broken, we will do it ourselves.

Make sure you can access the following files, they are in the CDs root folder.

- `Data_Shared.zip`
- `Language_data.zip`
- `Language_update.zip`
- `Data_Linux.zip`

Extract them into your installation folder in the above order (overwrite)!

Then delete the following files from your installation folder if they exist:

- `/INSTALL/data/patch.bif`
- `/INSTALL/patch.key`

And then execute the following command from a terminal:

    ./fixinstall

### Step 3: "Installing Hordes of the Underdark Expansion Pack"

Make sure you completed steps 1 and 2.

Remove the following files if they exist:

- `/INSTALL/patch.key`
- `/INSTALL/data/patch.bif`
- `/INSTALL/ xp1patch.key`
- `/INSTALL/data/xp1patch.bif`

Again: get the following archives from the HoU CD root and unzip them into your installation folder in the following order:

- `Data_Shared.zip`
- `Language_data.zip`
- `Language_update.zip`

Download [nwclienthotu.tar.gz](http://nwdownloads.bioware.com/neverwinternights/linux/161/nwclienthotu.tar.gz) and also extract it into your nwn directory, overwriting all.

Again, run ./fixinstall from your installation directory.

### Step 4: updating

Now update the game, [download the patch here](http://nwn.bioware.com/support/patch.html). To update, just overwrite-extract the archive you have downloaded in the installation map.

### Step 5: fixing

I got the following error when starting Neverwinter with the `./nwn` command:

    mcop warning: user defined signal handler found for SIG_PIPE, overriding
    Creating link /home/username/.kde/socket-hostname.
    can't create mcop directory

To fix this, I executed:

    mkdir ~/.kde/socket-hostname

Replace hostname with your own hostname, of course (it is mentioned in the error).

Then everything worked perfectly fine: NWN starts and I can enter my CD keys, the game doesn't run like it does on my gaming machine, but I'm satisfied that it runs at all with such a small Thinkpad X60 with quite a crappy graphics chip.

Again: thanks to Bioware for making this available (which other game company would host a one-gigabyte file on their servers?).

Happy adventuring!

