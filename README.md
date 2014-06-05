hot-restart
------------

[![NPM version](https://badge.fury.io/js/hot-restart.svg)](http://badge.fury.io/js/hot-restart)
[![Build Status](https://travis-ci.org/node-modules/hot-restart.svg?branch=master)](https://travis-ci.org/node-modules/hot-restart)

hot restart a node server in cluster mode.

## Install

```
npm install hot-restart
```

## Usage

in master:

```
var restarter = require('hot-restart')();

restarter.on('restart', fuction () {
  // fork new workers
});

// when new work forked
restarter.add(newWorker);

// when old work died
restarter.remove(oldWorker);
```

in worker:

```
var restarter = require('hot-restart/worker');

restarter({
  disconnectTime: 1000,
  exitTime: 2000
});
```

use signal to hot restart the server: `kill -PIPE 3132`

checkout the [example](example).

## License

MIT
