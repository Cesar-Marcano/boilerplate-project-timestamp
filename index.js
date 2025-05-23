// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

function identifyDateType(str) {
  const num = Number(str);
  if (!isNaN(num) && Number.isInteger(num) && num > 0) {
    const dateFromTimestamp = new Date(num);

    if (!isNaN(dateFromTimestamp)) {
      return 'timestamp';
    }
  }

  const iso8601Regex = /^\d{4}-\d{2}-\d{2}$/;
  if (iso8601Regex.test(str)) {
    const dateFromISO = new Date(str);

    if (!isNaN(dateFromISO)) {
      return 'iso-date';
    }
  }

  return 'malformed-string';
}

// your first API endpoint...
app.get('/api/:date?', function (req, res) {
  var dateParam = req.params.date;
  var date;

  if (!dateParam) {
    date = new Date();
  } else if (!isNaN(new Date(dateParam).getTime())) {
    date = new Date(dateParam);
  } else {
    switch (identifyDateType(dateParam)) {
      case 'iso-date':
        date = new Date(dateParam);
        break;
      case 'timestamp':
        date = new Date(parseInt(dateParam));
        break;
      case 'malformed-string':
        return res.status(400).json({ error: 'Invalid Date' });
    }
  }

  res.json({ unix: date.getTime(), utc: date.toUTCString() });
});

// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
