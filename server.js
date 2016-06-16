var PORT = process.env.PORT || 3000;
var SERVER_URL = 'http://159.122.211.134:8100';

var express = require('express');
var app = express();
var socket = require('socket.io-client').connect(SERVER_URL);
var moment = require('moment');

var db = require('./db.js');

app.use(express.static(__dirname + '/public'));

socket.on('connect', function(){
    console.log('successfully connected to ' + SERVER_URL);
});

socket.on('metric', function(message){
    console.log("new message");
    console.log(message);

    if(message.SNAPMESSAGE.Header.SourceId === 'teagasc1'){
        console.log('TEAGASC1!!!!!!!!');
    }

    if(message.SNAPMESSAGE.Payload.SensorId === 'WV'){
        db.entry.find({
            where: {
                timestamp: message.SNAPMESSAGE.Header.Ts
            }
        }).then(function(entry){
            if(!entry){
                db.entry.create({
                    timestamp: message.SNAPMESSAGE.Header.Ts,
                    direction: message.SNAPMESSAGE.Payload.SensorVal
                })
            }else{
                entry.update({direction: message.SNAPMESSAGE.Payload.SensorVal})
            }
        })
    }

    if(message.SNAPMESSAGE.Payload.SensorId === 'ANE'){
        db.entry.find({
            where: {
                timestamp: message.SNAPMESSAGE.Header.Ts
            }
        }).then(function(entry){
            if(!entry){
                db.entry.create({
                    timestamp: message.SNAPMESSAGE.Header.Ts,
                    speed: message.SNAPMESSAGE.Payload.SensorVal
                })
            }else{
                entry.update({speed: message.SNAPMESSAGE.Payload.SensorVal})
            }
        })
    }
})

socket.on('disconnect', function(){
    console.log('disconnected from ' + SERVER_URL);
});

db.sequelize.sync().then(function(){
    app.listen(PORT, function(){
        console.log('Listening on 3000...');
    })
});
