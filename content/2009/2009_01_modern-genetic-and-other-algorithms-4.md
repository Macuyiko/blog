Title: Modern Genetic (And Other) Algorithms Explained: Part 4 - Simulated Annealing
Date: 2009-01-19
Author: Seppe "Macuyiko" vanden Broucke

(This is part 4 in the Modern Genetic Algorithms Explained series, click [here](|filename|2009_01_modern-genetic-and-other-algorithms-1.md) to go to the first post, or browse through all the parts with the Table Of Contents at the end of this post.)

First of all: Simulated Annealing is not a genetic algorithm, but it is a modern optimization technique.

[Wikipedia](http://en.wikipedia.org/wiki/Simulated_Annealing) tells us the following:

> Simulated annealing (SA) is a generic probabilistic meta-algorithm for the global optimization problem, namely locating a good approximation to the global minimum of a given function in a large search space. It is often used when the search space is discrete (e.g., all tours that visit a given set of cities). For certain problems, simulated annealing may be more effective than exhaustive enumeration -- provided that the goal is merely to find an acceptably good solution in a fixed amount of time, rather than the best possible solution.
> The name and inspiration come from annealing in metallurgy, a technique involving heating and controlled cooling of a material to increase the size of its crystals and reduce their defects. The heat causes the atoms to become unstuck from their initial positions (a local minimum of the internal energy) and wander randomly through states of higher energy; the slow cooling gives them more chances of finding configurations with lower internal energy than the initial one.

Let's take a look at some pseudocode:

	Randomly construct a valid solution
	For each temperature do:
	  For number of trials to do at each temperature do:
	    Move solution to a neighbour
	    Accept neighbour with probability(old_score, new_score, temperature)
	    Lower the temperature by a reduction factor

It becomes clear that this method can be used in discrete optimization problems only, so that we can construct neighbours from our current state. E.g., a first solution in the problem we've been discussing might be [10,51,5,18] with a neighbour [10,52,5,18].

Also, a probability function needs to be defined. Some functions are constructed so that better solutions will always be accepted. Ideally, we would always like to assign a certain probability, so that worse solutions have a chance of being accepted too (or better ones have a chance at rejection). Again: this is to avoid local maxima (comparable with GA's).

Often, the new solution is accepted with an exponential distribution: `exp( (new_score-old_score)/temperature )`.

Note: the pseudocode at the Wikipedia page doesn't use trials, for some problems, this is good enough.

Let's see some Python code (again, based on the code mentioned in the previous posts):

	from random import randint, random
	from operator import add
	from math import *

	def individual(length, min, max):
	  'Create a member of the population.'
	  return [ randint(min,max) for x in xrange(length) ]

	def fitness(individual, target):
	  """
	  Determine the fitness of an individual. Higher is better.
	  individual: the individual to evaluate
	  target: the target number individuals are aiming for
	  """
	  sum = reduce(add, individual, 0)
	  return abs(target-sum)

	def probability(o_fitness, n_fitness, temperature):
	  if n_fitness < o_fitness:
	    return 1
	  return exp( (n_fitness-o_fitness) / temperature)

	def temperature(step, max_steps):
	  return max_steps - step

	def neighbour(ind, min, max):
	  pos_to_mutate = randint(0, len(ind)-1)

	  if random() < 0.5:
	    ind[pos_to_mutate] -= 1
	  else:
	    ind[pos_to_mutate] += 1

	  if ind[pos_to_mutate] < min:
	    ind[pos_to_mutate] = min
	  elif ind[pos_to_mutate] > max:
	    ind[pos_to_mutate] = max

	  return ind

	def evolve(ind, nr_trials, step, max_steps, min, max, target):
	  best_fit = 10000;
	  for i in range(1,nr_trials):
	    n_ind = neighbour(ind, min, max)
	    o_fitness = fitness(ind,target)
	    n_fitness = fitness(n_ind,target)

	  if n_fitness < best_fit:
	    best_fit = n_fitness

	  #move to new state?
	  if probability(o_fitness, n_fitness, temperature(step,max_steps)) >= random():
	    ind = n_ind
	    print "Best fitness this evolution:",best_fit
	    print "Temperature this evolution:",temperature(step,max_steps)

	  return ind`

If the fitness of the neighbour is better (remember: that means lower), we immediately accept it. We don't really need a chance of rejection for this problem. Otherwise, we use `exp( (n_fitness-o_fitness) / temperature)`.

We use a separate function to calculate the temperature for each step. This function is kept fairly simple `(max steps - this step)`, but non-linear temperature can also be implemented.

Let's try it, our starting temperature becomes 100, using 1000 trials per temperature:

	import sys
	sys.path.append("C:\Users\Me\Desktop")
	from annealing import *
	target = 300
	i_length = 6
	i_min = 0
	i_max = 100
	i = individual(i_length, i_min, i_max)
	print fitness(i, target)
	i_k = 0
	i_kmax = 100
	i_trials = 1000
	while i_k < i_kmax:
	  i = evolve(i, i_trials, i_k, i_kmax, i_min, i_max, target)
	  i_k += 1

The output:

	Best fitness this evolution: 34
	Temperature this evolution: 100
	Best fitness this evolution: 7
	Temperature this evolution: 99
	Best fitness this evolution: 0
	Temperature this evolution: 98
	Best fitness this evolution: 44
	Temperature this evolution: 97
	Best fitness this evolution: 43
	Temperature this evolution: 96
	Best fitness this evolution: 33
	Temperature this evolution: 95
	Best fitness this evolution: 39
	Temperature this evolution: 94
	Best fitness this evolution: 44
	Temperature this evolution: 93
	Best fitness this evolution: 34
	Temperature this evolution: 92
	Best fitness this evolution: 36
	Temperature this evolution: 91
	Best fitness this evolution: 50
	Temperature this evolution: 90
	Best fitness this evolution: 68
	Temperature this evolution: 89
	Best fitness this evolution: 67
	Temperature this evolution: 88
	Best fitness this evolution: 53
	Temperature this evolution: 87
	Best fitness this evolution: 49
	Temperature this evolution: 86
	Best fitness this evolution: 35
	Temperature this evolution: 85
	Best fitness this evolution: 55
	Temperature this evolution: 84
	Best fitness this evolution: 5
	Temperature this evolution: 83
	Best fitness this evolution: 0

Simulated annealing is easy to program and implement. Provided it is easy to construct neighbours, and a sensible combination of temperature and probability functions can be constructed, and the number of trials is well defined. Still: this method might be too naive to solve more difficult problems.

The source code can be downloaded [here](http://www.macuyiko.com/files/ga/ga_annealing.zip).

An interesting implementation is [this](http://alteredqualia.com/visualization/evolve/). It is based on another genetic programming experiment located [here](http://rogeralsing.com/2008/12/07/genetic-programming-evolution-of-mona-lisa/) (both are very interesting and fun examples, I highly recommend reading them).

Another Java applet to look at: solving a [travelling salesman problem with simulated annealing](http://www.heatonresearch.com/articles/64/page1.html).

-----

Table Of Contents (click a link to jump to that post)

1. [Introduction](|filename|2009_01_modern-genetic-and-other-algorithms-1.md)
2. [Genetic Algorithms](|filename|2009_01_modern-genetic-and-other-algorithms-2.md)
3. [CHC Eshelman](|filename|2009_01_modern-genetic-and-other-algorithms-3.md)
4. [Simulated Annealing](|filename|2009_01_modern-genetic-and-other-algorithms-4.md)
5. [Ant Colony Optimization](|filename|2009_01_modern-genetic-and-other-algorithms-5.md)
6. [Tabu Search](|filename|2009_01_modern-genetic-and-other-algorithms-6.md)
7. [Conclusion](|filename|2009_01_modern-genetic-and-other-algorithms-7.md)
