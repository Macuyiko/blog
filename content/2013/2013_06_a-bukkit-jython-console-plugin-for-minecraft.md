Title: A Bukkit Jython Console Plugin for Minecraft
Author: Seppe "Macuyiko" vanden Broucke
Date: 2013-06-29
Subtitle: A Python interpreter for a Bukkit Minecraft server
Image: minecraft.jpg

### Summary and Changes

This post describes how you can create a Python interpreter for a Bukkit Minecraft server, providing access to the full internal API. Commands are issued on a separate console window and do not require players or server administrators to be running the game itself.

Following list provides an overview of changes:

* 2013-06-29: Initial version.
* 2013-07-16: Some spelling fixes. Added feature which creates server listening for incoming connection instead of spawning a GUI based console. This allows users on servers to play with the plugin as well.
* 2013-07-18: Expanded server listening feature to allow for multi-user logins. Article updated accordingly.

### Introduction

Unless you've been living under a rock, you probably know about [Minecraft](https://minecraft.net/), the famous open block based 3D building/crafting/exploration/survival game.

> Minecraft is a game about breaking and placing blocks. At first, people built structures to protect against nocturnal monsters, but as the game grew players worked together to create wonderful, imaginative things.
>
> It can also be about adventuring with friends or watching the sun rise over a blocky ocean. It's pretty. Brave players battle terrible things in The Nether, which is more scary than pretty. You can also visit a land of mushrooms if it sounds more like your cup of tea.

Minecraft has been wildly successful. Not only because of the LEGO-like main gameplay, but also thanks to the developers' friendly stance towards modding, causing an incredible amount of modifications being released, ranging from [additional creatures to custom biomes](http://www.pcgamesn.com/minecraft/twenty-best-minecraft-mods).

[Lots](http://kotaku.com/5981660/a-short-but-wonderful-documentary-about-why-kids-play-minecraft) of people have also emphasized the fact that Minecraft is a great way for parents to bond with their children. Also in the [classroom](http://www.studentadvisor.com/pages/5-ways-minecraft-can-help-improve-your-sat-score), Minecraft has been used as a teaching aid to inspire children.

Combine the two aspects above (modding and teaching), and you ultimately start wondering whether Minecraft could also be used to teach programming. When the Raspberry Pi put online [their announcement](http://www.raspberrypi.org/archives/2565) that a special Minecraft version would be available for their miniature, cheap computer, the answer to this question indeed seems to be: yes, since their "Minecraft: Pi Edition" would come with a programming Python  API built in, as shown by the following screen shot.

![Minecraft running on the Raspberry Pi](http://i.imgur.com/ieZYEn2.jpg)

Back on the PC-side, the great interest in modding Minecraft eventually led to the [Bukkit](http://bukkit.org/) project -- a community-created Minecraft server with a comprehensive API to allow others to create plugins, extending the world, gameplay and rules of the vanilla Minecraft experience. Minecraft server administrators also enjoy having some sort of console available to be able to modify a Minecraft world at runtime. Banning players, erecting or destroying structures or changing the time of day without having to restart indeed comes in handy when you're running a server. The Bukkit development API makes it very easy to create such kinds of plugins, but they often require the list of possible commands to be specified beforehand (in the Java plugin), which are then made available through the game's chat window. For instance, issuing the command:

	/weather sunny

Would mean that you have a plugin running which is able to handle the command `/weather` and converts this to appropriate Bukkit API calls, e.g. [`setThundering`](http://jd.bukkit.org/rb/apidocs/org/bukkit/World.html#setThundering(boolean)).

Other than that, lots of people have started to learn Java or other languages by trying to create a Bukkit plugin or some sort of Minecraft-inspired clone. Following list provides just a tad of what is out there:

 * [Learning Java: Bukkit Style](http://www.planetminecraft.com/blog/learning-java-bukkit-style---part-1-or-how-to-program-a-minecraft-plugin/)
 * [Introducing Kids to Java Programming Using Minecraft
](https://blogs.oracle.com/arungupta/entry/introducing_kids_to_java_programming) -- on Oracle's blog
 * [MineAssemble](https://github.com/Overv/MineAssemble) -- not for Bukkit, but a bootable Minecraft clone written partly in x86 assembly, impressive
 * https://github.com/fogleman/Minecraft -- also not for Bukkit, but a clone in Python and Pyglet
 * [Learning Physics with Minecraft](http://www.wired.com/wiredscience/2012/02/minecraft-physics/) -- not programming, but learning physics with Minecraft
 * [Minecraft in Mathematica](http://mathematica.stackexchange.com/questions/19669/mathematica-minecraft) -- ...and even Mathematica clones

This is all nice, but a bit too high-level for what I wanted to build. I wanted to have direct access to the Bukkit API, similar to how the Minecraft: Pi Edition provides direct access to its API.

We're thus going to create a Bukkit plugin which gives server administrators or programming students direct access to the full Bukkit API. The actual plugin is actually very simple, thanks to the magic of Jython, a Python implementation in Java which allows for Python<->Java crosstalk and saves us from having to implement any command in the plugin itself. Commands are issued on a separate console window and do not require players or server administrators to be running the game itself.

### Related Work

The basic idea behind what we're going to do is certainly not new by any means. The [Minecraft: Pi Edition](http://www.raspberrypi.org/archives/2565), as mentioned above, implements a similar idea ([see also this article](http://www.stuffaboutcode.com/2013/06/programming-minecraft-with-bukkit.html)). The Mag Pi magazine even [featured a nice tutorial](http://www.stuffaboutcode.com/2013/04/minecraft-pi-edition-api-tutorial.html) to show off what you can do with it.

Other than that, there's [ScriptCraft](http://scriptcraftjs.org/), providing a Javascript based programming interface for Minecraft:

> ScriptCraft is a Minecraft Mod that lets you extend Minecraft using the Javascript Programming Language. ScriptCraft makes modding Minecraft easier. It includes a logo-like "Drone" object that can be used to build complex buildings, roads, villages, even entire cities. It also includes many other features that make modding Minecraft easier.

You can find more information about ScriptCraft [here](http://walterhiggins.net/blog/YoungPersonProgrammingMinecraft) and [here](http://walterhiggins.net/blog/ScriptCraft). It's certainly a great project to teach programming, but comes with the drawback that it offers programmers its own API (implemented in a Bukkit plugin), meaning that you'll have to program using Bukkit chat commands, for instance:

	/js box("5").up(3).left(4).box("1").turn(3).fwd(5).right().box("1").move("start")

ScriptCraft also includes a "Drone" class which simplifies movement and building in Minecraft, similar to the "turtle" in the LOGO programming language (LOGO is a Lisp-like programming language which used to be popular to teach kids programming; fun fact: the first "real" programming language I learnt actually was a LOGO derivative).

This is all nice, but still too high-level. I want to be able to get direct access to all Bukkit's API functions (not only exposed ones through a plugin), preferably not having to use the game's chat.

[ComputerCraft](http://www.rockpapershotgun.com/2013/01/07/coding-in-minecraft/#more-137060) also inspires people to learn coding, but is even more high level. It actually provides a "console block" in the game offering a rudimentary shell which has nothing to do with the inner workings of either Bukkit or Minecraft.

Finally, plugins such as [PyDevTool](http://dev.bukkit.org/bukkit-plugins/pydevtools/) and [RedstoneTorch](http://dev.bukkit.org/bukkit-plugins/redstonetorch/) come closer to what we want to achieve. For instance, PyDevTools allows to:

> Execute arbitrary python code from console or ingame
> Execute saved python scripts
> Interactive interpreter mode

This is almost exactly what I wanted to build, but still requires to log into the game to execute `/py <statement>` commands. Yes, these can also be entered in the Bukkit console (offering some kind of interactive shell), but I wanted to remove the `/py` clutter. A simple trick indeed will allow us to do so, let's get right to it...

### Making the Plugin

We'll be using Eclipse to make our Bukkit plugin. I'll assume you know how this IDE works already. If you're not familiar with Java and just want to try the plugin, you can skip this section. Otherwise, follow along.

First of all, we're going to create a new Java project in Eclipse. I'll call this `BukkitConsole`. We create a `plugin.yml` file in the project root with some basic information:

[![](http://2.bp.blogspot.com/-i5hB1gwGemM/UdBQCbfc4mI/AAAAAAAAXgw/ZEHixo85VDE/s320/03.gif)](http://2.bp.blogspot.com/-i5hB1gwGemM/UdBQCbfc4mI/AAAAAAAAXgw/ZEHixo85VDE/s566/03.gif)

Next up, we create a `lib` folder in which we're going to place two libraries:

* `jython-standalone-*.jar`: to be downloaded from the [Jython](http://www.jython.org/downloads.html) web site
* `bukkit-*.jar`: the Bukkit development API, which can be downloaded from [here](http://dl.bukkit.org/latest-dev/bukkit.jar) (more information on [their Wiki](http://wiki.bukkit.org/Plugin_Tutorial)). I'm using the 1.5.2 branch.

Add these libraries to the build path. You'll now have the following structure:

[![](http://1.bp.blogspot.com/-XB56VYI6GOQ/UdBQCu1IYfI/AAAAAAAAXhc/JoQm1mL0C90/s320/04.gif)](http://1.bp.blogspot.com/-XB56VYI6GOQ/UdBQCu1IYfI/AAAAAAAAXhc/JoQm1mL0C90/s280/04.gif)

Next, we'll create the plugin classes themselves. Create a package under `src` called `com.macuyiko.bukkitconsole`. We're going to add two classes.

`MainPlugin.java`, this class just loads the libraries from the `lib` folder and spawns a `PythonConsole` window:

	package com.macuyiko.bukkitconsole;

	import java.io.File;
	import org.bukkit.plugin.java.JavaPlugin;
	import org.bukkit.plugin.java.PluginClassLoader;

	public class MainPlugin extends JavaPlugin {
		public void onEnable(){
			getLogger().info("BukkitConsole: Loading libs");
			try {
				File dependencyDirectory = new File("lib/");
				File[] files = dependencyDirectory.listFiles();
				getLogger().info("BukkitConsole: JARs found: "+files.length);
				for (int i = 0; i < files.length; i++) {
				    if (files[i].getName().endsWith(".jar")) {
				    	getLogger().info("BukkitConsole:  - "+files[i].getName());
						((PluginClassLoader) this.getClassLoader()).addURL(
							new File("lib/"+files[i].getName()).toURI().toURL());
				    }
				}
			} catch (Exception e) {
				e.printStackTrace();
			}

			getLogger().info("BukkitConsole: Starting Jython console");
			new PythonConsole();
		}

		public void onDisable(){
			getLogger().info("BukkitConsole: Plugin was disabled");
		}
	}

`PythonConsole.java`, this class employs Jython to execute `start.py` in the `python` directory:

	package com.macuyiko.bukkitconsole;

	import org.python.core.Py;
	import org.python.core.PyString;
	import org.python.core.PySystemState;
	import org.python.util.PythonInterpreter;

	public class PythonConsole {
		public PythonConsole() {
			PySystemState.initialize();

			PythonInterpreter interp = new PythonInterpreter(null,
					new PySystemState());

			PySystemState sys = Py.getSystemState();
			sys.path.append(new PyString("."));
			sys.path.append(new PyString("python/"));

			String scriptname = "python/start.py";
			interp.execfile(scriptname);
		}
	}

Things'll now look as follows:

[![](http://1.bp.blogspot.com/-vT2ZBTYSk0Y/UdBQC2ZRQ1I/AAAAAAAAXg4/R-bQgiHScvk/s320/05.gif)](http://1.bp.blogspot.com/-vT2ZBTYSk0Y/UdBQC2ZRQ1I/AAAAAAAAXg4/R-bQgiHScvk/s1064/05.gif)

That's it for the Java side! Export your project to `bukkitconsole.jar`.

We're now going to setup the server. Create a folder `server` somewhere. Next, download `craftbukkit-*.jar` from [here](http://dl.bukkit.org/latest-rb/craftbukkit.jar) (Bukkit is the development API, "CraftBukkit" is the actual server; again, more info on the [Wiki](http://wiki.bukkit.org/Setting_up_a_server)) and put it in this folder.

We're also going to create a simple `run.bat` in this folder:

	java -Xmx1024M -jar craftbukkit-*.jar -o true
	PAUSE

Execute `run.bat` to see whether CraftBukkit works fine and if you can connect with your Minecraft client (note: if you're running the current snapshot, the launcher should allow you to create a profile with version 1.5.2, which is what we're using here). Normally, you should get something like:

[![](http://4.bp.blogspot.com/-TNlVvsT2NW0/UdBQC7ZZiNI/AAAAAAAAXhE/Vn9H0l9E1wI/s400/07.gif)](http://4.bp.blogspot.com/-TNlVvsT2NW0/UdBQC7ZZiNI/AAAAAAAAXhE/Vn9H0l9E1wI/s988/07.gif)

Enter `stop` to stop the server. CraftBukkit will have created some new folders in your `server` directory:

[![](http://4.bp.blogspot.com/-MNFmUy2ojro/UdBQMLKeBQI/AAAAAAAAXhw/svw9WscYSDo/s598/08.gif)](http://4.bp.blogspot.com/-MNFmUy2ojro/UdBQMLKeBQI/AAAAAAAAXhw/svw9WscYSDo/s400/08.gif)

Next, we're going to download a Jython console. I picked [this one by Don Coleman](http://don.freeshell.org/jython/), since it is simple and offers fairly robust code completion. Note that I had to make some changes to it which can be found on the [GitHub repository](https://github.com/Macuyiko/minecraft-bukkit-console) I've created for this project. Not using these changes is okay but will lead to some error spam on the Bukkit console.

Create a folder called `python` in `server` and extract the Jython console. `python` should contain:

 * `console.py`
 * `history.py`
 * `introspect.py`
 * `jintrospect.py`
 * `popup.py`
 * `tip.py`

We'll also create a file `start.py` in this location with the following content:

	import console
	console.main()

We also need to create a `lib` folder in `server` and put in the following JARs:

 * `bukkit-*.jar`
 * `jython-standalone-*.jar`

Yes... the same ones we've included in our Eclipse project. It would have been possible to package these into the JAR, but loading in resources from JAR files is a bit of a pain which I didn't want to go through. Feel free to add `lib` and `python` to the JAR and submit a pull request on GitHub if you get things working.

That's it. Try executing `run.bat` again. If all goes right, Bukkit should be able to load in our console plugin and will present you with an interpreter:

[![](http://2.bp.blogspot.com/-l78RCAZbo74/UdBQEKYM78I/AAAAAAAAXhU/m5a1z_klzr0/s400/10.gif)](http://2.bp.blogspot.com/-l78RCAZbo74/UdBQEKYM78I/AAAAAAAAXhU/m5a1z_klzr0/s987/10.gif)

We can try out some commands. Note that you'll have to `from org.bukkit.Bukkit import *` to get access to the Bukkit API (or `from org.bukkit import Bukkit` -- you'll have to use `Bukkit.*` but will allow autocompletion)!

	>>> from org.bukkit.Bukkit import *
	>>> getWorlds()
	[CraftWorld{name=world}, CraftWorld{name=world_nether}, CraftWorld{name=world_the_end}]
	>>> w = getWorld("world")
	>>> w.getTemperature(0,0)
	0.800000011920929
	>>> w.getBiome(0,0)
	PLAINS
	>>> w.getTime()
	12557L
	>>> w.getPlayers()
	[]
	>>>

The [Bukkit API docs](http://jd.bukkit.org/rb/apidocs/) provide a full overview of all that is possible with the complete API. Broadcasting messages, changing inventories, changing worlds, spawning lightning, all is possible.

You can also save functions in Python scripts if you want to. For example, try creating a `scripts.py` in the `server` folder:

	import random
	import time
	from org.bukkit.Bukkit import *

	def punishPlayer(name, power):
		p = getPlayer(name)
		p.getWorld().strikeLightning(p.getLocation())
		p.getWorld().createExplosion(p.getLocation(), power)
		broadcastMessage("Player %s has been punished!" % (name))

Now, in the console, we can:

	>>> import scripts
	>>> scripts.punishPlayer("Macuyiko", 6)

Which will explode a player with a lightning strike to warn other outlaws. The server administrator's "command center" now looks like this:

[![](http://3.bp.blogspot.com/-GXdBI19OpZ0/UdBQFHSyxSI/AAAAAAAAXho/ou6ZpIs9xCw/s640/11.gif)](http://3.bp.blogspot.com/-GXdBI19OpZ0/UdBQFHSyxSI/AAAAAAAAXho/ou6ZpIs9xCw/s1600/11.gif)

### Adding a Remote Interpreter Server

We've now created a Bukkit plugin spawning a Jython interactive console which is able to use the full Bukkit API. This is a nice starting point to create administrative support scripts, in-game games, or course material for a Minecraft Python programming course.

**(Added 2013-07-16)** There is still "one more thing", however, which prevents our plugin from being useful for "real" server administrators: the fact that it relies on GUI capabilities being present. It would be nice if we would be able the just spawn an interpreter on the console. Doing so, however, is not particularly trivial. One might be tempted to just start a `code.interact()` loop to do so, but this method comes with several drawbacks:

* The input/output of the interpreter would clash with that of Bukkit itself.
* Only the server user would be able to execute commands. It would be nice if we could allow for multi-user interaction (e.g. for students).
* Running code.interact() puts Jython in a wait forever loop, which actually causes Bukkit to postpone its further loading. We can put this in a separate thread, but it still remains a messy solution.

**(Added 2013-07-18)** Next, I opted to create a socket based listening server which listens for incoming connections and presents a "remote interpreter" to the user. This is great, since it also allows non-local access. Still the implementation (created as a Python script loaded by the plugin) was a bit hacky and contained some drawbacks:

* Use of blocking reads/writes can cause the server to lockup in some cases. Yes, this could be fixed, but would require expanding the code significantly.
* Only one concurrent user can be "logged in". This is caused by (i) the absence of multi-threaded connection handling and (ii) the `stdout` redirection we're doing to redirect output coming from the Python interpreter back to the client socket, based on a similar implementation found in [RipShell](http://johnnydebris.net/projects/ripshell/) by Guido Wesdorp.
* Still a wait-forever loop which causes Bukkit to halt loading. Note that te GUI version manages to avoid this (the console stays open while Bukkit continues loading), due to the fact that the GUI gets put into its own thread. Adding a daemonized thread to the "console server" mode fixed this issue and at least allowed the proof of concept to work.

The *real* solution consists of editing the plugin code itself and once again haressing the power of Jython...

As such, we create two new Java classes. `SocketServer.java` handles the incoming client connections and creates a `ConnectionThread.java` thread per client. For each client, a new `InteractiveInterpreter` is spawned:

	// ...

	public class ConnectionThread implements Runnable {
		//...

		public ConnectionThread(Socket socket, SocketServer socketServer) {
			this.socket = socket;
			this.server = socketServer;
			this.interpreter = new InteractiveInterpreter();
			try {
				this.in = new BufferedReader(new InputStreamReader(socket.getInputStream(), "UTF-8"));
				this.out = new PrintStream(this.socket.getOutputStream());
			} catch (Exception e) {
				e.printStackTrace();
			}
			this.interpreter.setOut(this.out);
			this.interpreter.setErr(this.out);
		}

		public void run() {
			try {

				//...

				out.print(">>> ");
				while ((line = in.readLine()) != null && !line.equals("exit!")) {
					boolean result = interpreter.runsource(line);
	 				if (result)		out.print("... ");
					else			out.print(">>> ");
	 				if (line.equals("stop!")) {
	 					server.getListener().close();
	 					socket.close();
	 					return;
	 				}
				}

				out.println("Bye");
				socket.close();
			} // ...
		}
	}

Finally, `MainPlugin.java` is modified to read in config values from a `config.yml` file with following defaults:

	bukkitconsole:
	 guiconsole:
	  enabled: true
	 serverconsole:
	  enabled: true
	  password: swordfish
	  port: 44444
	  maxconnections: 10

Once done, the plugin is able to start both a GUI interpreter locally on the server, or bind a remote interpreter server to a chosen port, waiting for clients to connect. A session (using `telnet` might look as follows):

	~$ telnet localhost 44444
	Trying 127.0.0.1...
	Connected to localhost.
	Escape character is '^]'.

	Python Interpreter Server
	-------------------------
	PASSWORD: swordfish
	You're in
	>>> from org.bukkit import Bukkit
	>>> Bukkit.getWorlds()
	[CraftWorld{name=world}, CraftWorld{name=world_nether}, CraftWorld{name=world_the_end}]
	>>> Bukkit.getWorld("world").setTime(200)
	>>> Bukkit.getWorld("world").setTime(1400)
	>>> exit!
	Bye
	Connection closed by foreign host.

[![Screengrab showing remote interpreter functionality](http://i.imgur.com/XpR5Um7.png)](http://i.imgur.com/XpR5Um7.png)

Two special commands exist. `exit!` exits the session whereas `stop!` will completely stop the socket server (not allowing any new connections until Bukkit is restarted). Just as with the GUI interpreter, it makes sense to `from org.bukkit import Bukkit` before entering other commands for convenience' sake.

### Wrapping Up

The source code for this project can be found on the [following GitHub repo](https://github.com/Macuyiko/minecraft-bukkit-console). The repository also hosts everything you need to get running without having to code/compile anything. Feel free to modify both the Python and Java sources and submit pull requests with improvements. I'd also love to hear about any cool or interesting things you do with this.

Note that the default configuration for the repo project will spawn both a GUI interpreter and a listening server (at port 44444, password "swordfish"). If you want to change this, simply modify `config.yml` which will be created in `plugins/Bukkit Jython Console/` after starting the plugin for the first time.

Finally, if you're interested, the following video shows some more tinkering. (Protip: I'm a bit awkwardly using alt-tab and the inventory screen here. If you press `T` to start typing in chat, you can alt-tab out of the game without pausing or having the inventory screen opened, which allows you to better see what's going on.)

<div class="videowrapper"><iframe src="//www.youtube.com/embed/rI3PfgCSI7Y" frameborder="0" allowfullscreen></iframe></div>



