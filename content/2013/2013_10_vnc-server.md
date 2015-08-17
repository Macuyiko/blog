Title: Note To Self: Setting Up VNC Desktop For Remote User
Author: Seppe "Macuyiko" vanden Broucke
Date: 2013-10-20 18:15

Another one of these things I always end up forgetting: setting up a Linux (in this case: Ubuntu) server so that users can login using a VNC client and get a (slim) desktop.

First thing you need to do is make sure you have a VNC server (`tightvncserver`), desktop apps and window manager installed. E.g.:

	apt-get -y install ubuntu-desktop tightvncserver xfce4 xfce4-goodies

Next, add a user (if you haven't already) for the remote user going to login:

	adduser remote_user
	passwd remote_user

Add to sudoers if required.

Next, set a VNC password. Best to set this to something else than normal password:

	su - remote_user
	vncpasswd

Next, create a `vncserver.sh` helper script to start to VNC server for a user:

	#!/bin/bash
	PATH="$PATH:/usr/bin/"
	export USER="$2"
	export PWD="/home/${USER}"
	DISPLAY="$3"
	DEPTH="16"
	GEOMETRY="1024x768"
	OPTIONS="-depth ${DEPTH} -geometry ${GEOMETRY} :${DISPLAY}"
	. /lib/lsb/init-functions

	case "$1" in
	start)
	log_action_begin_msg "Starting vncserver for user '${USER}' on localhost:${DISPLAY}"
	su ${USER} -c "/usr/bin/vncserver ${OPTIONS}"
	;;

	stop)
	log_action_begin_msg "Stoping vncserver for user '${USER}' on localhost:${DISPLAY}"
	su ${USER} -c "/usr/bin/vncserver -kill :${DISPLAY}"
	;;

	restart)
	$0 stop
	$0 start
	;;
	esac
	exit 0

And start with:

	./vncserver.sh start remote_user 1

The remote user is then able to login to port `5901`.

Edit `/home/remote_user/.vnc/xstartup` to your liking. I'm using LXDE:

	#!/bin/sh
	xrdb $HOME/.Xresources
	xsetroot -solid black
	lxterminal &
	/usr/bin/lxsession -s LXDE &

