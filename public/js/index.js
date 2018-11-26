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
    let formattedTime = moment(message.createdAt).format('h:mm a');
    let li = jQuery('<li></li>');
    li.text(`${message.from} ${formattedTime}: ${message.text}`);

    jQuery('#messages').append(li);
});

//listening for newLocationMessage event
socket.on('newLocationMessage', function (message) {
    let formattedTime = moment(message.createdAt).format('h:mm a');
    let li = jQuery('<li></li>');
    let a = jQuery('<a target="_blank">My Current Location</a>');
    
    li.text(`${message.from}: ${formattedTime} `);
    a.attr('href', message.url);
    li.append(a);

    jQuery('#messages').append(li);
});

//using Jquery to get message form, 
//overidde the default event action 
//send/emit a createMessage event
jQuery('#message-form').on('submit', function (e) {
    e.preventDefault();

    var messageTextbox = jQuery('[name=message]');

    socket.emit('createMessage', {
        from: 'User',
        text: messageTextbox.val()
    }, function () {
        //this would run after the server listens 
        //and receive the passed data
        messageTextbox.val('');
    });
});

//getting the send location button
var locationButton = jQuery('#send-location');

locationButton.on('click', function () {
    if(!navigator.geolocation){
        return alert('Geolocation not supported by your browser');
    }

    locationButton.attr('disabled', 'disabled').text('Sending location...');

    navigator.geolocation.getCurrentPosition(function (position) {
        locationButton.removeAttr('disabled').text('Send location...');
        //emitting a location event message 
        //if navigator is allowed to process request
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    }, function () {
        alert('Unable to fetch location');
        locationButton.removeAttr('disabled').text('Send location...');
    });
})
