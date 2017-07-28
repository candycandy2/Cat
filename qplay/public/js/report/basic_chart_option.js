var getMultiLineChartOpt = function(){
    return {
        rangeSelector: {
            buttons: [{
                type: 'week',
                count: 1,
                text: Messages.DAY.replace('%d','7'),
                dataGrouping: {
                    forced: true,
                    units: [['day', [1]]]
                }
            }, {
                type: 'month',
                count: 3,
                text: Messages.N_MONTH.replace('%d','3'),
                dataGrouping: {
                    forced: true,
                    units: [['day', [1]]]
                }
            }, {
                type: 'month',
                count: 6,
                text:  Messages.N_MONTH.replace('%d','6'),
                dataGrouping: {
                    forced: true,
                    units: [['day', [1]]]
                }
            }, {
                type: 'all',
                text: 'All',
                dataGrouping: {
                    forced: true,
                    units: [['day', [1]]]
                }
            }],

            buttonTheme: {
                width: 60
            },

            selected: 0,

            inputEnabled:true,

            inputDateFormat:"%Y-%m-%d",
            inputEditDateFormat:"%Y-%m-%d",
            inputDateParser: function (value) {
                value = value.split('-');
                return Date.UTC(
                    parseInt(value[0]),
                    parseInt(value[1]) - 1,
                    parseInt(value[2])
                );
            }
        },

        yAxis: {
            plotLines: [{
                value: 0,
                width: 2,
                color: 'silver'
            }]
        },

        xAxis: {
            type: 'datetime',
        },

        plotOptions: {
            series: {
                showInNavigator: true,
                point: {},  
            }

        },

        tooltip: {
            pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}',
            valueDecimals: 2,
            split: true
        },

        legend: {
            enabled: true
        },

        series: {},
         lang: {
            noData: Messages.NO_DATA_TO_DISPLAY
        },

        noData: {
            style: {
                fontWeight: 'bold',
                fontSize: '15px',
                color: '#303030'
            }
        },

        exporting: {
            dateFormat:"%Y-%m-%d",
            enabled:true
        },
    }
}

var getDonutChartOpt = function(){
    return {
        chart: {
            type: 'pie'
        },
        title: {
            text: ''
        },
        subtitle: {
            text: ''
        },
        yAxis: {
            title: {
                text: ''
            }
        },
        plotOptions: {
            pie: {
                shadow: false,
                center: ['50%', '50%']
            }
        },
        tooltip: {
            valueSuffix: '%'
        },
        series: [{
            name: 'Sites',
            data: [],
            size: '60%',
            dataLabels: {
                enabled: true,
                style: { fontSize: '12px' },
                formatter: function () {
                    return this.y > 5 ? this.point.name : null;
                },
                color: '#ffffff',
                distance: -30
            }
        }, {
            name: 'Departments',
            data: [],
            size: '80%',
            innerSize: '60%',
            dataLabels: {
                enabled: true,
                style: { fontSize: '12px' },
                formatter: function () {
                    // display only if larger than 1
                    return this.y > 1 ? '<b>' + this.point.name + ':</b> ' +
                        this.y + '%' : null;
                }
            },
            id: 'sites'
        }],

        lang: {
            noData: Messages.NO_DATA_TO_DISPLAY
        },
        
        noData: {
            style: {
                fontWeight: 'bold',
                fontSize: '15px',
                color: '#303030'
            }
        },
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 400
                },
                chartOptions: {
                    series: [{
                        id: 'sites',
                        dataLabels: {
                            formatter: function () {
                                // display only if larger than 1
                                return this.y > 1 ? '<b>' + this.point.name + ':</b> ' +
                                    this.y + '%' : null;
                            }
                        }
                    }]
                }
            }]
        }
    };
}

var getRangeLineChartOpt = function(){
    return{
            title: {
                text: ''
            },

            xAxis: {
                type: 'datetime',
            },

            yAxis: {
                title: {
                    text: null
                }
            },

            tooltip: {
                crosshairs: true,
                shared: true,
            },

            legend: {
            },

            series: [{
                name: Messages.OPERATION_TIME,
                data: [],
                zIndex: 1,
                marker: {
                    fillColor: 'white',
                    lineWidth: 2,
                    lineColor: Highcharts.getOptions().colors[0]
                }
            }, {
                name: Messages.MAX_STAY_TIME,
                data: [],
                type: 'arearange',
                lineWidth: 0,
                linkedTo: ':previous',
                color: Highcharts.getOptions().colors[0],
                fillOpacity: 0.3,
                zIndex: 0,
                marker: {
                    enabled: false
                }
            }],
            lang: {
            noData: Messages.NO_DATA_TO_DISPLAY
            },
            
            noData: {
                style: {
                    fontWeight: 'bold',
                    fontSize: '15px',
                    color: '#303030'
                }
            },
        };
}

var getSemiDonutChartOpt = function(){
    return {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: 0,
            plotShadow: false,
            marginTop: -75,
        },
        title: {
            text: '',
            align: 'center',
            verticalAlign: 'middle',
            y: 15
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                dataLabels: {
                    enabled: true,
                    distance: -50,
                    style: {
                        fontWeight: 'bold',
                        color: 'white'
                    }
                },
                size: '100%',
                startAngle: -90,
                endAngle: 90,
                center: ['50%', '75%']
            }
        },
        series: [{
            type: 'pie',
            name: '',
            innerSize: '50%',
            data: []
        }],
        lang: {
            noData: Messages.NO_DATA_TO_DISPLAY
        }
    };
};

var getColumnChartOpt = function(){
    return {
            chart: {
                type: 'column',
                panning: false
            },
            navigator: {
                enabled: false
            },
            tooltip: {
                followPointer: false,  // this is already the default, it's just to stress what's said in commit comments and make code "speak"
                followTouchMove: false,  // this is already the default, it's just to stress what's said in commit comments and make code "speak"
            },
            legend: {
                enabled: true
            },
            mapNavigation: {
                enableTouchZoom: true,
            },
            xAxis: {
               range: 23,
               labels: {
                    formatter: function () {
                        return this.value;
                    }
                },
                events: {
                        setExtremes: function(e) {
                            console.log(this);
                            if(typeof(e.rangeSelectorButton)!== 'undefined')
                            {
                              alert('count: '+e.rangeSelectorButton.count + 'text: ' +e.rangeSelectorButton.text + ' type:' + e.rangeSelectorButton.type);
                              return false;
                            }
                        }
                    }
                },
                rangeSelector: {
                    selected: 1
                },
                scrollbar: {
                    enabled: false
                },
                plotOptions: {
                column: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: true,
                        color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
                    }
                }
            },
             yAxis: {
                min: 0,
                title: {
                    text: 'Total fruit consumption'
                }
            },
                series:  [],
                lang: {
                    noData: Messages.NO_DATA_TO_DISPLAY
                }
            }
};