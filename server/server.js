//requiring node modules
const PATH = require('path');
const http = require('http');

//requiring the third party module
const Express = require('express');
const SocketIO = require('socket.io');

//requiring a local module
const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation')
const {Users} = require('./utils/users');

//creating an express application
const app = Express();
//creating a http server using the node http module
//and setting express() as its argument
const server = http.createServer(app);
//creating an IO server using http server as it argument
const IO = SocketIO(server);
var users = new Users();

//setting the server port number
const PORT = process.env.PORT || 3000;
//setting the public folder and getting it path
const PUBLICPATH =  PATH.join(__dirname, './../public');

//this registers an event listener that listens for an
//such event is a connection
IO.on('connection', function (socket) { //this socket argument represents an individual socket instead of that of other users connected to the server
    console.log('New User Connected');


    //listening for join event i.e when a user joins a group
    socket.on('join', function (params, callback) {
        if (!isRealString(params.name) || !isRealString(params.room)) {
            return callback('Name and room are required');
        }

        //joining a room from the params object
        socket.join(params.room);
        //After joining a room now you can emit room events which looks logical
         
        //remove a user from any previous group 
        users.removeUser(socket.id);

        //then
        //adding new user to the users list from the Users class
        users.addUser(socket.id, params.name, params.room);

        IO.to(params.room).emit('updateUserList', users.getUsersList(params.room));
        //on connection event, emit welcome message
        socket.emit('newMessage', generateMessage('Admin','Welcome to the chat app'));

        //emitting a broadcast event informing other sockets about new user
        //the to object allows you to broadcast to room members
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin',`${params.name} has joined this room`));
        
        callback();
    })

    //listening for a createMessage event from the client(s)
    socket.on('createMessage', function (message, callback) {
        let user = users.getUser(socket.id);
        if (user && isRealString(message.text)) {
            //IO server emitting the event to all connected clients
            IO.to(user.room).emit('newMessage', generateMessage(user.name,message.text));
            callback();
        }
    });

    socket.on('createLocationMessage', function (coords) {
        let user = users.getUser(socket.id);

        //if user is available
        if(user){
            //this emiits a newLocation event to the clients
            IO.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, `${coords.latitude}`, `${coords.longitude}`));
        }
    })

    //listening when user joins
    socket.on('disconnect', function () {
        // console.log('User was Disconnected');

        //first we want to remove the user from the group
        //storing the user that is removed first
        var user = users.removeUser(socket.id);

        //if user is available
        if (user) {
            IO.to(user.room).emit('updateUserList', users.getUsersList(user.room));
            IO.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left the room`));
        }
    });
});

//setting the static middleware to serve files in the public directory
app.use(Express.static(PUBLICPATH));

server.listen(PORT, function () {
   console.log('Server is listening on port', PORT); 
});