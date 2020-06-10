var request = require('request');
var express = require('express');
var bodyParser = require('body-parser');

var app = require('express')();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

var path = require("path");
var server = require('https').createServer(app);
var io = require('socket.io')(server);
var array = [];

/* Webhook */

app.post('/webhook', function (req, res) {
  // console.log('Dialogflow Request headers: ' + JSON.stringify(req.headers));
  // console.log('Dialogflow Request body: ' + JSON.stringify(req.body));

  if(!req.body)
    return res.sendStatus(400); 
  res.setHeader('Content-Type', 'application/json');

  if (req.body.queryResult.intent['displayName'] === "balance.check") {
    var param              = '';
    var fulfillmentMessage = '';
    var balanceType        = req.body.queryResult.parameters['balance-type'];
    var digits             = req.body.queryResult.parameters['number'];

    if (balanceType.hasOwnProperty("global")) {
      param = req.body.queryResult.parameters['balance-type'].['global'];
    } else if (balanceType.hasOwnProperty("account-type")) {
      param = req.body.queryResult.parameters['balance-type'].['account-type'];
    } else if (balanceType.hasOwnProperty("card-type")) {
      param = req.body.queryResult.parameters['balance-type'].['card-type'];
    }

    if (balanceType.hasOwnProperty("global")) {
      var fulfillmentMessage = 'Your current global balance is equivalent to: 850 USD';
    } else if (digits != null) {      
      var fulfillmentMessage = 'Your current ' + param + ' balance is equivalent to: 150 USD';
    } else {
      var fulfillmentMessage = 'Please provide the last 4 digits of the requested ' + param;
    }
    
    array.push({ fulfillmentText: fulfillmentMessage,
                 fulfillmentMessages: [{"text": {"text": [fulfillmentMessage]}}],
                 source: 'webhook-heroku'
              });
  }
  
  // var atmAndBranches = getAtmAndBranches();
  // console.log('AtmAndBranches Results ' + atmAndBranches);

  console.log(array);
  res.json(array);
})

app.listen((process.env.PORT || 8000), function() {
  console.log("Server up and listening");
});

/* Calling WSO2 Web APIS */

function getAtmAndBranches() {
  var https = require('https');
  var success = function(data) {console.log('Success');};
  var dataString = JSON.stringify({'lng': 'en'}); 
  console.log(`REST API Start! data = ${dataString} and success = ${success}`);

  var options = {
    host: 'cmbaas.capital-banking.com',
    path: '/cn/public/atmbranches',
    method: 'POST',
    headers: {'Content-Type': 'application/json',
              'Content-Length': dataString.length}
  };

  var req = https.request(options, function(res) {
    console.log(`HTTPS request just started !`);
    res.setEncoding('utf-8');
    var responseString = '';

    res.on('data', function(data) {
      responseString += data;
      console.log(`responseString on DATA !`);
    });

    res.on('end', function() {
      console.log(`responseString on END !` + responseString);
      var responseObject = JSON.parse(responseString);
      success(responseObject);
    });
  });

  req.write(dataString);
  req.end();
  console.log(`REST API End !`);
  return responseObject;
}