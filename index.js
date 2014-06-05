/*!
 * hot-restart - index.js
 * Copyright(c) 2014 dead_horse <dead_horse@qq.com>
 * MIT Licensed
 */

'use strict';

var debug = require('debug')('hot-restart:master');
var EventEmitter = require('events').EventEmitter;
var util = require('util');

function Restarter() {
  this.workers = [];
}

util.inherits(Restarter, EventEmitter);

Restarter.prototype.add = function (worker) {
  var self = this;
  if (Array.isArray(worker)) {
    worker.forEach(function (w) {
      self.add(w);
    });
    return;
  }
  if (~this.workers.indexOf(worker)) return;

  this.workers.push(worker);
  debug('add worker, worker list length %d', this.workers.length);
};

Restarter.prototype.remove = function(worker) {
  var self = this;
  if (Array.isArray(worker)) {
    worker.forEach(function (w) {
      self.remove(w);
    });
    return;
  }

  var index = this.workers.indexOf(worker);
  if (index < 0) return;
  this.workers.splice(index, 1);
  debug('remove worker, worker list length %d', this.workers.length);
};

Restarter.prototype.send = function () {
  this.workers.forEach(function (worker) {
    try {
      worker.send({action: '__reload__'});
    } catch (err) {
      console.error('send reload message to worker error: %s', err.message);
    }
  });
  return this;
};

var restarter = null;

module.exports = function (sig) {
  if (restarter) {
    return restarter;
  }
  restarter = new Restarter();
  sig = sig || 'SIGPIPE';
  process.on(sig, function () {
    debug('get restart sig: %s, send restart message to workers', sig);
    restarter.send();
    setImmediate(function () {
      restarter.emit('restart');
    });
  });
  return restarter;
};
