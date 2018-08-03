var last_drag = null;
var paused = false;

var node_energy = null;
var emitter = null;

function randomint(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}

function keyTyped() {
  return false;
}

function setup() {
  createCanvas(520, 320);
  nodes.push(new Node(20, 140));
  nodes.push(new Node(90, 80));
  nodes.push(new Node(90, 220));
  addEdge(0, 1); addEdge(0, 2);
  nodes.push(new Node(180, 80));
  addEdge(1, 3);
  nodes.push(new Node(300, 220));
  addEdge(2, 4);
  nodes.push(new Node(340, 180));
  nodes.push(new Node(360, 220));
  nodes.push(new Node(340, 260));
  addEdge(4, 5); addEdge(4, 6); addEdge(4, 7);
}

function draw() {
  background(240);
  fill(255);
  for (var i = 0; i < nodes.length; i++) {
    var connected = getConnected(i);
    for (var j = 0; j < connected.length; j++) {
      line(nodes[i].x, nodes[i].y, nodes[connected[j]].x, nodes[connected[j]].y);
    }
  }
  for (var i = 0; i < nodes.length; i++) {
    fill(255);
    ellipse(nodes[i].x, nodes[i].y, 20);
    fill(50);
    text(i, nodes[i].x-5, nodes[i].y+5);
  }
  fill(255);
  for (var i = 0; i < packets.length; i++) {
    fill(255, 204, 0);
    ellipse(packets[i].x, packets[i].y, 10);
    fill(50);
    if (packets[i].trajectory)
      text('-> ' + packets[i].to + ' : ' + packets[i].trajectory.join(", "), packets[i].x-5, packets[i].y-10);
  }
  if (!paused && frameCount % 5 == 0) {
    tick();
  }
}

function tick() {
  for (var i = 0; i < packets.length; i++) {
    packets[i].update();
    if (packets[i].arrived()) {
      consumePacket(i);
    }
  }
  if (emitter !== null && frameCount % 15 == 0)
    emitPacket(emitter);
}

function mouseReleased() {
  var inNode = mouseToNodeIndex();
  if (inNode !== null && mouseButton === CENTER) {
    emitter = inNode;
  } else if (inNode === null && mouseButton === CENTER) {
    emitter = null;
  } else if (inNode !== null && inNode == last_drag) {
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

