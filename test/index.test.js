/*!
 * hot-restart - test/index.test.js
 * Copyright(c) 2014 dead_horse <dead_horse@qq.com>
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 */

var restarter = require('..')();
var childprocess = require('child_process');
var cluster = require('cluster');
var path = require('path');
var pedding = require('pedding');

var workerPath = path.join(__dirname, 'support', 'worker.js');

cluster.setupMaster({
  exec: workerPath
});

var clusterWorker;
var childWorker;

describe('test/index.test.js', function () {
  it('should add worker ok', function () {
    clusterWorker = cluster.fork();
    restarter.add(clusterWorker);
    restarter.workers.should.have.length(1);

    childWorker = childprocess.fork(workerPath);
    restarter.add(childWorker);
    restarter.workers.should.have.length(2);
  });

  it('should ignore repeat worker', function () {
    restarter.add(clusterWorker);
    restarter.add(childWorker);
    restarter.workers.should.have.length(2);
  });

  it('should get restart message', function (done) {
    var _done = pedding(6, function () {
      done();
    });

    restarter.once('restart', _done);
    clusterWorker.on('disconnect', _done);
    clusterWorker.on('exit', _done);
    cluster.on('disconnect', _done);
    cluster.on('exit', _done);
    childWorker.on('exit', _done);
    process.emit('SIGPIPE');
  });
});
