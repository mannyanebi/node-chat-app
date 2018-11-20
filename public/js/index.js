//initiating a request from client to 
//server to open up a 
//socket and keep the connection open
let socket = io(); //this socket variable is what we will use to listen for data from the server and send to the server

//listening for a connect event from the server
socket.on('connect', function () {
    console.log('Connected to Server');
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
    let li = jQuery('<li></li>');
    li.text(`${message.from}: ${message.text}`);

    jQuery('#messages').append(li);
});

//using Jquery to get message form, 
//overidde the default event action 
//send/emit a createMessage event
jQuery('#message-form').on('submit', function (e) {
    e.preventDefault();

    socket.emit('createMessage', {
        from: 'User',
        text: jQuery('[name=message]').val()
    }, function () {
        // console.log('Message received', data);
    });
});
