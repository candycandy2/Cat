var getMultiLineChartOpt = function(){
    return {
        rangeSelector: {
            buttons: [{
                type: 'week',
                count: 1,
                text: '7天',
                dataGrouping: {
                    forced: true,
                    units: [['day', [1]]]
                }
            }, {
                type: 'month',
                count: 3,
                text: '3個月',
                dataGrouping: {
                    forced: true,
                    units: [['day', [1]]]
                }
            }, {
                type: 'month',
                count: 6,
                text: '6個月',
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
            noData: "沒有匹配的記錄"
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
            noData: "沒有匹配的記錄"
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
                name: '處理時間',
                data: [],
                zIndex: 1,
                marker: {
                    fillColor: 'white',
                    lineWidth: 2,
                    lineColor: Highcharts.getOptions().colors[0]
                }
            }, {
                name: '停留最大',
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
            noData: "沒有匹配的記錄"
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