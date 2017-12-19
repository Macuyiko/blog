var grid;

var draw_type = 0;
var last_drag = null;

function setup() {
  createCanvas(520, 320);
  var types = ['water', 'floor'];
  var w = 20;
  var cols = floor(width/w);
  var rows = floor(height/w);
  var colors = [[0, 50, 255], [50, 50, 50]];
  grid = new Grid(cols, rows, w, types, colors);


  grid.cells[3][2].current("floor", 1);
  grid.cells[3][3].current("floor", 1);
  grid.cells[3][4].current("floor", 1);
  grid.cells[3][5].current("floor", 1);
  grid.cells[3][6].current("floor", 1);
  grid.cells[3][7].current("floor", 1);
  grid.cells[3][8].current("floor", 1);
  grid.cells[3][9].current("floor", 1);
  grid.cells[3][10].current("floor", 1);
  grid.cells[3][11].current("floor", 1);
  grid.cells[3][12].current("floor", 1);
  grid.cells[3][13].current("floor", 1);
  grid.cells[3][14].current("floor", 1);
  grid.cells[3][15].current("floor", 1);
  grid.cells[4][5].current("water", 0.5091016699400385);
  grid.cells[4][6].current("water", 0.9941831053089576);
  grid.cells[4][7].current("water", 0.9989474659507794);
  grid.cells[4][8].current("water", 0.9943009178749547);
  grid.cells[4][9].current("water", 0.9989687834531301);
  grid.cells[4][10].current("water", 0.9944163443204124);
  grid.cells[4][11].current("water", 0.9989896692028742);
  grid.cells[4][12].current("water", 0.9945294329730308);
  grid.cells[4][13].current("water", 0.9990101319442243);
  grid.cells[4][14].current("water", 1);
  grid.cells[4][15].current("floor", 1);
  grid.cells[5][5].current("water", 0.5022104830199068);
  grid.cells[5][6].current("water", 0.9931305712597369);
  grid.cells[5][7].current("water", 0.9932483838257342);
  grid.cells[5][8].current("water", 0.9932697013280849);
  grid.cells[5][9].current("water", 0.9933851277735426);
  grid.cells[5][10].current("water", 0.9934060135232867);
  grid.cells[5][11].current("water", 0.9935191021759049);
  grid.cells[5][12].current("water", 0.9935395649172549);
  grid.cells[5][13].current("water", 0.9882905943075018);
  grid.cells[5][14].current("water", 1);
  grid.cells[5][15].current("floor", 1);
  grid.cells[6][2].current("floor", 1);
  grid.cells[6][3].current("floor", 1);
  grid.cells[6][4].current("floor", 1);
  grid.cells[6][5].current("floor", 1);
  grid.cells[6][6].current("floor", 1);
  grid.cells[6][7].current("floor", 1);
  grid.cells[6][8].current("floor", 1);
  grid.cells[6][9].current("floor", 1);
  grid.cells[6][10].current("floor", 1);
  grid.cells[6][11].current("floor", 1);
  grid.cells[6][12].current("floor", 1);
  grid.cells[6][13].current("water", 0.9736917776481478);
  grid.cells[6][14].current("floor", 1);
  grid.cells[6][15].current("floor", 1);
  grid.cells[7][13].current("water", 0.9512215926987706);
  grid.cells[7][14].current("water", 1.0000430629765396);
  grid.cells[7][15].current("floor", 1);
  grid.cells[8][13].current("water", 0.9378054853157624);
  grid.cells[8][14].current("water", 1.000043062974519);
  grid.cells[8][15].current("floor", 1);
  grid.cells[9][13].current("water", 0.9181043275839196);
  grid.cells[9][14].current("water", 1.0000430629755293);
  grid.cells[9][15].current("floor", 1);
  grid.cells[10][13].current("water", 0.906957822700437);
  grid.cells[10][14].current("water", 1.0000430629711647);
  grid.cells[10][15].current("floor", 1);
  grid.cells[11][13].current("water", 0.89162176281117);
  grid.cells[11][14].current("water", 1.0000430629711647);
  grid.cells[11][15].current("floor", 1);
  grid.cells[12][13].current("water", 0.8836478839780378);
  grid.cells[12][14].current("water", 1.0000430629678516);
  grid.cells[12][15].current("floor", 1);
  grid.cells[13][13].current("water", 0.8739193582545697);
  grid.cells[13][14].current("water", 1.0000430629683363);
  grid.cells[13][15].current("floor", 1);
  grid.cells[14][13].current("water", 0.8697641017416248);
  grid.cells[14][14].current("water", 1.0000430629650991);
  grid.cells[14][15].current("floor", 1);
  grid.cells[15][13].current("water", 0.8664312574324596);
  grid.cells[15][14].current("water", 1.00004306296554);
  grid.cells[15][15].current("floor", 1);
  grid.cells[16][2].current("floor", 1);
  grid.cells[16][3].current("floor", 1);
  grid.cells[16][4].current("floor", 1);
  grid.cells[16][5].current("floor", 1);
  grid.cells[16][6].current("floor", 1);
  grid.cells[16][7].current("floor", 1);
  grid.cells[16][8].current("floor", 1);
  grid.cells[16][9].current("floor", 1);
  grid.cells[16][10].current("floor", 1);
  grid.cells[16][11].current("floor", 1);
  grid.cells[16][12].current("floor", 1);
  grid.cells[16][13].current("floor", 1);
  grid.cells[16][14].current("floor", 1);
  grid.cells[16][15].current("floor", 1);
}

function draw() {
  background(255);
  grid.draw();
  if (frameCount % floor(frameRate()/10) <= 1) {
    tick();
  }
}

function isPassable(neighborhood, side) {
  if (!neighborhood[side]) return false;
  if (neighborhood[side].current('floor')) return false;
  return true;
}

function getSideOutFlow(neighborhood, type) {
  var currentLevel = neighborhood.me.remaining(type);
  var divider = 1;
  var totalLevel = currentLevel;
  var doLeft = isPassable(neighborhood, 'left') && 
      neighborhood.left.current(type) < currentLevel;
  var doRight = isPassable(neighborhood, 'right') && 
      neighborhood.right.current(type) < currentLevel;
  if (doLeft) {
    divider += 1;
    totalLevel += neighborhood.left.current(type);
  }
  if (doRight) {
    divider += 1;
    totalLevel += neighborhood.right.current(type);
  }
  var stableLevel = totalLevel / divider;
  var toLeft = !isPassable(neighborhood, 'left') ? false :
      Math.max(0, stableLevel - neighborhood.left.current(type));
  var toRight = !isPassable(neighborhood, 'right') ? false :
      Math.max(0, stableLevel - neighborhood.right.current(type));
  return [toLeft, toRight];
}

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

function tick() {
  grid.update(function(neighborhood) {
    doVerticalFlow(neighborhood, 'water', 'down', 1);
    doHorizontalFlow(neighborhood, 'water', 'down', 0.7, 0, 1);
    doPressureFlow(neighborhood, 'water', 'up');
  });
  grid.finish();
}

function keyTyped() {
  if (key == 'o') {
    draw_type = (draw_type + 1) % grid.types.length;
    message = 'Drawing ' + grid.types[draw_type];
    message_ticks = 100;
  } else if (key == 'p') {
    paused = !paused;
    message = 'Toggled pause';
    message_ticks = 100;
  } else if (key == 'u') {
    grid.visit(function(col, row) {
      for (var i = 0, len = grid.types.length; i < len; i++)
      if (grid.cells[col][row].current(grid.types[i]) > 0)
      console.log('grid.cells['+col+']['+row+'].current("'+grid.types[i]+'", '+
            grid.cells[col][row].current(grid.types[i])+');');
    });
  } else if (key == 'd') {
    debug = !debug;
    message = 'Toggled debug mode';
    message_ticks = 100;
  } else if (key == 'r') {
    message = 'Reset';
    message_ticks = 100;
    grid.reset()
  }
  return false;
}

function mouseReleased() {
  last_drag = null;
}

function mousePressed() {
  mouseDragged();
}

function mouseDragged() {
  gridpos = grid.mouseToGrid(mouseX, mouseY);
  if (last_drag == null || gridpos.toString() != last_drag.toString()) {
    i = gridpos[0];
    j = gridpos[1];
    var row = grid.cells[i];
    if (!row)
      return;
    var cell = row[j];
    if (!cell)
      return;
    var current = cell.current(grid.types[draw_type]);
    cell.reset();
    cell.current(grid.types[draw_type], abs(current - 1));
  }
  last_drag = gridpos;
}