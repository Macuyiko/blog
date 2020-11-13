Title: An Exploration of Cellular Automata and Graph Based Game Systems: Part 2
Author: Seppe "Macuyiko" vanden Broucke
Date: 2017-12-19 18:05
Subtitle: Grid Based Fluid Systems
Image: water.jpg

<script>
$(function() {
	$('.toggle').each(function(index) {
		var toggler = $('<div style="margin: 8px 0; background-color: #E3E0FF; cursor: pointer; padding: 8px;">Toggle iframe</div>');
		toggler.insertBefore($(this));
		toggler.click(function() {
			var elt = $(this).next('.toggle');
			var newElt = $("<iframe></iframe>")
			Array.prototype.slice.call(elt.get(0).attributes).forEach(function(a) {
				newElt.attr(a.name, a.value);
			});
			if (!$(this).hasClass('toggled')) {
				elt.append(newElt);
				$(this).addClass('toggled');
			} else {
				elt.html('');
				$(this).removeClass('toggled');
			}
		});
	});
});
</script>

This post is the second part on a small series on cellular automata and graph based systems as found in games. Part 1 can be found [here](|filename|/2017/2017_11_cellular_exploration.md).

In our last past, we ended up with a general framework to construct cellular automata. To refresh, a cellular automaton is a discrete simulation defined over a grid of cells, each one of which is carrying a state. For each cell, a set of cells called its neighborhood is defined relative to the specified cell. From an initial state, a simulation is started where each new generation is created according to a set of rules that determines the new state of each cell in terms of the current state of the cell and the states of the cells in its neighborhood:

```plain
forever:
	for each current cell in current grid:
		get current neighborhood
		determine state for new cell based on current cell and current neighborhood
		swap new grid to current grid
```

Left up to us is to:

- Define the neighborhood of a cell
- Define the state of a cell
- Define the rules to determine the state in a new generation

Let's now expand on this framework to simulate fluid dynamics as similarly as seen in games such as Oxygen Not Included, "[falling sand](https://en.wikipedia.org/wiki/Falling-sand_game)" games, and so on.

# Some basic groundwork

The main change we need to perform is to the definition of a cell's state. Contrary to what we've been working with so far, our state now is going to be a tad more complex, allowing for some flexibility:

- A cell can hold a variable number of materials, each represented as a float in the range 0 (min) to 1 (max)
- To represent a cell, we'll associate an RGB color to each material "type"
- When drawing the grid, we simply use some alpha masking to overlay the colors on top of each other

Regarding the rules to determine the next generation, we're going to work with the concept of flow. Our rule system will be based on a general framework adhering to the following rules:

- First of all, make a copy of the current state and set it as the next state, this will ensure that cells where nothing happens or where some material is "left over" automatically carry this to the next generation without us always having to manually assign this
- Define helper "remaining" variables for every cell to keep track of how much material can still be flowed out for that cell, as we want to ensure that we don't flow out more material than was there in the current state (this is not necessary, but makes things much easier)
- Next up, we visit every cell
- Based on a collection of rules, we only allow materials to "flow out", decreasing the "remaining" count and material count in the next state, and increasing the material count in the next state for one of the neighboring cells

In pseudocode:

```plain
next_board = copy(this_board)
remaining_board = copy(this_board)
for each cell in this_board:
	// based on rules, perform one or more:
	flow(cell, neighbor, material, amount)
this_board = next_board

func flow(cell, neighbor, material, amount):
	cell.material in remaining_board -= amount
	cell.material in next_board -= amount
	neighbor.material in next_board += amount
```

# Basic example

Let's try out this approach using a simple system: one with sand and floors.

```javascript
function setup() {
	createCanvas(520, 320);
	var types = ['sand', 'floor'];
	var w = 20;
	var cols = floor(width/w);
	var rows = floor(height/w);
	var colors = [[255, 160, 20], [50, 50, 50]];
	grid = new Grid(cols, rows, w, types, colors);
}
```

Using the following simple update rule:

```javascript
function tick() {
	var downMaxSpeed = 1;
	grid.update(function(neighborhood) {
	// Fall sand
	if (neighborhood.bottom && !neighborhood.bottom.current('floor')) {
		var sandHere = neighborhood.me.current('sand');
		var spaceBelow = 1 - neighborhood.bottom.current('sand');
		var flow = constrain(sandHere, 0, Math.min(downMaxSpeed, spaceBelow));
		neighborhood.me.flow(neighborhood.bottom, 'sand', flow);
	}
	});
	grid.finish();
}
```

You can play around with the result here. Tip: pressing `o` cycles through the different material types to draw, `p` (un)pauses the simulation, `d` toggles debugging mode. Press `r` to reset everything. You might need to click inside first to give the iframe focus.

<div src="/iframes/cellular2/index.basic.html"
	class="toggle" scrolling="no" frameborder="0" width="520" height="320"></div>

# Introducing water

This basic example is not that impressive yet. Let's change things up a bit by defining a system for water instead. Our update rules now look as follows:

```javascript
function tick() {
	var downMaxSpeed = 1;
	grid.update(function(neighborhood) {
	// Water falls downwards
	var waterHere = neighborhood.me.current('water');
	var bottomPassable = isPassable(neighborhood, 'bottom');
	if (bottomPassable) {
		var spaceBelow = 1 - neighborhood.bottom.next('water');
		var flow = constrain(waterHere, 0, Math.min(downMaxSpeed, spaceBelow));
		neighborhood.me.flow(neighborhood.bottom, 'water', flow);
		waterHere -= flow;
	}
	// And also sideways if their's a floor beneath or lots of water
	var waterDown = bottomPassable ? neighborhood.down.current('water') : 1;
	if (waterDown > 0.8 && waterHere > 0) {
		var sideFlow = getWaterSideOutFlow(neighborhood, waterHere);
		if (sideFlow[0] !== false)
		neighborhood.me.flow(neighborhood.left, 'water', sideFlow[0]);
		if (sideFlow[1] !== false)
		neighborhood.me.flow(neighborhood.right, 'water', sideFlow[1]);
		waterHere -= sideFlow[0] + sideFlow[1];
	}
	});
	grid.finish();
}
```

`getWaterSideOutFlow` is a helper function which determines how much water should be flown out to the left and right respectively to reach a "stable" level:

```javascript
function getWaterSideOutFlow(neighborhood, currentWater) {
	var divider = 1;
	var totalWater = currentWater;
	var doLeft = isPassable(neighborhood, 'left') && 
		neighborhood.left.current('water') < currentWater;
	var doRight = isPassable(neighborhood, 'right') && 
		neighborhood.right.current('water') < currentWater;
	if (doLeft) {
	divider += 1;
	totalWater += neighborhood.left.current('water');
	}
	if (doRight) {
	divider += 1;
	totalWater += neighborhood.right.current('water');
	}
	var stableLevel = totalWater / divider;
	var toLeft = !isPassable(neighborhood, 'left') ? false :
		Math.max(0, stableLevel - neighborhood.left.current('water'));
	var toRight = !isPassable(neighborhood, 'right') ? false :
		Math.max(0, stableLevel - neighborhood.right.current('water'));
	return [toLeft, toRight];
}
```

Of course, we could play around with this -- a much easier option is to move water around to the left or right randomly (which is the option many systems go for), though this leads to a kind of jittery effect.

You can play around with the result below. Again: pressing `o` cycles through the different material types to draw, `p` (un)pauses the simulation, `d` toggles debugging mode. Press `r` to reset everything. The simulation below starts from a preset scenario, though feel free to play around with this (break a hole in one of the walls, for instance). One interesting aspect you'll note is that this simulation does not adhere to "real" pressure dynamics (i.e. modeling "[communicating vessels](https://en.wikipedia.org/wiki/Communicating_vessels)" is not working here). This is another aspect most cellular automaton based systems fail to model correctly and something we'll fix in a bit.

<div src="/iframes/cellular2/index.water.html"
	class="toggle" scrolling="no" frameborder="0" width="520" height="320"></div>

# Fixing pressure

Let's expand on the previous example a bit to fix the communicating vessel issue. First, we'll add to general purpose methods as follows (note how the "remaining" variables come into play here):

```javascript
function doVerticalFlow(neighborhood, type, direction, speed) {
	if (typeof speed === "undefined") speed = 1;
	var passable = isPassable(neighborhood, direction);
	var liquid = neighborhood.me.remaining(type);
	if (passable) {
	var room = 1 - neighborhood[direction].next(type);
	var flow = constrain(liquid, 0, Math.min(speed, room));
	neighborhood.me.flow(neighborhood[direction], type, flow);
	}
}

function doHorizontalFlow(neighborhood, type, direction, viscosity, stickyness, fluidity) {
	if (typeof viscosity === "undefined") viscosity = 1;
	if (typeof stickyness === "undefined") stickyness = 1;
	if (typeof fluidity === "undefined") fluidity = 1;
	var passable = isPassable(neighborhood, direction);
	var support = passable ? neighborhood[direction].current(type) : 1;
	var liquid = neighborhood.me.remaining(type);
	if (support >= viscosity && liquid > stickyness) {
	var sideFlow = getSideOutFlow(neighborhood, type);
	if (sideFlow[0] !== false)
		neighborhood.me.flow(neighborhood.left, type, sideFlow[0]/fluidity);
	if (sideFlow[1] !== false)
		neighborhood.me.flow(neighborhood.right, type, sideFlow[1]/fluidity);
	}
}
```

These will be used to update down/upwards (vertical) and side (horizontal) flow respectively, with several parameters to set to determine the "stickyness" and so on of horizontal flow.

To handle pressure, we'll utilize a similar "teleportation" trick as done in [Dwarf Fortress](http://dwarffortresswiki.org/index.php/v0.34:Flow#Fluids_under_pressure.2C_aka_Teleportation):

> Fluids moving under pressure do not just move to adjacent tiles, they also trace a path through other full tiles of fluid trying to move to more distant tiles. Fluids moving under pressure can effectively teleport through other tiles that are already filled with fluid. When teleporting, fluids do not generate any flow, neither will they push objects around.

This is handled by the following functions:

```javascript
function isPressured(neighborhood, type, direction, liquid, minliquid, minpressure) {
	var passable = isPassable(neighborhood, direction);
	var pressure = !passable ? 0 : 1 - neighborhood[direction].current(type);
	var pressured = pressure >= minpressure && liquid >= minliquid;
	return pressured;
}

function doPressureFlow(neighborhood, type, direction, minliquid, minpressure, connectedliquid, minflow) {
	if (typeof minliquid === "undefined") minliquid = 0.5;
	if (typeof minpressure === "undefined") minpressure = 0.1;
	if (typeof connectedliquid === "undefined") connectedliquid = 0.5;
	if (typeof minflow === "undefined") minflow = 0.1;
	var liquid = neighborhood.me.remaining(type);
	var pressured = isPressured(neighborhood, type, direction, liquid, minliquid, minpressure);
	if (!pressured) return;
	// Find a lower connected tile that is also pressured
	var expansion_list = [];
	var done_list = [];
	function expand(expansion_list, done_list, neighborhood) {
	var directions = ['top', 'left' ,'right', 'down'];
	for (var i = 0; i < directions.length; i++) {
		if (neighborhood[directions[i]] 
			&& isPassable(neighborhood, directions[i])
			&& done_list.indexOf(neighborhood[directions[i]]) < 0) {
			expansion_list.push(neighborhood[directions[i]]);
		}
	}
	}
	var thatneighborhood = false;
	var flow = 0;
	expand(expansion_list, done_list, neighborhood);
	while (expansion_list.length) {
		var todo = expansion_list.pop();
		done_list.push(todo);
		thatneighborhood = grid.neighborhood(todo.col, todo.row);
		var thatliquid = thatneighborhood.me.next(type);
		var thatpressured = isPressured(thatneighborhood, type, direction, thatliquid, 0, minpressure);
		var check = direction == 'up' ? 
			neighborhood.me.row <= thatneighborhood.me.row :
			neighborhood.me.row >= thatneighborhood.me.row;
		var room = 1 - thatneighborhood.me.next(type);
		var maxFlow = (liquid - thatliquid) / 2;
		flow = constrain(liquid, 0, Math.min(maxFlow, room));
		if (thatliquid < liquid && thatpressured && check && flow > 0.1)
			break;
		if (thatneighborhood.me.current(type) > connectedliquid)
			expand(expansion_list, done_list, thatneighborhood);
		thatneighborhood = false;
	}
	if (thatneighborhood) {
		neighborhood.me.flow(thatneighborhood.me, type, flow);
	}
}
```

Putting everything together in our update rule set:

```javascript
function tick() {
	grid.update(function(neighborhood) {
		doVerticalFlow(neighborhood, 'water', 'down', 1);
		doHorizontalFlow(neighborhood, 'water', 'down', 0.7, 0, 1);
		doPressureFlow(neighborhood, 'water', 'up');
	});
	grid.finish();
}
```

We get the following result. Again: pressing `o` cycles through the different material types to draw, `p` (un)pauses the simulation, `d` toggles debugging mode. Press `r` to reset everything. Note how the "vessels" now stabilize (try filling up one side by drawing some water in the air):

<div src="/iframes/cellular2/index.pressure.html"
	class="toggle" scrolling="no" frameborder="0" width="520" height="320"></div>

# Expansion

Expanding on this system is now relatively easy. The following simulation defines three new material types: lava, steam, and ice. Cells that mix lava and water will convert this water to steam, which flows upwards in a more random manner (to allow steam to linger in a cell from time to time). When steam touches an ice block in one of its neighbors, it converts back to water. The teleportation trick is only used for water in the simulation below:

```javascript
function tick() {
	grid.update(function(neighborhood) {
		doVerticalFlow(neighborhood, 'water', 'down', 1);
		doVerticalFlow(neighborhood, 'lava', 'down', 1);
		doHorizontalFlow(neighborhood, 'water', 'down', 0.7, 0, 1);
		doHorizontalFlow(neighborhood, 'lava', 'down', 1, 0.8, 3);
		if (random(0, 10) > 7) {
			if (random(0, 20) > 19) {
				doVerticalFlow(neighborhood, 'steam', 'down', 0.1);
			} else {
				doVerticalFlow(neighborhood, 'steam', 'up', 0.4);
			}
		}
		if (random(0, 10) > 8) {
			doHorizontalFlow(neighborhood, 'steam', 'up', 0.8, 0.1, 2);
		}
		if (neighborhood.me.remaining('water') && neighborhood.me.remaining('lava')) {
			var vaporation = Math.min(neighborhood.me.remaining('water'), neighborhood.me.remaining('lava'));
			neighborhood.me.flow(null, 'water', vaporation);
			neighborhood.me.flow(null, 'steam', -vaporation);
		}

		var icenearby = (neighborhood.up && neighborhood.up.remaining('ice')) ||
			(neighborhood.down && neighborhood.down.remaining('ice')) || 
			(neighborhood.left && neighborhood.left.remaining('ice')) || 
			(neighborhood.right && neighborhood.right.remaining('ice'))
		if (neighborhood.me.remaining('steam') && icenearby) {
			var vaporation = Math.min(neighborhood.me.remaining('steam'), 0.2);
			neighborhood.me.flow(null, 'steam', vaporation);
			neighborhood.me.flow(null, 'water', -vaporation);
		}

		doPressureFlow(neighborhood, 'water', 'up');
	});
	grid.finish();
}
```

You can play around with the result below. Again: pressing `o` cycles through the different material types to draw, `p` (un)pauses the simulation, `d` toggles debugging mode. Press `r` to reset everything. The initial setup loads in a closed system where water is heated, cycled, and cooled down:

<div src="/iframes/cellular2/index.lava.html"
	class="toggle" scrolling="no" frameborder="0" width="520" height="320"></div>

# Conclusion

We've now seen the basics regarding the use of cellular automata to simulate simple systems. Based on our framework we have constructured, it's now easy to add in further material types and interactions.

Next time, we switch gears and move away from cellular automata to graph based systems, another often-utilized concept in games, though we'll see that there is some overlap with cellular automata as well.