Title: Finished
Date: 2006-10-26
Author: Seppe "Macuyiko" vanden Broucke

Just updated to Edgy and installed Beryl following [these instructions](http://doc.gwos.org/index.php/BerylOnEdgy).

Added these to my sources:

    deb http://www.beerorkid.com/compiz edgy main-edgy
    deb http://media.blutkind.org/xgl/ edgy main-edgy
    deb http://compiz-mirror.lupine.me.uk/ edgy main-edgy
    deb http://ubuntu.compiz.net/ edgy main-edgy

Then:

    sudo apt-get update

Then, in `/etc/X11/xorg.conf`, since I use an Intel card, add to Section "Device":

    Option "XAANoOffscreenPixmaps" "true"

And at the end of the file:

    Section "Extensions"
    Option "Composite" "true"
    EndSection

Then install Beryl:

    sudo apt-get install beryl-core beryl-plugins beryl-plugins-data emerald beryl-settings beryl-manager beryl beryl-dev emerald-themes

Then just start with `beryl-manager`.

Works like a charm, and quite fast too after tinkering with some effects and themes.
