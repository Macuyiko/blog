Title: Muxtape Downloader Shell Script
Date: 2008-06-26
Author: Seppe "Macuyiko" vanden Broucke

I got to confess something: I love Muxtape! Did you know there is a [userscript](http://userscripts.org/scripts/show/24382) which lets you download the songs? It's not encouraged though...

I've been trying to learn Shell Scripting. So I decided: why not make a Muxtape downloader. This is my first shell script (longer than a few lines). I've thrown together code I found at various site, and I find programming with bash... special. Currently: the script looks like this:

    #!/bin/bash

    #Fetch URL
    wget -O /tmp/muxtape_html.out http://$1.muxtape.com

    #Fetch titles
    sed -n '/<div class="name">/,/<\/div>/p' /tmp/muxtape_html.out > /tmp/muxtape_titles.out
    titles=`cat /tmp/muxtape_titles.out`
    echo ${titles//<div\ class="\">/} > /tmp/muxtape_titles.out
    titles=`cat /tmp/muxtape_titles.out`
    echo ${titles//\ <\/div>/;} > /tmp/muxtape_titles.out

    #Fetch kettle
    egrep -o "Kettle.*" /tmp/muxtape_html.out > /tmp/muxtape_links1.out
    sed -e 's,Kettle(,,' /tmp/muxtape_links1.out > /tmp/muxtape_links2.out
    sed -e 's,);,,' /tmp/muxtape_links2.out > /tmp/muxtape_links.out
    cat /tmp/muxtape_links.out | tr -d '[' > /tmp/muxtape_links.out
    cat /tmp/muxtape_links.out | tr -d ']' > /tmp/muxtape_links.out
    cat /tmp/muxtape_links.out | tr -d "'" > /tmp/muxtape_links.out

    #Make arrays
    titles=`cat /tmp/muxtape_titles.out`
    IFS=";"
    titlesa=($titles)
    foo=`cat /tmp/muxtape_links.out`
    IFS=","
    bar=($foo)
    compar=$(( ${#bar[@]}/2 ))

    #Get songs
    for (( i = 0 ; i < ${#bar[@]} ; i++ )) do
      if [ $i -lt $compar ]
      then
        k='http://muxtape.s3.amazonaws.com/songs/'
        a=${bar[$i]}
        b=${k}$a
        q="?"
        k=${b}$q
        e=${bar[$i+${#bar[@]}/2]}
        z=${k}$e
        echo ${titlesa[$i]}
        wget -O ${titlesa[$i]}.mp3 $z
      fi
    done

Yuck! But it works, save it in `script.sh`, make it executable and then `./script.sh muxtape_username`.

This will save all mp3s. It took me an hour to figure this out, and I'm sure lots of you could do this much better. Still, it was cool to build... but in Perl or PHP I could've done this much quicker and cleaner. Oh and by the way: don't abuse this... Muxtape are friendly people.

