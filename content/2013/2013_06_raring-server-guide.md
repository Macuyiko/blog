Title: Raring / Digital Ocean Server Setup
Date: 2013-06-20
Author: Seppe "Macuyiko" vanden Broucke

Two years after having moved to Linode, coming [from Slicehost](|filename|/2011/2011_12_oneiric-linode-server-migration.md), it seems that a new competitor is once again at the horizon, namely [Digital Ocean](https://www.digitalocean.com).

I'd heard good things about them already, especially on Hacker News, praising their competitive pricing and clean dashboard. However, being newcomers to the field, I didn't want to jump ship too abruptly, as I was still a happy Linode customer.

But, in April, Linode got [hacked](http://slashdot.org/firehose.pl?op=view&type=submission&id=2603667). Password hashes, source code fragments and even credit card statements were all rumored to be extracted. So okay, things like this happen, but the way how Linode dealt with the whole situation was less than optimal: first, they tried to ignore the problem; then, this was followed by a [statement](https://blog.linode.com/2013/04/12/security-notice-linode-manager-password-reset/) afterwards advising people to reset their password due to "security precautions". This is turn was followed by [an update](https://blog.linode.com/2013/04/16/security-incident-update/) which was a bit more transparent, but still somewhat surprising.

One of the staff mentions the following in the comments of the update post:

> @Eivind. our private key is stored only in encrypted format. The passphrase is not guessable, sufficiently long and complex, not based on dictionary words, and not stored anywhere but in our heads.

The hackers, on the other hand, came out with a [different statement](http://turtle.dereferenced.org/~nenolod/linode/linode-abridged.txt) altogether:

> 06:00 \<AlexC\_\> ryann: So, are you saying CC details have also been compromised?
> 06:00 \<ryann\> Yep
> 06:00 \<AlexC\_\> ryann: And you plan on releasing these?
> 06:00 \<ryann\> They did try to encrypt them, but using public key encryption doesn't work if you have the public and private key in the same directory

Of course, statements such as these should be taken with a grain of salt, as it could easily be hyperbolic bragging. Still, the whole ordeal left many Linode users with a bitter aftertaste.

So recently, I had a look at Digital Ocean to see if they're worth their salt. First difference is in pricing, and it's a pretty big one:

- DigitalOcean: $10 / mo. for 1GB, 1 Core, 30GB space, 2TB transfer
- Linode: $20 / mo. for 1GB, 8 Cores, 24GB space, 2TB transfer

Linode has DigitalOcean beat on CPU power, but DigitalOcean has the SSD advantage. Jason Ormand has performed [a benchmark](http://jasonormand.com/2013/02/08/linode-vs-digitalocean-performance-benchmarks/) and goes more into the technical details.

So with a new host comes a new opportunity to execute a clean Ubuntu install. In the same vein as the [previous post](|filename|/2011/2011_12_oneiric-linode-server-migration.md), let's get right to it...

## 1. Install Ubuntu

This is a single-click process with DigitalOcean. I'm using Ubuntu Server 13.04 x64. You will get a root account with password.

## 2. Always be updating and upgrading

    apt-get update
    apt-get upgrade

## 3. Synchronize the system clock

Synchronize the system clock with an NTP server over the Internet.

    apt-get install ntp ntpdate

SSH is installed already, so we skip this. We also don't have to configure our network, but you can check the hostname with:

    hostname

## 4. Add users

Add some users. Adding a `webmaster` is recommended:

    useradd -d /home/webmaster -m webmaster
    passwd webmaster
    adduser webmaster sudo

## 5. Secure SSH

Edit `/etc/ssh/sshd_config`:

	# Always a good idea to not listen at the default port
	Port	44422

	# Prohibit root logins
	PermitRootLogin no

Then restart SSH and login again with a normal user:

    service ssh restart

Using `sudo su` should allow you to continue as root.

## 6. MySQL

Install MySQL. You will be asked for a root password.

	apt-get install mysql-server mysql-client

We keep `bind-address = 127.0.0.1` in `/etc/mysql/my.cnf`.

If you wish, you can also opt to use MariaDB instead.

## 7. Postfix for SMTP support

    apt-get install postfix procmail

Make sure to pick the following:

	General type of configuration?
	 --> Internet Site

Run:

    dpkg-reconfigure postfix

And would through the questions. Defaults are fine, but you can disable IPv6 if you want to.

Next, we make sure to listen to local interface only:

	postconf -e 'inet_interfaces = loopback-only'

Restart Postfix:

	service postfix restart

## 8. Apache/PHP5

Install:

	apt-get install apache2 apache2-mpm-prefork apache2-utils ssl-cert

	apt-get install libapache2-mod-php5 php5 php5-common php5-curl php5-dev php5-gd php5-idn php-pear php5-imagick php5-imap php5-json php5-mcrypt php5-memcache php5-mhash php5-ming php5-mysql php5-ps php5-pspell php5-recode php5-snmp php5-sqlite php5-tidy php5-xmlrpc php5-xsl

Enable some modules:

	a2enmod ssl
	a2enmod rewrite
	a2enmod suexec
	a2enmod status
	a2enmod include

	/etc/init.d/apache2 force-reload

Adding subdomains is done with vhosts in `/etc/apache2/sites-enabled`:


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
        DirectoryIndex index.html index.htm index.php
        AllowOverride All
        Order allow,deny
        allow from all
      </Directory>

      ErrorLog /var/log/apache2/error.log
      LogLevel warn

      CustomLog /var/log/apache2/access.log combined
      ServerSignature On
    </VirtualHost>

Don't forget to edit the default virtualhost with a `NameVirtualHost *` and `AllowOverride All`.

Also, edit `php.ini` if needed.

## 9. Proftpd

Install Proftpd:

	apt-get install proftpd ucf

Make sure to pick `standalone`.

Edit `/etc/proftpd/proftpd.conf`:

	DefaultRoot /
	UseIPv6 off

And:

	service proftpd restart

We don't install phpMyAdmin anymore. `apt-get install phpmyadmin` if you want to.

## 10. Set `/var/www` permissions

Making it easy for our "webmaster":

    chown -R webmaster:www-data /var/www
    chmod 775 -R /var/www

## 11. Install fail2ban

    apt-get install fail2ban

Don't forget to configure a jail.local and add custom filters if needed.

We do not install Slowloris protection any more. Attacks using this method seem to have stopped/weakened.

## 12. Final migration

- Move user files
- Configure all virtualhosts
- Move `/var/www`
- Move data bases
- Keep a copy of `/etc` around
- Move SSL keys

Backup script:

    tar cvpzf backup.tgz --exclude=/proc --exclude=/lost+found --exclude=/mnt --exclude=/sys --exclude=/dev --exclude=/usr --exclude=/bin --exclude=/sbin --exclude=/backup.tgz /

It's a pity this last step can't be automated. I guess it would be possible to create an image and move it over the another VPS, but this will bring along all the extra filler you maybe don't want anymore.

My experience with DigitalOcean was pleasant so far. The SSD drives make installing `apt` packages a real breeze. I'm not migrating completely from Linode yet (hosting too many sites at the moment with them), but I'll definitely launch new projects over there.

