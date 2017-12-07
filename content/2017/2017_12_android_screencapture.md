Title: Note to Self: Fast Android Screen Capture
Author: Seppe "Macuyiko" vanden Broucke
Date: 2017-11-13 14:30

Getting a reliable, real-time screen of an Android device is more challenging than one might think, e.g. for the purpose of training a reinforcement learning agent.

[This post](https://blog.shvetsov.com/2013/02/grab-android-screenshot-to-computer-via.html) describes a basic approach:

	adb shell screencap -p

Sadly, adb mangles binary output and has a tendency to convert `\n` to `\r\n`, which we need to manually untangle. Newer versions of `adb` come with an `exec-out` command which removes this problem:

	adb exec-out screencap -p

Though note that `exec-out` in older versions still returns mangled output.

In any case, using this command as a real-time image feed is unfeasible. Let's define a small helper script:

	import subprocess

	ADBBIN = 'adb.exe'

	def run_adb(arguments, clean=False, as_str=False, print_out=False, out_file=None):
		if type(arguments) == str:
			arguments = arguments.split(' ')
		result = subprocess.run([ADBBIN] + arguments, stdout=subprocess.PIPE)
		stdout = result.stdout
		if clean:
			stdout = stdout.replace(b'\r\n', b'\n')
		if as_str:
			stdout = stdout.decode("utf-8")
		if print_out:
			print(stdout)
		if out_file:
			mode = 'w' if as_str else 'wb'
			with open(out_file, mode) as file:
				file.write(stdout)
		return stdout

Which we can then use with e.g.

	from adb import *
	import tkinter as tk
	from time import time
	from PIL import ImageTk, Image
	from io import BytesIO

	window = tk.Tk()
	window.title("Image")
	window.geometry("360x660")
	window.configure(background='grey')

	panel = tk.Label(window)
	panel.pack(side="bottom", fill="both", expand="yes")

	previous_time = time()
	frames_drawn = 0
	while True:
		data = run_adb('exec-out screencap -p', clean=False)
		im = Image.open(BytesIO(data))
		im.thumbnail((im.size[0] * .33, im.size[1] * .33), Image.ANTIALIAS)
		img = ImageTk.PhotoImage(im)
		panel.configure(image=img)
		panel.image = img
		window.update_idletasks()
		window.update()
		frames_drawn += 1
		if time() > previous_time + 10:
			print('FPS:', frames_drawn / (time() - previous_time))
			previous_time = time()
			frames_drawn = 0

This works, but leads to a horrible framerate (and a very hot phone):

![](/images/2017/adb.gif)

Some devices also allow to use a `screenrecord` command:

	adb exec-out screenrecord --output-format=h264 -

Though the stream starts to lag after a few minutes and most players will have trouble to handle this raw h264 stream. Heavy applications also cause a lot of lag and dropped frames.

The code over at [https://github.com/fhorinek/adbmirror](https://github.com/fhorinek/adbmirror) provides a solid solution, though with no support for Python 3. The shell commands to set things up is also a bit messy, but it provides a perfect starting ground to work with.

First, we need to create a local `bin` folder with `minicap`, `minicap-shared` and `minitouch` placed in there:

![](/images/2017/minicap.png)

Next, we rewrite the scripts a bit to support Python 3. We don't need the "rotation" apk, as I didn't need to handle rotation support, made available at [https://github.com/Macuyiko/adbmirror](https://github.com/Macuyiko/adbmirror).

Running `start-mirror.py` now shows:

	Device info: arm64-v8a 26 8.0.0 1080x1920
	Now pushing files
	[ 11%] /data/local/tmp/adbmirror/minicap
	[ 22%] /data/local/tmp/adbmirror/minicap
	[ 33%] /data/local/tmp/adbmirror/minicap
	[ 45%] /data/local/tmp/adbmirror/minicap
	[ 56%] /data/local/tmp/adbmirror/minicap
	[ 67%] /data/local/tmp/adbmirror/minicap
	[ 79%] /data/local/tmp/adbmirror/minicap
	[ 90%] /data/local/tmp/adbmirror/minicap
	[100%] /data/local/tmp/adbmirror/minicap
	bin/minicap/arm64-v8a/minicap: 1 file pushed. 17.7 MB/s (580048 bytes in 0.031s)

	[100%] /data/local/tmp/adbmirror/minitouch
	bin/minitouch/arm64-v8a/minitouch: 1 file pushed.

	[100%] /data/local/tmp/adbmirror/minicap.so
	bin/minicap-shared/android-26/arm64-v8a/minicap.so: 1 file pushed. 1.4 MB/s (23592 bytes in 0.016s)

	Now ready to start GUI, press ENTER when done for cleanup
	Example command:
	python gui.py 540x960 1080x1920 /data/local/tmp/adbmirror/

Running `python gui.py 540x960 1080x1920 /data/local/tmp/adbmirror/` now provides us with a live mirror, no root required:

![](/images/2017/mirror.png)

Touch is simulated through mouse clicks and drags. Adding extension to fetch e.g. a PIL image every 5 seconds or to automate touch is pretty easy.