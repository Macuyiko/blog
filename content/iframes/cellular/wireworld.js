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
    if (cell.state == 0) fill(255); 
    else if (cell.state == 1) fill(color(0, 0, 255)); 
    else if (cell.state == 2) fill(color(255, 0, 0)); 
    else if (cell.state == 3) fill(color(255, 210, 0)); 
    stroke(10);
    rect(col*self.size, row*self.size, self.size-1, self.size-1);
  });
}

Grid.prototype.neighborhood = function(col, row) {
  var n = {};
  n.me = this.cells[col][row];
  n.heads = 0;
  for (var c = col-1; c <= col+1; c++) {
    for (var r = row-1; r <= row+1; r++) {
      if (c == col && r == row)
        continue;
      if (c < 0) continue;
      if (r < 0) continue;
      if (c > this.cols-1) continue;
      if (r > this.rows-1) continue;
      n.heads += this.cells[c][r].state == 1 ? 1 : 0;
    }
  }
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