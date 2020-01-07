Title: And Now, Time for Another Rant
Author: Seppe "Macuyiko" vanden Broucke
Date: 2020-01-07 22:01
Subtitle: Everything about computing is still horrible

I was going to spew this out as a Twitter "thread" as is the fashion these days, but I decided against it. Blogging is still cool. Especially once I realized this is not the [first time](|filename|/2017/2017_11_rant.md) I've done this...

... Meaning that I'm sitting at my machine and realize computing is (still) terrible. No worries, this rant won't be as long as last time, since turns out most of it boils down to the same stuff anyway, but let me revisit some of the topics from -- now -- three (!) years ago. Yes, Windows 10 was already a thing then, we get old.

**On Windows and Interfaces**: this is still terrible. I've learnt how to deal with Windows 10 random crashing shenanigans by just buying a new laptop every year. Truth be said, the update mechanism appears to be less invasive, except if you have a bunch of machines like me just resting at random offices which crap out the moment you return to them after a month or so. The interface, on the other hand, whilst useable, even look more outdated today. Not just because of the fact that you can still visit all "design era's" all the way from 10 to Vista to 7 to XP to 98 if you continue to dig deep enough in the control panel (even although most of it is better hidden nowadays), but also simply because the flat design looks outdated. I still miss good old buttons.

Discoverability is an issue. Clickability is an issues. How the !@#$ can you claim in the Snipping Tool app that it's "gone soon" whilst no one knows about WinKey + Shift + S? The same holds for Apple: cover 80% of use cases in an easy to use manner, whilst making the other 20% near impossible. It's a user's nightmare.

Apart from that, I'm getting more and more annoyed that my beast of a machine -- because let's be honest, an octa-core 3Ghz machine is a beast, in fact -- will randomly spin its (probably too cheap since we only look at "them GigaHertz") fans in the middle of the night because of... who knows? Indexing, perhaps? There's always some important indexing or telemetry work to do.

I'm also annoyed that there's no simple way to "sync and ready" Windows systems (neither is there on Linux or Max, but I know their users would defend the point more heavily with home-brew solutions). Case in point: one of my favorite use cases for a VM is to boot from a snapshot. I want that for my main machines, but: (i) keep my documents in sync (even if that means a Dropbox or Google Drive), (ii), keep my main set of apps in an updated state (but not whilst I'm working), (iii) put everything else in "containers" or whatever and let me decide if this new app I've just installed becomes part of the "main bunch" or just something I want to try out. The first real tool that provides this has my $ (and I can only imagine this is an issue many multi-device users face). Going on the road with "that travel laptop" and having to get everything ready in the hotel room the night before is hellish, when you just want to boot it up, go over your slides, make some last minute changes to your Jupyter notebooks, enjoy a beer and go to bed. I'm even tempted to try it myself, but know I'd botch the implementation.

For a while, in fact, Chromebooks offerred a good solution. Always updated, always browser-only. Then Google lost interest and went for a last-resort "meh let's support (badly so) Android apps". Also, why is there no good way to set up ChromeOS on a non Chromebook device? I tried this Cloudready thing to prepare a beefy replacement laptop for my mom (who was a big ChromeOS fan -- even whilst not knowing it -- the first laptop she liked to use), and even apart from the USB boot stick taking six hours to prepare (my problem), the mouse pointer decided to randomly disappear completely after a day or so of use, even whilst working after install, even after two fresh installs (her problem, but even more so my problem).

Last year I wrote this:

> Interfaces in general have become horrid. An interesting [discussion on Twitter](https://tttthreads.com/thread/927593460642615296) has lots
> of people talking about this (funny that a separate website is needed to kind-of properly render out a list of tweets in a somewhat 
> readable format)

This conversation got revisited, I think, recently -- no wait, it's [this one](https://news.ycombinator.com/item?id=21835417) (I'm linking to the Hacker News page as that's the site that actually allowed my to find this post in a rapid way instead of Twitter, which still is -- in 2020 -- a massive sinkhole in which any good content simply goes dark... sigh.)

What actually sparked me to write this post were two Google products. One, Google Translate (in Chrome), which still randomly cannot detect that a web page I'm viewing is in Mandarin whilst at other times -- on the same domain -- will pop up a very helpful button asking if I want to translate the page. Good luck forcing Chrome to do so if you don't get that pop up. The second one is Google Drive which still... years later... with so many paying customers... will for some reason randomly continue to sync but context-menu-up a completely grey box when you right click its icon. Why? Because I have many files? You offer 2TB of space. You have a hundred engineers (easily) slacking off at this very moment. Redesign your management style. Fix this mess.

Oh, and Google Maps is getting worse as well, as commenters on [Hacker News point out as well](https://news.ycombinator.com/item?id=21782101).

Anyway, another item from three years ago was **On Devices, Apple and Linux**... I don't think I want to get into that again. The whole mobile ecosystem has burned down. At least Apple was quick enough with "Arcade" to salvage what they could from the gaming subsphere. Okay move. Google has [this](https://www.theverge.com/2019/11/4/20948098/google-play-pass-rewards-program-points-us-apple-app-store-arcade). Worse move.

I also wrote:

> Also: good luck using your Linux laptop to give a presentation at some corp where they're using some FuYouDianNoa brand of projectors which only work in some kind of devil's 888x666 resolution.

That point still stands. systemd being another one, too. Wayland is still "in progress" as well. Also, Intel CPU issues post-Spectre and Meltdown (yes, already a thing in 2017) have simply continued, too. Foreshadow, [Zombieload](https://techcrunch.com/2019/05/14/zombieload-flaw-intel-processors/)... Have we collectively stood still?

> All these "smart" tablets, phones, fridges and whatnot need to update a bajillion apps if you don't use them for a few weeks and start to slow down after every OS update.

Let alone the fact that they're [sending screenshots of what you're watching](https://www.washingtonpost.com/technology/2019/09/18/you-watch-tv-your-tv-watches-back/)... to somewhere. As if we didn't expect that. Samsung is in [cahoots with Qihoo](https://android.gadgethacks.com/how-to/prevent-samsungs-shady-360-storage-cleaner-from-phoning-home-china-0225941/) -- just happened at the time of writing. 

I've briefly mentioned some points **on gaming** above already. Again, the situation hasn't gotten better. Well, at least EA and Microsoft have wised up and are coming back to Steam.

> If you do finally manage to get into a game, be prepared to cough up money for microtransactions, "cosmetic unlockables", "loot boxes", (edit: and now: "live services") and all those other gamblind-inspired horrids that have come straight from the seventh hell that is mobile gaming to infest the rest of the gaming world.

**Programming** has continued to get worse. The tyranny of Javascript continues. For everything else, it's Rust or invalid. Virtualize, containerize, package it up, but AWS in front of it, get your keys stolen by posting them on Github, make a type in a package name and get hacked. I'm not going to link to all this. I'm just going to [link to a tweet from Casey Muratori](https://twitter.com/cmuratori/status/1213202388598714368):

> As we come into 2020, I am now pretty sure I picked the wrong career. If I had known what computers were going to become, I probably wouldn't have wanted to be a programmer. It is definitely no longer a career for people who take pride in their work.

[Jonathan Blow](https://twitter.com/Jonathan_Blow) (who's been working on his own language and understands that computers are fast enough) has similar good points to peruse. [John Carmack](https://twitter.com/ID_AA_Carmack/status/1210997702152069120) also made a good point:

> My formative memory of Python was when the Quake Live team used it for the back end work, and we wound up having serious performance problems with a few million users. My bias is that a lot (not all!) of complex “scalable” systems can be done with a simple, single C++ server.

... and even he got flamed by Javascript/Rust/... fanboys.

By the way, this leads me to **AI**, since Carmack is working on that as well these days. Everyone is still AI crazy. Hadoop is gone, Spark is known. Kafka is still hot, but Tensorflow and PyTorch are bursting with energy. Forget about that simple model which is understandable and robust, just slap twenty layers on your small tabular data set and let it train for a week.

Tensorflow is a mess right now. Good luck finding your way between old and new tutorials as Google makes its transition to v2 of the API. As with all things Google, it's "don't use v1, its outdated and deprecated and boring, use v2, which is not ready yet".

A while ago I encountered a (published) paper where the authors first convert a structured instance to a row of pixels by freaking one-hot encoding everything (including numerical values) and feeding that to a 1d CNN. For god's sake, at least you could've used greyscales.

Meanwhile, [there's this](https://arxiv.org/pdf/1910.11015.pdf) (check out the Figure in that PDF).

I'm going to call it quits here and go hang out at [href.cool](https://href.cool/) and [Neocities](https://neocities.org/), or play a bit of the excellent and wacky [Hypnospace Outlaw](https://store.steampowered.com/app/844590/Hypnospace_Outlaw/).

I close by repeating my final points from three years back:

> What has happened with "computing" as of today? Perhaps -- most likely -- all of this is due to me getting older, more busier, less easily impressed, or simply a case of nostalgia goggles firmly stuck on my face, but I can't shake the feeling that computing today has lost a lot of its appeal, its "magic", if you will, compared to the days of old.
> I used to laugh (silently) at "dinosaurs" I'd meet telling me about how all of this new stuff already existed in the eighties. I still laugh (silently), as I can still gleem in the fact that I at least try to keep up to date with all these new developments whereas they have given up and perhaps just want to emphasize their relevancy, but I'm feeling increasingly more sour as I start to wonder towards where, exactly, we're trying to "evolve" to.

See you in three years from now.