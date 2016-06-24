var app = angular.module('windRose', [])

.controller('MainCtrl', function($scope, $http, Metrics){
    Metrics.get().then(function(res) {
        $scope.metrics = res;
        $scope.directions = Metrics.directions();
        console.log($scope.metrics);
        console.log($scope.metrics.speedFreq('NE', 2, 10));

        $scope.$apply();


        // Parse the data from an inline table using the Highcharts Data plugin
        $('#container').highcharts({
        data: {
            table: 'freq',
            startRow: 1,
            endRow: 17,
            endColumn: 7
        },

        chart: {
            polar: true,
            type: 'column'
        },

        title: {
            text: 'Plezica wind rose demo'
        },

        subtitle: {
            text: ''
        },

        pane: {
            size: '85%'
        },

        legend: {
            align: 'right',
            verticalAlign: 'top',
            y: 100,
            layout: 'vertical'
        },

        xAxis: {
            tickmarkPlacement: 'on',
            plotLines: [{
                color: 'red', // Color value
                //dashStyle: 'longdashdot', // Style of the plot line. Default to solid
                value: 4, // Value of where the line will appear
                width: 3, // Width of the line
                label: {
                    text: 'Current : 12 m/s E', // Content of the label.
                    align: 'right', // Positioning of the label.Default to center.
                    x: +30 // Amount of pixels the label will be repositioned according to the alignment.
                }
  }]
        },

        yAxis: {
            min: 0,
            endOnTick: false,
            showLastLabel: true,
            title: {
                text: 'Frequency (%)'
            },
            labels: {
                formatter: function () {
                    return this.value + '%';
                }
            },
            reversedStacks: false
        },

        tooltip: {
            valueSuffix: '%'
        },

        plotOptions: {
            series: {
                stacking: 'normal',
                shadow: false,
                groupPadding: 0,
                pointPlacement: 'on'
            }
        }
    });
    })
})
