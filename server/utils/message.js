//this file contains utility method for message generation

var generateMessage = function (from, text) {
    return {
        from: from,
        text: text,
        createdAt: new Date().getTime()
    };
};

module.exports = {
    generateMessage: generateMessage
};