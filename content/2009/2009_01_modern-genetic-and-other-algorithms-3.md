Title: Modern Genetic (And Other) Algorithms Explained: Part 3 - CHC Eshelman
Date: 2009-01-13
Author: Seppe "Macuyiko" vanden Broucke

(This is part 3 in the Modern Genetic Algorithms Explained series, click [here](|filename|2009_01_modern-genetic-and-other-algorithms-1.md) to go to the first post, or browse through all the parts with the Table Of Contents at the end of this post.)

In this part, we will look at a "special" genetic algorithm, CHC by Eshelman. The original paper is very hard to find, but it is mentioned in a lot of other works.

The pseudocode looks like this (thanks to the commenters for sorting some problems out):

    Create initial population: P
    L := length of an individual chromosome
    N := population size
    Threshold := MutProb * (1.0-MutProb) * L (or L/4 is also used)

    Evolution until time limit hit or satisfying solution found:
      CPop := {}
      For i := 1 to N/2 do:
        Choose two random parents: P1 and P2
        If (different bits between P1 an P2) / 2 > threshold do:
          Create children C1 and C2 using half-uniform crossover
          Add C1 and C2 to CPop

      If there are no children in Cpop:
        Threshold := threshold - 1
      Else:
        P := best N individuals from P and CPop

      If threshold < 0:
        Cataclysmic creation of new population P

There is another pseudocode description in the slides found [here](http://soar.snu.ac.kr/~yhdfly/presentation/MKCP.pps).

A few interesting remarks:
(1) N (population size) is almost always set to 50, but can range from 50 - 10000.
(2) The different bits between P1 and P2 can be defined as the hamming distance between them.
(3) Half uniform crossover swaps exactly half of the non-matching bits. However, often a uniform crossover is used, with a chance of 0.5 - 0.8 of swapping.
(4) MutProb is the mutation probability and originally set to 0.35 (35%).
(5) A "cataclysmic event" occurs when there are no children created for a certain period of time. New children can only be made between parents which are different enough. Basically this means: whenever the population converges towards a certain points, a cataclysm occurs.
(6) What this cataclysm will do depends on the actual implementation. Originally, and often, the following method is used: take the single best individual, and put it in the new population. Now, mutate each of its bits with a 35% chance, this will be the second individual. Repeat this to create a new population of size N. Sometimes, the mutation chance is set to a higher value.

My Python - again, based on the [code found here](http://lethain.com/entry/2009/jan/02/genetic-algorithms-cool-name-damn-simple/) \- implementation looks as follows (the original problem was unchanged):

    from random import randint, random
    from operator import add

    def individual(length, min, max):
      return [ randint(min,max) for x in xrange(length) ]

    def population(count, length, min, max):
      return [ individual(length, min, max) for x in xrange(count) ]

    def fitness(individual, target):
      sum = reduce(add, individual, 0)
      return abs(target-sum)

    def grade(pop, target):
      summed = reduce(add, (fitness(x, target) for x in pop))
      return summed / (len(pop) * 1.0)

    def hamming(ind1, ind2):
      nr_hamming = 0
      for x in range(0, len(ind1) - 1):
        if (ind1[x] != ind2[x]):
          nr_hamming += 1
      return nr_hamming

    def cataclysm(pop, target, min, max):
      #keep the best individual, flip 35% of bits to get new individuals
      pop.sort (lambda x, y : cmp (fitness(x, target), fitness(y, target)))
      firstind = pop[0]
      newpop = [firstind]
      for x in range(1, len(pop)):
        nextind = firstind[:]
        for i in range(0, len(nextind)):
          if 0.35 > random():
            nextind[i] = randint(min, max)
        newpop.append(nextind)
      return newpop

    def hux(ind1, ind2):
      child_one = []
      child_two = []
      hamming_dist = hamming(ind1, ind2);
      nr_swaps = 0
      for x in range(0, len(ind1)):
        if (ind1[x] == ind2[x]) or (random > 0.5) or (nr_swaps > hamming_dist / 2):
          #same, just copy to both
          child_one.append(ind1[x])
          child_two.append(ind2[x])
        else:
          #different, swap with .5 probability, until hamming/2 swaps
          nr_swaps += 1
          child_one.append(ind2[x])
          child_two.append(ind1[x])
      return [child_one,child_two]

    def evolve(pop, target, min, max, treshold):
      child_population = []
      for i in range(1, len(pop)/2):
        #choose two random parents:
        parent_one = pop[randint(0, len(pop)-1)]
        parent_two = pop[randint(0, len(pop)-1)]
        if (hamming(parent_one, parent_two)/2) > treshold[0]:
          #do hux crossover
          children = hux(parent_one, parent_two)
          child_population.append(children[0])
          child_population.append(children[1])
      if len(child_population) == 0:
        treshold[0]-=1;
        print "No children evolved"
      else:
        p_count = len(pop);
        print len(child_population),"children"
        for x in child_population:
          pop.append(x)
        pop.sort (lambda x, y : cmp (fitness(x, target), fitness(y, target)))
        #for x in pop:
        # if fitness(x,target) == 0:
        # print "Perfect individual found:",x
        pop = pop[:p_count]
        print len(pop),"new population, grade:", grade(pop, target)
      if treshold[0] < 0:
        pop = cataclysm(pop, target, min, max)
        print "Cataclysm, newpop length:",len(pop),"grade:",grade(pop,target)
        treshold[0] = len(pop[0]) / 4.0
        print "Treshold is now:",treshold[0]
      return pop`

This reminds me: I should really work on a css class for code (update: done), instead of writing everything in monospace. A few remarks:
(1) The implementation is a bit hacky. Python passes everything by reference, except immutable objects. I wanted to pass threshold by reference, which did not work, it being a float and such. That's why I've wrapped it in a list.
(2) I'll use L/4 as the threshold; and I still use a 35% mutate rate, although we are not using bit encoded individuals, though we could set this a bit higher if we wanted.
(3) We do crossover by randomly swapping different values with a 0.5 chance, until half of the values are swapped. Probability-wise, this is not the same as randomly picking half of the different bits. This doesn't matter that much for this example, though.

Let's test it:

    import sys
    sys.path.append("C:\Users\Me\Desktop")
    from chc_eshelman import *
    target = 300
    p_count = 50
    i_length = 6
    i_min = 0
    i_max = 100
    treshold = [i_length / 4.0]
    p = population(p_count, i_length, i_min, i_max)
    print "First grade: ",grade(p, target)
    for i in range(0,100):
      p=evolve(p, target, i_min, i_max, treshold)`

In the first run, it took two cataclysms to reach a completely perfect population (grade is the average score for the complete population, not for the best single individual, it might be possible to have a perfect individual in the first evolution, still, because this problem is so simple, we look at the complete population):

    First grade: 66.88
    48 children
    50 new population, grade: 30.34
    44 children
    50 new population, grade: 18.92
    48 children
    50 new population, grade: 10.64
    38 children
    50 new population, grade: 6.68
    40 children
    50 new population, grade: 4.74
    36 children
    50 new population, grade: 3.84
    12 children
    50 new population, grade: 3.48
    12 children
    50 new population, grade: 3.12
    6 children
    50 new population, grade: 3.0
    No children evolved
    No children evolved
    Cataclysm, newpop length: 50 grade: 48.24
    Treshold is now: 1.5
    46 children
    50 new population, grade: 17.36
    36 children
    50 new population, grade: 7.8
    32 children
    50 new population, grade: 4.1
    20 children
    50 new population, grade: 2.76
    14 children
    50 new population, grade: 2.44
    16 children
    50 new population, grade: 2.12
    22 children
    50 new population, grade: 1.68
    20 children
    50 new population, grade: 1.28
    18 children
    50 new population, grade: 1.0
    No children evolved
    No children evolved
    Cataclysm, newpop length: 50 grade: 48.86
    Treshold is now: 1.5
    40 children
    50 new population, grade: 21.04
    46 children
    50 new population, grade: 5.3
    36 children
    50 new population, grade: 1.56
    40 children
    50 new population, grade: 0.38
    32 children
    50 new population, grade: 0.0

Another run only takes four evolutions to reach a perfect population, with a beautiful convergence:

    First grade: 51.16
    46 children
    50 new population, grade: 24.26
    46 children
    50 new population, grade: 12.6
    34 children
    50 new population, grade: 5.78
    38 children
    50 new population, grade: 0.94
    34 children
    50 new population, grade: 0.0
    20 children
    50 new population, grade: 0.0`

Sometimes however, the algorithm gets stuck in a loop:

    ...
    18 children
    50 new population, grade: 1.0
    22 children
    50 new population, grade: 1.0
    24 children
    50 new population, grade: 1.0
    16 children
    50 new population, grade: 1.0
    26 children
    50 new population, grade: 1.0
    24 children
    50 new population, grade: 1.0
    24 children
    50 new population, grade: 1.0
    18 children
    50 new population, grade: 1.0
    18 children
    50 new population, grade: 1.0
    14 children
    50 new population, grade: 1.0
    16 children
    50 new population, grade: 1.0
    16 children
    50 new population, grade: 1.0`

This has something to do with the way the hamming distance is calculated. Sometimes, a pool of two different solutions will be made, but with more than one different values, thus this will always be above the hamming threshold, but will always create the same children, and the same resulting new population.

For example, the algorithm can get stuck in a pool with two types of parents:

    1: [83, 19, 67, 64, 23, 44], sum 300
    (the target was 300, so fitness: 300-300 = 0: perfect)

    2: [38, 28, 67, 64, 6, 97], sum 300`

Both are optimal (but the sum might also be both 299, or 299 and 301, etc)... Notice that the hamming distance between them is four, far above the threshold, thus the following children can be created:

    [38, 28, 67, 64, 23, 44], sum 264
    [38, 19, 67, 64, 6, 97], sum 291
    [83, 28, 67, 64, 6, 44], sum 292
    [83, 19, 67, 64, 6, 97], sum 336`

However, these children all perform worse and will never be considered for the new population, and this is how we get stuck in a loop.

If we'd used a bit-representation, or other workarounds, this would've worked better. For example use another check: if there is no change in the population members: do `threshold := threshold - 1`. Still, it's good enough to show the workings of the algorithm.

In conclusion, CHC performs very well with only a very limited population size, even in problems where local maxima are common.

If you want to download the source code used in this post, you can find it [here](http://www.macuyiko.com/files/ga/ga_chceshelman.zip).

-----

Table Of Contents (click a link to jump to that post)

1- [Introduction](|filename|2009_01_modern-genetic-and-other-algorithms-1.md)
2- [Genetic Algorithms](|filename|2009_01_modern-genetic-and-other-algorithms-2.md)
3- [CHC Eshelman](|filename|2009_01_modern-genetic-and-other-algorithms-3.md)
4- [Simulated Annealing](|filename|2009_01_modern-genetic-and-other-algorithms-4.md)
5- [Ant Colony Optimization](|filename|2009_01_modern-genetic-and-other-algorithms-5.md)
6- [Tabu Search](|filename|2009_01_modern-genetic-and-other-algorithms-6.md)
7- [Conclusion](|filename|2009_01_modern-genetic-and-other-algorithms-7.md)