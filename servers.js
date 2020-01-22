const express = require('express');
const app = express();
const http = require('http');
var server = http.createServer();
var websocket = require("ws");
const path = require('path')
app.use(express.static(path.join(__dirname + '/public')));

const socketio = require('socket.io');
const expressServer = app.listen(9090);
const io = socketio(expressServer);
const io2 = new websocket.Server({server});
console.log("server started on port 9090");

//App organisation
module.exports = {
    app,
    io,
    io2
}