const moment = require('moment');

//this file contains utility method for message generation
var generateMessage = function (from, text) {
    return {
        from: from,
        text: text,
        createdAt: moment().valueOf()
    };
};

var generateLocationMessage = function (from, latitude, longitude) {
    return {
        from: from,
        url: `https://www.google.com/maps?q=${latitude},${longitude}`,
        createdAt: moment().valueOf()
    };
};

module.exports = {
    generateMessage: generateMessage,
    generateLocationMessage: generateLocationMessage
};