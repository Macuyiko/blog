var grid;
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
  createCanvas(520, 520);
  var w = 5;
  var cols = floor(width/w);
  var rows = floor(height/w);
  grid = new Grid(cols, rows, w);
  grid.cells[floor(cols/2)][floor(rows/2)].ant = 1;
}

function draw() {
  background(255);
  grid.draw();
  if (!paused) {
    tick();
  }
}

function tick() {
  grid.update(function(neighborhood) {
    neighborhood.me.next_state = neighborhood.me.state;
    if (neighborhood.me.ant) {
      // The ant is here, flip color
      neighborhood.me.next_state = abs(neighborhood.me.state - 1);
      if (neighborhood.me.state) {
        // At a black square, turn 90° left
        neighborhood.me.next_ant = 1 + ((neighborhood.me.ant + 1 + 1) % 4);
      } else {
        // At a white square, turn 90° right  
        neighborhood.me.next_ant = 1 + ((neighborhood.me.ant + 1 - 1) % 4);
      }
      // Move forward one unit
      var next = '';
      if (neighborhood.me.next_ant == 1) next = 'up';
      if (neighborhood.me.next_ant == 2) next = 'right';
      if (neighborhood.me.next_ant == 3) next = 'down';
      if (neighborhood.me.next_ant == 4) next = 'left';
      neighborhood[next].next_ant = neighborhood.me.next_ant;
      neighborhood.me.next_ant = 0;
    }
  });
  grid.finish();
}
