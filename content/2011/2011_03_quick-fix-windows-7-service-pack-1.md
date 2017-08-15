Title: Quick Fix: Windows 7 Service Pack 1 Error 80073701
Date: 2011-03-27
Author: Seppe "Macuyiko" vanden Broucke

If your Windows 7 service pack upgrade is failing with error code 80073701, you might be able to fix it with the following steps. I've had to search around quite a bit before resolving this error, mainly because I saw the first and second solutions listed below pop up everywhere, but it was the third solution that actually fixed the problem for me in the end.

### Solution 1: reset Windows Update components (you've probably done this already)

Download the Fix It tool fromÂ [this Microsoft KB article](http://support.microsoft.com/kb/971058/en-us)Â and run it. Afterwards, restart your computer and try installing SP1 again.

### Solution 2: run the System Update Readiness Tool (you've probably done this, too)

The tool can be downloaded fromÂ [this Microsoft KB article](http://support.microsoft.com/kb/947821/en-us). Make sure to download the correct version. Note that the updates installed by this tool might take a _long_Â time to complete. It will appear as if the installation process is stuck. Don't worry, as the progress bar might go from zero to hundred per cent in an instant, just be patient. Afterwards, restart your computer and try installing SP1 again.

### Solution 3: check out the logs and run lpksetup (this might be new)

Still no dice? Then check the logs at `c:\Windows\Logs\CBS\CheckSUR.log` and/or `c:\Windows\Logs\CBS\CheckSUR.persist.log`. These will give you more detailed information about the error. For me, and for [this user](http://superuser.com/questions/249641/error-80073701-when-installing-windows-7-service-pack-1) at superuser.com, the culprit was a language pack.

However, contrary to the user mentioned above, I am not using a language other than the default English, and cannot recall ever installing one. I ignored the language pack problem (as re-installing a language pack was not an option for me) until I learned about the Language Pack Setup Tool. Just run `lpksetup.exe` from your Start Menu. A window will pop up asking you if you want to install or uninstall a language pack. Pick uninstall. Sure enough, a list of languages was presented: English (the in use, default and system language), and some other language (Portuguese or Spanish, I can't remember) with a yellow danger sign marking that it was in a broken state. Very strange indeed. After selecting the language for removal and pressing next, the situation was promptly resolved. Deinstalling the language took just a few seconds, probably because no language files were actually present on the disk.

Anyway, after this small operation, installing SP1 went smoothly.



