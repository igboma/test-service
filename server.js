const config = require('./config/config');

// Init the express application
const app = require('./config/express')();

// // Start the app by listening on <port>
// app.listen(config.port);

// process.on('SIGINT', function () {
//     console.log('Gracefully shutting down from SIGINT (Ctrl-C)');
//     // some other closing procedures go here
//     process.exit(1);
// });

// Expose app
exports = module.exports = app;

if (!module.parent) {
    const server = app.listen(config.port, () => {
      console.log(`Server is running on port ${config.port}`);
    });
  
    // Graceful shutdown
    process.on('SIGINT', function () {
      console.log('Gracefully shutting down from SIGINT (Ctrl-C)');
      // Some other closing procedures go here, if needed
      server.close(() => {
        console.log('Server closed');
        process.exit(1);
      });
    });
  }

// Logging initialization
console.log(`Starting server on port ${config.port}`);