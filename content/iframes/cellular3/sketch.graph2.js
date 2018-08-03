var last_drag = null;
var paused = false;

function keyTyped() {
  return false;
}

function setup() {
  createCanvas(520, 320);
}

function draw() {
  background(240);
  for (var i = 0; i < nodes.length; i++) {
    var connected = getConnected(i);
    for (var j = 0; j < connected.length; j++) {
      line(nodes[i].x, nodes[i].y, nodes[connected[j]].x, nodes[connected[j]].y);
    }
  }
  for (var i = 0; i < nodes.length; i++) {
    ellipse(nodes[i].x, nodes[i].y, 20);
  }
  if (!paused && frameCount % 15 == 0) {
    tick();
  }
}

function tick() {
  
}

function mouseReleased() {
  var inNode = mouseToNodeIndex();
  if (inNode !== null && inNode == last_drag) {
    removeNode(inNode);
  } else if (inNode !== null && last_drag !== null && inNode != last_drag) {
    addEdge(last_drag, inNode);
  } else {
    var newNode = new Node(mouseX, mouseY);
    nodes.push(newNode);
  }
  last_drag = null;
}

function mousePressed() {
  last_drag = mouseToNodeIndex();
}

