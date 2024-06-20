var grid;

var draw_type = 0;
var last_drag = null;

var paused = false;

function setup() {
  createCanvas(520, 320);
  var types = ['sand', 'floor'];
  var w = 20;
  var cols = floor(width/w);
  var rows = floor(height/w);
  var colors = [[255, 160, 20], [50, 50, 50]];
  grid = new Grid(cols, rows, w, types, colors);
}

function draw() {
  background(255);
  grid.draw();
  if (!paused && frameCount % 3 == 0) {
    tick();
  }
}

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
