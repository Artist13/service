'use strict';

const express = require('express');

process.env.BASE_UUID = Math.random().toString(36).substring(7);

var statistic = {
  v3Count: 0,
  v5Count: 0,
  healthBadCount: 0,
  // okCount = 0,
  errorCount: 0,
  otherCount: 0
};

function isOk() {
  return true;
}

const controller = {
  v3: function(req, res) {
    statistic.v3Count++;
    var val = req.params.value;
    res.send(val + process.env.BASE_UUID);
  },
  v5: function(req, res) {
    statistic.v5Count++;
    var val = req.params.value;
    res.send(val + process.env.BASE_UUID);
  },
  health: function(req, res) {
    if (isOk()) {
      res.status(200);
    } {
      res.status(503);
    }
    
  },
  metrics: function(req, res) {
    let responseText = `
    v3count ${statistic.v3Count}\n
    v5count ${statistic.v5Count}\n
    503count ${statistic.healthBadCount}\n
    404count ${statistic.otherCount}\n
    `;
    res.send(responseText);
  }
};

function routes(app) {
  app.route('/v3/:value').get(controller.v3);
  app.route('/v5/:value').get(controller.v5);
  app.route('/health').get(controller.health);
  app.route('/metrics').get(controller.metrics);

  app.use(function(req, res){
    statistic.otherCount++;
    res.status(404);
  });
}

// consts
const port = 8080;
const host = '0.0.0.0';

const app = express();
routes(app);

app.listen(port, host);
console.log(`running on http://${host}:${port}`);