/*
    Creates a Node.js server that listens for calls to /webhooks/posts
    When the call is made, we'll send a message to slack
*/

const express = require('express');
const bodyParser = require('body-parser');
const variables = require('./variables');
const sender = require('./message-sender')
const request = require('request')


/******* START SERVER *******/
const server = express();
server.use(bodyParser.json());
const port = (process.env.PORT || variables.port)
server.listen(port);
console.log('[+] Notifier server started at port ' + port);


/****** SET OWN WEBHOOK *******/
server.post(variables.webhookPath, (req, res) => {
  if ((variables.userAgent && req.headers["user-agent"].includes(variables.userAgent)) ||
    (variables.expectedIp && req.headers["x-forwarded-for"].includes(variables.expectedIp))) {
    res.sendStatus(200)
    sender.sendMessages(req.body.pullRequest)
  } else {
    res.sendStatus(403)
  }

})
