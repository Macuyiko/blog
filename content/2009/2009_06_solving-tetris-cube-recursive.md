Title: Solving A Tetris Cube, Recursive Backtracking, Algorithm X, Oh My!
Date: 2009-06-23
Author: Seppe "Macuyiko" vanden Broucke

A few days ago I got my hands on one of these:

![](http://4.bp.blogspot.com/_X4W-h82Vgjw/SsWhepcG4cI/AAAAAAAAPPw/Q4bKUWnAUL4/s200/41j38E8H-5L._SL500_AA280_.jpg)

A Tetris Cube. Twelve pieces, and a box of 4 by 4 by 4. Your task: to put the pieces neatly in the box again. The box said there are more than 9000 solutions, but I knew nonetheless this wasn't going to be an easy task. I was going to solve it, "Without cheating!", I proclaimed proudly.

An hour or so later these little blocks were completely driving me crazy. Usually I'm not that bad with these kinds of puzzles, but this thing certainly proved to be very difficult. I decided to call it a day and would try again later.

The next day I tried again, I was making a little progress, but every time I came close a little piece stuck out _just a tiny little bit_! This was going nowhere. If I were to beat this devil's contraption, I would need to resort to other means.

"I'll just throw together a recursive function real quick, that should be easy enough, right? (And no, that is _not_ cheating...)" How I came to regret those words. In my experience, this:

> I'll just quickly find a solution with recursive backtracking.

Almost always turns into this:

> Damn, damn, damn! Why is it so slow? How can I speed this thing up?

But first things first. There are a few ways you could solve this, but first, let's take a slight detour to explain backtracking (you may skip this if you already know all this, but if you _do_ know all this, then you probably know the solution to the puzzle as well, or would handle things better than I did):

**Detour: Recursive backtracking in general**

Let's see what a recursive backtracking function generally looks like:

    recursive_funtion(level) {
      for all possible ways for something {
        try it
        if solution valid {
          if solution complete {
            done, show solution
          }else{
            recursive_function(next_level)
          }
        }
        (revert this try)
      }
    }

As you can see, this method consists of a level, which we traverse in each recursive call, and a set of local decisions we make at each level. Take a magic square, for example (image from the [Wikipedia](http://en.wikipedia.org/wiki/Magic_square) page):

![](http://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Magicsquareexample.svg/180px-Magicsquareexample.svg.png)

With the above method, we would define our level as the position in the grid (ranging from 1 to 9, as there are 9 spaces to fill with a number), the decisions at each level would be a number ranging from 1 to 9, our function would be:

    recursive_funtion(position) {
      for number from 1 to 9, not used elsewhere already {
        put this number on this position, make it unavailable
        if solution valid {
          if solution complete {
            done, show solution
          }else{
            recursive_function(next_position)
          }
        }
        (make this space blank again, and the number available)
      }
    }

A few remarks:

(1) As each number can only be used once in the whole square, we must keep an array or set somewhere to keep track of the numbers used, which can be easily done in each programming language.
(2) Note that we can check mid-solution, we must not wait until we are at position 9 (the last position) to check if the solution is valid. In fact, we can speed things up a bit by implementing a bit of optimization. For example: after each row is done (at positions 3, 6 and 9), check if this row sums to 15, if it does not, there is no sense continuing towards deeper levels in our tree.

Speaking of trees, I hope you see how the combination of levels and decisions correspond to a tree. If you do not: here is a picture:

![](http://4.bp.blogspot.com/_X4W-h82Vgjw/Sj_kNqo4oBI/AAAAAAAAPKk/gfiRKCnrFYc/s400/illustration_base.jpg)

(Not all levels, lines and branches are shown, but it should give you a pretty clear idea.) Note that, if we picked e.g. the number 2 for position (level) 1, we cannot use it in the following levels, as shown in the tree.

Now let's see how the function will work, we start at the first level, with the first number:

![](http://4.bp.blogspot.com/_X4W-h82Vgjw/Sj_lIbDRx0I/AAAAAAAAPK0/eHGcTB3-QLY/s400/tree2.png)

This is a valid choice, so we can step down to the next level. In level 2, our first number we can pick is 2:

![](http://4.bp.blogspot.com/_X4W-h82Vgjw/Sj_lKowgRsI/AAAAAAAAPK8/vuIcYsQqK0I/s400/tree3.png)

This is a valid choice, so we can step down to the next level. In level 3, we can pick 3, let's see what happens:

![](http://4.bp.blogspot.com/_X4W-h82Vgjw/Sj_lMWhNHiI/AAAAAAAAPLE/nA_oX-8fKhk/s400/tree4.png)

Since we now have a complete row, we can check if the sum 1+2+3=15. Is isn't, so it makes no sense to continue at this point. Look at the huge part of the tree we can "cut off", as shown by the red curved line.

We're still in level 3, we try the following number: 4. 1+2+4=7, which isn't 15. We can cut away this part as well. Number 5 gives 8, 6 gives 9, and so on until number 9 gives 1+2+9=12, all the branches have been cut. Note that we can make an important observation here: your optimizations should try to cut away from the tree as early as possible, that way, the solution space in which we have to search can be decreased dramatically. (This is also the reason why the hardest choices or levels are often put first in these trees.)

Now the algorithm "backtracks" back to level 2, and tries the following number there: 2:

![](http://1.bp.blogspot.com/_X4W-h82Vgjw/Sj_lOtG9w5I/AAAAAAAAPLM/Y73zU9n0DTE/s400/tree5.png)

And so on (the yellow numbers are the ones we've "done", or excluded in our optimization). This continues until we find a solution, e.g.:

Level 1: 2, level 2: 7 and level 3: 6 gives 15;
level 4: 9, level 5: 5 and level 6: 1 gives 15;
level 7: 4, level 8: 3 and level 9: 8 gives 15.



**Back on track (no pun intended): recursive backtracking in this case**

For the Tetris Cube, we have tree decision variables:

(1) the block used (there were 12 different blocks);
(2) the position were we put the block;
(3) the rotation of the block.

If we'd used position as the level, we have 64 different levels (4x4x4). If we were able to place _any_ remaining block at this position, we could immediately use the next unoccupied space as the position in the next recursive call (since it makes no sense trying all the occupied positions first, since they won't validate anyway).

If we'd used block as the level, we have 12 different levels. If we are able to place this block at any available position in a specific rotation, we can move on the the next block. It seems a bit more sensible to use this method. This way, our tree will be smaller (less tall), and the decisions inside the function purely concern position and orientation in 3d-space.

Our function now looks like:

    recursive_funtion(block) {
      for all positions 1 to 64 {
      for all orientations 1 to 24 {
        put our block at this position in this orientation
        if solution valid {
          if solution complete {
            done, show solution
          }else{
            recursive_function(next_block)
          }
        }
        (remove this block)
      }
      }
    }

There are still a few questions left we have to answer, mainly: the different rotations, and how we can validate a partial solution. But first: let's take a look at the different blocks and how we can encode them.

**The different blocks**

There are 12 blocks, colored in either red, blue or yellow (but the colors themselves mean nothing, they just add decoration). Since the 3d-modeling program [Blender](http://www.blender.org/) runs too slow on my laptop (Compositing enabled and such) I quickly whipped out a few lines of [Povray](http://www.povray.org/) code.

![](http://4.bp.blogspot.com/_X4W-h82Vgjw/Sj_w45fPrmI/AAAAAAAAPLU/TbVLNnELHyg/s320/allblocks.png)

Did you know I can do animations too?

![](http://static.macuyiko.com/files/tetriscube/animateblock.gif)

Anyway, now how do we encode them? Each block can be described by a set of tiny 1x1x1 sub-blocks placed along the x, y and z axes. I call the tiny block placed at (0,0,0) the pivot. Take the red L for example, this block can be described as a combination of five little blocks:

    {(0,0,0); (1,0,0); (2,0,0); (0,1,0); (0,2,0)}

(0,0,0) is the corner-block and our pivot.

Another way of describing this block with another pivot point:

    {(0,0,0); (1,0,0); (2,0,0); (2,1,0); (2,1,0)}

As you can see, it doesn't matter which sub-block we use as our pivot block or how we places our x,y and z axes. Since our function will try every position and every possible rotation, we try every combination anyway.

Now why are there 24 rotations? Every block can be placed facing the direction along: x positive, x negative, y positive, y negative, z positive and z negative, which gives 6 possible directions.

For every direction, we can rotate the block in 4 different ways (0Â°, 90Â°, 180Â° and 270Â°). 4x6=24. Easy.

Taking the description {(0,0,0); (1,0,0); (2,0,0); (0,1,0); (0,2,0)} and saying: put this block in position 34 facing y negative and rotated 90Â° now just becomes a matter of transforming and rotating objects in 3d. I won't describe the details here, it involves some matrix manipulations and such, but are really simple when rotating in the four degrees mentioned above. If you want to know more, take a look [here](http://www.siggraph.org/education/materials/HyperGraph/modeling/mod_tran/3drota.htm) or [Google it](http://www.google.com/search?q=3d+transformation+and+rotation).

In PHP, the language I was using (I know, I know - remember, I thought this would be a quick and easy job), a block description looks like:

    // 1 1 1
    // 1
    // (1)
    $blocks[] = array(array(0,0,0)
      ,array(0,1,0)
      ,array(0,2,0)
      ,array(1,2,0)
      ,array(2,2,0) );

**Verifying partial solutions**

Just as with our magic square, we can do a few checks after placing a few blocks, a few of them are necessary:

(1) a block may not overlap another block;
(2) a block may not go outside the bounds of the 4x4x4 block.

You could also get creative:

(3) a block may not be placed in such a way that we have an isolated empty space. This is, a space surrounded by occupied spaces (or by the bounds of our 4x4x4 cube).

**Trying the program**

We're done, I was exited, I would beat this thing!

The program now looked like this (you can't read the code - believe me, it's a good thing):

![](http://4.bp.blogspot.com/_X4W-h82Vgjw/SkC620yOxMI/AAAAAAAAPMk/mcLhVbwdAng/s400/all.png)

The program was running dog slow. It was doing lots of block-position-rotation combinations very fast, but it was still too slow. I thought I had made an error, and changed some parameters. I used a 2x2x2 bounding box with only three little pieces to fill it with. The program immediately displayed all the solutions (not that many of course). It was working fine, but couldn't handle the large solution space of a 4x4x4 box. That's the problem with recursive backtracking, a "magic square" (see above), with 9 spaces is easy enough, but one with 10 spaces is a lot harder, and one with 11 spaces is even harder then the previous increment (non-linear). It was back to the drawing board again.

**The following day...**

The next day I decided to Google around a bit. It turns out that someone else has already solved this puzzle and posted his method online [here](http://scottkurowski.com/tetriscube/). The author seems to like solving all these puzzles. Most of his findings and description is exactly the same as what I found, so why did his method work. You can download his program (http://scottkurowski.com/tetriscube/TetrisCubeSolved.zip) and take a look at the source code yourself.

So why was his program working?

(1) C! It's a pity, but C is much, much faster than PHP, a factor we can't omit here.
(2) He doesn't use a backtracking recursive function, but the general method is the same (a bunch of goto's and iterating over all the possible permutations the place the blocks one by one). It _does_ backtrack however.

It's a pretty and well-written program. I felt defeated. Both by the puzzle and by another programmer. Since I didn't want to rewrite everything in C to see if a recursive method would prove successful there (I don't like C), I wanted to see if I could solve it using a "slow" language anyway: less brute-forcing, more being smart.

**Searching for a better method**

I recalled reading something about Dancing Links and how someone [solved a Sudoku](http://www.ocf.berkeley.edu/~jchu/publicportal/sudoku/sudoku.paper.html) puzzle with them. "Sudoku and Tetris Cubes look alike", I thought. So I continued researching this.

First of all, we have "[Algorithm X](http://en.wikipedia.org/wiki/Algorithm_X)", an algorithm found by Donald Knuth for solving exact cover problems. Exact cover problems are problems in which every constraint is an "exactly one"-constraint. Knuth uses the Pentomino puzzle as an example (every _piece_ should be used _exactly once_ and every _space_ must be overlapped by a piece _exactly once_).

Also - more good news - Algorithm X is recursive and backtracking, it basically optimizes the way the recursion is done (see the linked Wikipedia page above to see how the algorithm works, make sure you understand it before continuing, it's quite easy and Wikipedia does a really good job at explaining it.)

[Dancing Links](http://en.wikipedia.org/wiki/Dancing_Links) is a method to implement Algorithm X based on the fact that it is very easy to remove and re-add elements in a double linked list. Instead of using this, I first decided to try a simple Algorithm X implementation.

Basically, Algorithm X performs a few operations on a matrix in which each element is either zero (0) or one (1). A solution is then a set of rows so that in each column there is only one one (1).

Take the Pentomino puzzle for example (if you aren't familiar with the puzzle, take a look [here](http://yucs.org/~gnivasch/pentomino/)). It is basically the same problem as our Tetris cube, except for the fact that it is in 2d instead of 3d. We construct a matrix as such (from Wikipedia):

There are two constraints:

(1) for each of the 12 pieces, there is the constraint that it must be placed exactly once. Name these constraints after the corresponding pentominoes: F I L P N T U V W X Y Z.
(2) for each of the 60 spaces, there is the constraint that it must be covered by a pentomino exactly once.

Thus there are 12+60=72 constraints in total.

The problem involves many choices, one for each way to place a pentomino on the board. It is convenient to consider each choice as a sets of 6 constraints: 1 constraint for the pentomino being placed and 5 constraints for the five squares where it is placed. For example:

    {F, 12, 13, 21, 22, 32}
    {F, 13, 14, 22, 23, 33}
    {I, 11, 12, 13, 14, 15}
    {L, 12, 22, 32, 42, 43}
     ...

One of many solutions of this exact cover problem is the following set of 12 choices:

    {I, 11, 12, 13, 14, 15}
    {N, 16, 26, 27, 37, 47}
    {L, 17, 18, 28, 38, 48}
    {U, 21, 22, 31, 41, 42}
    {X, 23, 32, 33, 34, 43}
    {W, 24, 25, 35, 36, 46}
    {P, 51, 52, 53, 62, 63}
    {F, 56, 64, 65, 66, 75}
    {Z, 57, 58, 67, 76, 77}
    {T, 61, 71, 72, 73, 81}
    {V, 68, 78, 86, 87, 88}
    {Y, 74, 82, 83, 84, 85}`

So, in our case, we need a row for every choice we can make, that is: all the combinations of every piece and every possible way of placing it. The following function finds every valid possible combination for every block and constructs rows in the matrix:

    for every block {
      for every position {
        for every rotation {
          try this, if this placement is possible (thus if it does not exceed the boundaries of the 4x4x4 box, add it as a row:
          {BLOCK; pos1, pos2, pos3,...}
        }
      }
    }

Now our columns: we have 12 blocks, and 64 positions these blocks can occupy. 12+64=76. For every row, we:

(1) set a one (1) in one of the first twelve columns according to the block this row uses;
(2) set a one (1) in every "position" this row occupies.

After quickly throwing some ugly code together, I ran the program. First, it constructs the choices and the matrix:

    Constructing choices:
    0: ................................................................
    1: ................................................................
    2: ................................................................
    3: ................................................................
    4: ................................................................
    5: ................................................................
    6: ................................................................
    7: ................................................................
    8: ................................................................
    9: ................................................................
    10: ................................................................
    11: ................................................................
    Number of choices/rows: 4488 out of 18432 theoretical possibles choices
    Constructing matrix: .................................................................................................................................................................................................................................................................................................................................................................................................................................................................
    Done, number of rows: 4488 and cols: 76`

The matrix itself is a bit large to display here. But here are the first few rows:

    OUTPUTTING MATRIX:
    0 {0; 0; 1; 2; 6; 7; }: 1 0 0 0 0 0 0 0 0 0 0 0 1 1 1 0 0 0 1 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
    1 {0; 0; 1; 2; 18; 19; }: 1 0 0 0 0 0 0 0 0 0 0 0 1 1 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
    2 {0; 0; 4; 8; 9; 13; }: 1 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 1 0 0 0 1 1 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
    3 {0; 0; 16; 32; 33; 49; }: 1 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0
    4 {0; 0; 4; 8; 24; 28; }: 1 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 1 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
    5 {0; 0; 16; 32; 36; 52; }: 1 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0
    6 {0; 1; 5; 9; 10; 14; }: 1 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 1 0 0 0 1 1 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
    7 {0; 1; 17; 33; 34; 50; }: 1 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0
    8 {0; 1; 5; 9; 8; 12; }: 1 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 1 0 0 1 1 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
    9 {0; 1; 17; 33; 32; 48; }: 1 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
    10 {0; 1; 5; 9; 25; 29; }: 1 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 1 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
    11 {0; 1; 17; 33; 37; 53; }: 1 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0
    12 {0; 2; 6; 10; 11; 15; }: 1 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 1 0 0 0 1 1 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
    13 {0; 2; 18; 34; 35; 51; }: 1 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0
    14 {0; 2; 6; 10; 9; 13; }: 1 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 1 0 0 1 1 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
    15 {0; 2; 18; 34; 33; 49; }: 1 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0
    16 {0; 2; 6; 10; 26; 30; }: 1 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 1 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
    17 {0; 2; 18; 34; 38; 54; }: 1 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0
    18 {0; 3; 2; 1; 5; 4; }: 1 0 0 0 0 0 0 0 0 0 0 0 0 1 1 1 1 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
     ...

As you can see, in these rows, the first block (number zero) is used, so the first column is one (1), the next eleven columns are zero (0). The next 64 columns are one if the row uses that position.

The program then gives some verbose information:

    ==> (0) Number of rows: 4488 and cols: 76
    Picking 12, has 117
    117 rows to do for column
    ==> (1) Number of rows: 3414 and cols: 70
    Picking 15, has 22
    22 rows to do for column
    ==> (2) Number of rows: 2025 and cols: 64
    Picking 17, has 45
    45 rows to do for column
    ==> (3) Number of rows: 1156 and cols: 57
    Picking 26, has 10
    10 rows to do for column
    ...
    ==> (10) Number of rows: 9 and cols: 12
    Picking 4, has 3
    3 rows to do for column
    ==> (11) Number of rows: 0 and cols: 0
     <== Column has zero ones.
    ==> (11) Number of rows: 0 and cols: 0
     <== Column has zero ones.
    ==> (11) Number of rows: 0 and cols: 0
     <== Column has zero ones.
    ==> (10) Number of rows: 10 and cols: 12
    Picking 4, has 2
    2 rows to do for column
    ==> (11) Number of rows: 0 and cols: 0
     <== Column has zero ones.
    ==> (11) Number of rows: 2 and cols: 6
    Picking 10, has 2
    2 rows to do for column
    ==> (12) Number of rows: 0 and cols: 0

And finally, a first solution is found, alongside a simple presentation to try it on the cube:

    All done, here is a list of choices:
    CHOICE NR 0: 0 0 1 2 6 7
    CHOICE NR 393: 1 19 3 23 22 21
    CHOICE NR 741: 2 5 9 13 29 30 45
    CHOICE NR 1113: 3 15 31 14 11 10
    CHOICE NR 2693: 7 4 8 12 28 44
    CHOICE NR 2371: 5 63 62 46 61 60
    CHOICE NR 3328: 8 58 47 42 43 39 27
    CHOICE NR 3621: 9 38 51 54 55 59
    CHOICE NR 4427: 11 49 53 50 34 35 18
    CHOICE NR 2635: 6 56 57 40 24 20 16
    CHOICE NR 2004: 4 48 52 32 33 17
    CHOICE NR 3938: 10 26 25 41 37 36

    Solution found:
    Plane 0:
    3 3 2 7
    3 3 2 7
    0 0 2 7
    1 0 0 0
    Plane 1:
    3 2 2 7
    8 10 10 6
    1 1 1 6
    1 11 4 6
    Plane 2:
    8 5 2 7
    8 8 10 6
    8 9 10 10
    11 11 4 4
    Plane 3:
    5 5 5 5
    9 8 6 6
    9 9 11 4
    9 11 11 4

Which looks like this:

![](http://static.macuyiko.com/files/tetriscube/animatecube.gif)

Ha, gotcha! If we would use Dancing Links as well, and a faster/better suited language, this would go even faster.

