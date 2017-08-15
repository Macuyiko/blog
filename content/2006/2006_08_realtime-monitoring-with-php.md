Title: Realtime Monitoring With PHP
Date: 2006-08-12
Author: Seppe "Macuyiko" vanden Broucke

If you're a [Digg](http://digg.com/)'er, you'll probably know the [Digg Labs](http://labs.digg.com/): the site where you can track how users are digging stories. In realtime.

Most of you will know that Digg is programmed in PHP. The two Flash applications provided in Digg labs have to get their data from somewhere. I was wondering how to achieve a similar type of result within one of my own Intranet applications I am writing.

Of course, it would not be an exact copy, this is what I wanted to do:

- User tracking in realtime.
- Query execution tracking in realtime.
- Making an interface for administrators to see this, not using Flash.

So no digging stories, and no Flash. Because Flash is heavy and I am not a very experienced Flash programmer.

Of course, this functionality can be split up into three parts:

1. The main "server": the page or piece of software which tracks all the incoming messages, and sends them to all the monitoring users.
2. The monitor: the ones who view all the activity and receive messages from the server.
3. The sender: the page or function or class or whatever which sends the actual messages to the server. E.g.: "User 123 has logged in into the system."

How would I achieve this. One possible way would be using files. But that's a big no-no because yo have to implement file locking and all kinds of timestamp magic to quickly retrieve the latest messages to make it realtime-ish.

Another way is using a database. Databases are fine for logging stuff but this would also not work because the amount of inserts and selects would quickly become too large (slowing down the user experience) and it would also be not really realtime.

Why would these two options not be realtime? Consider that all your visiting clients are putting messages into the database. These are given a timestamp. Now consider your monitoring application. You would have to retrieve all the latest messages every X seconds (only retrieving the ones you haven't retrieved before of course). So it would not be realtime, but "intervalled".

Of course: this can be a valid solution too, but I wanted something real-realtime.

So I decided I would be using a real client/server system. Using [PHP's socket](http://www.php.net/sockets) support.

The first script I wrote was the main server. This process would continue forever and handle all the incoming connections and commands. You can run this script in a browser on the server, but I advise running it from the command line (convert all the line breaks to `\n` for extra commandline-ness).

I downloaded some chat server script a while ago and edited that. You can find the [complete source code here.](http://student.kuleuven.be/%7Es0172696/src/socketrealtime/socketserver.php)

Then I wrote a small function for connecting, authenticating and sending messages. You could also write this as a class of course.

I used this function in every important event I wanted to log and monitor e.g. when loading a page I sent "User X has entered page {$_SERVER['PHP_SELF']}".

You can download that [function here](http://student.kuleuven.be/%7Es0172696/src/socketrealtime/socketsender.php).

To finish of, you can [download the monitoring script](http://student.kuleuven.be/%7Es0172696/src/socketrealtime/socketmonitor.php), using Javascript and output buffering, you can see all the messages in real time. The interface is very crude but provides a good starting point for more neat looks and ideas. You could even connect using telnet and see the messages there.

Now: start socketserver.php on your server, you'll see "Running" if everything is OK.

Then, include the function from socketsender.php and sprinkle it all over your scripts...

Then use socketmonitor.php to see stuff happening in realtime.
