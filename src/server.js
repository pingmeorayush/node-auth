const app = require('./app');
const http = require('http');
const dotenv = require('dotenv');

const connectDB = require('./database/connection');

dotenv.config('.env');

/**
 * Create HTTP server
 */
var server = http.createServer(app);

/**
 * Database connection
 */
connectDB();

require('./models/Admin');
require('./models/AdminPassword');

const PORT = process.env.PORT;

server.listen(PORT);
// server.on('error',onError);
// server.on('listening', onListening);

/**
 * Event listener for HTTP server "error event"
 */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  console.log('Listening on ' + bind);
}
