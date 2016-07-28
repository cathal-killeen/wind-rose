app
.factory('Metrics', function($http){
    var directions = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'];

    function Metrics(){
            this.directions = {};
            this.totalPoints = function() {
                var total = 0;
                for (var key in this.directions) {
                    if (this.directions.hasOwnProperty(key)) {
                        total += this.directions[key].length;
                    }
                }
                return total;
            }
            //returns frequency of speeds between 'a' and 'b' in direction 'direction'
            this.speedFreq = function(direction, a, b){
                var f_total = 0;
                this.directions[direction].forEach(function(point) {
                    if(point >= a && point < b){
                        f_total++;
                    }
                })
                return f_total/this.totalPoints() * 100;
            }
            this.speedAbove = function(direction, a){
                var f_total = 0;
                this.directions[direction].forEach(function(point) {
                    if(point >= a){
                        f_total++;
                    }
                })
                return f_total/this.totalPoints() * 100;
            }
    }
    var url = 'http://159.122.211.137:8000';

    return {
        get: function(options){
            return new Promise(function(resolve, reject) {
                $http.get(url + '/metrics' +
                            '?from=' + moment(options.start).unix() +
                            '&until=' + moment(options.end).unix()).then(function(res){
                    var metrics = new Metrics();
                    directions.forEach(function(dir){
                        metrics.directions[dir] = [];
                    })
                    console.log(res);
                    res.data.forEach(function(metric) {
                        metrics.directions[metric.direction].push(metric.speed);
                    })

                    console.log(metrics);
                    resolve(metrics);
                })
            });
        },
        directions: function(){
            return directions;
        }
    }


})
