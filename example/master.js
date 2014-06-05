
var path = require('path');
var cluster = require('cluster');
var childprocess = require('child_process');
var restarter = require('..')();
var appPath = path.join(__dirname, 'app.js');
var workerPath = path.join(__dirname, 'worker.js');

var appNum = 4;

setupCluster();
clusterFork();
workerFork();
console.log('master %s started, input `kill -PIPE %s` to hot restart', process.pid, process.pid);

restarter.on('restart', function () {
  console.log('master get restart message');
  clusterFork();
  workerFork();
});

function setupCluster() {
  cluster.setupMaster({
    exec: appPath
  });

  cluster.on('disconnect', function (worker) {
    console.error('[%s] [master:%s] wroker:%s disconnect, suicide: %s, state: %s.',
      Date(), process.pid, worker.process.pid, worker.suicide, worker.state);
  });

  cluster.on('exit', function (worker, code, signal) {
    restarter.remove(worker);
    var exitCode = worker.process.exitCode;
    if (exitCode === 100) {
      return console.log('app %s exit by hot reload', worker.process.pid);
    }
    console.error('app %s exit.', worker.process.pid);

    // fork a new one if exit not by restart
    setTimeout(function () {
      var newWorker = cluster.fork();
      restarter.add(newWorker);
    }, 1000);
  });
}

function clusterFork() {
  for (var i = 0; i < appNum; i++) {
    var worker = cluster.fork();
    restarter.add(worker);
  }
}

function workerFork() {
  var worker = childprocess.fork(workerPath);
  restarter.add(worker);
  worker.on('exit', function (code, signal) {
    restarter.remove(worker);
    if (code === 100) {
      return console.log('worker %s exit by hot reload', worker.pid);
    }
    console.error('app %s exit.', worker.pid);
    setTimeout(workerFork, 1000);
  });
}
