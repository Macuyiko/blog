Title: Gibbed's Mass Effect 3 Audio Extractor: "IO.Path.Combine path1 cannot be null"
Date: 2012-03-24
Author: Seppe "Macuyiko" vanden Broucke

I was trying to use Gibbed's Mass Effect 3 Audio Extractor recently, but it failed with:

> IO.Path.Combine path1 cannot be null

To fix this, use `regedit` to go to

  - `HKEY_LOCAL_MACHINE\SOFTWARE\Wow6432Node\BioWare\Mass Effect 3` (on 64 bit machines)
  - `HKEY_LOCAL_MACHINE\SOFTWARE\BioWare\Mass Effect 3` (on 32 bit machines)

Add a new registry entry (right click -> "New" -> "String Value"). Name it `Install Dir`. Set the value to your installation directory (the same value as the `Path` registry entry). Close `regedit`. Re-open Gibbed's Mass Effect 3 Audio Extractor.

