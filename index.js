var https = require('https');
var success = function(data) {
  console.log('Success');
};
var dataString = JSON.stringify({'lng': 'en'});
console.log(`REST API Start! data = ${dataString}`);

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