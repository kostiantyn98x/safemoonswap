const express = require('express');
const connection = require('./config/mySql');
const path = require('path');
var bodyParser = require('body-parser');
var app = require('express')();
const cors = require('cors');
const fs = require('fs');

var http = require('http').createServer(app);

app.use(cors({
    origin: '*'
}));

var io = require('socket.io')(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    transports : ['websocket']
  }
});

// Connect Database
connection();

// Init Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
// Define Routes

app.use('/api/auth', require('./routes/api/auth'));


app.use('/api/stake', require('./routes/api/stake'));
app.use('/api/admin', require('./routes/api/admin'));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

io.on('connection', function(socket){
  socket.on("stake", (arg) => {
    console.log(arg)
    io.emit('allow', 'Success socket');  
  });
  socket.on("response", (arg) => {
    console.log(arg)
    io.emit('response', 'response');  
  });
  socket.on('unstake', function () {
    io.emit('unstakeResponse', 'response'); 
  });
  socket.on('unStakeResponse', function () {
    io.emit('unstakeResponse-client', 'response'); 
  });
  socket.on('unStakeReject', function () {
    io.emit('unstakeReject-client', 'response'); 
  });
});
http.listen(5000, ()=> {
     console.log('listening on *:5000');
});