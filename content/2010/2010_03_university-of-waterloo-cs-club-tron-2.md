Title: The University Of Waterloo CS Club Tron Challenge, And Some Minimax In General - Part 2
Date: 2010-03-02
Author: Seppe "Macuyiko" vanden Broucke

(This is the second and final part in the University Of Waterloo CS Club Tron
Challenge post series. You can find the first part
[here](|filename|2010_02_university-of-waterloo-cs-club-tron.md).)

Now that the contest is finished, congratulations go out to the first place
winner: a1k0n, well done!

I also wanted to pass on a few remaining interesting links and concepts I
haven't yet included or explained in my first post.

How did I do? 144th place. Not bad for a heuristic, but next year I'll be
using minimax as well.

### A small selection of rounds

I'm including some final rounds to show where my bot did well, and where it
performed poorly.

![](http://4.bp.blogspot.com/_X4W-h82Vgjw/S40zMMa5LgI/AAAAAAAAPVQ/D2y-
QyMkIrY/s200/game1_1.png)

The first game starts of like this. My bot is red.

![](http://1.bp.blogspot.com/_X4W-
h82Vgjw/S40zSO6_dbI/AAAAAAAAPVU/oLvgFvVb8yA/s200/game1_2.png)

The board after a few moves. Our bot senses it can reach a wall to block our
opponent of by going east...

![](http://4.bp.blogspot.com/_X4W-
h82Vgjw/S40zWTKFJOI/AAAAAAAAPVY/00ZwMbDZOWQ/s200/game1_3.png)

Which is what happens here. It's easy to see we've won now.

![](http://4.bp.blogspot.com/_X4W-
h82Vgjw/S40zayPFGmI/AAAAAAAAPVc/Sy82jJS_Zjw/s200/game1_4.png)

Our opponent makes optimal use of the remaining space, but loses.

* * *

![](http://3.bp.blogspot.com/_X4W-
h82Vgjw/S40ziJsPQpI/AAAAAAAAPVg/qfsp585DN-k/s200/game2_1.png)

The second game. We're red again.

![](http://2.bp.blogspot.com/_X4W-
h82Vgjw/S40zmK8FPFI/AAAAAAAAPVk/XQoqkw8WuKM/s200/game2_2.png)

We've been chasing blue for a bit.

![](http://2.bp.blogspot.com/_X4W-
h82Vgjw/S40zqEWnZmI/AAAAAAAAPVo/L-7DnhWH5-s/s200/game2_3.png)

To close in on blue, we need to go the other way around. But due to our
aggressive manoeuvres, we've made a mistake.

![](http://1.bp.blogspot.com/_X4W-
h82Vgjw/S40zu_gWtjI/AAAAAAAAPVs/U8wAQLbr-M4/s200/game2_4.png)

Blue exploits our mistakes and blocks us off. Well done.

* * *

![](http://3.bp.blogspot.com/_X4W-
h82Vgjw/S40z01RGLaI/AAAAAAAAPVw/v77txiOUSpQ/s200/game3_1.png)

A new game, we're red again.

![](http://2.bp.blogspot.com/_X4W-
h82Vgjw/S40z4mlqvRI/AAAAAAAAPV0/wH8s8jaroKU/s200/game3_2.png)

The first moves start of pretty symmetric.

![](http://1.bp.blogspot.com/_X4W-h82Vgjw/S40z8uQpHCI/AAAAAAAAPV4/CH2nGH-
YMBg/s200/game3_3.png)

We're chasing our opponent for a bit. Since we cannot reach him by going north
anymore, we'll go down now...

![](http://3.bp.blogspot.com/_X4W-
h82Vgjw/S400ApI6mPI/AAAAAAAAPV8/C7fzgJ0HwUI/s200/game3_4.png)

Which is what happens here. Our bot quickly senses that we can close blue off.
It's pretty hard to eyeball here that we'll end up with more room then blue,
but our bot seems to be confident.

![](http://3.bp.blogspot.com/_X4W-
h82Vgjw/S400E86mIHI/AAAAAAAAPWA/xDc2nh20D8Q/s200/game3_5.png)

Indeed, a few seconds later the situation looks like this. It's clear we've
won.

* * *

![](http://1.bp.blogspot.com/_X4W-
h82Vgjw/S400KOEWHPI/AAAAAAAAPWE/6Dplv6x4NlY/s200/game4_1.png)

Another game. Now we're in blue. I'm picking this round because my bot had a
lot of problems with this setup.

![](http://2.bp.blogspot.com/_X4W-
h82Vgjw/S400Np8LBXI/AAAAAAAAPWI/dHPrVl_rGeg/s200/game4_2.png)

By chasing our opponent, we're getting ourselves in a lot of trouble.

![](http://4.bp.blogspot.com/_X4W-
h82Vgjw/S400RTFHgFI/AAAAAAAAPWM/kTIUrzsghf0/s200/game4_3.png)

And indeed, a few moves later, red can easily corner us.

* * *

![](http://1.bp.blogspot.com/_X4W-
h82Vgjw/S400XKOpEtI/AAAAAAAAPWQ/1TFNges609I/s200/game5_1.png)

This game was played against the contest winner, a1k0n, we're blue again.

![](http://1.bp.blogspot.com/_X4W-
h82Vgjw/S400bM6ucYI/AAAAAAAAPWU/NHcVB3sDxIE/s200/game5_2.png)

Both players start of pretty aggressive.

![](http://4.bp.blogspot.com/_X4W-h82Vgjw/S400eeK-
z3I/AAAAAAAAPWY/EViduIwnoI0/s200/game5_3.png)

Red makes a slight detour, so we go north to reach him.

![](http://1.bp.blogspot.com/_X4W-
h82Vgjw/S400h5xPPXI/AAAAAAAAPWc/NdAumvqy9D4/s200/game5_4.png)

Then red turns around, an obvious mistake would be to follow him by going
south. In the first part we've mentioned this problem and included a fix to
avoid these dead-ends.

![](http://3.bp.blogspot.com/_X4W-
h82Vgjw/S400li8eGVI/AAAAAAAAPWg/y9aqw5TCOfE/s200/game5_5.png)

...and thus we turn around as well.

![](http://2.bp.blogspot.com/_X4W-
h82Vgjw/S400pFJbXRI/AAAAAAAAPWk/YIw1adE16aA/s200/game5_6.png)

Alas, red is still able to close us off before we reach him. I actually
consider this a well-played game.

### An easier (and better) minimax evaluation function: Voronoi territories

In the previous post I've already mentioned that the most important part of a
good minimax strategy is the evaluation (the score) you give to each game
state. A lot of players have been using a Voronoi Territory based system to
evaluate their positions.

The name comes from [Voronoi
diagrams](http://en.wikipedia.org/wiki/Voronoi_diagram), a decomposition of
space determined by distances to objects in that space (like points for
example). When applied to the game of Tron, we could start with this simple
board:

![](http://2.bp.blogspot.com/_X4W-
h82Vgjw/S400uc5jzBI/AAAAAAAAPWo/zYmmrnEA4Jg/s1600/voronoi1.png)


To define our territory, we figure out the quickest way to reach each free
square, both for us, and for our opponent:

![](http://1.bp.blogspot.com/_X4W-
h82Vgjw/S400xVroxQI/AAAAAAAAPWs/rjp6uG3981Q/s320/voronoi2.png)

Our territory is defined by the squares we can reach quicker than our
opponent, and vice verso. E.g. red's space is colored in light red, blue's
space in light blue:

![](http://2.bp.blogspot.com/_X4W-
h82Vgjw/S4001dkwqGI/AAAAAAAAPWw/O4tQoEJHYIM/s1600/voronoi3.png)


If we apply this method to each board in our minimax tree, we can assign a
score. For example:

    _score_ = _size of our territory_ \- _size of their territory_

### Articulation points

To expand on this idea, a lot of players also searched for [articulation
points](http://en.wikipedia.org/wiki/Cut_vertex) on the board to see if it
would make sense to block those off. Remember: an articulation point is a
point such that removal (filling) that point would increase the number of
disconnected "chambers". For example, the articulation points in the board
above are:

![](http://1.bp.blogspot.com/_X4W-
h82Vgjw/S4009Ad07HI/AAAAAAAAPW0/hROnW7-xPXM/s1600/artic1.png)


A good strategy checks whether we can reach those articulation points first,
if it separates us from our opponent, and if doing so would result in more
territory for us than our opponent.

### Worth reading

Now that the contest is over, a lot of players have posted their source code
in [this thread](http://csclub.uwaterloo.ca/contest/forums/viewtopic.php?f=8&t
=358#p1849). The [git repository](http://github.com/a1k0n/tronbot) of the
contest winner is especially worth taking a look at.

**Addendum**: a1k0n has posted a [post-mortem on his blog](http://a1k0n.net/blah/archives/2010/03/index.html#top), which manages to explain things very well. It's a wonderful read.
