if (typeof module !== "undefined" && typeof exports !== "undefined" && module.exports === exports) {
    module.exports = 'troiChart';
}

/**
 * <troi-chart source="chartData" base-line="baseLine" drawpoint="addPointValue"
 * tool-tip="tooltipdata" series-type="column" style="width:800px;
 * height:300px;" legend="true"> </troi-chart> toolTip = { toolTipXPoint:"위치",
 * show:true | false } baseLine Y 축의 plot 추가 drawpoint 는 소스의 형식과 같고 추가한만큼빠진다.
 * source 의 형식 : source:[ {name:"memory", data:[{x:"시간", y:"검색된값",
 * totalCount:"해당시간전체로그의개수", searchCount:"검색된로그의개수", alert:""}, {x:"", y:"",
 * totalCount:"", searchCount:"", alert:"색칠할지여부(true:false)"}] },
 * {name:"overflow", data:[{x:"시간", y:"검색된값", totalCount:"해당시간전체로그의개수",
 * searchCount:"검색된롤그의개수", alert:""}, {x:"", y:"", totalCount:"",
 * searchCount:"", alert:"색칠할지여부(true:false)"}] }.... ]
 * 
 * @param angular
 */
(function (angular) {
    angular.module('troiChart', [])
        .directive('troiChart', ['$compile', 'CommonService', function ($compile, CommonService) {
            'use strict';

            return {
                restrict: 'EA',
                require: "troiChart",
                transclude: true,
                scope: {
                    zoomType: "@",
                    seriesType: "@",
                    tooltipCustomType: "@",
                    stacking: "@",
                    legend: "@",
                    unit: "@",
                    showTimeLabel: "@",
                    colorList: "@",
                    chartHeight: "@",
                    chartWidth: "@",
                    barWidth: "=",
                    refresh: "@",
                    source: "=",
                    baseLine: "=",
                    toolTip: "=",
                    legendFilter: "=",
                    legendAlign: "@",
                    legendX: "@",
                    onSeriesClick: "&",
                    onSeriesOver: "&",
                    onSeriesOut: "&",
                    onDrillDown: "&",
                    onChartDataChange: "&",
                    onLegendClick: "&",
                    drawpoint: "=",
                    useParser: "@",
                    categoryTick:"@"
                },
                link: function postLink($scope, element, attrs, controller) {
                    var chart = null;
                    var defaultColorList = ['#8cc2d7', '#6692bb', '#67ca36', '#bdca36', '#e39a1c', '#d4702c', '#595959'];
                    var source = null;
                    var chartDiv = null;
                    var seriesType = "column";
                    var baseSeries = null;
                    var seriesMap = null;
                    var baseLine = null;
                    var toolTipXPoint = null;
                    var stacking = undefined;
                    var legend = false;
                    var legendAlign = "right";
                    var legendX = -20;
                    var showTimeLabel = true;
                    var unit = "";
                    var categoryTick = 5;
                    var zoomType = "";
                    var tooltipOption = "";
                    var isDummy = false;
                    var colorList = "#8cc2d7,#6692bb,#67ca36,#bdca36,#e39a1c,#d4702c,#595959";
                    var chartID = "";
                    var refresh = "";
                    var barWidth = null;
                    var legendFilter = null;
                    var legendForceEvent = false;
                    var baseTop = 0;
                    var tooltip = null;

                    function getChartOption() {
                        if (!source) {
                            source = [];
                            source.push({
                                data: []
                            });
                        }

                        if (attrs.barWidth) {
                            barWidth = parseInt(attrs.barWidth);
                        }

                        source = addEvent(source);
                        tooltipOption = getTooltipOption();
                        var option = {
                            chart: {
                                type: seriesType,
                                marginLeft: 60,
                                animation: false,
                                zoomType: zoomType
                            },
                            colors: defaultColorList,
                            exporting: {
                                enabled: false
                            },
                            title: {
                                text: null
                            },
                            scrollbar: {
                                enabled: false
                            },
                            xAxis: {
                                type: "category",
                                gridLineWidth: 1,
                                labels: {
                                    enabled: showTimeLabel,
                                    formatter: xAxisFormatter
                                },
                                events: {
                                    afterSetExtremes: xAxisZoomEvent
                                }
                            },
                            tooltip: tooltipOption,
                            yAxis: {
                                title: {
                                    text: null
                                },
                                min: 0,
                                max: 100
                            },
                            legend: {
                                enabled: legend,
                                x: legendX,
                                align: legendAlign,
                                floating: false,
                                padding: 5,
                                verticalAlign: "top",
                                backgroundColor: "rgba(255, 255, 255, 0.1)",
                                shadow: false,
                                animation: false,
                                maxHeight:35,
                                style: {
                                    opacity: 0.5
                                }
                            },
                            credits: {
                                enabled: false
                            },
                            plotOptions: {
                                series: {
                                    animation: false,
                                    marker: CommonService.marker,
                                    stacking: stacking,
                                    events: {
                                        legendItemClick: legendItemClick
                                    },
                                    fillOpacity: 0.2,
                                    lineWidth: 1,
                                    pointWidth: barWidth
                                }
                            },
                            series: source
                        };
                        return option;
                    }

                    function addEvent(series) {
                        if (!($scope.onSeriesOver || $scope.onSeriesOut || $scope.onSeriesClick)) {
                            return;
                        }

                        for (var i = 0; i < series.length; i++) {
                            series[i].point = {
                                events: {
                                    mouseOver: function (e) {
                                        if ($scope.onSeriesOver) {
                                            $scope.onSeriesOver({
                                                event: this
                                            });
                                        }
                                    },
                                    mouseOut: function (e) {
                                        if ($scope.onSeriesOut) {
                                            $scope.onSeriesOut({
                                                event: this
                                            });
                                        }
                                    },
                                    click: function (e) {
                                        if ($scope.onSeriesClick) {
                                            $scope.onSeriesClick({
                                                event: this
                                            });
                                        }
                                    }
                                }
                            };
                        }
                        return series;
                    }

                    // 현재 컴포넌트 위치보다 툴팁이 위에 뜨는건 
                    // 용납할수 없다.
                    function getScrollParent(parent) {
                        var p = parent[0];
                        if (!p) {
                            return null;
                        }

                        if (p.scrollHeight > p.clientHeight + 10) {
                            return parent;
                        }

                        if (p.tagName == "BODY") {
                            return null;
                        }

                        return getScrollParent(parent.parent());
                    }

                    function isEnableToolTip(top) {
                        var pt = getScrollParent(target.parent());
                        if (!pt) {
                            return true;
                        }

                        var offset = pt.offset();
                        if (offset.top > top || offset.top + pt.outerHeight() < top) {
                            return false;
                        }

                        return true;
                    }
                    
                    function getScrollArea(parent) {
                        var p = parent[0];
                        if (!p) {
                            return null;
                        }
                        if(p.id == "scrollArea") {
                        	return parent;
                        }

                        if (p.tagName == "BODY") {
                            return null;
                        }

                        return getScrollParent(parent.parent());
                    }


                    function customToolTipPositionFunction(w, h, c) {
                        var chartLayout = $(this.chart.renderTo);
                        var chartW = chartLayout.width();
                        var chartH = chartLayout.height();

                        var y = c.plotY;
                        var magic = 0;
                        
                        var scrollArea = getScrollArea(target.parent());
                        var scrollTop = 0;
                        if(scrollArea)
                            scrollTop = scrollArea.scrollTop();

                        var legend = this.chart.legend;
                        if (legend && legend.legendHeight) {
                        	y += legend.legendHeight + legend.legendHeight;
                        }
                        
                        // tooltip이 사용자 정의값일때만
                        // tootip 높이에 맞춰서 보정해줘야함
                        if ($scope.toolTip) {
                            magic = (Math.abs(h/2) - 5);
                        }
                        y -= magic;

                        var ret = null;
                        var tailClass = "tail-left";
                        
                        // tooltip 오른쪽 끝으로 진행시 tail-right 로 변경관련 버그 수정
                        var tooltipDataLength = $("#tooltipContent" + chartID).width();
                        if(tooltipDataLength > 0){
                        	w = tooltipDataLength;
                        }
                        
                        if (chartW - (c.plotX + w + 60) > 0) {
                            ret = {
                                "x": c.plotX + 60,
                                "y": y
                            };
                        } else {
                            ret = {
                                "x": c.plotX - w + 40,
                                "y": y
                            };

                            tailClass = "tail-right";
                        }

                        var pos = getPosition(target[0]);
                        var t = pos.y;//target.offset().top;
                        var l = pos.x;//target.offset().left;

                        ret.x += l;
                        ret.y += t;

                        ret.y = ret.y - scrollTop - ($("#tooltipContent" + chartID).height() / 2);
                        if ((!isEnableToolTip(ret.y + magic) || ret.y < 0) && scrollTop > 0 ) {
                            return {
                                x: -1000,
                                y: -1000
                            };
                        }

                        if (!tooltip || !tooltip.parentElement) {
                            tooltip = $(this.label.div);
                            tooltip.css("position", "fixed");
                            tooltip.css("z-index", "99999999999");
                            tooltip.remove();
                            tooltip.insertAfter("body");
                        }

                        var tooltipOpt = tooltip.find(".tooltip-opt");
                        tooltipOpt.removeClass("tail-left");
                        tooltipOpt.removeClass("tail-right");
                        tooltipOpt.addClass(tailClass);
                        tooltipOpt.show();

                        return ret;
                    }

                    function toolTipPositionFunction(w, h, c, d) {
                        var chartLayout = $(this.chart.renderTo);
                        var chartW = chartLayout.width();
                        var chartH = chartLayout.height();
                        chartLayout.find(".tooltip-opt").hide();

                        var y = c.plotY;
                        if (c.plotY > chartH - h)
                            y = chartH - h - 10;

                        $(".highcharts-tooltip").css("position", "absolute");
                        if (chartW - (c.plotX + w + 100) > 0) {
                            return {
                                "x": c.plotX + (w / 2) - 18,
                                "y": y
                            };
                        } else {
                            return {
                                "x": c.plotX - (w / 2) - 47,
                                "y": y
                            };
                        }
                    }
                    
                    function customToolTipFormatter(tooltip) {
                        if (!tooltip) {
                            return;
                        }

                        var background = "#fff";
                        if (this.point.hasImportedEvents) {
                            background = "#000";
                        }

                        var tooltipPoint = this.point;
                        var tooltipStr = "";
                        var pointIndex = -1;
                        var l = chart.series.length;
                        for (var i = 0; i < l; i++) {
                            var pointList = chart.series[i].data;
                            if (pointList.indexOf(tooltipPoint) > -1) // 인덱스를 찾아서
                                pointIndex = pointList.indexOf(tooltipPoint);
                        }

                        for (i = 0; i < l; i++) {
                            var pointList = chart.series[i].options.data;
                            if (i == 0) { // 최초 진입시에는 x좌표도 포함
                                var time = pointList[pointIndex].x;
                                time = moment(fastParseNumber(time)).local().format("YYYY-MM-DD HH:mm:ss");

                                tooltipStr = "Time : " + time + "<br>";
                            }

                            if (chart.series[i].name == "dummy") {
                                continue;
                            }

                            var yValue = pointList[pointIndex].y;
                            var userOption = chart.series[i].userOptions;
                            var customUnit = userOption.unit;
                            //userOption._symbolIndex;
                            
                            if (!customUnit) {
                                customUnit = unit;
                            }

                            var seriesNameStr = "";
                           // if (userOption.metricCnt > 1) {
                                seriesNameStr = chart.series[i].name;
                           // } else {
                           //     seriesNameStr = chart.series[i].name;
                              //  seriesNameStr = seriesNameStr.replace(", ", "");
                              //  seriesNameStr = seriesNameStr.replace(userOption.metricName + ", ", "");
                           // }

                            var symbol = getSymbolStr(userOption._symbolIndex);
                            var y = (yValue == null) ? "-" : yValue.toLocaleString();
                            var arr = [tooltipStr, "<p style='color:", chart.series[i].color, "'>", symbol, seriesNameStr.toUpperCase(), " : ", y, " ", customUnit, "</p>"];
                            tooltipStr = arr.join("");
                        }
                        
                        //툴팁 움직이는거 개선  2016-06-02 현진
                        $(".highcharts-tooltip").css("pointer-events", "none");
                        var tooltipData = "<div id='tooltipContent" + chartID + "' class='tooltip-opt tail-left'><div class='in-box'>" + tooltipStr + "</div><div class='tail'></div></div>";
                        
                        return tooltipData;
                    }

                    function getSymbolStr(idx) {
                    	if(idx == 0) {
                    		return "● ";
                    	}
                    	if(idx == 1) {
                    		return "◆ ";
                    	}
                    	if(idx == 2) {
                    		return "■ ";
                    	}
                    	if(idx == 3) {
                    		return "▲ ";
                    	}
                    	if(idx == 4) {
                    		return "▼ ";
                    	}
                    	return "";
                    }
                    
                    function toolTipFormatter(tooltip) {
                        if (!tooltip) {
                            return;
                        }

                        var tooltipPoint = this.point;
                        var tooltipStr = "";
                        var pointIndex = -1;
                        for (var i = 0; i < chart.series.length; i++) {
                            var pointList = chart.series[i].data;
                            if (pointList.indexOf(tooltipPoint) > -1) // 인덱스를 찾아서
                                pointIndex = pointList.indexOf(tooltipPoint);
                        }

                        for (i = 0; i < chart.series.length; i++) {
                            var pointList = chart.series[i].data;
                            if (i == 0) { // 최초 진입시에는 x좌표도 포함
                                var time = pointList[pointIndex].x;
                                time = moment(fastParseNumber(time)).local().format("YYYY-MM-DD HH:mm:ss");

                                tooltipStr = "Time : " + time + "<br>";
                            }

                            if (chart.series[i].name == "dummy")
                                continue;

                            var yValue = pointList[pointIndex].y;
                            var userOption = chart.series[i].userOptions;
                            var customUnit = userOption.unit;
                            if (!customUnit)
                                customUnit = unit;

                            var seriesNameStr = "";
                            if (userOption.metricCnt > 1) {
                                seriesNameStr = chart.series[i].name;
                            } else {
                                seriesNameStr = chart.series[i].name;
                                seriesNameStr = seriesNameStr.replace(userOption.metricName + ", ", "");
                            }

                            tooltipStr = tooltipStr + "<span style='color:" + chart.series[i].color + "'>" + seriesNameStr + " : " + yValue.toLocaleString() +
                                " " + customUnit + "</span><br>";
                        }
                        return tooltipStr;
                    }

                    var minTime;
                    var maxTime;

                    function xAxisZoomEvent(event) {
                        var extremes = this.getExtremes();
                        minTime = extremes.dataMin;
                        maxTime = extremes.dataMax;
                        
                        if(extremes.dataMin == event.min && extremes.dataMax == event.max) {
                        	return;
                        }

                        if (extremes.dataMin <= event.min && extremes.dataMax >= event.max) {
                            chart.zoomOut();

                            if ($scope.onDrillDown) {
                                var min = parseInt(event.min / 1000) * 1000;
                                var max = parseInt((event.max + 999) / 1000) * 1000;
                                minTime = moment(min).local().format("YYYY-MM-DD HH:mm:ss");
                                maxTime = moment(max).local().format("YYYY-MM-DD HH:mm:ss");
                                $scope.onDrillDown({ min: minTime, max: maxTime });
                            }
                        }
                    }

                    /**
                     *  this.value 에 카테고리 값이 넘어온다.
                     */
                    function xAxisFormatter() {
                    	if(minTime && maxTime) {
                    		if( maxTime - minTime >= 86400  * 1000 )
                    			return moment(parseInt(this.value)).local().format("YYYY-MM-DD");
                    		else {
                    			return moment(parseInt(this.value)).local().format("HH:mm:ss");
                    		}
                    	}
                    	else {
                    		return moment(parseInt(this.value)).local().format("HH:mm:ss");
                    	}
                        
                    }

                    function legendItemClick(event) {
                        var result = false;
                        var series = chart.series;
                        var sl = series.length;
                        var selectedIndex = (event.currentTarget && event.currentTarget.index) ? event.currentTarget.index : event.target.index;
                        for (var i = 0; i < sl; i++) {
                            if (i != selectedIndex && series[i].visible == true) {
                                result = true;
                                break;
                            }
                        }

                        if ($scope.onLegendClick && !legendForceEvent) {
                            $scope.onLegendClick({
                                event: event,
                                series: chart.series
                            });
                        }

                        legendForceEvent = false;

                        return result;
                    }

                    function createChart() {
                        if (!source || source.length < 1) {
                            if (chart) {
                                chart.destroy();
                                chart = null;
                            }
                            return;
                        }
                        var option = getChartOption();
                        chartDiv.highcharts(option);
                        chart = chartDiv.highcharts();

                        makeSeriesMap();
                        setMinMaxValue();
                        addPlotBound();
                    }

                    /**
                     *  차트에서 사용되는 시리즈의 맵을 생성한다. 
                     */
                    function makeSeriesMap() {
                        var chartSeries = chart.series;
                        seriesMap = {};
                        for (var i = 0, l = chartSeries.length; i < l; i++) {
                            if (i == 0) {
                                baseSeries = chartSeries[i];
                            }
                            seriesMap[chartSeries[i].name] = chartSeries[i];
                        }
                    }

                    /**
                     * Y축의 값이 0 보다 작으면 100 으로 고정
                     */
                    function setMinMaxValue() {
                        if (!chart || !chart.yAxis)
                            return;

                        var extremes = chart.yAxis[0].getExtremes();
                        var min = extremes.min;
                        if (min < 0) {
                            min = 0;
                        }

                        if (unit == "%") {
                            if (extremes.dataMax < 100) {
                                chart.yAxis[0].setExtremes(min, 100, true, false);
                            } else {
                                chart.yAxis[0].setExtremes(min, extremes.dataMax, true, false);
                            }
                        } else {
                            chart.yAxis[0].setExtremes(min, extremes.dataMax + 10, true, false);
                        }
                        
                        updateCategory();
                    }

                    function addPlotBound() {
                        drawYPlotBound();
                        drawXPlotBound();
                    }
                    
                    function updateCategory() {
                    	if(!chart.series || chart.series.length <1 ) 
                    		return;
                    	
                    	var series = getSeries();		//기본 날짜는 0번을 기준
                    	var data = series.options.data;
                    	var tickPositions = [];
                    	for(var i=0; i<data.length; i++) {
                    		if(data.length < 8) {
                    			tickPositions.push(data[i].x);
                    			continue;
                    		}
                    		if(i % categoryTick == 0 )
                    			tickPositions.push(data[i].x);
                    	}
                    	
                    	chart.xAxis[0].update( {tickPositions:tickPositions} );
                    	
                    }
                    function getSeries() {
                    	for(var i=0; i<chart.series.length; i++) {
                    		if(chart.series[i].visible)
                    			return chart.series[i];
                    	}
                    	return null;
                    }

                    function drawYPlotBound() {
                        if (!chart) {
                            return;
                        }

                        var extremes = chart.yAxis[0].getExtremes();
                        chart.yAxis[0].removePlotBand();

                        if (!baseLine) {
                            return;
                        }

                        var bLine = null;
                        var l = baseLine.length;
                        for (var i = 0; baseLine && i < l; i++) {
                            bLine = baseLine[i];
                            if (!bLine || !bLine.value) {
                                continue;
                            }

                            var baseline = fastParseNumber(bLine.value);
                            var m = extremes.max;
                            if (baseline > m) {
                                m = baseline * 1.1;
                                chart.yAxis[0].setExtremes(0, m, true, false);
                                extremes = chart.yAxis[0].getExtremes();
                            }

                            var type = bLine.type;
                            if (!type) {
                                type = "";
                            } else {
                                type = type.toLowerCase();
                            }

                            var opt = null;
                            if (type == "down") {
                                opt = {
                                    from: extremes.min,
                                    to: baseline,
                                    color: 'rgba(68, 170, 213, 0.2)'
                                };
                            } else if (type == "baseline") {
                                opt = {
                                    value: baseline,
                                    width: 2,
                                    color: '#ff0000',
                                    zIndex: 20
                                };
                            } else if (type == "min/max") {
                                var min = fastParseNumber(bLine.value.split("/")[0]);
                                var max = fastParseNumber(bLine.value.split("/")[1]);
                                baseline = min + " ~ " + max;
                                opt = {
                                    from: min - (min * 0.01),
                                    to: max - (max * 0.01),
                                    color: 'rgba(255, 0, 0, 0.2)',
                                    zIndex: 20
                                };
                            } else {
                                opt = {
                                    from: baseline,
                                    to: m * 10,
                                    color: 'rgba(68, 170, 213, 0.2)'
                                };
                            }

                            opt.label = {
                                useHTML: true,
                                text: '<div class="result-header"><div class="count-box"><span class="title">' + baseline + '</span></div></div>',
                                align: 'right',
                                verticalAlign: 'middle'
                            }
                            chart.yAxis[0].addPlotBand(opt);
                        }

                    }

                    function drawXPlotBound() {
                        if (!chart || !chart.series) {
                            return;
                        }

                        chart.xAxis[0].removePlotBand();

                        // 모든 series의 alert 구간을 합친다.
                        var plotMap = [];
                        for (var i = 0, l = chart.series.length; i < l; i++) {
                            var series = chart.series[i];
                            if (series.name == "dummy")
                                continue;

                            var data = series.options.data;
                            for (var j = 0, ll = data.length; j< ll; j++) {
                                if (data[j].alert == 'true') {
                                    plotMap[dataj[j].xDate] = data[j];
                                } else {
                                    if (!plotMap[data[j].xDate]) {
                                        plotMap[data[j].xDate] = data[j];
                                    }
                                }
                            }
                        }

                        // 데이터 정렬을 위해 map->array 로 변경
                        var list = [];
                        for (var key in plotMap) {
                            list.push(plotMap[key]);
                        }

                        list = list.sort(function (a, b) {
                            if (a.x > b.x) {
                                return 1;
                            }
                            if (a.x < b.x) {
                                return -1;
                            }
                            return 0;
                        });

                        // 합쳐진 데이터를 바탕으로 alert 구간을 그린다.
                        var plotList = makePlotArr(list);
                        for (var j = 0, jl = plotList.length; j < jl; j++) {
                            chart.xAxis[0].addPlotBand(plotList[j]);
                        }
                    }

                    function makePlotArr(data) {
                        var colorstr = "rgba(255,0,0,.1)";
                        var returnArr = [];
                        var obj = null;

                        var gap = 500;
                        var l = data.length;
                        if (l > 2) {
                            gap = (data[1].x - data[0].x) / 2;
                        }

                        for (var i = 0; i < l; i++) {
                            if (data[i].alert == "true") {
                                if (!obj) {
                                    obj = {};
                                    obj.color = colorstr;
                                    obj.from = data[i].x - gap;
                                }
                                obj.to = data[i].x + gap;
                            } else {
                                if (obj)
                                    returnArr.push(obj);

                                obj = null;
                            }
                        }

                        if (obj) {
                            obj.to = data[data.length - 1].x + gap;
                            returnArr.push(obj);
                        }

                        return returnArr;

                    }
                    
                    function sourceChange(value) {
                        if (!value || value === source)
                            return;

                        source = value;
                        for (var i = 0, l = source.length; i < l; i++) {
                            parseIntValue(source[i].data, "y");
                        }

                        createChart();

                        if ($scope.onChartDataChange && baseSeries) {
                            $scope.onChartDataChange({
                                event: baseSeries.data,
                                series: chart ?  chart.series : null 
                            });
                        }
                        source.resourceSeriesVisible = resourceSeriesVisible;
                        source.redraw = createChart;
                    }
                    
                    function resourceSeriesVisible(resourceUuid) {
                    	console.log(resourceUuid);
                    	var l = chart.series.length;
                        for (var i = 0; i < l; i++) {
                        	console.log(chart.series[i]);
                        }
                    }

                    function seriesTypeChange(value) {
                        if (seriesType == value || value == "0" || value == "")
                            return;

                        seriesType = value;
                        if (!chart) {
                            createChart();
                        } else {
                            $.each(chart.series, function (key, series) {
                                series.update({type: seriesType}, false);
                            });
                            chart.redraw();
                        }
                    }

                    function stackingChange(value) {
                        if (stacking == value)
                            return;

                        stacking = value;
                        createChart();
                    }

                    function legendChange(value) {
                        if (legend == value)
                            return;

                        if (value == "true" || value == true) {
                            value = true;
                        } else {
                            value = false;
                        }

                        legend = value;
                        createChart();
                    }
                    
                    function legendAlignChange(value) {
                        if (!value) {
                            legendAlign = "right";
                        } else {
                            legendAlign = "left";
                        }
                    }
                    
                    function legendXChange(value) {
                        if (!value) {
                            legendX -20;
                        }  else {
                            legendX = parseInt(value)
                        }
                    }

                    function legendFilterChange(value) {
                        if (!value || value === legendFilter)
                            return;

                        legendFilter = value;

                        for (var i = 0, l = legendFilter.length; i < l; i++) {
                            for (var j = 0, jl = chart.series.length; j < jl; j++) {
                                if (chart.series[j].visible && legendFilter[i].toUpperCase() == chart.series[j].name.toUpperCase()) {
                                    legendForceEvent = true;
                                    angular.element(chart.series[j].legendItem.element).trigger('click');
                                    break;
                                }
                            }
                        }
                    }

                    function colorListChange(value) {
                        if (value == null || colorList == value)
                            return;

                        defaultColorList = value.split(",");

                        if (!chart) {
                            createChart();
                        } else {
                            chart.options.colors = defaultColorList;
                        }
                    }

                    function unitChange(value) {
                        if (unit == value) {
                            return;
                        }

                        unit = value;
                        if (!unit) {
                            unit = "";
                        }

                        setMinMaxValue();
                    }

                    function baseLineChange(value) {
                        if (baseLine == value) {
                            return;
                        }

                        baseLine = value;
                        drawYPlotBound();
                    }

                    function showTimeLabelChange(value) {
                        showTimeLabel = value == "false" ? false : true;
                        createChart();
                    }

                    function zoomTypeChange(value) {
                        if (zoomType == value) {
                            return;
                        }
                        zoomType = value;
                        createChart();
                    }

                    function tooltipCustomTypeChange(value) {
                        if (tooltipOption == value) {
                            return;
                        }
                        createChart();
                    }

                    //toolTip = {   toolTipXPoint:"위치", show:true | false   }
                    function toolTipChange(value) {
                        if (!value || value.show == false) {
                            if (chart != null && chart.tooltip != null) {
                                chart.tooltip.hide();
                                chart.xAxis[0].drawCrosshair({
                                    chartX: 0,
                                    chartY: 0
                                }, 0);
                            }
                            return;
                        }

                        if (!chart)
                            return;

                        toolTipXPoint = value.toolTipXPoint;
                        var series = getSeries();
                        var dataList = series.data;
                        var point = null;
                        var e = {};

                        var l = dataList.length;
                        for (var i = 0; i < l; i++) {
                            if (parseInt(dataList[i].category) == parseInt(value.toolTipXPoint)) {
                                point = dataList[i];
                                e.chartX = point.plotX;
                                e.chartY = point.plotY;

                                // 값이 없어서 차트가 끊길경우에는 툴팁을 뿌려주지 않는다.
                                if (point.plotY == null)
                                    return;

                                break;
                            }
                        }
                        if (point) {
                            chart.tooltip.refresh(point);
                            chart.xAxis[0].drawCrosshair(e, point);
                        } else {
                            if (!chart || !chart.toolTip)
                                return;

                            chart.toolTip.hide();
                            chart.xAxis[0].drawCrosshair({
                                chartX: 0,
                                chartY: 0
                            }, 0);
                        }
                    }

                    function addPointChange(value) {
                        if (!value || value.length < 1)
                            return;

                        if (!chart)
                            return;
                        var series = value;
                        for (var i = 0, l = series.length; i < l; i++) {
                            var s = seriesMap[series[i].name];
                            if (!s) {
                                continue;
                            }

                            var data = series[i].data;
                            if (!data || data.length == 0) {
                                continue;
                            }

                            data = parseIntValue(data, "y");
                            var removeCount = removeDuplicateData(s, data[0]);

                            for (var j = 0, ll = data.length; j < ll; j++) {
                            	if( !data[j].hasOwnProperty("x") || !data[j].x  ) {
                            		continue ;   //가끔 X값이 안들어오는것 같아서 넣음
                            	}		
                            	
                                if (removeCount) {
                                    removeCount--;
                                    s.addPoint(data[j], false, false);
                                } else {
                                    s.addPoint(data[j], false, true);
                                }
                            }
                        }

                        setMinMaxValue();
                        drawXPlotBound();
                        chart.redraw();
                        
                        if ($scope.onChartDataChange && baseSeries) {
                            $scope.onChartDataChange({
                                event: baseSeries.data
                            });
                        }
                    }

                    function widthChange(value) {
                        if (!value)
                            return;

                        chartDiv.outerWidth(parseInt(value));
                        if (chart && chart.hasOwnProperty("animation") == true) {
                            chart.setSize(chartDiv.outerWidth(), chartDiv.outerHeight());
                        }
                    }

                    function heightChange(value) {
                        if (!value)
                            return;

                        chartDiv.outerHeight(parseInt(value));
                        if (chart && chart.hasOwnProperty("animation") == true) {
                            chart.setSize(chartDiv.outerWidth(), chartDiv.outerHeight());
                        }
                    }

                    function refreshChange(value) {
                        if (!value)
                            return;

                        createChart();
                    }

                    function removeDuplicateData(orgSeries, newData) {
                        if (!newData || newData.length < 1)
                            return;

                        if (!orgSeries)
                            return;

                        var removeCount = 0;
                        var oldData = orgSeries.options.data;

                        var l = oldData.length;
                        for (var i = l - 1; i > -1; i--) {
                            var checkData = oldData[i];
                            if (!checkData) {
                                continue;
                            }

                            if (checkData.x >= newData.x) {
                                removeCount++;
                                orgSeries.removePoint(i, false);
                            } else {
                                break;
                            }
                        }
                        return removeCount;

                    }

                    // 인티저로 하면서 날짜포멧 변경
                    function parseIntValue(data, field) {
                        if ($scope.useParser != "true") {
                            return data;
                        }

                        if (!data)
                            return;

                        var l = data.length;
                        for (var j = 0; j < l; j++) {
                            data[j][field] = (data[j][field] == "") ? null:(+data[j][field]);
                            data[j].xDate = data[j].x;
                            data[j].x = Date.parse(data[j].x);
                        }

                        return data;
                    }


                    function getTooltipOption() {
                        var tooltipOption = {};
                        if (attrs.tooltipCustomType == null || attrs.tooltipCustomType == "true") {
                            tooltipOption = {
                                positioner: customToolTipPositionFunction,
                                formatter: customToolTipFormatter,
                                useHTML: true,
                                shared: false,
                                borderRadius: 0,
                                borderWidth: 0,
                                shadow: false,
                                enabled: true,
                                hideDelay: 1,
                                animation: false,
                                backgroundColor: 'none',
                                crosshairs: [{
                                    width: 1,
                                    color: '#000'
                                }]
                            };
                        } else {
                            tooltipOption = {
                                positioner: toolTipPositionFunction,
                                formatter: toolTipFormatter,
                                useHTML: true,
                                hideDelay: 1,
                                animation: false,
                                crosshairs: [{
                                    width: 1,
                                    color: '#000'
                                }]
                            };
                        }
                        return tooltipOption;
                    }


                    var target = angular.element(element);
                    target.css("display", "block");

                    chartID = (new Date()).getTime() + Math.floor((Math.random() * 1000) + 1);
                    chartDiv = angular.element("<div id='" + chartID + "' style='display:block; width: 100%; height:150px'></div>");
                    target.append(chartDiv);

                    target.on('remove', destroyFunction);
                    
                    var unbind = [$scope.$watch("seriesType", seriesTypeChange),
                        $scope.$watch("stacking", stackingChange),
                        $scope.$watch("legend", legendChange),
                        $scope.$watch("legendAlign", legendAlignChange),
                        $scope.$watch("legendX", legendXChange),
                        $scope.$watch("unit", unitChange),
                        $scope.$watch("source", sourceChange),
                        $scope.$watch("baseLine", baseLineChange),
                        $scope.$watch("toolTip", toolTipChange),
                        $scope.$watch("legendFilter", legendFilterChange),
                        $scope.$watch("drawpoint", addPointChange),
                        $scope.$watch("showTimeLabel", showTimeLabelChange),
                        $scope.$watch("zoomType", zoomTypeChange),
                        $scope.$watch("tooltipCustomType", tooltipCustomTypeChange),
                        $scope.$watch("colorList", colorListChange),
                        $scope.$watch("chartWidth", widthChange),
                        $scope.$watch("chartHeight", heightChange),
                        $scope.$watch("refresh", refreshChange),
                        $scope.$watch("categoryTick", categoryTickChange)
                    ];
                    
                    function categoryTickChange(value) {
                    	if(value ) {
                    		categoryTick = value
                    	}
                    }

                    setTimeout(function () {
                        baseTop = target.offset().top;
                    }, 500);

                    $scope.$on("$destroy", destroyFunction);
                    
                    function destroyFunction() {
                    	 unbind.forEach(function (fn) {
                             fn();
                         });
                         if (tooltip) {
                             tooltip.remove();
                         }
                         if (chart) {
                             chart.destroy();
                             chart = null;
                         }
                    }
                },
                

                controller: ['$scope', function ($scope) {

                }],

            };
        }])
})(angular);