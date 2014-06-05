/*!
 * hot-restart - worker.js
 * Copyright(c) 2014 dead_horse <dead_horse@qq.com>
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 */

var debug = require('debug')('hot-restart:worker');
var cluster = require('cluster');

module.exports = function (options) {
  var servers = options.servers || [];
  var exitCode = options.exitCode || 100;
  var disconnectTime = options.disconnectTime || 10000;
  var exitTime = options.exitTime || 20000;

  if (!Array.isArray(servers)) {
    servers = [ servers ];
  }

  process.on('message', function (msg) {
    if (!msg || msg.action !== '__reload__') {
      return;
    }
    debug('worker:%s get reload message', process.pid);

    setTimeout(disconnect, disconnectTime);
    setTimeout(exit, exitTime);
  })

  function disconnect() {
    if (cluster.worker && !cluster.worker.suicide) {
      debug('cluster worker disconnect');
      cluster.worker.disconnect();
    }
    servers.forEach(function (s) {
      s.close();
    });
    debug('close all %s servers', servers.length);
  }

  function exit() {
    process.exit(exitCode);
  }
}
