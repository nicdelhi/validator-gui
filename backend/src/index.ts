import { exec } from 'child_process';
import * as express from 'express';
import path = require('path');
import configureAuthHandlers from './handlers/auth';
import configureCliHandlers from './handlers/node';

const app = express();
const port = process.env.PORT || 8080;

// define a route handler for the default home page
app.get('/', (req, res) => {
  // // render the index template
  // res.sendFile(path.join(__dirname, '../../../frontend/index.html'));

  // redirect to port 3000 for next.js frontend
  res.redirect("http://localhost:3000")
});

configureAuthHandlers(app)

configureCliHandlers(app)

// start the express server
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});

app.get('/node/status', (req, res) => {
  console.log('fetching node state');
  res.send({
    state: 'active',
    lastActive: '2011-05-02T11:52:23.24Z',
    stakeAmount: '40000000000000000000',
    stakeRequirement: '20000000000000000000',
    earnings: '200000000000000000',
    lastPayout: '2011-05-02T11:52:23.24Z',
    lifetimeEarnings: '200000000000000000',
    stakeAddress: '0x23904...',
  });
});

app.get('/node/status/history', (req, res) => {
  console.log('fetching node history');
  // @ts-ignore
  if (req.params['from']) {
    res.send([
      {
        state: 'active',
        stakeAmount: '40000000000000000000',
        stakeRequirement: '20000000000000000000',
        lifetimeEarnings: '200000000000000000',
        date: '2011-05-02T11:52:23.24Z',
      },
      {
        state: 'active',
        stakeAmount: '40000000000000000000',
        stakeRequirement: '20000000000000000000',
        date: '2011-05-04T11:52:23.24Z',
      },
    ]);
    // @ts-ignore
  } else if (req.params['latest']) {
    res.send({
      state: 'active',
      stakeAmount: '40000000000000000000',
      stakeRequirement: '20000000000000000000',
      date: '2011-07-04T11:52:23.24Z',
    });
  }
});

app.get('/node/version', (req, res) => {
  console.log('fetching node version');
  res.send({
    runningVersion: '1.0.0',
    minimumVersion: '1.0.0',
    latestVersion: '1.1.1',
  });
});

app.get('/node/performance', (req, res) => {
  console.log('fetching node state');
  res.send([
    {
      cpu: 42,
      ram: 23,
      disk: 93499234,
      network: 14,
      tpsThroughput: 14,
      transactionCount: 24242,
      stateStorage: 1412344,
      date: '2022-12-22T11:23:55.848Z',
    },
  ]);
});

app.get('/node/network', (req, res) => {
  console.log('fetching node state');
  res.send({
    size: {
      active: 2002,
      standBy: 200,
      desired: 2000,
      joining: 4,
      syncing: 2,
    },
    load: {
      maxTps: 14000,
      avgTps: 9000,
      totalProcessed: 51258129,
    },
    health: {
      activeStandbyRatio: 20,
      desiredActiveStandbyRatio: 25,
    },
    reward: {
      dailyIssuance: '1000000000000000',
      avgPerDay: '1000000000000000',
      avgPerNodeDay: '1000000000000000',
    },
    apr: {
      nodeApr: 4,
      avgApr: 9,
    },
  });
});
