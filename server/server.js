//requiring node modules
const PATH = require('path');
const http = require('http');

//requiring the third party module
const Express = require('express');
const SocketIO = require('socket.io');


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
    
    //creating an event [emit function is also a listener but it functions to create events]
    // socket.emit('newEmail', {
    //     from: 'manny@example.com',
    //     text: 'Hey, what is going on.',
    //     createdAt: 123
    // });

    //listening for an emitted event from the client(s)
    // socket.on('createEmail', function (email) {
    //     console.log('createEmail', email);
    // });

    //emitting an event to the client(s)
    socket.emit('newMessage', {
        from: 'User1',
        text: 'This is a Aloha text',
        createdAt: new Date().getTime()
    });

    //listening for a createMessage event from the client(s)
    socket.on('createMessage', function (message) {
        console.log('createMessage', message);
    })

    socket.on('disconnect', function () {
        console.log('User was Disconnected');
    });
});

//setting the static middleware to serve files in the public directory
app.use(Express.static(PUBLICPATH));

server.listen(PORT, function () {
   console.log('Server is listening on port', PORT); 
});