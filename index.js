var request = require('request');
var express = require('express');
var bodyParser = require('body-parser');

var app = require('express')();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

var path = require("path");
var server = require('https').createServer(app);
var io = require('socket.io')(server);

/* Webhook */

app.post('/webhook', function (req, res) {
  // console.log('Dialogflow Request headers: ' + JSON.stringify(req.headers));
  // console.log('Dialogflow Request body: ' + JSON.stringify(req.body));

  if(!req.body)
    return res.sendStatus(400); 
  res.setHeader('Content-Type', 'application/json');
  
  if (req.body.queryResult.intent['displayName'] === "getUserNavigationRequest") {
    var page = req.body.queryResult.parameters['Pages'];
    var fulfillmentMessage = 'Got Page: ' + page + ' from DialogFlow';
    res.json({ fulfillmentText: fulfillmentMessage,
               fulfillmentMessages: [{"text": {"text": [fulfillmentMessage]}}],
               outputContexts: [{ "name": "projects/ice-cream-helper-8226e/agent/sessions/13c7b519-028d-5517-bfab-f10585e781b3/contexts/go-to-action",
                                  "lifespanCount": 1,
                                  "parameters": {
                                    "page": page
                                }}],
               source: 'webhook-heroku'
            });
  } else if (req.body.queryResult.intent['displayName'] === "getIceCreamOrder") {
    var size = req.body.queryResult.parameters['size'];
    var flavour = req.body.queryResult.parameters['flavours'];
    var fulfillmentMessage = 'Got Size: ' + size + ' And Flavour: ' + flavour + ' from DialogFlow';
    res.json({ fulfillmentText: fulfillmentMessage,
               fulfillmentMessages: [{"text": {"text": [fulfillmentMessage]}}],
               outputContexts: [{ "name": "projects/ice-cream-helper-8226e/agent/sessions/13c7b519-028d-5517-bfab-f10585e781b3/contexts/order",
                                  "lifespanCount": 1,
                                  "parameters": {
                                    "size": size,
                                    "flavour": flavour
                                }}],
               source: 'webhook-heroku'
            });
  }
  
  // var atmAndBranches = getAtmAndBranches();
  // console.log('AtmAndBranches Results ' + atmAndBranches);
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