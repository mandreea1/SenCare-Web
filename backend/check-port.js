const net = require('net');

const port = 3003;
const host = '127.0.0.1';

const socket = new net.Socket();

socket.setTimeout(2000);

socket.on('connect', function() {
  console.log(`Portul ${port} este DESCHIS pe ${host}`);
  socket.destroy();
  process.exit(0);
}).on('timeout', function() {
  console.log(`Timeout: Portul ${port} NU răspunde pe ${host}`);
  socket.destroy();
  process.exit(1);
}).on('error', function(err) {
  console.log(`Portul ${port} este ÎNCHIS sau blocat pe ${host}:`, err.message);
  process.exit(1);
}).connect(port, host); 