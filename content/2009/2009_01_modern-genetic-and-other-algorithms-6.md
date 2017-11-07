Title: Modern Genetic (And Other) Algorithms Explained: Part 6 - Tabu Search
Date: 2009-01-29
Author: Seppe "Macuyiko" vanden Broucke

(This is part 6 in the Modern Genetic Algorithms Explained series, click [here](|filename|2009_01_modern-genetic-and-other-algorithms-1.md) to go to the first post, or browse through all the parts with the Table Of Contents at the end of this post.)

[Tabu search](http://en.wikipedia.org/wiki/Tabu_search) is not really "modern" anymore, but still widely used nonetheless.

The pseudocode looks like this:

	Construct an initial solution
	Until timelimit hit or satisfying solution found do:
	    Find all neighbours which are not in the tabu list, and calculate their score
	    Pick the best neighbour, add the previous solution to the tabu list`

Notice that the "best neighbour" must not necessarily be better than the current solution, or than the ever best found solution.

Maintaining a tabu list can be time and memory consuming, alternatively we could construct a list like this: add the difference between two following solutions to the list (so that they cannot be undone), and keep it in the list for n iterations. N, or the length of the list is important: make it too long and the algorithm might get stuck, make it too short and the algorithm will tend towards local maxima.

This time, I've coded the example in PHP, I hope nobody minds:

	<?php
	$target = 300;

	//construct an initial solution
	$tabulist = array('ttl' => array(), 'change' => array());
	$solution = array();

	$min = 0;
	$max = 100;
	for ($i=0;$i<6;$i++)
	    $solution[] = rand($min,$max);

	//until solution found
	while (true){
	    $best_neighbour_solution = false;
	    $best_neighbour_score = 1000;
	    $best_neighbour_tabu = false;
	    for ($position=0;$position<6;$position++){
	        if (!in_array("$position+",$tabulist['change'])
	                and $solution[$position] < $max){
	            $temp_solution = $solution;
	            $temp_solution[$position]++;
	            $score = fitness($temp_solution,$target);
	            if ($score < $best_neighbour_score){
	                $best_neighbour_score = $score;
	                $best_neighbour_solution = $temp_solution;
	                //make sure this step doesn't get undone
	                $best_neighbour_tabu = "$position-";
	            }
	        }
	        if(!in_array("$position-",$tabulist['change'])
	                and $solution[$position] > $min){
	            $temp_solution = $solution;
	            $temp_solution[$position]--;
	            $score = fitness($temp_solution,$target);
	            if ($score < $best_neighbour_score){
	                $best_neighbour_score = $score;
	                $best_neighbour_solution = $temp_solution;
	                //make sure this step doesn't get undone
	                $best_neighbour_tabu = "$position+";
	            }
	        }
	    }
	    //pick the best neighbour
	    $solution = $best_neighbour_solution;
	    $fitness = fitness($solution,$target);
	    echo "Iteration $iterations: fitness = $fitness\n";
	    if ($fitness == 0){
	        echo "Perfect solution found:\n";
	        print_r($solution);
	        die;
	    }
	    //add change to tabu list
	    $tabulist['ttl'][$iterations] = 5; //remember for 5 iteration
	    $tabulist['change'][$iterations] = $best_neighbour_tabu;
	    //update the tabulist
	    foreach ($tabulist['ttl'] as $key => &$val){
	        $val--;
	        if ($val <= 0){
	            unset($tabulist['ttl'][$key]);
	            unset($tabulist['change'][$key]);
	        }
	    }
	    echo "Iteration $iterations: tabulist now contains "
	        .count($tabulist['ttl'])." items \n";
	    $iterations++;
	}

	function fitness($array, $target){
	    return abs(array_sum($array)-$target);
	}

The neighbour calculation could be done a little better (there's a bit of ugly duplicate code), but the following output is given:

	Iteration : fitness = 57
	Iteration : tabulist now contains 1 items
	Iteration 1: fitness = 56
	Iteration 1: tabulist now contains 2 items
	Iteration 2: fitness = 55
	Iteration 2: tabulist now contains 3 items
	Iteration 3: fitness = 54
	Iteration 3: tabulist now contains 4 items
	Iteration 4: fitness = 53
	Iteration 4: tabulist now contains 4 items
	Iteration 5: fitness = 52
	Iteration 5: tabulist now contains 4 items
	...
	Iteration 55: tabulist now contains 4 items
	Iteration 56: fitness = 1
	Iteration 56: tabulist now contains 4 items
	Iteration 57: fitness = 0
	Perfect solution found:
	Array
	(
	    [0] => 66
	    [1] => 14
	    [2] => 20
	    [3] => 99
	    [4] => 14
	    [5] => 87
	)

With this sample problem, such an output was, of course, expected. Notice that I've used the second method of keeping a tabulist.

This post concludes this series, we only have one post to go, with a general conclusion.


-----

Table Of Contents (click a link to jump to that post)

1. [Introduction](|filename|2009_01_modern-genetic-and-other-algorithms-1.md)
2. [Genetic Algorithms](|filename|2009_01_modern-genetic-and-other-algorithms-2.md)
3. [CHC Eshelman](|filename|2009_01_modern-genetic-and-other-algorithms-3.md)
4. [Simulated Annealing](|filename|2009_01_modern-genetic-and-other-algorithms-4.md)
5. [Ant Colony Optimization](|filename|2009_01_modern-genetic-and-other-algorithms-5.md)
6. [Tabu Search](|filename|2009_01_modern-genetic-and-other-algorithms-6.md)
7. [Conclusion](|filename|2009_01_modern-genetic-and-other-algorithms-7.md)
