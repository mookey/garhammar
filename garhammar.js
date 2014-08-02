var express = require('express'),
    app = express();

require('./server/config/config.js')(app);
require('./server/controllers/routes.js')(app);
require('./server/controllers/admin.js')(app);
require('./server/config/errors.js')(app);

app.listen(3033);

log = function(first, second) {
  if (second) {
    console.log(first, second);
  } else {
    console.log(first);
  }
}