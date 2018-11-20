//initiating a request from client to 
//server to open up a 
//socket and keep the connection open
let socket = io(); //this socket variable is what we will use to listen for data from the server and send to the server

//listening for a connect event from the server
socket.on('connect', function () {
    console.log('Connected to Server');

    //emitting a createMessage event 
    // socket.emit('createMessage', {
    //     from: 'User2',
    //     text: 'This is from User 2'
    // });
});

socket.on('connection', function (message) {
    console.log(message);
});

//listening for a disconnect event from the server
socket.on('disconnect', function () {
    console.log('Disconnected from Server');
});

//listening for a newMessage event from the server
socket.on('newMessage', function (message) {
    console.log('newMessage', message);
})

