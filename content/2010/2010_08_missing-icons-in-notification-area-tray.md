Title: Missing Icons In Notification Area (Tray Bar)
Date: 2010-08-18
Author: Seppe "Macuyiko" vanden Broucke

A few days ago some of my programs stopped showing their icons in the Windows (7) notification area. A quick peek at the Task Manager revealed that they were, in fact, running.

Changing the notification settings and peeking around in the task bar configuration revealed nothing.

It turns out that Windows 7 stores its tray icons in a registry key. To reset the icons, do this:

1. Open regedit
2. Go to `HKEY_CURRENT_USER\Software\Classes\Local Settings\Software\Microsoft\Windows\CurrentVersion\TrayNotify`
3. You should see two values: `IconStreams` (stores program path and other info) and `PastIconsStream` (stores the icon data), delete them
4. Restart the `explorer.exe` process (or restart the computer)
5. The missing icons should return, if the volume meter or other standard Windows icons are gone, you can re-enable them in the normal Taskbar Properties dialog

That did the trick for me.

