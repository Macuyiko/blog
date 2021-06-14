Title: reMarkable 2 Screen Capture on Windows 10
Author: Seppe "Macuyiko" vanden Broucke
Date: 2021-01-14 12:50

I've recently bought a [reMarkable 2](https://remarkable.com/store/remarkable-2) and am happy with it. Since teaching is still happening online for the most part at the moment, I was curious whether I could use it as a drawing tablet, share the screen with my machine, and then pick that up in e.g. OBS Studio to share it to viewers.

Luckily, the reMarkable 2, like its predecessor, is hacker-friendly, and someone has already made a [tool](https://github.com/rien/reStream) to do exactly this.

I'm working with Windows on my teaching machine, however, and wanted to avoid having to install Git BASH or MSYS2. Luckily, you can get the setup to work in a very portable fashion.

We're going to follow more or less the installation instructions over at [https://github.com/rien/reStream](https://github.com/rien/reStream). First, we need to generate a SSH key pair on our machine:

```text
C:\Users\Seppe> ssh-keygen -t rsa -C

Your public key has been saved in C:\Users\Seppe/.ssh/id_rsa.pub.
```

This will save a public key in `C:\Users\Seppe/.ssh/id_rsa.pub` (replace my username with yours). For the reMarkable 2, we need to use `rsa`.

Next, we need to add the identity using the ssh-agent:

```text
C:\Users\Seppe> ssh-agent -s

unable to start ssh-agent service, error :1058
```

If you get this error, head to services and enable/start the OpenSSH Authentication Agent:

![](/images/2021/restream1.png)

And then:

```text
C:\Users\Seppe> ssh-agent -s
C:\Users\Seppe> ssh-add C:\Users\Seppe/.ssh/id_rsa

Identity added: C:\Users\Seppe/.ssh/id_rsa (C:\Users\Seppe/.ssh/id_rsa)
```

Next, find the root password and IP address of your reMarkable (go to Settings, Help, Copyrights and licenses and scroll down). Then connect to it:

```text
C:\Users\Seppe> ssh root@10.11.99.1

# If it doesn't exist already
reMarkable: ~/ mkdir .ssh
```

And then, in another Windows terminal, copy over the public key:

```text
C:\Users\Seppe> type %HOMEPATH%\.ssh\id_rsa.pub | ssh root@10.11.99.1 "cat > .ssh/authorized_keys"
```

Finally, back in the SSH session, don't forget to set the permissions correctly:

```text
reMarkable: ~/ chmod -R og-rwx /home/root/.ssh
reMarkable: ~/ exit
```

Now try `ssh root@10.11.99.1` again. It should **not** ask for a password.

Finally, copy over the [binary](https://github.com/rien/reStream/blob/main/restream.arm.static) over to the reMarkable and make it executable:

```text
C:\Users\Seppe> scp restream.arm.static root@10.11.99.1:/home/root/restream
C:\Users\Seppe> ssh root@10.11.99.1 'chmod +x /home/root/restream'
```

Next, create an empty folder on your machine, and dump the [ffmpeg](https://www.gyan.dev/ffmpeg/builds/) (`ffplay.exe`) and [lz4](https://github.com/lz4/lz4/releases) into it (`lz4.exe`). Then navigate to this folder and run the following command on Windows:

```text
ssh root@10.11.99.1 -o ConnectTimeout=1 "./restream" | lz4 -d | ffplay -window_title Restream -vcodec rawvideo -loglevel info -f rawvideo -pixel_format gray8 -video_size 1872,1404 -i - -vf "transpose=2,transpose=1,setpts=(RTCTIME-RTCSTART)/(TB*1000000)"
```

And there we go:

![](/images/2021/restream2.gif)

`transpose=1` can be replaced with `transpose=0` for portrait mode.