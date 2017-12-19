var grid;

var draw_type = 0;
var last_drag = null;

function setup() {
  createCanvas(520, 320);
  var types = ['water', 'floor', 'lava', 'steam', 'ice'];
  var w = 20;
  var cols = floor(width/w);
  var rows = floor(height/w);
  var colors = [[0, 50, 255], [50, 50, 50], [255, 50, 0], [50, 70, 70], [0, 125, 250]];
  grid = new Grid(cols, rows, w, types, colors);

  grid.cells[2][3].current("floor", 1);
  grid.cells[2][4].current("floor", 1);
  grid.cells[2][5].current("floor", 1);
  grid.cells[2][6].current("floor", 1);
  grid.cells[2][7].current("floor", 1);
  grid.cells[2][8].current("floor", 1);
  grid.cells[2][9].current("floor", 1);
  grid.cells[2][10].current("floor", 1);
  grid.cells[2][11].current("floor", 1);
  grid.cells[2][12].current("floor", 1);
  grid.cells[2][13].current("floor", 1);
  grid.cells[2][14].current("floor", 1);
  grid.cells[2][15].current("floor", 1);
  grid.cells[3][3].current("floor", 1);
  grid.cells[3][13].current("water", 1);
  grid.cells[3][14].current("water", 1);
  grid.cells[3][15].current("floor", 1);
  grid.cells[4][3].current("floor", 1);
  grid.cells[4][5].current("floor", 1);
  grid.cells[4][13].current("water", 1);
  grid.cells[4][14].current("water", 1);
  grid.cells[4][15].current("floor", 1);
  grid.cells[5][3].current("floor", 1);
  grid.cells[5][5].current("floor", 1);
  grid.cells[5][6].current("floor", 1);
  grid.cells[5][7].current("floor", 1);
  grid.cells[5][8].current("floor", 1);
  grid.cells[5][9].current("floor", 1);
  grid.cells[5][10].current("floor", 1);
  grid.cells[5][11].current("floor", 1);
  grid.cells[5][13].current("floor", 1);
  grid.cells[5][14].current("floor", 1);
  grid.cells[5][15].current("floor", 1);
  grid.cells[6][3].current("floor", 1);
  grid.cells[6][5].current("floor", 1);
  grid.cells[6][11].current("floor", 1);
  grid.cells[6][13].current("floor", 1);
  grid.cells[7][3].current("floor", 1);
  grid.cells[7][5].current("floor", 1);
  grid.cells[7][11].current("floor", 1);
  grid.cells[7][13].current("floor", 1);
  grid.cells[8][0].current("floor", 1);
  grid.cells[8][1].current("floor", 1);
  grid.cells[8][2].current("floor", 1);
  grid.cells[8][3].current("floor", 1);
  grid.cells[8][5].current("floor", 1);
  grid.cells[8][11].current("floor", 1);
  grid.cells[8][13].current("floor", 1);
  grid.cells[9][0].current("floor", 1);
  grid.cells[9][1].current("steam", 1.0004423800810731);
  grid.cells[9][2].current("steam", 0.5966373453274263);
  grid.cells[9][5].current("floor", 1);
  grid.cells[9][11].current("floor", 1);
  grid.cells[9][13].current("floor", 1);
  grid.cells[10][0].current("floor", 1);
  grid.cells[10][1].current("steam", 1.0004060877033207);
  grid.cells[10][2].current("steam", 0.5380522519931641);
  grid.cells[10][4].current("steam", 0.1);
  grid.cells[10][5].current("floor", 1);
  grid.cells[10][11].current("floor", 1);
  grid.cells[10][13].current("floor", 1);
  grid.cells[11][0].current("floor", 1);
  grid.cells[11][1].current("steam", 1.0003986695151235);
  grid.cells[11][2].current("steam", 0.5546737035716511);
  grid.cells[11][4].current("floor", 1);
  grid.cells[11][11].current("floor", 1);
  grid.cells[11][13].current("floor", 1);
  grid.cells[12][0].current("floor", 1);
  grid.cells[12][1].current("steam", 1);
  grid.cells[12][2].current("steam", 0.5963453285159779);
  grid.cells[12][3].current("floor", 1);
  grid.cells[12][11].current("floor", 1);
  grid.cells[12][13].current("floor", 1);
  grid.cells[13][0].current("floor", 1);
  grid.cells[13][1].current("steam", 1.0003434349035891);
  grid.cells[13][2].current("steam", 0.5965071300861571);
  grid.cells[13][3].current("floor", 1);
  grid.cells[13][11].current("floor", 1);
  grid.cells[13][13].current("floor", 1);
  grid.cells[14][0].current("floor", 1);
  grid.cells[14][1].current("steam", 1.000531697186066);
  grid.cells[14][2].current("steam", 0.5923071020361264);
  grid.cells[14][3].current("floor", 1);
  grid.cells[14][11].current("floor", 1);
  grid.cells[14][13].current("floor", 1);
  grid.cells[15][0].current("floor", 1);
  grid.cells[15][1].current("steam", 1.0009630867679984);
  grid.cells[15][2].current("steam", 0.5904399034993724);
  grid.cells[15][3].current("floor", 1);
  grid.cells[15][11].current("floor", 1);
  grid.cells[15][13].current("floor", 1);
  grid.cells[16][0].current("floor", 1);
  grid.cells[16][1].current("steam", 1.0046380683972993);
  grid.cells[16][2].current("steam", 0.5896580066982509);
  grid.cells[16][3].current("floor", 1);
  grid.cells[16][11].current("floor", 1);
  grid.cells[16][13].current("floor", 1);
  grid.cells[17][0].current("floor", 1);
  grid.cells[17][1].current("steam", 1.0060352572001676);
  grid.cells[17][2].current("steam", 0.5882488996571731);
  grid.cells[17][3].current("floor", 1);
  grid.cells[17][11].current("floor", 1);
  grid.cells[17][12].current("steam", 0.04822360871602989);
  grid.cells[17][13].current("floor", 1);
  grid.cells[18][0].current("floor", 1);
  grid.cells[18][1].current("steam", 1.0105994728100227);
  grid.cells[18][2].current("steam", 0.5864507357805469);
  grid.cells[18][3].current("floor", 1);
  grid.cells[18][11].current("floor", 1);
  grid.cells[18][12].current("steam", 0.0950451433296175);
  grid.cells[18][13].current("floor", 1);
  grid.cells[18][14].current("floor", 1);
  grid.cells[18][15].current("floor", 1);
  grid.cells[19][0].current("floor", 1);
  grid.cells[19][1].current("steam", 1.005738725898638);
  grid.cells[19][2].current("steam", 0.5931570459968614);
  grid.cells[19][3].current("floor", 1);
  grid.cells[19][10].current("floor", 1);
  grid.cells[19][11].current("steam", 0.07705461366652896);
  grid.cells[19][13].current("lava", 0.7705514730003065);
  grid.cells[19][14].current("lava", 1.0000286636471296);
  grid.cells[19][15].current("floor", 1);
  grid.cells[20][0].current("floor", 1);
  grid.cells[20][1].current("steam", 1.0020130455346314);
  grid.cells[20][2].current("steam", 0.6063137411564861);
  grid.cells[20][4].current("floor", 1);
  grid.cells[20][5].current("floor", 1);
  grid.cells[20][6].current("floor", 1);
  grid.cells[20][7].current("floor", 1);
  grid.cells[20][8].current("floor", 1);
  grid.cells[20][9].current("floor", 1);
  grid.cells[20][11].current("steam", 0.0841998257554143);
  grid.cells[20][13].current("lava", 0.2708939193667907);
  grid.cells[20][14].current("lava", 1.0000286636471292);
  grid.cells[20][15].current("floor", 1);
  grid.cells[21][0].current("floor", 1);
  grid.cells[21][1].current("steam", 1.0006720989180042);
  grid.cells[21][2].current("steam", 0.5949431212377798);
  grid.cells[21][13].current("lava", 0.18620725998231702);
  grid.cells[21][14].current("lava", 1.0000286636471287);
  grid.cells[21][15].current("floor", 1);
  grid.cells[22][0].current("floor", 1);
  grid.cells[22][1].current("steam", 1.000002438414536);
  grid.cells[22][2].current("steam", 0.5921946323146975);
  grid.cells[22][13].current("lava", 0.7926366141702391);
  grid.cells[22][14].current("lava", 1.0000286636471283);
  grid.cells[22][15].current("floor", 1);
  grid.cells[23][0].current("floor", 1);
  grid.cells[23][1].current("steam", 1.0000050122965467);
  grid.cells[23][2].current("steam", 0.5941074643262205);
  grid.cells[23][4].current("floor", 1);
  grid.cells[23][5].current("floor", 1);
  grid.cells[23][6].current("floor", 1);
  grid.cells[23][7].current("floor", 1);
  grid.cells[23][8].current("floor", 1);
  grid.cells[23][9].current("floor", 1);
  grid.cells[23][10].current("steam", 0.08078289563541081);
  grid.cells[23][13].current("lava", 0.7997885829882163);
  grid.cells[23][14].current("lava", 1.000028663647128);
  grid.cells[23][15].current("floor", 1);
  grid.cells[24][0].current("floor", 1);
  grid.cells[24][1].current("steam", 1);
  grid.cells[24][2].current("steam", 0.5952893515004548);
  grid.cells[24][3].current("floor", 1);
  grid.cells[24][10].current("floor", 1);
  grid.cells[24][12].current("steam", 0.07606982237329062);
  grid.cells[24][13].current("lava", 0.7999791228670599);
  grid.cells[24][14].current("lava", 1.0000286636471276);
  grid.cells[24][15].current("floor", 1);
  grid.cells[25][0].current("floor", 1);
  grid.cells[25][1].current("floor", 1);
  grid.cells[25][2].current("floor", 1);
  grid.cells[25][11].current("floor", 1);
  grid.cells[25][12].current("floor", 1);
  grid.cells[25][13].current("floor", 1);
  grid.cells[25][14].current("floor", 1);
  grid.cells[25][15].current("floor", 1);
  grid.cells[10][0].current("ice", 1);
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