var grid;
var last_drag = null;


Grid.prototype.neighborhood = function(col, row) {
  var n = {};
  n.me = this.cells[col][row];
  n.live_neighbors = 0;
  for (var c = col-1; c <= col+1; c++) {
    for (var r = row-1; r <= row+1; r++) {
      if (c == col && r == row)
        continue;
      // Wrap around the grid
      var wrapped_col = c;
      var wrapped_row = r;
      if (wrapped_col < 0) wrapped_col = this.cols-1;
      if (wrapped_row < 0) wrapped_row = this.rows-1;
      if (wrapped_col > this.cols-1) wrapped_col = 0;
      if (wrapped_row > this.rows-1) wrapped_row = 0;
      n.live_neighbors += this.cells[wrapped_col][wrapped_row].state;
    }
  }
  return n;
}

function setup() {
  createCanvas(520, 320);
  var w = 20;
  var cols = floor(width/w);
  var rows = floor(height/w);
  grid = new Grid(cols, rows, w);
  grid.cells[0][1].state = 1;
  grid.cells[1][2].state = 1;
  grid.cells[2][0].state = 1;
  grid.cells[2][1].state = 1;
  grid.cells[2][2].state = 1;
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
    if (neighborhood.me.state) {
      // Any live cell with fewer than two live neighbours dies
      if (neighborhood.live_neighbors < 2)
        neighborhood.me.next_state = 0;
      // Any live cell with two or three live neighbours lives on
      if (neighborhood.live_neighbors == 2 || neighborhood.live_neighbors == 3)
        neighborhood.me.next_state = 1;
      // Any live cell with more than three live neighbours dies
      if (neighborhood.live_neighbors > 3)
        neighborhood.me.next_state = 0;
    } else {
      // Any dead cell with exactly three live neighbours becomes a live cell
      if (neighborhood.live_neighbors === 3)
        neighborhood.me.next_state = 1;
    }    
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
