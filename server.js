const config = require('./config/config');

// Init the express application
const app = require('./config/express')();

// Expose app
exports = module.exports = app;

if (!module.parent) {
    const server = app.listen(config.port, () => {
        console.log(`Server is running on port ${config.port}`);
    });

    // Graceful shutdown
    process.on('SIGINT', function () {
        console.log('Gracefully shutting down from SIGINT (Ctrl-C)');
        console.log('Server closed');
        server.close();
        process.exit(1);
    });
}

// Logging initialization
console.log(`Starting server on port ${config.port}`);