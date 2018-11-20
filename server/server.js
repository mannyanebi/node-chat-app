//requiring node modules
const PATH = require('path');
const http = require('http');

//requiring the third party module
const Express = require('express');
const SocketIO = require('socket.io');

//requiring a local module
const {generateMessage} = require('./utils/message');

//creating an express application
const app = Express();
//creating a http server using the node http module
//and setting express() as its argument
const server = http.createServer(app);
//creating an IO server using http server as it argument
const IO = SocketIO(server);

//setting the server port number
const PORT = process.env.PORT || 3000;
//setting the public folder and getting it path
const PUBLICPATH =  PATH.join(__dirname, './../public');

//this registers an event listener that listens for an
//such event is a connection
IO.on('connection', function (socket) { //this socket argument represents an individual socket instead of that of other users connected to the server
    console.log('New User Connected');

    //on connection event, emit welcome message
    socket.emit('newMessage', generateMessage('Admin','Welcome to the chat app'));

    //emitting a broadcast event informing other sockets about new user
    socket.broadcast.emit('newMessage', generateMessage('Admin','New User joined'));

    //listening for a createMessage event from the client(s)
    socket.on('createMessage', function (message, callback) {
        console.log('createMessage', message);
        //IO server emitting the event to all connected clients
        IO.emit('newMessage', generateMessage(message.from,message.text));
        callback('This is from the server');

    });

    socket.on('disconnect', function () {
        console.log('User was Disconnected');
    });
});

//setting the static middleware to serve files in the public directory
app.use(Express.static(PUBLICPATH));

server.listen(PORT, function () {
   console.log('Server is listening on port', PORT); 
});