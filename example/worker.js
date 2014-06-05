var http = require('http');
var restarter = require('../worker');

function request() {
  http.get('http://localhost:3000', function (res) {
    console.log("Got response: " + res.statusCode);
  }).on('error', function (err) {
    console.error(err);
  });
}

setInterval(request, 100);

restarter({
  disconnectTime: 100,
  exitTime: 100
});
