var PORT = process.env.PORT || 8000;

var URL_ROOT = "http://159.122.211.137:8080/render/";

var express = require('express');
var app = express();
var moment = require('moment');
var request = require('request');
var bodyParser = require('body-parser');

function getSpeeds(node, start, end){
    return new Promise(function(resolve, reject) {
        var URL = URL_ROOT +
                '?target=' + node + '.ANE.Value' +
                '&format=json';
        if(start && end){
            URL += '&from=' + start + '&until=' + end;
        }
        console.log(URL)
        request(URL, function (error, response, body) {
            if(!error){
                body = JSON.parse(body);
                console.log(body[0].datapoints[0]);
                resolve(body[0].datapoints);
            }else{
                reject();
            }
        })
    });
}

function getDirections(node, start, end){
    return new Promise(function(resolve, reject) {
        var URL = URL_ROOT +
                '?target=' + node + '.WV.Value' +
                '&format=json';
        if(start && end){
            URL += '&from=' + start + '&until=' + end;
        }
        console.log(URL)
        request(URL, function (error, response, body) {
            if(!error){
                body = JSON.parse(body);
                resolve(body[0].datapoints);
            }else{
                reject();
            }
        })
    });
}

function windVaneConvert (num){

    var map = [{"char":"N","val":"0"},{"char":"NNE","val":"1"},{"char":"NE","val":"2"},{"char":"ENE","val":"3"},{"char":"E","val":"4"},{"char":"ESE","val":"5"},{"char":"SE","val":"6"},{"char":"SSE","val":"7"},{"char":"S","val":"8"},{"char":"SSW","val":"9"},{"char":"SW","val":"10"},{"char":"WSW","val":"11"},{"char":"W","val":"12"},{"char":"WNW","val":"13"},{"char":"NW","val":"14"},{"char":"NNW","val":"15"}];
    for(var i=0; i< map.length; i++){
        if(map[i].val === num.toString()){
            console.log("WIND VANE: " + num + " -> " + map[i].char );
            return map[i].char;
        }
    }
}

app.use(express.static(__dirname + '/public'));

app.get('/metrics', function(req, res){
    var NODE = "408510454.teagasc2";
    getDirections(NODE, req.params.from, req.params.until).then(function(directions){
        getSpeeds(NODE, req.params.from, req.params.until).then(function(speeds){
            var metrics = [];
            for(var i=0; i<speeds.length; i++){
                //check if timestamps equal
                if(speeds[i][1] === directions[i][1]){
                    //check if both values are not null
                    if(speeds[i][0] !== null && directions[i][0] !== null){
                        metrics.push({ts: speeds[i][1], speed: speeds[i][0], direction_num: directions[i][0], direction: windVaneConvert(directions[i][0])});
                    }
                }
            }
            console.log(metrics);
            res.status(200).json(metrics);
        }).catch(function(err){
            res.status(500).send("error getting speeds: " + err);
        })
    }).catch(function(err){
        res.status(500).send("error getting directions: " + err);
    })
})

app.listen(PORT, function(){
    console.log('Listening on 3000...');
})
