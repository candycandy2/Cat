var getMultiLineChartOpt = function(){
    return {
        rangeSelector: {
            buttons: [{
                type: 'week',
                count: 1,
                text: Messages.N_DAY.replace('%d','7'),
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
                    type: 'column'
                },
                loading: {
                    hideDuration: 1000,
                    showDuration: 1000
                },
                title: {
                    text: 'Stacked column chart'
                },
                xAxis: {
                    categories: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
                                 '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
                                 '21', '22', '23'
                                ]
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: ''
                    },
                    stackLabels: {
                        enabled: true,
                        style: {
                            fontWeight: 'bold',
                            color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                        }
                    }
                },
                legend: {
                    align: 'right',
                    x: -30,
                    verticalAlign: 'top',
                    y: 25,
                    floating: true,
                    backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
                    borderColor: '#CCC',
                    borderWidth: 1,
                    shadow: false
                },
                tooltip: {
                    headerFormat: '<b>{point.x}</b><br/>',
                    pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
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
                series: [],
                lang: {
                    noData: Messages.NO_DATA_TO_DISPLAY,
                }
            }
};

var getSimpleColumnChartOpt = function(){
    return {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Stacked column chart'
        },
        xAxis: {
            categories: []
        },
        yAxis: {
            min: 0,
            title: {
                text: ''
            }
        },
        tooltip: {
            pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
            shared: true
        },
        plotOptions: {
            column: {
                stacking: 'percent'
            }
        },
        series:[],
        lang: {
            noData: Messages.NO_DATA_TO_DISPLAY
        }
    };
}
