Title: Is w32codecs Freezing Your Ubuntu?
Date: 2008-06-27
Author: Seppe "Macuyiko" vanden Broucke

Wanted to play an Realmedia file? Installed w32codecs? Now Totem is freezing your Ubuntu Hardy? And by freezing, I mean: you can move the mouse, nothing else works, no ctrl-alt-backspace, no ctrl-alt-F1.  
Then do the following:  
1. Make sure you have gstreamer0.10-pitfdll installed.2. Install (if you haven't already) w32codecs.3. Execute the following three commands in the terminal:  
    rm -rf ~/.gstreamer-0.10      gst-inspect-0.10      gst-inspect-0.10 pitfdll
4. Try Totem again. Should work now.
