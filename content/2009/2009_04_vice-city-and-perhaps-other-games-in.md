Title: Vice City (And Perhaps Other Games) In Wine - CD Error With ISO
Date: 2009-04-28
Author: Seppe "Macuyiko" vanden Broucke

So, you've just gotten yourself two .iso's for Grand Theft Auto: Vice City (your backups, of course), which you want to play in Wine. What do you do?

That's easy, you say:

    sudo mkdir /media/isoimag
    sudo mount -o loop ./cd1.iso /media/isoimage

And start the setup with Wine.

Now the installer asks for the second CD, what do you do? Here we have to "eject" our "cd" first...

    wine eject
    sudo umount /media/isoimage
    sudo mount -o loop ./cd2.iso /media/isoimage

And we're done. You want to start the game, but it requires the play disk, even although you're sure you've mounted it. Thing is, Vice City isn't looking at your `/media/isoimage` mount point, but it's looking at your drive letters... where could the cd be?

Take a look in `~/.wine/dosdevices` (it's a hidden directory in your home folder). We're going to create two symbolic links there (in my case, there were a lot of symbolic, broken links already there, I deleted every one of them except c: and z:). One for the mount point, and one for the actual device (or in our case: the image).

    ln -sf /media/isoimage ~/.wine/dosdevices/e:
    ln -sf ~/cd2.iso ~/.wine/dosdevices/e::

Note the double colons (e::) in the second line. That's it, the game should start fine now.

Be sure to replace `/media/isoimage`, `e:`, `e::`, `~/cd1.iso`, `~/cd2.iso` and other displayed paths/locations with the ones relevant for you.

