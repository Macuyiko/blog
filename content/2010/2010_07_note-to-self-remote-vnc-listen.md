Title: Note To Self: Remote VNC (Listen) Connection
Date: 2010-07-02
Author: Seppe "Macuyiko" vanden Broucke

Because I always forget these commands and end up double checking them...

####  Client (Me) - Listening:

    vncviewer -listen PORT

(Using UltraVNC on Windows.)

####  Server - Initiating:

    x11vnc -connect IP:PORT

