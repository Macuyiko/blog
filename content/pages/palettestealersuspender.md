Title: PalettestealerSuspender
Author: Seppe "Macuyiko" vanden Broucke

A tool to prevent color problems in old Directdraw games PalettestealerSuspender is a launcher tool which allows you to play Directdraw games in fullscreen on Windows Vista and Windows 7 without color problems.

See [this post](|filename|/2009/2009_07_solving-color-problem-red-grass-purple.md) for a full description of the problem and solutions.

## Changelog

*   Update (15-Aug-2012): A new update for the PalettestealerSuspender program is up. This release tries to fix some common "black screen after game exit" and other problems people have reported. Updated version can be downloaded from normal link below.
*   Update (30-Jul-2011): A new update for the PalettestealerSuspender program is up. This release brings some significant UI changes. The tool now loads and saves settings and hides to the notification area so it can run and monitor games in the background. I've restructured theÂ accompanyingÂ blog post to move program instructions to a separate page (this one).
*   Update (24-Apr-2011): A new update for the PalettestealerSuspender program is up. This release fixes some bugs, and adds the ability to use the program in "batch/console"-mode. The readme contains usage details.
*   Update (08-Sep-2010): I've added explanation for the new registry method (see comment). Also added a link to Jari Komppa's Ddraw implementation.
*   Update (18-Apr-2010): A new version of the program is up. This version includes the ability to wait for a game until it is started instead of starting the game itself. This is useful when using launchers or lobby programs like Garena which start the game for you.
*   Update (27-Mar-2010): I've added a new version of the program which fixes the "CD not found"-issue when using patch 1.0c for The Conquerors. Turns out the working directory for the executable should be set to "C:\Install Path\Age Of Empires 2" and not C:\Install Path\Age Of Empires 2\age2_x1".
*   Update (7-Feb-2010): I've added a new version of the program to fix a minor error which caused an exception to appear when starting the game in some rare cases. Download link still below.

## Download

*   [Download zipped binary][1] (Requires .NET 3.0 or higher. **Last updated at 15-Aug-2012**.)
*   [Download zipped binary of old version][2] (For people preferring the old interface.)
*   [Download source][3] (VB.NET 2010 project)

Works with:

*   Worms Armageddon
*   Age Of Empires (and Rise Of Rome)
*   Age Of Empires 2: Age Of Kings (and The Conquerors)
*   Starcraft (and Broodwar)
*   Diablo 1 (and expansions)
*   Diable 2 (and expansions, note that Blizzard fixed the color issue in a recent patch)
*   Star Wars: Galactic Battlegrounds (fun fact: this game uses the same engine as the Age Of Empires series)
*   Fallout 1
*   Fallout 2
*   Others... (?)


## Usage (GUI)

### Startup

After opening the program automatically places itself in your notification area and loads your saved settings. Settings are saved in "save.xml"; you may delete this file and start the program again to start with a blank slate if you desire to do so. Only one instance of the program can run at once.

![](http://2.bp.blogspot.com/-VLzHv-X5Djc/TjQsXJneQdI/AAAAAAAASKU/cHYP61EQK9M/s1600/pss_jul11_01.png)

The program places itself in your Windows notification area after starting it.

### Right click menu Right clicking the notification area icon brings up a menu with the following options:

  
*   Games: this menu will subdivide itself into a list of games. When starting the program for the first time, no games will be present. For each game added, a (un)checkable entry will appear, together with an option to start a game manually.
*   Configure...: this menu item brings up the configuration screen, where you can add games and manage settings. Double clicking the icon has the same effect.
*   Quit: exits the program completely.

![](http://1.bp.blogspot.com/-JuRDOH6-_Vg/TjQsgcFDv0I/AAAAAAAASKY/bYoig7INtp0/s1600/pss_jul11_02.png)

Right-click menu after starting the program for the first time.

### The configuration screen
 
![](http://3.bp.blogspot.com/-id4e7jpkEp0/TjQsnAbQdwI/AAAAAAAASKc/rHJeTNJfZ8A/s1600/pss_jul11_03.png)

The "Games"-menu shows a list of added games. Entries can be checked from this menu to monitor them.

The configuration screen (brought up by choosing "Configuration..." in the right-click menu or double clicking the notification area icon) allows for the following:

![](http://1.bp.blogspot.com/-It-L2z-HOkQ/TjQoiyM0D1I/AAAAAAAASKM/XdjrkkNadJk/s1600/pss_jul11_04.png)

*   A list of games: you can add game executables here using the "Browse..." and "Add" buttons. Double clicking removes entries from the list. Checking an item denotes that you wish to monitor this particular game (remember that entries can also be checked from the right-click menu). Every change you make to this list will also be reflected in the right-click menu under "Games".
*   A list of palette stealing processes: which should require no tampering in most cases. Palette stealing processes are automatically detected and added to the list while the configuration screen is active. If the program isn't working correctly for you, you might want to leave the configuration screen open while running the game to let new entries appear in this list. By checking and unchecking items you can choose which processes you want to suspend. Note that it is impossible to check or uncheck some processes.
*   The method to suspend and resume palette stealing programs: in most cases, the recommended option should work well enough. Try the other options in case the program isn't working.
*   Buttons: "Save and Hide" saves your settings to "save.xml" and hides the program back to the notification area. "Quit" completely exits the program and has the same effect as picking "Quit" from the right-click menu.Starting and playing games
  
There are two ways to play your games. The first one is to "manually start" your games with the right-click menu. PalettestealerSuspender will automatically suspend all palette stealing programs and resume them when exiting the game.
  
![](http://1.bp.blogspot.com/-w5XkFBJJIz8/TjQqMacplPI/AAAAAAAASKQ/wQdoE7ESr1g/s1600/pss_jul11_05.png)

The other way is to let PalettestealerSuspender monitor your list of running processes to see if a game has been started. To allow PalettestealerSuspender to monitor a particular game, check its entry in the configuration screen or through the right-click menu itself. This option provides the most flexibility, as you can just configure a list of games you want to monitor in the configuration screen, make sure they are checked, and then just hide PalettestealerSuspender and forget all about it. It will automatically react when you start a game, while still allowing to "manually start" games from the right-click menu as well.

## Usage (Console)

As of April 2011, the program also contains a console mode, look in "readme.txt" for usage instructions.

## License and Disclaimer

This work is licensed under a Creative Commons Attribution-Share Alike 2.0 Belgium License as stated at http://creativecommons.org/licenses/by-sa/2.0/be/.

THIS SOFTWARE IS PROVIDED "AS IS" AND ANY EXPRESSED OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE REGENTS OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) 
HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

 [1]: http://static.macuyiko.com/files/palettestealersuspender/PalettestealerSuspender.zip
 [2]: http://static.macuyiko.com/files/palettestealersuspender/PalettestealerSuspender_old.zip
 [3]: http://static.macuyiko.com/files/palettestealersuspender/PalettestealerSuspender_src.zip
