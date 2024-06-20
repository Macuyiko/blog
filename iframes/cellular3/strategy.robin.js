function emitPacket(n, from) {
  var connected = getConnected(n);
  if (connected.length == 0) return null;
  var next = undefined;
  while ((from == next && connected.length > 1) || next == undefined) {
    nodes[n].last_connected_index = (nodes[n].last_connected_index + 1) % connected.length;
    next = connected[nodes[n].last_connected_index];
  }
  var newPacket = new Packet(n, next);
  packets.push(newPacket);
}

function consumePacket(p) {
  var n = packets[p].to;
  var connected = getConnected(n);
  if (connected.length > 1) emitPacket(n, packets[p].from);
  packets[p].remove()
}