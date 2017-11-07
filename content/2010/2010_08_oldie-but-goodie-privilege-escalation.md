Title: Oldie But Goodie: Privilege Escalation In Windows
Date: 2010-08-17
Author: Seppe "Macuyiko" vanden Broucke

### Number One:

Replace `C:\Windows\system32\sethc.exe` with `cmd.exe` (e.g. by renaming and/or using a repair CD: with the Vista repair CD you can open "`notepad`" in the command prompt and execute file manipulations from the Open Dialog).

Restart. At the login screen press "Shift" five times (at this point, you can guess what `sethc.exe` originally did) and a command window with full system privileges will appear. Often used to replace forgotten administrator passwords:

    net user administrator *

Of course, booting some sort of [live CD](http://www.sysresccd.org/) or [tool](http://pogostick.net/~pnh/ntpasswd/) might be simpler.

### Number Two:

The btwdins.exe method. On systems with the right Bluetooth service executable, you can execute any executable located at `C:\Program.exe` with LocalSystem rights. More info [here](http://osix.net/modules/article/?id=679).

###  Number Three:

A.k.a. the famous "at"-method, there was a lot of talk about this back in the day (about a year ago). Basically, the concept went like this:

Open a command prompt as a normal user, type:

    at

If it responds with an "`Access denied.`" error, you are out of luck. If it responds with "`There are no entries in the list.`" then you're good.

Now execute:

    at 18:15 /interactive "cmd.exe"

And at a quarter past six a command prompt will appear, with SYSTEM privileges. Sounds sensible, right? Not really, since the only users able to schedule commands [are already local administrators](http://h0bbel.p0ggel.org/windows-xp-privilege-escalation-exploit-no-it-isnt).
