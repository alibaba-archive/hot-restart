var http = require('http');
var restarter = require('../worker');

var app = http.createServer(function (req, res) {
  res.statusCode = 200;
  res.end('hello world');
});

app.listen(3000);
console.log('app start listen at 3000');

restarter({
  servers: app,
  disconnectTime: 5000,
  exitTime: 10000
});
