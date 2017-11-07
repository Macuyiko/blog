Title: Solving Color Problem (Red Grass, Purple Water) In Age Of Empires 2: Age Of Kings (The Conquerors And Others Too) On Vista And Windows 7
Date: 2009-07-29
Author: Seppe "Macuyiko" vanden Broucke

**Legacy note**: this program was pretty popular around 2010-2012, but now has fallen out of use, since most games have been patched to prevent this issue. The source code and last binary release have been moved to [GitHub](https://github.com/Macuyiko/palettestealer-suspender), as Google was thinking it was malware and flagging my blog.

###  Changelog

  - Update (07-Nov-2017): Final update: source code and binary moved to [GitHub](https://github.com/Macuyiko/palettestealer-suspender).
  - Update (30-Jul-2011): A new update for the Palettestealersuspender program is up. This release brings some significant UI changes. The tool now loads and saves settings and hides to the notification area so it can run and monitor games in the background. I've restructured the accompanying blog post to move program instructions to a separate page.
  - Update (24-Apr-2011): A new update for my PaletteStealerSuspender program is up. This release fixes some bugs, and adds the ability to use the program in "batch/console"-mode. The readme contains usage details. The download link below leads you to the latest version.
  - Update (08-Sep-2010): I've added explanation for the new registry method. Also added a link to [Jari Komppa's Ddraw implementation](http://sol.gfxile.net/ddhack/).
  - Update (18-Apr-2010): A new version of the program is up again. This version includes the ability to wait for a game until it is started instead of starting the game itself. This is useful when using launchers or lobby programs like Garena which start the game for you.
  - Update (27-Mar-2010): I've added a new version of the program which fixes the "CD not found"-issue when using patch 1.0c for The Conquerors. Turns out the working directory for the executable should be set to "C:\Install Path\Age Of Empires 2" and not C:\Install Path\Age Of Empires 2\age2_x1".
  - Update (7-Feb-2010): I've added a new version of the program to fix a minor error which caused an exception to appear when starting the game in some rare cases. Download link still below.

###  Introduction

Recently I wanted to play an old favourite of mine: Age Of Kings: The Conquerors. The game had been running fine all the way from Windows 98 (and NT 4 as well, which was a pain to play games on at the time, but I digress) until Windows Vista. However, with Windows 7 - which I've been running happily for some time now - I stumbled on a roadblock: the colours were all wrong.

This is not an uncommon problem. Many people have had problems when running the game on Vista or Windows 7, this is how you could describe it:

  - Basically, the colors are all off.
  - It's Age Of Empires: Mars Edition.
  - Grass turns red, or green, after playing a few seconds...
  - ...or the water turns purple.
  - Some trees turn red as well.

And this is what it looks like:

![](http://4.bp.blogspot.com/_X4W-h82Vgjw/Sm9qKTG5QxI/AAAAAAAAPNE/dMiZGWxevro/s400/is.jpg)

The thumbnail doesn't really bring it out, look at this ("zoom, enhance"):

![](http://2.bp.blogspot.com/_X4W-h82Vgjw/Sm9qnQGXgkI/AAAAAAAAPNU/K7r-u6wXlTs/s400/zoom.png)

The tree has an ugly red border around it and the grass turns too green (your experience might be worse).

Age Of Kings isn't the only game with this problem. Basically a lot of old [Directdraw](http://en.wikipedia.org/wiki/DirectDraw) games suffer from this problem, like the first Age Of Empires, Worms Armageddon, and even Starcraft:

![](http://4.bp.blogspot.com/_X4W-h82Vgjw/Sm9tLcw1ckI/AAAAAAAAPNc/aBkiIRA3VxE/s400/starcraft+2009-07-28+22-58-25-57.png)

It's not too bad here though, most of the terrain looks okay.

###  Solutions and methods

There are a few different solutions floating around. Let's list the most common ones. I've also listed how well they work next to each number, so you can quickly scan the list. Newest and best performing methods come last.

####  Unreliable and/or hard methods

Most methods below are unreliable, or do not work with everyone. Most of them are pretty annoying and/or hard to execute as well. If you want better solutions, just skip this part...

**(1 - unreliable)** Alt-tab out of the game, and then maximize it again. This worked in XP (and in Vista for some users), and works in some cases in Windows 7. I had no luck with this anymore though. The colors would work for a few seconds, but then changed again.

**(2 - unreliable)** Change your in-game resolution. Doesn't work in Windows 7 anymore either. After switching resolutions, the colors even became worse. This might work in Vista, but this solution is not really preferred (you want to play on the best resolution possible).

**(3 - unreliable)** Before starting the game, open a explorer window. My Computer, a random folder, anything works. Surprisingly, this often worked in Vista with most Directdraw games. In Windows 7, not anymore.

**(4 - unreliable)** Mess around with the compatibility options, especially `Run in 256 colors`, `Disable visual themes`, `Disable desktop composition`, `Display display scaling on high DPI settings` and `Run as administrator`. This works for some games/users, but I don't really like this method as it has a lot of drawbacks (desktop windows/icons messed up when you exit etc...).

**(5 - mostly reliable but annoying)** Close `explorer.exe` using the Task Manager. This works on both Vista and 7, for most games, but if you're like me, you don't like to close your 5+ open explorer windows. Besides, there's a better solution...

This method has been added to the program (see below). Another way is to create a batch script, if you don't want to use the program:

    REM kill explorer.exe
    taskkill /f /IM explorer.exe
    REM start the game and wait to finish
    REM note: /D indicates the starting directory, often the same as your
    game's exe
    start /WAIT /D "C:\path\to\game.exe" "C:\path\to\game.exe"
    REM start explorer.exe again
    start explorer.exe

Or, another method:

    taskkill /f /IM explorer.exe
    "C:\path\to\game.exe"
    REM if the game finishes press enter to restart explorer
    pause
    start explorer.exe

**(6 - mostly reliable but annoying)** Download a mod or tool for Age Of Kings: The Conquerors to play it in windowed mode. You can get it [here](http://veg.slutsk.net/aoe/aoe_tc_vegmod.zip). Unzip the archive into your installation folder, and run `AoC.eXe`. If you want, you can also mess around in the `config.xml` file to change some options. This is how it looks:

![](http://4.bp.blogspot.com/_X4W-h82Vgjw/Sm9w5YpNrVI/AAAAAAAAPNk/iPHE3kGmxh0/s400/aoe-windowed.jpg)

On my large monitor, I actually enjoy playing this way.

There are other mods out there for other games which allow to run them in windowed mode. For Age Of Empires: Rise Of Rome, you can get [this mod](http://veg.slutsk.net/aoe/aoe_ror_vegmod.zip). Or you can get [DxWnd](http://www.nynaeve.net/?p=52) which forces Directdraw (DirectX >=7) games to run in a window. I had no luck with it for The Conquerors however. For Starcraft, there are also some tools floating around to fix the resolution/window/colors. For Worms: Armageddon, CyberShadow is working on a fix for the game (see [here](http://forum.team17.com/showthread.php?t=38762)), so you might want to keep an eye out for that.

**(7 - mostly reliable but annoying)** This is the newly found strange "Screen Resolution"-method. Found on [ this](http://www.sevenforums.com/gaming/2981-starcraft-fix-holy-cow.html) forum recently. This is a weird workaround but seems to work on every game I've tried. Follow these steps exactly: right click on your desktop and pick `Screen Resolution`. You're not done yet (!), in the Screen Resolution window, click `Advanced settings`. Another window will open - click the `Monitor`-tab in that window. You should now be looking at something like this:

![](http://2.bp.blogspot.com/_X4W-h82Vgjw/Sr9vNe13FsI/AAAAAAAAPPQ/UI7ohu9IvmM/s400/screenmethod.png)

Now, leave these windows open, and start the game. The colors should work. Unbelievably weird (I had to pick the Monitor tab for it to work), but it works. If it works for you too, you may stop reading here :).

####  Newer and/or reliable methods

You'll find the easier, newer and more reliable methods in this section.

**(8 - reliable)** [Download a tool](https://github.com/Macuyiko/palettestealer-suspender/releases/tag/final-release) I whipped up to play Directdraw games in fullscreen without them changing colors. This tool will act as a launcher which places itself in your notification area and automatically suspends all applications which are changing the game's colors and will bring them back alive when you close the game

**(9 - reliable)** Thanks to this a reader comment, I found out that Windows 7 actually provides a compatibility hack build in to allow running old DirectDraw games in all their glorious colors. The `HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\DirectDraw\Compatibility\` registry entry (or `HKEY_LOCAL_MACHINE\SOFTWARE\Wow6432Node\Microsoft\DirectDraw\Compatibility\` for 64bit Windows) contains entries for some popular games, such as Age Of Empires and Starcraft.

Then why are those games not working right? It turns out that the ID used in the registry entries are very specific to the game version. You can follow along with [this blogpost](http://go.hopx.net/2010/05/256-color-issues-with-directdraw-and.html) to find out all about this hack.

If you don't want to download `procmon` to figure out the application ID yourself then you can download a tool by Mudlord called "w7ddpatcher.zip" (you'll have to Google around). The source code is included, and looks clean. To use it, open the `w7ddpatcher.exe` executable, and press `Patch` to add a DirectDraw application to the registry. After patching, the game should always work with correct colors, and you won't have to use the program every time you want to play the game (unless you change the executable e.g., by updating the game).

**(!):** note that this tool might not work with Windows Vista or XP, I've only tested it with Windows 7 myself. If you're using XP, you're probably better off using my tool (see #8 above), since it probably doesn't come with those registry entries. Also, the tool won't work out of the box for Age Of Empires 2 (and other SafeDisc using games), as that game needs an entry for `age2_x1.icd` instead for `age2_x1.exe`, as stated on [this forum thread](http://www.sevenforums.com/gaming/100379-how-i-fixed-corrupt-color-palette-some-old-games-windows-7-a-2.html). Take a look at `HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\DirectDraw\MostRecentApplication` to find out the correct application ID and edit the registry entry manually accordingly.

**(10 - reliable for certain games)** A few days ago, [this writeup](http://sol.gfxile.net/ddhack/) from Jari Komppa got my attention. This coding wizzard has programmed a custom ddraw.dll which wraps all DirectDraw calls and redirects them to an OpenGL surface. Tip of the hat to this guy. Download the DirectDraw Hack DLL binary from [his site](http://sol.gfxile.net/ddhack/) and put it in the same directory as the game executable you're trying to run. It should work for Wing Commander, StarCraft 1, WarCraft 2, Fallout and Fallout 2.

**(!):** the DLL alas, does currently (as per last update to this blog post) not work for Age Of Empires 2. So I'm still shamelessly plugging my tool for that game (see #8 above).

###  Technical explanation

If you're interested in a little background on why this problem is happening, read on.

When I first encountered this problem, I already knew a little about [DirectX](http://en.wikipedia.org/wiki/DirectX), the [GDI](http://en.wikipedia.org/wiki/Graphics_Device_Interface) and the [Windows API](http://en.wikipedia.org/wiki/Windows_API). Basically, back in the day, DirectX (which handles a lot of the graphics and multimedia workload in games and other program) included a component called Directdraw, used for rendering 2D graphics.

PCs back then weren't really powerful. Everything had to be as fast as possible, even color handling. So something which Directdraw did for you was maintaining a palette of 256 colors. Like a painter, programmers could fill this palette with 256 colors they would use: ten greens for grass, 6 blues for water, and so on. Some of these 256 colors are static (but then again, not always) and cannot be changed. If you're interested in the deep and dirty details: [this page](http://www.compuphase.com/palette.htm) does a good job explaining it.

Now this is the thing: if you're a fullscreen game, you don't want other programs screwing up the system palette, changing your beautiful chosen colors to ugly greens and reds. And this is what's happening in Windows 7. If you read [System Palette and Static Colors](http://msdn.microsoft.com/en-us/library/dd145128\(VS.85\).aspx) on MSDN, it states that "However, because changing the static colors can have an immediate and dramatic effect on all windows on the display, an application should not call SetSystemPaletteUse, unless it has a maximized window and the input focus." Alas, this is not enforced by Windows, and thus `explorer.exe` (which comes from Microsoft mind you) and other programs will happily call `SetSystemPaletteUse` and mess the poor fullscreen DirectDraw game up.

I googled a bit around to see if I could find any clues. [ This message](http://stackoverflow.com/questions/1054365/exclusive-directdraw-palette-isnt-actually-exclusive) at Stackoverflow describes the same problem. This message is actually posted by the maintainers of Worms: Armageddon. No-one provided an answer though. I opened up Visual Studio (which was still installed) to quickly throw something together in VB.NET to intercept the `WM_SYSCOLORCHANGE`, `WM_PALETTECHANGED`, `WM_PALETTEISCHANGING` and `WM_QUERYNEWPALETTE` messages and look at where they're coming from. Basically, three processes are fighting:

	CHANGING from (0)
	CHANGED from Age of Empires II Expansion (135458)
	Device context: 16847861
	Process: 4508: age2_x1
	Got 256 palette size scr
	[...]
	CHANGED from GDI+ Window (917744)
	Device context: 184626156
	Process: 2452: explorer
	Got 256 palette size scr
	CHANGED from (65552)
	Device context: 1744905863
	Process: 540: csrss
	Got 256 palette size scr
	[...]

The game itself, `explorer.exe`, and `csrss.exe`.

I then wanted to make a program which would change the palette back every time an outside process tried to change it. A had a whole list of functions loaded and code written, but it just didn't work out and turned out to be too difficult. Also, I was beginning to suspect that this method could work, but would still result in flickering while changing palettes. I was browsing around at the Worms Armageddon [forums](http://forum.team17.com/showthread.php?t=38762), and found out that somebody wrote a DLL with source code for this problem. The code was written in Delphi and easy enough to read: grab a process, find every thread, and send the suspend message to every thread. I converted this code to VB.NET and slapped it on a form which would grab every `WM_PALETTECHANGED` message to update its list of processes.

Note that there is actually also a lesser known way to suspend a process with one API call, without iterating all the threads, which is used in the PsSuspend- and Process Explorer tools made by SysInternals:

	Public Shared Function NtSuspendProcess(ByVal ProcessHandle As IntPtr) As Integer
	End Function

	Public Shared Function NtResumeProcess(ByVal ProcessHandle As IntPtr) As Integer
	End Function


