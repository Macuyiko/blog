var grid;
var last_drag = null;
var paused = false;

function keyTyped() {
  if (key == 'p') {
    paused = !paused;
  } else if (key == 'd') {
    grid.visit(function(col, row) {
      if (grid.cells[col][row].statenum)
      console.log('grid.cells['+col+']['+row+'].statenum = '+grid.cells[col][row].statenum+';');
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
  grid.cells[5][6].statenum = 1;
  grid.cells[6][6].statenum = 4;
  grid.cells[7][3].statenum = 3;
  grid.cells[7][6].statenum = 4;
  grid.cells[8][3].statenum = 4;
  grid.cells[8][6].statenum = 4;
  grid.cells[8][11].statenum = 3;
  grid.cells[9][3].statenum = 4;
  grid.cells[9][6].statenum = 4;
  grid.cells[9][11].statenum = 4;
  grid.cells[10][3].statenum = 4;
  grid.cells[10][6].statenum = 4;
  grid.cells[10][11].statenum = 4;
  grid.cells[11][3].statenum = 4;
  grid.cells[11][6].statenum = 4;
  grid.cells[11][11].statenum = 4;
  grid.cells[12][3].statenum = 2;
  grid.cells[12][4].statenum = 4;
  grid.cells[12][5].statenum = 4;
  grid.cells[12][6].statenum = 2;
  grid.cells[12][7].statenum = 4;
  grid.cells[12][8].statenum = 4;
  grid.cells[12][9].statenum = 4;
  grid.cells[12][10].statenum = 4;
  grid.cells[12][11].statenum = 2;
  grid.cells[12][12].statenum = 4;
  grid.cells[12][13].statenum = 4;
  grid.cells[12][14].statenum = 3;
  grid.cells[13][3].statenum = 4;
  grid.cells[13][6].statenum = 4;
  grid.cells[13][11].statenum = 4;
  grid.cells[14][3].statenum = 4;
  grid.cells[14][6].statenum = 4;
  grid.cells[14][9].statenum = 4;
  grid.cells[14][10].statenum = 4;
  grid.cells[14][11].statenum = 4;
  grid.cells[15][3].statenum = 4;
  grid.cells[15][6].statenum = 4;
  grid.cells[15][9].statenum = 4;
  grid.cells[16][3].statenum = 4;
  grid.cells[16][6].statenum = 4;
  grid.cells[16][9].statenum = 4;
  grid.cells[16][10].statenum = 4;
  grid.cells[16][11].statenum = 4;
  grid.cells[16][12].statenum = 4;
  grid.cells[16][13].statenum = 4;
  grid.cells[17][3].statenum = 4;
  grid.cells[17][6].statenum = 4;
  grid.cells[17][13].statenum = 4;
  grid.cells[18][3].statenum = 4;
  grid.cells[18][6].statenum = 4;
  grid.cells[18][9].statenum = 4;
  grid.cells[18][10].statenum = 4;
  grid.cells[18][11].statenum = 4;
  grid.cells[18][12].statenum = 4;
  grid.cells[18][13].statenum = 4;
  grid.cells[19][3].statenum = 4;
  grid.cells[19][6].statenum = 4;
  grid.cells[19][9].statenum = 4;
  grid.cells[20][3].statenum = 3;
  grid.cells[20][6].statenum = 3;
  grid.cells[20][9].statenum = 4;
  grid.cells[20][10].statenum = 4;
  grid.cells[20][11].statenum = 3;
  grid.visit(function(col, row) {
    grid.cells[col][row].state = grid.states[grid.cells[col][row].statenum];
  });
}

function draw() {
  background(255);
  grid.draw();
  if (!paused && frameCount % 15 == 0) {
    tick();
  }
}

function tick() {
  var dirs = ['up', 'right', 'down', 'left'];
  var odirs = ['down', 'left', 'up', 'right'];
  grid.update(function(neighborhood) {
    neighborhood.me.next_state = Object.assign({}, neighborhood.me.state);
    if (neighborhood.me.state.type == 'edge') {
      var updated = false;
      if (!updated) {
        for (var d in dirs) {
          if (neighborhood[dirs[d]] && neighborhood[dirs[d]].state.type == 'emitter'
                && neighborhood[dirs[d]].state.direction == odirs[d]) {
            neighborhood.me.next_state = Object.assign({}, grid.states[5]);
            updated = true;
            break;
          }
        }
      }
      if (!updated) {
        for (var d in dirs) {
          if (neighborhood[dirs[d]] && neighborhood[dirs[d]].state.type == 'head') {
            neighborhood.me.next_state = Object.assign({}, grid.states[6]);
            updated = true;
            break;
          }
        }
      }
      if (!updated) {
        for (var d in dirs) {
          if (neighborhood[dirs[d]] && neighborhood[dirs[d]].state.type == 'link' 
                && neighborhood[dirs[d]].state.stored > 0
                && neighborhood[dirs[d]].state.direction == odirs[d]) {
            neighborhood.me.next_state = Object.assign({}, grid.states[6]);
            updated = true;
            break;
          }
        }
      }
    } else if (neighborhood.me.state.type == 'emitter') {
      neighborhood.me.next_state.direction = dirs[(dirs.indexOf(neighborhood.me.state.direction) + 1) % dirs.length];
    } else if (neighborhood.me.state.type == 'spawn') {
      neighborhood.me.next_state = Object.assign({}, grid.states[6]);
    } else if (neighborhood.me.state.type == 'head') {
      neighborhood.me.next_state = Object.assign({}, grid.states[7]);
    } else if (neighborhood.me.state.type == 'tail') {
      neighborhood.me.next_state = Object.assign({}, grid.states[4]);
    } else if (neighborhood.me.state.type == 'link') {
      for (var d in dirs) {
        if (!neighborhood.me.state.cooldown 
            && neighborhood[dirs[d]] 
            && neighborhood[dirs[d]].state.type == 'head') {
          neighborhood.me.next_state.stored += 1;
        }
      }
      if (neighborhood.me.state.stored > 0 
          && neighborhood[neighborhood.me.state.direction] 
          && neighborhood[neighborhood.me.state.direction].state.type == 'edge') {
        neighborhood.me.next_state.stored -= 1;
        neighborhood.me.next_state.cooldown = true;
      }
      if (neighborhood.me.state.stored > 0) {
        neighborhood.me.next_state.direction = dirs[(dirs.indexOf(neighborhood.me.state.direction) + 1) % dirs.length];
      }
      if (neighborhood.me.state.cooldown) neighborhood.me.next_state.cooldown = false;
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
    cell.state = cell.grid.states[(cell.statenum + 1) % cell.grid.states.length];
    cell.statenum += 1
  }
  last_drag = gridpos;
}
