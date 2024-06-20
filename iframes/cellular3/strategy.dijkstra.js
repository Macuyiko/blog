function dijkstra(s) {
  var solutions = {};
  solutions[s] = [];
  solutions[s].dist = 0;
  while (true) {
    var parent = null;
    var nearest = null;
    var tdist = Infinity;
    for (var n in solutions) {
      if(!solutions[n]) continue
      var ndist = solutions[n].dist;
      var adj = getConnected(n);
      for (var ai = 0; ai < adj.length; ai++) {
        a = adj[ai];
        if(solutions[a]) continue;
        var d = dist(nodes[a].x, nodes[a].y, nodes[n].x, nodes[n].y) + ndist;
        if(d < tdist) {
          parent = solutions[n];
          nearest = a;
          tdist = d;
        }
      }
    }
    if (tdist === Infinity) break;
    solutions[nearest] = parent.concat(nearest);
    solutions[nearest].dist = tdist;
  }
  return solutions;
}

function emitPacket(n) {
  var connected = getConnected(n);
  if (connected.length == 0) return null;
  var finaldest = randomint(0, nodes.length - 1)
  var trajectory = dijkstra(n)[finaldest];
  if (trajectory.dist == 0 || trajectory.dist == Infinity) return;
  var newPacket = new Packet(n, trajectory.shift());
  newPacket.trajectory = trajectory;
  packets.push(newPacket);
}

function consumePacket(p) {
  var n = packets[p].to;
  if (packets[p].trajectory.length > 0) {
    var newPacket = new Packet(n, packets[p].trajectory.shift());
    newPacket.trajectory = packets[p].trajectory;
    packets.push(newPacket);
  }
  packets[p].remove()
}