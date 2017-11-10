Title: Modern Genetic (And Other) Algorithms Explained: Part 1 - Introduction
Date: 2009-01-07
Author: Seppe "Macuyiko" vanden Broucke

A few days ago I saw [this on reddit](http://www.reddit.com/r/programming/comments/7n1zl/genetic_algorithms_cool_name_amp_damn_simple_best/), linking to a [well-written article](http://lethain.com/entry/2009/jan/02/genetic-algorithms-cool-name-damn-simple/) about genetic algorithms (GA):

> Genetic algorithms are a mysterious sounding technique in mysterious sounding field--artificial intelligence. This is the problem with naming things appropriately. When the field was labeled artificial intelligence, it meant using mathematics to artificially create the semblance of intelligence, but self-engrandizing researchers and Isaac Asimov redefined it as robots.
> The name genetic algorithms does sound complex and has a faintly magical ring to it, but it turns out that they are one of the simplest and most-intuitive concepts you'll encounter in A.I.
> If you're interested in GA's or modern optimization techniques in general, I strongly suggest you read it. The sample code in Python is fairly easy to read, even if you've never programmed in Python. On the reddit comment section, the following discussion was then started:
> The nice thing about GAs is that they are so simple. [...] As soon as you step out of the specialized GA literature and into other fields where the authors just happen to choose a GA for their problem, it's more likely than not that they've chosen a poor implementation.
> The problems that simple GAs work pretty well on tend to be the same as those that a simple hill climber would demolish the GA on. As soon as the problems get hard, the GA converges way too quickly to suboptimal solutions. [...]
> Part of the problem is the GA community itself. For years, GAs were touted as "global optimizers". We haven't talked like that for several years now, but I still see references to people who seem to think that solving a problem is as simple as just throwing a GA at it.

Followed by a response:

> Back in the look-ma-no-hands-period of AI, GAs converged too rapidly because they weren't tuned right: they used too much selection, too little mutation or other exploration mechanisms, too small of a population, etc. Since the field was unified with other evolutionary computation techniques in the early '90s, I don't think premature convergence has been a major impediment for almost 20 years now. Evolutionary computation techniques are pretty much the best available methods for much of stochastic search (and yes, I'm looking at you, simulated annealing). They're highly parallelizable, have good theory, and are representation-independent. Recent versions of them (notably ant colony optimization) are the gold standard for certain major tasks (like stochastic combinatorics problems).
> As to tabu search: now there is a technique which has some real pathologies. Perhaps this wasn't the best example you could have chosen.

Interesting... I recommend reading the full discussion at the reddit page.

Since I've always been interested in genetic and other modern optimization techniques, I wanted to a little research. In this series of posts, I will try to explain:

  - Genetic Algorithms
  - A more specialized GA: CHC. Eshelman's algorithms, as mentioned in the reddit comments.
  - Simulated Annealing
  - Ant Colony Optimization
  - And: a comparison with Tabu search

I will mention pseudocode in each of the posts, and will also edit the original Python to use it with the other techniques.

First a disclaimer though: I'm not an expert, I'm not a specialized GA-programmer, neither a mathematician. Also: I'm fairly new at Python, but I thought this would be a good opportunity to toy around with some code, so please excuse my possibly poor programming. Still, that being said, I try my best to provide valid information and real results.

In [part 2](|filename|2009_01_modern-genetic-and-other-algorithms-2.md) I will discuss (general) Genetic Algorithms.

-----

Table Of Contents (click a link to jump to that post)

1- [Introduction](|filename|2009_01_modern-genetic-and-other-algorithms-1.md)
2- [Genetic Algorithms](|filename|2009_01_modern-genetic-and-other-algorithms-2.md)
3- [CHC Eshelman](|filename|2009_01_modern-genetic-and-other-algorithms-3.md)
4- [Simulated Annealing](|filename|2009_01_modern-genetic-and-other-algorithms-4.md)
5- [Ant Colony Optimization](|filename|2009_01_modern-genetic-and-other-algorithms-5.md)
6- [Tabu Search](|filename|2009_01_modern-genetic-and-other-algorithms-6.md)
7- [Conclusion](|filename|2009_01_modern-genetic-and-other-algorithms-7.md)
