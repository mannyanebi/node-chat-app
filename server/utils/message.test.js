const expect = require('expect');
const {generateMessage} = require('./message')

describe('GenerateMessage', function () {
   it('should generate a message', function () {
        let from = 'Admin';
        let text = 'This is a test';
      let message = generateMessage(from, text);
    //   expect(message.createdAt).toBeA('number');
    //   expect(message.from).toBe(from);
    //   expect(message.text).toBe(text);
    expect(message).toMatchObject({
        from: from,
        text: text
    });
    // expect(message).toInclude({
    //     from: from,
    //     text: text
    // });
   }); 
});