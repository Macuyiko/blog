Title: Rooting Kindle Fire
Date: 2011-12-10
Author: Seppe "Macuyiko" vanden Broucke

The following overview is just a reminder, mainly aimed at myself in the future, on how to root the kindle fire.

**1\. Install Android SDK**

  - Download from http://developer.android.com/sdk/index.html
  - Update packages

**2\. In Kindle:Â "Allow Installation of Applications From Unknown Sources"**

**3\. Edit `android_winusb.inf` in `usb_driver` in Android install path**

  - Copy and paste right beneath [Google.NTx86] and [Google.NTamd64] line:

    ;Kindle Fire
    %SingleAdbInterface% = USB_Install, USB\VID_1949&PID_0006
    %CompositeAdbInterface% = USB_Install, USB\VID_1949&PID_0006&MI_01

**4\. Edit `adb_usb.ini` in `.android`**

  - Add 0x1949

**5\. Update USB driver**

  - "Update Driver Software" in Device Manager withÂ `android_winusb.inf`

**6\. (Optional) test USB**

  - In `platform-tools`, issue `adb kill-server` and `adb devices`

**7\. SuperOneClick root**

  - Download from ftp://shortfuse.org/SuperOneClick/Packages/SuperOneClickv2.2-ShortFuse.zip

**8\. Get `Root Explorer v2.17.1.apk` and `Vending.3.3.12.apk`, together with Google Services Framework apk**

**9\. Finalisation**

  - Install Google Service Framework apk and Root Explorer apk
  - "Move" Vending apk to `/system/app` with Root Explorer
  - Mount as RW and set Vending apk filepermissions to `rw-r-r-`
  - Install Vending apk and reboot

