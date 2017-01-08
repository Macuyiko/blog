Title: SmoothLife in Processing
Author: Seppe "Macuyiko" vanden Broucke
Date: 2017-01-08 17:44

Conway’s [Game of Life](http://en.wikipedia.org/wiki/Conway%27s_Game_of_Life) is one of the most popular examples of cellular automaton. However, did you know that [Stephan Rafler](http://arxiv.org/abs/1111.1567) proposed a version of Game of Life in 2011 which works over a contious domain, called SmoothLife?

<iframe width="560" height="315" src="https://www.youtube.com/embed/KJe9H6qS82I" frameborder="0" allowfullscreen></iframe>

Cool, isn't it? The basic idea is that the grid of cells is replaced here with an effective grid where each cell occupies a continuous coordinate with a very small finite size and with the neighbors calculated based on a radius around that cell.

[This blog post](https://0fps.net/2012/11/19/conways-game-of-life-for-curved-surfaces-part-1/) summarised the idea well and also provides a [JavaScript implementation](http://jsfiddle.net/mikola/aj2vq/).

Since I'm toying around with [Processing](https://processing.org/) again these days, it seemed like a fun quick project to convert the source to Java:

<script src="https://gist.github.com/Macuyiko/566840fe90642b9ddb37f57769496a60.js"></script>

Here's what the results look like. Higher resolutions are possible but can't be rendered in real-time due to the slower FFT implementation (it would be fun to import [FFTW](http://www.fftw.org/download.html) and see how that fares).

Here's what the result looks like:

![](/images/2017/spatial.png)
