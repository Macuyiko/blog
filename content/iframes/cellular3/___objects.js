var debug = false;
var precision = 0.000001;

var message_ticks = 0;
var message = '';

var Cell = function(parent, col, row) {
  this.grid = parent;
  this.col = col;
  this.row = row;
  this.reset();
}

Cell.prototype.reset = function()  {
  var types = this.grid.types;
  for (var i = 0, len = types.length; i < len; i++) {
    this[types[i]] = 0;
    this['next_' + types[i]] = 0;
    this['remaining_' + types[i]] = 0;
  }
}

Cell.prototype.flow = function(destination, type, value) {
  this.remaining(type, this.remaining(type) - value);
  this.next(type, this.next(type) - value);
  if (destination) destination.next(type, destination.next(type) + value);
}

Cell.prototype.current = function(type, value) {
  if(typeof value !== "undefined") {
    this[type] = value;
  }
  return this[type];
}

Cell.prototype.remaining = function(type, value) {
  if(typeof value !== "undefined") {
    this['remaining_' +type] = value;
  }
  return this['remaining_' + type];
}

Cell.prototype.next = function(type, value) {
  if(typeof value !== "undefined") {
    this['next_' + type] = value;
  }
  return this['next_' + type];
}

var Grid = function(cols, rows, size, types, colors) {
  this.types = types.slice();
  this.colors = colors.slice();
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

Grid.prototype.mouseToGrid = function (x, y) {
  col = floor(x / this.size);
  row = floor(y / this.size);
  return [col, row];
}

Grid.prototype.reset = function() {
  var self = this;
  this.visit(function(col, row) {
    self.cells[col][row].reset();
  });
}

Grid.prototype.draw = function() {
  var self = this;
  this.visit(function(col, row) {
    var cell = self.cells[col][row];
    for (var i = 0, len = self.types.length; i < len; i++) {
      var clr = self.colors[self.types.indexOf(self.types[i])];
      var value = cell[self.types[i]];
      fill(color(clr[0], clr[1], clr[2], value*255)); 
      stroke(10);
      rect(col*self.size, row*self.size, self.size-1, self.size-1);
      if (debug && value && round(frameCount / 120) % len == i) {
        stroke(0);
        fill(0);
        textSize(8);
        text(round(value * 100) / 100, col*self.size + 2, row*self.size + self.size/2 + 2);
      }
    }
  });
  if (debug) {
    textSize(12);
    for (var i = 0, len = self.types.length; i < len; i++) {
      var totalwater = 0;
      grid.visit(function(col, row) {
        totalwater += grid.cells[col][row][self.types[i]];
      });
      stroke(255);
      fill(255);
      rect(5, 5 + i*15, 170, 15);
      stroke(0);
      fill(0);
      text(self.types[i] + ': ' + totalwater, 10, 17 + i*15);
    }
    stroke(0);
    noFill();
    rect(5, 5, 170, self.types.length*15);
  }
  if (message_ticks > 0) {
    stroke(0);
    fill(255);
    rect(5, 290, 250, 20);
    stroke(0);
    fill(0);
    text(message, 10, 305);
    console.log(message)
    message_ticks--;
  }
}

Grid.prototype.neighborhood = function(col, row) {
  var n = {};
  n.me = this.cells[col][row];
  n.left = col > 0 ? this.cells[col-1][row] : null;
  n.right = col < (this.cols - 1) ? this.cells[col+1][row] : null;
  n.up = row > 0 ? this.cells[col][row-1] : null;
  n.down = row < (this.rows -1) ? this.cells[col][row+1] : null;
  n.bottom = n.down;
  n.top = n.up;
  n.center = n.me;
  return n;
}

Grid.prototype.visit = function(callable) {
  for (var i = 0; i < this.cols; i++) {
    for (var j = 0; j < this.rows; j++) {
      callable(i, j);
    }
  }
}

Grid.prototype.update = function(callable) {
  var self = this;
  // Make a copy
  this.visit(function(col, row) {
    for (var i = 0, len = self.types.length; i < len; i++) {
      var current = self.cells[col][row].current(self.types[i]);
      self.cells[col][row].next(self.types[i], current);
      self.cells[col][row].remaining(self.types[i], current);
    }
  });
  // Perform updates
  this.visit(function(col, row) {
    callable(self.neighborhood(col, row))
  });
  // Numeric stability
  this.visit(function(col, row) {
    for (var i = 0, len = self.types.length; i < len; i++) {
      var current = self.cells[col][row].next(self.types[i]);
      if (current > 0 && current < precision) {
        current = 0;
        console.log('<0 instability');
      } 
      if (current < 1 && current > 1 - precision) {
        current = 1;
        console.log('>1 instability');
      }
      self.cells[col][row].next(self.types[i], current);
    }
  });
}

Grid.prototype.finish = function(callable) {
  var self = this;
  this.visit(function(col, row) {
    var cell = self.cells[col][row];
    for (var i = 0, len = self.types.length; i < len; i++) {
      cell[self.types[i]] = cell['next_' + self.types[i]];
    }
  });
}