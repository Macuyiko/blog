var Cell = function(parent, col, row) {
  this.grid = parent;
  this.col = col;
  this.row = row;
  this.reset();
}

Cell.prototype.reset = function()  {
  this.state = 0;
  this.next_state = 0;
}

var Grid = function(cols, rows, size) {
  this.cells = new Array(cols);
  for (var i = 0; i < cols; i++) {
    this.cells[i] = new Array(rows);
  }
  this.cols = cols;
  this.rows = rows;
  this.size = size;
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
    var clr = color(floor((1 - cell.state)*255))
    fill(clr); 
    stroke(10);
    rect(col*self.size, row*self.size, self.size-1, self.size-1);
  });
}

Grid.prototype.neighborhood = function(col, row) {
  var n = {};
  n.me = this.cells[col][row];
  n.left = col > 0 ? this.cells[col-1][row] : null;
  n.right = col < (this.cols - 1) ? this.cells[col+1][row] : null;
  n.up = row > 0 ? this.cells[col][row-1] : null;
  n.down = row < (this.rows -1) ? this.cells[col][row+1] : null;
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
    cell.state = cell.next_state;
  });
}