Title: A Quick Look at Java Decompilers
Author: Seppe "Macuyiko" vanden Broucke
Date: 2015-05-11 19:34

I've been looking at various Java decompilers recently for a project I've been working on in spare time.

Java code obfuscation is something I have an interest in for no particular reason, mostly because you see a variety of cool approaches popping up in the wild to prevent people from reverse engineering your proprietary JAR's (which are, by default, very easy to reverse engineer). Most approaches resort to obfuscation/packing (similar as to what is done with Javascript files), but there exist more thorough methods as well, e.g. implementing a custom classloader which will decrypt classes on the fly. [This article](http://www.excelsior-usa.com/articles/java-obfuscators.html) contains a good general overview.

Old and Lacking Entries
---------------------------

### JAD

Some time ago, everyone's decompiler of choice was jad. Currently, the project is dead (in addition, it wasn't open source), but still you see a lot of people referring to it.

### Java DeObfuscator

Also an older tool from [fileoffset.com](http://www.fileoffset.com/), but still works more or less. The interface is rather clunky to use for larger projects, but the tool is [open source](http://sourceforge.net/projects/jdo/):

![](/images/2015/javadecompilers/JavaDeObfuscator.png)

### JODE

[JODE](http://jode.sourceforge.net/) is a java package containing a decompiler and an optimizer for Java. This package is freely available under the GNU GPL. It hasn't been updated for quite some time.

### AndroChef

Proprietary tool to decompile Android programs and Java files, available [here](http://www.neshkov.com/ac_decompiler.html). Not worth the money given the alternatives, just as [DJ Decompiler](http://www.neshkov.com/dj.html).

### Candle

An open source decompiler by Brad Davis. I'm mentioning it for completeness, but is far away from being feature complete.

Modern Tools
------------

### JD-Gui

Probably one of the most widely used tools for Java decompilation, as it is easy to use and provides a graphical user interface which allows to quickly open up and inspect a class file or JAR. You can find it [over here](http://jd.benow.ca/).

Not open source, though, and borderline modern as it's not able to decompile Java 8 features.

Below is a screenshot of JD-Gui with a Minecraft class file open[1]:

![](/images/2015/javadecompilers/jdgui.png)

Note that the decompiler is being tricked by the obfuscation routine.

### FernFlower

Very new and promising analytical Java decompiler (becoming an integral part of IntelliJ 14). Supports Java up to version 6 (annotations, generics, enum types).

[Download from here](https://github.com/fesh0r/fernflower)

It's a command line tool:

	java -jar fernflower.jar .\jartodecompile.jar .\decompiled

But this one is able to show the Unicode parameters with their full name:

	public float a(zy ˜ƒ, afi ˜ƒ1) {

### CFR

[Free, but not open source](http://www.benf.org/other/cfr/). This one aims to decompile modern Java features, including Java 8 lambdas (pre and post Java beta 103 changes), Java 7 String switches etc., though is itself written in Java 6.

Also a command line tool:

	java -jar cfr_0_100.jar .\jartodecompile.jar --outputdir .\decompiled

This one does an even better job and is slightly faster:

	@Override
    public float a(zy zy, afi afi) {

### Procyon

[Open source](https://bitbucket.org/mstrobel/procyon/wiki/Java%20Decompiler), and also aims to deal with Java 8 features (lambdas, `::` operator). Needs Java 7 to run.

Run it as follows:

	 java -jar procyon-decompiler-0.5.28.jar -o .\decompiled .\jartodecompile.jar

Outputs:

	@Override
    public float a(final zy \u2603, final afi \u2603) {

This one is my favorite modern decompiler at the moment.

### Krakatau

[Krakatau](https://github.com/Storyyeller/Krakatau) is interesting because it has been written in Python. It currently contains three tools: a decompiler and disassembler for
Java class files and an assembler to create class files.

Does not yet support Java 8 features.

### Soot

Soot is a framework for analyzing and transforming Java and Android applications, originally developed by the Sable Research Group of McGill University. It's not very commonly used "just" as a decompiler, as it also defines an intermediate byte code language.

Running it requires some fiddling, i.e. this is a minimal command to get things to run:

	java -jar soot-trunk.jar -w -process-dir ./dir_with_class_files/ -pp -cp ./dir_with_libs/ -allow-phantom-refs -d ./decompiled/ -f d


### Konloch's Bytecode Viewer

> An Advanced Lightweight Java Bytecode Viewer, GUI Java Decompiler, GUI Bytecode Editor, GUI Smali, GUI Baksmali, GUI APK Editor, GUI Dex Editor, GUI APK Decompiler, GUI DEX Decompiler, GUI Procyon Java Decompiler, GUI Krakatau, GUI CFR Java Decompiler, GUI FernFlower Java Decompiler, GUI DEX2Jar, GUI Jar2DEX, GUI Jar-Jar, Hex Viewer, Code Searcher, Debugger and more.

Written completely in Java, and it's [open source](https://github.com/Konloch/bytecode-viewer).

It uses FernFlower, Procyon and CFR for decompilation, makes this an awesome visual tool using state-of-art decompilers:

![](/images/2015/javadecompilers/bviewer.png)

### Enigma

[A tool specifically geared for deobfuscation](http://www.cuchazinteractive.com/enigma/):

![](/images/2015/javadecompilers/screenshot.1.png)

Originally used to deobfuscate Minecraft versions. Uses Procyon internally.

[1]: It's fun to note that a lot of effort into decompilers and de-obfuscators for Java is the result of the modding scene around Minecraft, one of the most popular games implemented in Java.

