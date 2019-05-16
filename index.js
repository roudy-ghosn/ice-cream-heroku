var request = require('request');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
var path = require("path");
var server = require('https').createServer(app);
var io = require('socket.io')(server);

/* WebHook */

app.host('/webhook', function(req, res){
  console.log('Received a POST request');
  
  if(!req.body)
    return res.sendStatus(400); 
  res.setHeader('Content-Type', 'application/json');
  
  console.log('Heres the post request from DialogFlow');
  console.log(req.body);
  console.log('Got Size: ' + req.body.queryResult.parameters['size'] + ' And Flavour: ' + req.body.queryResult.parameters['flavour'] + ' from DialogFlow');

  var size = req.body.queryResult.parameters['size'];
  var flavour = req.body.queryResult.parameters['flavour'];

  // var atmAndBranches = getAtmAndBranches();
  // console.log('AtmAndBranches Results ' + atmAndBranches);

  let response = " ";
  let responseObj = {
                      "fullfillmentText" : response,
                      // "fullfillmentMessages" : [{"text": {"text": [atmAndBranches]}}],
                      "source": ""
                    }

  console.log('Heres the response to DialogFlow');
  console.log(responseObj);
  return res.json(responseObj);
})

/* Calling WSO2 Web APIS */

// function getAtmAndBranches() {
//   var https = require('https');
//   var success = function(data) {console.log('Success');};
//   var dataString = JSON.stringify({'lng': 'en'});
//   console.log(`REST API Start! data = ${dataString} and success = ${success}`);

//   var options = {
//     host: 'cmbaas.capital-banking.com',
//     path: '/cn/public/atmbranches',
//     method: 'POST',
//     headers: {'Content-Type': 'application/json',
//               'Content-Length': dataString.length}
//   };

//   var req = https.request(options, function(res) {
//     console.log(`HTTPS request just started !`);
//     res.setEncoding('utf-8');
//     var responseString = '';

//     res.on('data', function(data) {
//       responseString += data;
//       console.log(`responseString on DATA !`);
//     });

//     res.on('end', function() {
//       console.log(`responseString on END !` + responseString);
//       var responseObject = JSON.parse(responseString);
//       success(responseObject);
//     });
//   });

//   req.write(dataString);
//   req.end();
//   console.log(`REST API End !`);
//   return responseObject;
// }