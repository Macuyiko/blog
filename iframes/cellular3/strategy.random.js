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
  if (node_energy !== null && node_energy[nodes[n].id] < 100) {
    node_energy[nodes[n].id] += 20;
  } else {
    var connected = getConnected(n);
    if (connected.length > 1) emitPacket(n, packets[p].from);
  }
  packets[p].remove()
}