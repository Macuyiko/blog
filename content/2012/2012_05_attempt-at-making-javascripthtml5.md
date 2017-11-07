Title: An Attempt At Making A Javascript/HTML5 SliceIt! Clone, And A (Failed) Attempt At A Genetic Algorithm Based Solver
Date: 2012-05-13
Author: Seppe "Macuyiko" vanden Broucke

One of the niceties of owning a smartphone is the huge amount of apps available for download, many of which games.

Some time ago, one of these games which was keeping me occupied was [SliceIt!](https://play.google.com/store/apps/details?id=com.com2us.sliceit&hl=en) from Com2uS. Don't worry if you don't know the game or haven't played it, I'll quickly explain it below.

###  The Game

SliceIt! is presented in a cute crayon-looking style:

![](http://2.bp.blogspot.com/-zSqnCJJ-sfM/T653to_HcCI/AAAAAAAAUio/k_KAzrHU430/s1600/sliceit01.png)

A typical SliceIt! level. Players draw lines (as shown here) to split a given shape into equally sized areas.

The goal of the game is to draw a number of lines to divide ("slice") the given area into a number of pieces. Both the number of lines and required pieces are fixed and given beforehand. You have to use all the strokes given, and have to match exactly the number of needed pieces. No more, no less. The final requirement of the game is that the resulting pieces need to have about the same area. While their form may differ, their area (size) has to match. This means for example that if the goal is to get four pieces, all these four pieces need to have a size around 25% (100%/4) of the original area. Pieces don't have to be of exactly the same size. If their areas differ slightly, the level is still won. This allows for levels which have straightforward but not-quite-perfect solutions and perfect but hard-to-find solutions as well.

###  The Idea

So far, so good. After playing the game for a while, I encountered the following level:

![](http://1.bp.blogspot.com/-4NkoKGfPQeM/T66FDAhSHYI/AAAAAAAAUi4/TonZ8ZOOD0A/s200/sliceit02.png)

Another SliceIt level (goal: 5 strokes, 10 areas),

This level introduces another gameplay concept: blocked areas. Drawing lines which crosses these areas is forbidden, so this solution won't work:

![](http://1.bp.blogspot.com/-HIIFUpg4wEk/T66FFMoOdVI/AAAAAAAAUjE/0GXX28R_7Ww/s200/sliceit03.png)

This solution would use 5 lines to form 10 equal areas, but the red areas forbids the player to draw the final line.

After fiddling for a bit, we find the following acceptable solution:

![A solution](http://4.bp.blogspot.com/-4-j4IJOIRH4/T66FCYBdrMI/AAAAAAAAUi0/tiyCrSrAnBk/s200/sliceit04.png)

While messing around with this, a thought popped into my head: could a genetic algorithm be used to solve a SliceIt! puzzle? At first sight, this seems like a good idea. The game itself is pretty easy. A chromosome representation can easily be established (since we know the list of strokes beforehand, so a population member can be represented simply as an array of coordinate-pairs:

    [
       ((l1x1,l1y1), (l1x2,l1y2)),
       ((l2x1,l2y1), (l2x2,l2y2)),
       ((l3x1,l3y1), (l3x2,l3y2)),
       ((l4x1,l4y1), (l4x2,l4y2)),
       ((l5x1,l5y1), (l5x2,l5y2))
    ]

And finally, the solutions can be easily checked (just compare areas with a known goal).

And so I set out to test this theory as a weekend project.

While lines, areas, points and polygons can all be expressed and compared mathematically, I wanted to create a graphical representation of the game as well. Moreover, I wanted to build a playable version, before implementing a genetic algorithm. Finally, I wanted to do this with HTML5 (canvas) and Javascript, as I've been pretty jealous of all these other cool genetic algorithm implementations available on the web:

- Shortest path:  <http://tomokas.com/apps/pathfinding-using-a-genetic-algorithm-html5-canvas-javascript>
- Eater's world:  <http://math.hws.edu/eck/jsdemo/ga-info.html>, demo at  <http://math.hws.edu/eck/jsdemo/jsGeneticAlgorithm.html>
- Genetic hello world:  <http://www.puremango.co.uk/2010/12/genetic-algorithm-for-hello-world/>
- Function optimization:  <http://icefox.github.com/javascript_genetic_algorithm/>
- Javascript Mona Lisa:  <http://blog.nihilogic.dk/2009/01/genetic-mona-lisa.html>

I didn't want go completely overboard, though. I only wanted to implement to most basic puzzles found in the game, as described above. Later levels add all sorts of crazy stuff (like bouncy edges and so on). Still, the game allows for some constructs which are pretty challenging:

1. Levels are created by defining a number of polygons. A level can be build out of multiple shapes.
2. These polygons can both be convex and concave.
3. The polygons can contain holes as well (not sure if there are levels like this in the game).
4. Polygons can be added to a level which denote "forbidden areas", though which no lines may be drawn.

Feature number three is the most challenging one. To solve this, you have to first create a polygon defining the outermost shape, and then additional polygons to define the holes. The area of the obtained shape is then calculated by subtracting the areas of all holes from the areas of all the outer shapes. While I was planning to implement this add first, I dropped it, mainly out of laziness, and because much of the logic in the game would've become quite harder when this aspect would be included.

###  The Implementation

The code turned out the be pretty complex. I created multiple Javascript object types, either handling game logic, or representing geometrical concepts. This means that types were made for:

- A point: constructed out of two numbers (x and y coordinates).
- A line: constructed out of two points (point one and two).
- A polygon: constructed out of an array of lines (the edges).
- A rectangle: constructed out of two points (upper left and lower right corner).

The rectangle type should actually have been based upon the polygon type (a rectangle is just a special type of polygon). Similarly, in hindsight, the polygon object should have been defined as an array of points, instead of lines. For lines, methods to get the length and intersects with other lines were added. For polygons and rectangles, methods to get the area of the shape were added as well. I had to refresh my memory on geometry a bit:

- For intersects:  <http://local.wasp.uwa.edu.au/~pbourke/geometry/lineline2d/>.
- For area (and centroid):  <http://en.wikipedia.org/wiki/Polygon#Area_and_centroid>, I used the shoelace/surveyor method (<http://en.wikipedia.org/wiki/Shoelace_formula>).

For the game logic, I created the following types:

- The surface: attached to a canvas element. Handles Javascript events (mouseup, mousemove...).
- The drawer: contains methods to draw various things using a surface. These contain methods for drawing the level, the forbidden rectangles, and a cutting line when a player drags the mouse.
- The level: contains level data, such as the number of allowed strokes and required pieces. The definition of the polygons making up the level, and the list of rectangles defining the forbidden areas.

The level object type also contains some methods for handling the harder game logic. E.g., methods which take a line, and figure out how the current list of level polygons should be cut.

The way levels are cut after drawing a line works like this. First, compare the drawn line with all the edges defined by all the polygons to get a list of intersects. Then, some basic checking is performed to figure out if the line is valid. Finally, if the line is valid, polygons are split up, and a list of new polygons is created.

An example can help here. The following figure shows how a line "splits" a single convex polygon:

![](http://4.bp.blogspot.com/-T4VnRr2ZgFI/T6_TxhMpVTI/AAAAAAAAUlA/Q93xwFLfMTs/s1600/sliceit10.png)

When a new line is drawn, the procedure is repeated for each polygon "crossed":

![](http://4.bp.blogspot.com/-RcAuGVhNBCs/T6_TyGTt56I/AAAAAAAAUlE/Zjcr5qgPjTM/s1600/sliceit11.png)

The basic check mentioned above to see if a line is valid is thus implemented in a very simple manner: check if the number of intersect points is even. For convex polygons, this is all we have to do, since each line drawn through a convex polygon will always create two other convex polygons. When dealing with concave polygons, things can get a bit harder:

![](http://1.bp.blogspot.com/-0GHO9lZPMZw/T6_Tyv_6t5I/AAAAAAAAUlQ/y38LhQLu_9w/s1600/sliceit12.png)

To solve this problem, we should either adapt our method in order to "clip" the drawn line with the given polygon. Instead of doing so, I opted to work with convex levels only.

As a side note, you might be tempted to think that the following adaptation of the "line validity" check could work as well, i.e.: find the intersect points, and check if -- for each polygon p containing an intersect point -- that p has two intersect points (one entry and one exit). This prevents the line in the example above from being drawn (there are four intersects for the single given polygon). This also restricts the number of possibilities to splice a polygon with a given stroke (which might be the desired behavior). Still, it should be noted that this doesn't work either, since it can't be guaranteed that the two intersect indeed "enter" and "exit" the polygon in the right order:

![](http://3.bp.blogspot.com/-R-2g_AKmU7E/T6_bOb2P_tI/AAAAAAAAUlg/7QzJIhU5I6A/s1600/sliceit13.png)

So convex-only levels for now. If someone wants to hack in support for complex polygons (concave and/or holes): links to the code will be posted at the end.

The last thing which was added were methods to check if a level is solved correctly.To avoid that the player has to have ultra-precise eye-hand coordination, very small polygons (e.g. less than one percent of the original area of the level) created by drawn lines are disregarded when checking the areas and number of goal areas. Now that the game was playable, I converted the level which was giving me difficulties to coordinates, and started working on the genetic algorithm.

###  The Genetic Algorithm

To implement the  [genetic algorithm](http://blog.macuyiko.com/2009/01/modern-genetic-and-other-algorithms_06.html), I used the "Mona Lisa"-painting genetic algorithm by [Nihilogic](http://www.nihilogic.dk/labs/evolving-images/) as a starting point. This algorithm implements a simple tournament-based genetic algorithm. As said earlier, each population member can be represented as a fixed size array of points denoting the position of the lines.

Crossover is easy as well, as we can just take one half of the array defined by parent number one, and combine it with the second half of the array defined by parent number two. I say "half", but it's not necessary to split the two arrays neatly in half; the crossover point can be randomly chosen.

Mutation works similarly. When the decision is made to mutate a member of the population, each point is randomly moved to a new position.

###  The Result

The algorithm and Canvas/JS implementation of SliceIt! can be tested [here](http://static.macuyiko.com/files/sliceit/). If you run the genetic algorithm (click "Evolve"), you'll notice that, although sometimes a valid solution is found, the algorithm has a tendency to get stuck in a local optimum (e.g. where only four of the required five lines are drawn). The reason for this is something we haven't yet talked about: the fitness function.

As with many applications of evolutionary computing, the definition of fitness function is certainly a hard task in this case. The main issue is that three variables have to be incorporated when evaluating a solution:

- The sizes of the areas created.
- The number of areas created.
- The number of valid lines drawn.

The first point is quite simple, just compute sum of the the (squared) differences between each area and the optimal target area. For example, if a level has an area size of 1000, and 10 areas have to be created, then we compute the fitness as:

![](http://2.bp.blogspot.com/-A0BUx4SGLaw/T7ADk0HqSyI/AAAAAAAAUl4/DuJVUPV_-NE/s1600/slice21.png)

Using this function alone, however, often leads to the algorithm getting stuck in local optima. Therefore, we need to punish for missing lines/areas as well. The problem is finding a function which drives the algorithm towards adding/moving a line when it is invalid, while still remaining able to "escape" local optima by making a line or the number of areas temporarily invalid.

I've tried different fitness functions, but none of them seem to be particularly efficient (feel free to modify the code in "Candidate.prototype.calcFitness", I've left the code uncompressed).

###  The Retry (Using the Watchmaker library)

As an extra exercise, I rewrote a [very basic version of the algorithm using Java](https://github.com/Macuyiko/sliceit-genetic-java). To implement the genetic algorithm, I opted to give the excellent, thorough [Watchmaker library](http://watchmaker.uncommons.org/) a go.

Just for fun, I recorded a timelapse of some of my coding:

<iframe allowfullscreen="" frameborder="0" height="315" src="http://www.youtube.com/embed/t39UaG9JZlg" width="560"></iframe>

This version works a bit better, mainly since there are no "forbidden areas" and the mutation operators are a bit more fine-tuned. See the suggestions below for more ideas if you want to try this experiment yourself.

###  Conclusions and Suggestions

Despite fact that the result works less perfect than expected, this still was a fun weekend-project. This project was a good exercise emphasizing the importance of a good fitness function when dealing with genetic algorithms.

Working with Javascript and Canvas in this manner was also quite new for me. While I've had plenty of experience applying Javascript in a normal web/DOM context, dealing with geometry is something else entirely. Writing object oriented code in Javascript as done here was also something which required some getting used to. In hindsight, the code could have been made a lot cleaner.

Programming a project like this one is somewhat easier in Java. The Watchmaker library especially seems like an amazingly engineered piece of software; I'll certainly revisit it later.

People who want to try this project for themselves or who want to extend my code are certainly free to do so. (The Javascript version can be found  [here](http://static.macuyiko.com/files/sliceit/) \-- just view the source of the web page. The Java version is on [github](https://github.com/Macuyiko/sliceit-genetic-java).) Some suggestions:

- Try implementing complex polygons (i.e. concave polygons or polygons with holes in a robust manner). This is something I'd like to come back to later, as the current implementation bugs me.
- For the _initial construction_ of the population in the genetic algorithm, several techniques can be used. The one I use here just randomly draws lines, with no regard if they're valid of not. An alternative technique could opt to only start from valid lines (by requiring that lines stay outside the given starting shapes, for example).
- For the _mutation operators_, I just move the points of lines to new random locations. The Java version is a bit smarter and moves points slightly to a neighboring position. Additionally, another "mutator" (with a lower mutation chance) is added which completely creates a new solution. Try making the algorithm "smarter" in this manner.
- The current version has no regard for symmetry, while human players will often prefer symmetric solutions. Try to find a way to determine and score this aspect.
- Finally, try coming up with better-performing fitness functions. Just using the squared sum of differences might work, provided you leave enough freedom to search for non-local solutions (e.g. high population size, enough chance for mutations). The way crossover (offspring generation) is performed doesn't seem to matter much, given the simple solution structure.
- Changing the population members' format could work as well, e.g. allow members to contain more lines than the goal number (n) given, but only evaluate the first valid n lines. This allows members to "carry" with them some genetic variety for more generations.

The links, once more:

- **Javascript version:** <http://static.macuyiko.com/files/sliceit/>
- **Java source:** <https://github.com/Macuyiko/sliceit-genetic-java>
- **Java binary (jar):** <https://github.com/Macuyiko/sliceit-genetic-java/blob/master/deploy/rungeneticsliceit.jar?raw=true>

