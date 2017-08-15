Title: MotionInJoy Appcrash When Loading Driver
Date: 2011-01-18
Author: Seppe "Macuyiko" vanden Broucke

When trying to install the MotioninJoy driver using the GUI, the program crashes.

Manually running the driver installation works. To do this, open a `cmd` window with administrative privileges. Make sure you have followed the other MotioninJoy steps and the controller is plugged in.

cd to the "ds3" directory, located in your MotioninJoy install path, e.g.:

    C:\Users\Seppe>**cd "C:\Installed Files\MotioninJoy\ds3"**

    C:\Installed Files\MotioninJoy\ds3>

Then run the driver installation program like so:

    C:\Installed Files\MotioninJoy\ds3>**MijCmd.exe /i drivers\MijXinput.inf**

    INFO: Updateing driver,Please wait a moment...

A notepad file containing log output will open, it should look something like this:

    INFO:MotioninJoy Driver install log
    INFO: Driver install Enter
    INFO: argc0="MijCmd.exe"
    INFO: argc1="/i"
    INFO: argc2="drivers\mijxinput.inf"
    INFO: DriverPackageInfPath="C:\Installed Files\MotioninJoy\ds3\drivers\mijxinput.inf"
    INFO: >>>>>installing driver package.
    LOG Event: 1, ENTER:  DriverPackageInstallW
    LOG Event: 2, DRIVER&#95;PACKAGE&#95;LEGACY&#95;MODE flag set but not supported on Plug and Play driver on VISTA. Flag will be ignored.
    LOG Event: 1, Looking for Model Section [MotioninJoy.NTamd64.6.0]...
    LOG Event: 1, Installing INF file 'C:\Installed Files\MotioninJoy\ds3\drivers\mijxinput.inf' (Plug and Play).
    LOG Event: 1, Looking for Model Section [MotioninJoy.NTamd64.6.0]...
    LOG Event: 1, Installing devices with Id "USB\VID&#95;054C&PID&#95;0268&REV&#95;0100" using INF "C:\Windows\System32\DriverStore\FileRepository\mijxinput.inf&#95;amd64&#95;neutral&#95;452fabe792a00d17\mijxinput.inf".
    LOG Event: 1, ENTER UpdateDriverForPlugAndPlayDevices...
    LOG Event: 0, RETURN UpdateDriverForPlugAndPlayDevices.
    LOG Event: 1, Installation was successful.
    LOG Event: 1, Marked Phantom Device with Hardware/Compatible Id 'USB\VID&#95;054C&PID&#95;0268&REV&#95;0100' for reinstall on next plug-in.
    LOG Event: 0, Install completed
    LOG Event: 1, RETURN: DriverPackageInstallW  (0x0)
    SUCCESS: installed package C:\Installed Files\MotioninJoy\ds3\drivers\mijxinput.inf.

You can now use the MotioninJoy GUI again. The driver will be installed.

