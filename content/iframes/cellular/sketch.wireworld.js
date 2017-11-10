var grid;
var last_drag = null;
var paused = false;

function keyTyped() {
  if (key == 'p') {
    paused = !paused;
  } else if (key == 'd') {
    grid.visit(function(col, row) {
      if (grid.cells[col][row].state)
      console.log('grid.cells['+col+']['+row+'].state = '+grid.cells[col][row].state+';');
    });
  }
  return false;
}

function setup() {
  createCanvas(520, 320);
  var w = 20;
  var cols = floor(width/w);
  var rows = floor(height/w);
  grid = new Grid(cols, rows, w);
  grid.cells[2][4].state = 3;
  grid.cells[2][10].state = 3;
  grid.cells[3][3].state = 3;
  grid.cells[3][5].state = 3;
  grid.cells[3][9].state = 3;
  grid.cells[3][11].state = 3;
  grid.cells[4][3].state = 3;
  grid.cells[4][5].state = 3;
  grid.cells[4][9].state = 3;
  grid.cells[4][11].state = 3;
  grid.cells[5][3].state = 3;
  grid.cells[5][5].state = 3;
  grid.cells[5][9].state = 3;
  grid.cells[5][11].state = 3;
  grid.cells[6][3].state = 2;
  grid.cells[6][5].state = 3;
  grid.cells[6][9].state = 3;
  grid.cells[6][11].state = 1;
  grid.cells[7][3].state = 1;
  grid.cells[7][5].state = 3;
  grid.cells[7][9].state = 3;
  grid.cells[7][11].state = 2;
  grid.cells[8][3].state = 3;
  grid.cells[8][5].state = 3;
  grid.cells[8][9].state = 3;
  grid.cells[8][11].state = 3;
  grid.cells[9][3].state = 3;
  grid.cells[9][5].state = 3;
  grid.cells[9][9].state = 3;
  grid.cells[9][11].state = 3;
  grid.cells[10][4].state = 3;
  grid.cells[10][10].state = 3;
  grid.cells[11][4].state = 3;
  grid.cells[11][10].state = 3;
  grid.cells[12][4].state = 3;
  grid.cells[12][6].state = 3;
  grid.cells[12][7].state = 3;
  grid.cells[12][8].state = 3;
  grid.cells[12][10].state = 3;
  grid.cells[13][5].state = 3;
  grid.cells[13][6].state = 3;
  grid.cells[13][8].state = 3;
  grid.cells[13][9].state = 3;
  grid.cells[14][6].state = 3;
  grid.cells[14][8].state = 3;
  grid.cells[15][6].state = 3;
  grid.cells[15][7].state = 3;
  grid.cells[15][8].state = 3;
  grid.cells[16][7].state = 3;
  grid.cells[17][7].state = 3;
  grid.cells[18][7].state = 3;
  grid.cells[19][7].state = 3;
  grid.cells[20][7].state = 3;
  grid.cells[21][7].state = 3;
  grid.cells[22][7].state = 3;
  grid.cells[23][7].state = 3;
}

function draw() {
  background(255);
  grid.draw();
  if (!paused && frameCount % 30 == 0) {
    tick();
  }
}

function tick() {
  grid.update(function(neighborhood) {
    neighborhood.me.next_state = neighborhood.me.state;
    if (neighborhood.me.state == 1) {
      // Head becomes tail
      neighborhood.me.next_state = 2;
    } else if (neighborhood.me.state == 2) {
      // Tail becomes wire
      neighborhood.me.next_state = 3;
    } else if (neighborhood.me.state == 3 && 
          (neighborhood.heads == 1 || neighborhood.heads == 2)) {
      // Wire becomes head if one or two of the neighbors are heads
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
    cell.state = (cell.state + 1) % 4;
  }
  last_drag = gridpos;
}
