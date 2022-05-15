const { connect, connection } = require('mongoose');

connect('mongodb://localhost/TheSocialDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = connection;