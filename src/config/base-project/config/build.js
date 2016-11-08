const settings = require('./settings.json');
const webpack = require("webpack");
var WebpackDevServer = require("webpack-dev-server");
const serverConfig = require('./webpack.server');
const clientConfig = require('./webpack.client');
const spawn = require('child_process').spawn;

/* Server webpack instance */
var express;
webpack(serverConfig, (err, stats) => {
    if (err) {
        throw new Error('Webpack could not build at this time.', err);
    }
    console.log('[webpack:server:build]', stats.toString({
        chunks: false,
        colors: true
    }));
    startExpressApp(); // After build start the server
});

if (!process.env.PORT) {
    // Use the server port defined in the settings file 
    process.env.PORT = settings.server.port;
}
process.env.DEBUG = 'modern-express:*';

function startExpressApp() {
    if (express && !express.killed) {
        // Stop the express application
        express.kill();
    }
    // Start the express application
    express = spawn('node', ['build/compiled'], {
        env: process.env
    });

    express.stdout.on('data', (data) => {
        process.stdout.write(data);
    });
}

/* Client webpack instance */
if (clientConfig.devServer.inline) {
    // Attach live reload
    clientConfig.entry.app.unshift(`webpack-dev-server/client?http://${clientConfig.devServer.host}:${settings.client.port}`);
}
const compiler = webpack(clientConfig);
clientConfig.devServer.port = settings.client.port;
clientConfig.devServer.proxy[settings.server.proxy] = `http://localhost:${settings.server.port}`;

const server = new WebpackDevServer(compiler, clientConfig.devServer);
server.listen(settings.client.port, function() {
    console.log(`Starting server on http://localhost:${settings.client.port}`);
});