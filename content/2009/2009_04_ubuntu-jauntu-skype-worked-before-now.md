Title: Ubuntu Jauntu: Skype Worked Before, Now: "Problem with audio capture"
Date: 2009-04-28
Author: Seppe "Macuyiko" vanden Broucke

There are two things I currently not like about Ubuntu or Linux in general: the whole sound mess, and the whole graphics mess (but both are getting better). This problem is about the first mess.  
Skype was working perfectly in Interprid, now in Jaunty it was telling me that there was a "Problem with audio capture". I tested Ubuntu's sound-recorder as well, which was not working either.  
I'm using the default, normal Skype from the Medibuntu repo's.  
Let's take a look at all the different factors here. First of all, open `System -> Preferences -> Sound`. Mine looks like this:  
  - Sound Events - Sound playback: Autodetect
  - Music and Movies - Sound playback: Autodetect
  - Audio Conferencing
    - Sound playback: Autodetect
    - **Sound capture**: ALSA - Advanced Linux Sound Architecture, in your case, this may say PulseAudio Sound Server here. However, I have noticed that ALSA seems to record better sound (less garbled, especially with slower computers). Since we're not doing anything unusual with recorded sound (client-server, multiple inputs), I suggest you also pick ALSA here.
Now right click the sound icon in the panel and pick "Open Volume Control". My device says "HDA Intel (Alsa mixer)". You'll probably need the Alsa mixer as well. I have a few sliders I have to play with:  
  - In the Playback-tab (yes, here!): Mic Boost
  - In the Recording-tab: Capture
  - In the Switches-tab: make sure Microphone Capture is enabled! This was disabled after my Jaunty upgrade. If you're not seeing any relevant sliders or checkboxes, click the Preferences-button and enable all relevant sliders/switches.
Now open sound-recorder. You should be able to record sound now. Also, start `pavucontrol`, and click the Input Devices-tab, the level meter should respond to you clapping your hands for example.  
Hear yourself? No, then try fiddling again with the settings in the previously opened windows before you continue!  
Yes, good, onwards to Skype. Try making a test call. In my case, Skype was still complaining about the audio capture. Let's open Skype's options -> Sound Devices.  
In my case, the options were:  
  - Sound In: HDA Intel (hw:Intel,0)
  - Sound Out: pulse
  - Ringing: pulse
Which was working in Intrepid. If you suffer the same problem, read on...  
A sidenote, your Sound In device might be either pulse or default as well. There are a few cases when you should use these:  
  - default: if you've succesfully changed configuration files to make the correct devices the default ones. This will almost never be the case.
  - pulse: if you're using PulseAudio server for the Sound Capture. But even then, I don't recommend it. Using pulse for Sound In often crashes Skype on my machine...
Again, provided when you use a normal Skype (non static, non OSS). 
Your Sound Out/Ringing devices are already correct, they need to be pulse. Sound In will be set to an hw-device.  
Before reading further, try making a test call with every listed hw-device (I had four, you can have more or less).  
If none of them are working or if you're sure which hw-device you need (and it isn't working), try this: edit `/etc/pulse/daemon.conf` (don't forget to sudo) and make sure the following lines are present and uncommented, with the following values:      default-fragments = 8      default-fragment-size-msec = 5
This is an optional step however, but it seems to help with the Skype sound quality (an other option is setting `default-fragment-size-msec` to 10).  
**(!)** Now,  edit `~/.asoundrc` (no need to be root here, it's a file in your home directory). And make sure the following lines are there:      pcm.pulse { type pulse }      ctl.pulse { type pulse }
Which I totally did in Hardy as well! The update must've deleted them. This simple file seemed to do the trick!  
Then, just to be sure, I reinstalled  the `libasound2-plugins` package.  
Reboot, or restart pulseaudio (kill it, then start it in i.e. a Terminal window). Restart Skype. Skype was working fine now. If it is not, make sure you try every plughw-device.  
Still not working, no matter how much you try? You're out of luck. If sound-recorder and sound playback is working, you can try an emergency solution. Install the static, OSS version of Skype (you can find it with Medibuntu or floating around in a tarball somewhere). and start it with:      padsp skype
To route the sounds through the PulseAudio sink. Sound devices in this Skype should all be set to default (or OSS). Calls should work now. Be warned though: always try this as a last resort, routing OSS sound through PulseAudio is slow and bloated, ugly and old. Your record voice will sound like... well, crap. 