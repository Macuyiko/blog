var nodes = Array();
var edges = Array();
var packets = Array();
var id_counter = 0;
var packet_counter = 0;

var Packet = function(from, to) {
  this.id = packet_counter++;
  this.from = from;
  this.to = to;
  this.x = nodes[from].x;
  this.y = nodes[from].y;
  this.dx = nodes[to].x;
  this.dy = nodes[to].y;
  this.arrived = function() {
    var d = dist(this.x, this.y, this.dx, this.dy);
    return (d < 20);
  }
  this.update = function() {
    if (!this.arrived()) {
      var tx = this.dx - this.x, ty = this.dy - this.y;
      var dist = Math.sqrt(tx*tx + ty*ty), rad = Math.atan2(ty, tx), angle = rad/Math.PI * 180;
      var velX = (tx/dist) * 5, velY = (ty/dist) * 5;
      this.x += velX;
      this.y += velY;
    } else {
      this.x = this.dx;
      this.y = this.dy;
    }
  }
  this.remove = function() {
    for (var i = 0; i < packets.length; i++) {
      if (packets[i].id == this.id) {
        packets.splice(i, 1);
        break;
      }
    }
  }
}

var Node = function(x, y) {
  this.id = id_counter++;
  this.x = x;
  this.y = y;
  this.last_connected_index = 0;
}

function removeNode(n) {
  for (var i = 0; i < nodes.length; i++) {
    removeEdge(n, i);
  }
  nodes.splice(n, 1);
}

function getConnected(n) {
  var connected = Array();
  for (var i = 0; i < edges.length; i++) {
    if (edges[i][0] == nodes[n].id && idToNodeIndex(edges[i][1]) !== null) connected.push(idToNodeIndex(edges[i][1]));
    if (edges[i][1] == nodes[n].id && idToNodeIndex(edges[i][0]) !== null) connected.push(idToNodeIndex(edges[i][0]));
  }
  return connected;
}

function addEdge(i, j) {
  if (nodes[i].id > nodes[j].id) return addEdge(j, i);
  var index = edges.indexOf([nodes[i].id, nodes[j].id]);
  if (index == -1) edges.push([nodes[i].id, nodes[j].id]);
}

function removeEdge(i, j) {
  if (nodes[i].id > nodes[j].id) return removeEdge(j, i);
  var index = edges.indexOf([nodes[i].id, nodes[j].id]);
  if (index > -1) edges.splice(index, 1);
}

function idToNodeIndex(id) {
  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i].id == id) {
      return i;
    }
  }
  return null;
}

function mouseToNodeIndex() {
  for (var i = 0; i < nodes.length; i++) {
    var d = dist(mouseX, mouseY, nodes[i].x, nodes[i].y);
    if (d < 20) {
      return i;
    }
  }
  return null;
}