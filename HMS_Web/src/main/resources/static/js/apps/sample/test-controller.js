define(["app"], function(app){
	app.controller("TestCtrl",["$scope", "DataService", "$translate", "uiGridConstants", "ngDialog", "$interval", "PopupSearch", "$rootScope",
		function($scope, DataService, $translate, uiGridConstants, ngDialog, $interval, PopupSearch, $rootScope) {
		"use strict";
		
		var testCtrl = this;
		var chartSpeed

		testCtrl.testChart = function(){
			
			
		};
		
		
		
		// The speed gauge
		
		function chartSpeed(result){
			
			
			chartSpeed = Highcharts.chart('container-speed', Highcharts.merge(gaugeOptions, {
			    yAxis: {
			        min: 0,
			        max: 200,
			        title: {
			            text: 'Speed'
			        }
			    },
			
			    series: [{
			        name: 'Speed',
			        data: result,
			        dataLabels: {
			            format: '<div style="text-align:center"><span style="font-size:25px;color:' +
			                ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y}</span><br/>' +
			                   '<span style="font-size:12px;color:silver">km/h</span></div>'
			        },
			        tooltip: {
			            valueSuffix: ' km/h'
			        }
			    }]
			
			}));
		};
		
		
		// The RPM gauge
		var chartRpm = Highcharts.chart('container-rpm', Highcharts.merge(gaugeOptions, {
		    yAxis: {
		        min: 0,
		        max: 5,
		        title: {
		            text: 'RPM'
		        }
		    },
		
		    series: [{
		        name: 'RPM',
		        data: [1],
		        dataLabels: {
		            format: '<div style="text-align:center"><span style="font-size:25px;color:' +
		                ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y:.1f}</span><br/>' +
		                   '<span style="font-size:12px;color:silver">* 1000 / min</span></div>'
		        },
		        tooltip: {
		            valueSuffix: ' revolutions/min'
		        }
		    }]
		
		}));
		
		// Bring life to the dials
		var refreshIntervalId = setInterval(function () {
		    // Speed
		    var point,
		        newVal,
		        inc;
		
		    if (chartSpeed) {
		        point = chartSpeed.series[0].points[0];
		       
		        /*inc = Math.round((Math.random() - 0.5) * 100);
		        newVal = point.y + inc;
		
		        if (newVal < 0 || newVal > 200) {
		            newVal = point.y - inc;
		        }*/
		
		        point.update(point);
		    }
		
		    // RPM
		    if (chartRpm) {
		        point = chartRpm.series[0].points[0];
		        inc = Math.random() - 0.5;
		        newVal = point.y + inc;
		
		        if (newVal < 0 || newVal > 5) {
		            newVal = point.y - inc;
		        }
		
		        point.update(newVal);
		    }
		}, 2000);




		
		var gaugeOptions = {
				
		    chart: {
		        type: 'solidgauge'
		    },
		
		    title: "Test",
		
		    pane: {
		        center: ['50%', '85%'],
		        size: '140%',
		        startAngle: -90,
		        endAngle: 90,
		        background: {
		            backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#EEE',
		            innerRadius: '60%',
		            outerRadius: '100%',
		            shape: 'arc'
		        }
		    },
		
		    tooltip: {
		        enabled: false
		    },
		
		    // the value axis
		    yAxis: {
		        stops: [
		            [0.1, '#55BF3B'], // green
		            [0.5, '#DDDF0D'], // yellow
		            [0.9, '#DF5353'] // red
		        ],
		        lineWidth: 0,
		        minorTickInterval: null,
		        tickAmount: 2,
		        title: {
		            y: -70
		        },
		        labels: {
		            y: 16
		        }
		    },
		
		    plotOptions: {
		        solidgauge: {
		            dataLabels: {
		                y: 5,
		                borderWidth: 0,
		                useHTML: true
		            }
		        }
		    }
		};
		
		
		function initialize() {
			$interval.cancel($rootScope.stopInterval);
			
			chartSpeed([10,20,30,40]); 
			
			//refreshIntervalId();
		}
		
		initialize();
		
	}]);
	
});		