var grid;
var last_drag = null;

function setup() {
  createCanvas(520, 320);
  var w = 20;
  var cols = floor(width/w);
  var rows = floor(height/w);
  grid = new Grid(cols, rows, w);
}

function draw() {
  background(255);
  grid.draw();
  if (frameCount % 10 == 0) {
    tick();
  }
}

function tick() {
  grid.update(function(neighborhood) {
    neighborhood.me.next_state = neighborhood.left ?
      neighborhood.left.state : 0;
  });
  grid.finish();
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
    if (!row) return;
    var cell = row[j];
    if (!cell) return;
    cell.state = abs(cell.state - 1);
  }
  last_drag = gridpos;
}
