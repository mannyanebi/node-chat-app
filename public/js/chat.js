//initiating a request from client to 
//server to open up a 
//socket and keep the connection open
let socket = io(); //this socket variable is what we will use to listen for data from the server and send to the server

//autoscrolling function if messages exceed client viewport
function scrollToBottom() {
    //Selectors
    let messages = jQuery('#messages');
    let newMessage = messages.children('li:last-child');

    //Heights
    let clientHeight = messages.prop('clientHeight');
    let scrollTop = messages.prop('scrollTop');
    let scrollHeight = messages.prop('scrollHeight');
    let newMessageHeight = newMessage.innerHeight();
    let lastMessageHeight = newMessage.prev().innerHeight();

    if((clientHeight + scrollTop  + newMessageHeight + lastMessageHeight) >= scrollHeight){
        messages.scrollTop(scrollHeight);
    }
}

//listening for a connect event from the server
socket.on('connect', function () {
    console.log('Connected to Server');
    //getting parameters to create join emit from url passed
    //using a library that allows deparam just like jQuery.param
    let params = jQuery.deparam(window.location.search);

    socket.emit('join', params, function (err) {
        if (err) {
            alert(err);
            window.location.href = '/'
        } else {
            console.log('No error');
        }
    })
});

//listening for a connection event to the server
socket.on('connection', function (message) {
    console.log(message);
});

//listening for a disconnect event from the server
socket.on('disconnect', function () {
    console.log('Disconnected from Server');
});

socket.on('updateUserList', function (users) {
    var ol = jQuery('<ol></ol>');

    users.forEach(function (user) {
        ol.append(jQuery('<li></li>').text(user));
    })

    jQuery('#users').html(ol);
})

//listening for a newMessage event from the server
socket.on('newMessage', function (message) {
    //this templating engine provides to you a reusable structure
    let formattedTime = moment(message.createdAt).format('h:mm a');
    let template = jQuery('#message-template').html();
    let html = Mustache.render(template, {
        //this then allows you to provide a dynamic data
        text: message.text,
        from: message.from,
        createdAt: formattedTime
    });
    
    jQuery('#messages').append(html);
    
    // let formattedTime = moment(message.createdAt).format('h:mm a');
    // let li = jQuery('<li></li>');
    // li.text(`${message.from} ${formattedTime}: ${message.text}`);

    // jQuery('#messages').append(li);

    scrollToBottom();
});

//listening for newLocationMessage event
socket.on('newLocationMessage', function (message) {
    
    let formattedTime = moment(message.createdAt).format('h:mm a');
    let template = jQuery('#location-message-template').html();
    let html = Mustache.render(template, {
        from: message.from,
        url: message.url,
        createdAt: formattedTime
    });

    jQuery('#messages').append(html);
    scrollToBottom();
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
