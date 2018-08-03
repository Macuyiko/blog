var Cell = function(parent, col, row) {
  this.grid = parent;
  this.col = col;
  this.row = row;
  this.reset();
}

Cell.prototype.reset = function()  {
  this.statenum = 0;
  this.state = Object.assign({}, this.grid.states[this.statenum]);
  this.next_state = Object.assign({}, this.grid.states[this.statenum]);
}

var Grid = function(cols, rows, size) {
  this.cells = new Array(cols);
  for (var i = 0; i < cols; i++) {
    this.cells[i] = new Array(rows);
  }
  this.cols = cols;
  this.rows = rows;
  this.size = size;
  this.states = [
    {type: null, clr: 255},
    {type: 'emitter', direction: 'up', clr: color(255, 0, 10)},
    {type: 'link', stored: 0, cooldown: false, direction: 'up', clr: color(150, 100, 100)},
    {type: 'consumer', clr: color(150, 150, 50)},
    {type: 'edge', clr: color(255, 210, 0)},
    {type: 'spawn', clr: color(50, 50, 50)},
    {type: 'head', clr: color(0, 10, 255)},
    {type: 'tail', clr: color(0, 100, 255)},
  ];
  var self = this;
  this.visit(function(col, row) {
    self.cells[col][row] = new Cell(self, col, row);
  });
}

Grid.prototype.visit = function(callable) {
  for (var i = 0; i < this.cols; i++) {
    for (var j = 0; j < this.rows; j++) {
      callable(i, j);
    }
  }
}

Grid.prototype.mouseToGrid = function(x, y) {
  col = floor(x / this.size);
  row = floor(y / this.size);
  return [col, row];
}

Grid.prototype.draw = function() {
  var self = this;
  this.visit(function(col, row) {
    var cell = self.cells[col][row];
    fill(cell.state.clr);
    stroke(10);
    rect(col*self.size, row*self.size, self.size-1, self.size-1);
    stroke(10); noFill();
    if (cell.state.direction) text(cell.state.direction, col*self.size, row*self.size + Math.floor(self.size / 2));
  });
}

Grid.prototype.neighborhood = function(col, row) {
  var n = {me: null, up: null, down: null, left: null, right: null};
  n.me = this.cells[col][row];
  if (col > 0) n.left = this.cells[col-1][row];
  if (col < this.cols-1) n.right = this.cells[col+1][row];
  if (row > 0) n.up = this.cells[col][row-1];
  if (row < this.rows-1) n.down = this.cells[col][row+1];
  return n;
}

Grid.prototype.update = function(callable) {
  var self = this;
  this.visit(function(col, row) {
    callable(self.neighborhood(col, row))
  });
}

Grid.prototype.finish = function(callable) {
  var self = this;
  this.visit(function(col, row) {
    var cell = self.cells[col][row];
    cell.state = Object.assign({}, cell.next_state);
  });
}