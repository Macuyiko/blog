Title: Oneiric / Linode Server Migration
Date: 2011-12-18
Author: Seppe "Macuyiko" vanden Broucke

Sigh... I'm sorry, Slicehost, but I'm leaving you. I've been a long (and very happy) Slicehost customer for the past few years. The service offered was perfect for anyone knowing their way around SSH, Linux administration and setting up a server -- and all that for just 30 bucks a month. Nothing bad can be said about the Slicehost developers either: their support has been excellent, the uptime of their servers near-perfect, and their tutorials and guides well-written. I've ran MySQL and web servers, wiki's, proxy's, game hosts and much more on my little slice. I even used it as a [honeypot](http://blog.macuyiko.com/2011/03/running-ssh-honeypot-with-kippo-lets.html).

But then, a sudden announcement changed everything. In 2008 (such a long time, already!) Slicehost told the world that they had been acquired by Rackspace. Since then, I've become more and more frustrated with Rackspace's need to shove buzzwords, confusing plans and general overdone "enterprisiness" up my throat. Try to find out how much a [new slice](http://www.rackspace.com/cloud/cloud_hosting_products/servers/pricing/) will cost you... exactly. Compare this new look with the [old Slicehost landing page](http://web.archive.org/web/20080603231902/http://www.slicehost.com/). The old page was simple, easy, beautiful. The new pricing gives the impression that you're bringing 20 consultants on board.

I don't have anything against acquisitions in general, but the Rackspace takeover has been particularly confusing for end-users, with DNS service moving to Rackspace (free?), lower bandwidth allowances (huh?), servers moving data centers (why?), changes in Slice sizes, and a requirement to migrate to Rackspace in 2012 (what does this mean? Just leave me be!)

Since I'm not charmed by Rackspace's way of handling things (I'm sure they're nice people though), I'm moving to [Linode](http://www.linode.com/). With easy to understand pricing, a clean dashboard (with all the same features as Slicehost) and not too much fluff to get in your way, it's a perfect solution for the hobbyist hacker. Even better: Linode also [outperforms the competition](http://journal.uggedal.com/vps-performance-comparison/) performance-wise, although the linked benchmark is a bit old, and I've never had complaints with Slicehost in this regard.

The reason why I've been putting off the move is because it involves setting up a new server (easy), configuring it exactly as you want (difficult), and making sure everything is migrated correctly (ugh). There's always one little configuration directive, file, or database table which is forgotten during the process.

The steps below serve as a reminder, mainly aimed at my (future) self, for setting up an Ubuntu (Oneiric) server. I'm looking forward to seeing how Linode performs...

## 1. Install Ubuntu

## 2. Edit /etc/apt/sources.list and update

    apt-get update
    apt-get upgrade`

## 3. Enable the root account

    sudo passwd root

And give root a password. Afterwards we become root by running: `su`

## 4. Synchronize the system clock

Synchronize the system clock with an NTP server over the internet. (You can also install this via the Time and Date Preferences GUI.

    apt-get install ntp ntpdate

## 5. Install the SSH server

Install OpenSSH by default.

    apt-get install ssh openssh-server

## 6. Configure the network

A server should have a static IP address; edit `/etc/network/interfaces`:

    #This file describes the network interfaces available on your system
    # and how to activate them. For more information, see interfaces(5).

    # The loopback network interface
    auto lo
    iface lo inet loopback

    # The primary network interface
    auto eth0
    iface eth0 inet static
    address 192.168.0.100
    netmask 255.255.255.0
    network 192.168.0.0
    broadcast 192.168.0.255
    gateway 192.168.0.1`

Then restart your network:

    /etc/init.d/networking restart

Then edit `/etc/hosts`:

    127.0.0.1 localhost.localdomain localhost
    192.168.0.100 server1.example.com server1

    # The following lines are desirable for IPv6 capable hosts

    ::1 ip6-localhost ip6-loopback
    fe00::0 ip6-localnet
    ff00::0 ip6-mcastprefix
    ff02::1 ip6-allnodes
    ff02::2 ip6-allrouters
    ff02::3 ip6-allhosts`

Now run:

    echo server1.example.com > /etc/hostname

Reboot the system:

    reboot

Afterwards, run:

    hostname
    hostname -f

Both should show your chosen hostname.

## 7. Add users

Add some users. Adding a "webmaster" is recommended:

    sudo useradd -d /home/webmaster -m webmaster
    sudo passwd webmaster

    # Set /bin/bash as shell

    # Edit /etc/sudoers

## 8. MySQL

Install MySQL. You will be asked for a root password.

    apt-get install mysql-server mysql-client

We keep `bind-address = 127.0.0.1` in `/etc/mysql/my.cnf`.

## 9. Postfix for SMTP support

    apt-get install postfix procmail

You will be asked two questions. Answer as follows:

    General type of configuration?
      Internet Site

    Mail name?
      server1.example.com

Run:

    dpkg-reconfigure postfix

Again, you'll be asked some questions:

    General type of configuration? <-- Internet Site
    Where should mail for root go <-- [blank]
    Mail name? <-- server1.example.com
    Other destinations to accept mail for? (blank for none) <-- server1.example.com, localhost.example.com, localhost.localdomain, localhost
    Force synchronous updates on mail queue? <-- No
    Local networks? <-- 127.0.0.0/8
    Use procmail for local delivery? <-- Yes
    Mailbox size limit <-- 0
    Local address extension character? <-- +
    Internet protocols to use? <-- ipv4

Next:

    postconf -e 'inet_interfaces = loopback-only'

We do not create certificates any more. Only using postfix as a local-only SMTP handler. IMAP and others not handled with Google Apps.

Restart Postfix:

    /etc/init.d/postfix restart

## 10. Apache/PHP5

### 10.1. Installation

    apt-get install apache2 apache2-mpm-prefork apache2-utils ssl-cert

Install PHP5:

    apt-get install libapache2-mod-php5 php5 php5-common php5-curl php5-dev php5-gd php5-idn php-pear php5-imagick php5-imap php5-json php5-mcrypt php5-memcache php5-mhash php5-ming php5-mysql php5-ps php5-pspell php5-recode php5-snmp php5-sqlite php5-tidy php5-xmlrpc php5-xsl

Edit `/etc/apache2/mods-available/dir.conf`:

    <IfModule mod_dir.c>
      #DirectoryIndex index.html index.cgi index.pl index.php index.xhtml
      DirectoryIndex index.html index.htm index.shtml index.cgi index.php index.xhtml
    </IfModule>`

Now we have to enable some Apache modules:

    a2enmod ssl
    a2enmod rewrite
    a2enmod suexec
    a2enmod status
    a2enmod include

Reload the Apache configuration:

    /etc/init.d/apache2 force-reload

Don't forget to edit php.ini.

### 10.2. Adding subdomains

You can add sites to `/etc/apache2/sites-enabled`, use the following example configuration file:

    <VirtualHost *>
      ServerAdmin info@sitename.com
      ServerName sitename.com
      ServerAlias *.sitename.com
      DocumentRoot /var/www/sitename.com/

      <Directory />
        Options FollowSymLinks
        AllowOverride All
      </Directory>

      <Directory /var/www/sitename.com/>
        Options Indexes FollowSymLinks MultiViews
        DirectoryIndex index.html index.htm index.php index.php3
        AllowOverride All
        Order allow,deny
        allow from all
      </Directory>

      ScriptAlias /cgi-bin/ /usr/lib/cgi-bin/

      <Directory "/usr/lib/cgi-bin">
        AllowOverride None
        Options ExecCGI -MultiViews +SymLinksIfOwnerMatch
        Order allow,deny
        Allow from all
      </Directory>

      ErrorLog /var/log/apache2/error.log

      # Possible values include: debug, info, notice, warn, error, crit,
      # alert, emerg.
      LogLevel warn

      CustomLog /var/log/apache2/access.log combined
      ServerSignature On

      #Alias /doc/ "/usr/share/doc/"
    </VirtualHost>`

Don't forget to edit the default virtualhost with a `NameVirtualHost *` and `AllowOverride All`.

## 11. Proftpd

Install Proftpd:

    apt-get install proftpd ucf

You will be asked a question:

    Run proftpd from inetd or standalone? <-- standalone`

Now edit `/etc/proftpd/proftpd.conf`:

    DefaultRoot /
    UseIPv6 off

Then restart Proftpd:

    /etc/init.d/proftpd restart

## 12. PHPMyAdmin

Install PHPMyAdmin:

    apt-get install phpmyadmin

Pick apache2 to configure.

## 13. Secure SSH a bit

Edit `/etc/ssh/sshd_config`:

    Port 4444 #Other than 22
    PermitRootLogin no #Make sure other user can login/sudo`

## 14. Set /var/www permissions

    chown -R webmaster:www-data /var/www
    chmod 775 -R /var/www

## 15. Install slowloris protection

    apt-get install gcc apache2-threaded-dev
    wget https://gist.github.com/raw/773464/4e7250692c34f55725384525b513e71be7541f5a/mod_muantiloris.c
    apxs2 -a -i -c mod_muantiloris.c
    /etc/init.d/apache2 restart

Edit `/etc/apache2/httpd.conf`:

    ExtendedStatus On
    IPReadLimit 5
    IPPostLimit 10

## 16. Install fail2ban

    apt-get install fail2ban

Don't forget to configure a jail.local and add custom filters if needed.

## 17. Final migration

Move user files, virtualhost configurations, /var/www. Backup mysql data bases.

Install openjdk-6-jre, davmail if needed.

Backup script:

    tar cvpzf backup.tgz --exclude=/proc --exclude=/lost+found --exclude=/mnt --exclude=/sys --exclude=/dev --exclude=/usr --exclude=/bin --exclude=/sbin --exclude=/backup.tgz /
