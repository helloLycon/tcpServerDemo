#!/usr/local/bin/node
const net = require('net');
const terminal = require('./terminal');


//const LISTEN_HOST = '127.0.0.1';
const LISTEN_PORT = 6969;

var clients = new Set();

terminal.termInit(clients);

/**
 * Create a server instance, and chain the listen function to it
 * The function passed to net.createServer() becomes the event handler for the 'connection' event
 * The sock object the callback function receives UNIQUE for each connection
 */
const server = net.createServer( sock => {
    /* We have a connection - a socket object is assigned to the connection automatically */
    console.log(`${sock.remoteAddress}:${sock.remotePort} Connected!\r\n`);
    /* push new sock into buffer */
    clients.add(sock);

    /**
     * broadcast to all other clients
     */
    clients.forEach(function(client){
        if(client != sock){
            client.write(`${sock.remoteAddress}:${sock.remotePort} Connected!\r\n`);
        }
    });

    /* Add a 'data' event handler to this instance of socket */
    sock.on('data', data => {
        console.log(`${sock.remoteAddress}:${sock.remotePort} => ${data}`);
        /* Write the data back to the socket, the client will receive it as data from the server */
        sock.write(`u sent ${data.byteLength} bytes\r\n`);
    });
    
    /* Add a 'close' event handler to this instance of socket */
    sock.on('close', () => {
        console.log(`${sock.remoteAddress}:${sock.remotePort} Disconnected!`);
        clients.delete(sock);
        console.log(`now left ${clients.size} clients`);
    });
    
}).listen(LISTEN_PORT);

/* error handler */
server.on('error' , err => {
    console.log(`error: ${err}`);
});

console.log('Server listening on ' +':'+ LISTEN_PORT);

