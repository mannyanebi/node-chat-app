//requiring node modules
const PATH = require('path');

//requiring the third party module
const Express = require('express');

//creating an express application
const app = Express();

//setting the port number
const PORT = process.env.PORT || 3000;

//setting the public folder and getting it path
const PUBLICPATH =  PATH.join(__dirname, './../public');

//setting the static middleware to serve files in the public directory
app.use(Express.static(PUBLICPATH));

app.listen(PORT, function () {
   console.log('Server is listening on port', PORT); 
});