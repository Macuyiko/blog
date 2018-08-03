var emitSpeed, packetEnergy, energyRequired;


var last_drag = null;
var paused = false;

var node_energy = {};
var emitter = 0;

function emitPacket(n, from) {
  var connected = getConnected(n);
  if (connected.length == 0) return null;
  var next = undefined;
  while ((from == next && connected.length > 1) || next == undefined) {
    next = connected[randomint(0, connected.length)];
  }
  var newPacket = new Packet(n, next);
  packets.push(newPacket);
}

function consumePacket(p) {
  var n = packets[p].to;
  if (node_energy !== null && !(nodes[n].id in node_energy)) node_energy[nodes[n].id] = 0;
  if (node_energy !== null && node_energy[nodes[n].id] < energyRequired.value()) {
    node_energy[nodes[n].id] += packetEnergy.value();
  } else {
    var connected = getConnected(n);
    if (connected.length > 1) emitPacket(n, packets[p].from);
  }
  packets[p].remove()
}

function randomint(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}

function keyTyped() {
  return false;
}

function setup() {
  createSpan('Emit speed (higher is slower): ');
  emitSpeed = createSlider(5, 30, 15);
  createSpan('<br>Energy per packet: ');
  packetEnergy = createSlider(5, 50, 20);
  createSpan('<br>Energy threshold: ');
  energyRequired = createSlider(0, 500, 100);
  createP('');

  createCanvas(520, 320);
  nodes.push(new Node( 25 , 133 ));
  nodes.push(new Node( 156 , 129 ));
  nodes.push(new Node( 122 , 87 ));
  nodes.push(new Node( 158 , 67 ));
  nodes.push(new Node( 188 , 263 ));
  nodes.push(new Node( 395 , 116 ));
  nodes.push(new Node( 368 , 70 ));
  nodes.push(new Node( 402 , 58 ));
  nodes.push(new Node( 442 , 71 ));
  nodes.push(new Node( 449 , 109 ));
  nodes.push(new Node( 234 , 247 ));
  nodes.push(new Node( 233 , 284 ));
  addEdge(0, 1); addEdge(1, 2); addEdge(1, 3); addEdge(1, 4);
  addEdge(4, 10); addEdge(4, 11); addEdge(1, 5); addEdge(5, 6);
  addEdge(5, 7); addEdge(5, 8); addEdge(5, 9);
}

function draw() {
  background(240);
  text('Speed: ' + emitSpeed.value() + ' | Energy: ' + packetEnergy.value() + ' | Threshold: ' + energyRequired.value(), 10, 20);
  fill(255);
  for (var i = 0; i < nodes.length; i++) {
    var connected = getConnected(i);
    for (var j = 0; j < connected.length; j++) {
      line(nodes[i].x, nodes[i].y, nodes[connected[j]].x, nodes[connected[j]].y);
    }
  }
  for (var i = 0; i < nodes.length; i++) {
    fill(255, 100 + node_energy[nodes[i].id], 60);
    ellipse(nodes[i].x, nodes[i].y, 20);
    fill(50);
    text(node_energy[nodes[i].id], nodes[i].x-10, nodes[i].y+5);
  }
  fill(255);
  for (var i = 0; i < packets.length; i++) {
    fill(255, 204, 0);
    ellipse(packets[i].x, packets[i].y, 10);
    fill(50);
  }
  if (!paused && frameCount % 5 == 0) {
    tick();
  }
}

function tick() {
  for (var i = 0; i < nodes.length; i++) {
    if (!(nodes[i].id in node_energy)) node_energy[nodes[i].id] = 0;
    node_energy[nodes[i].id] = max(node_energy[nodes[i].id] - 1, 0);
  }
  for (var i = 0; i < packets.length; i++) {
    packets[i].update();
    if (packets[i].arrived()) {
      consumePacket(i);
    }
  }
  if (emitter !== null && frameCount % emitSpeed.value() == 0)
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

