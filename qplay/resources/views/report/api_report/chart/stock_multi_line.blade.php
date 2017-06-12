<div class="col-lg-12 col-md-12 col-xs-12" id="">
    <div id="container_stock" style="height: 400px; min-width: 310px"></div>
</div>
<script>
/**
 * Create the chart when all data is loaded
 */
function createMultiLineChart(container, seriesOptions, res) {

    Highcharts.stockChart('container_stock', {

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
                console.log(value);
                return Date.UTC(
                    parseInt(value[0]),
                    parseInt(value[1]) - 1,
                    parseInt(value[2])
                );
            }
        },

        yAxis: {
            labels: {
                formatter: function () {
                    return (this.value > 0 ? ' + ' : '') + this.value + '%';
                }
            },
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
                point: {
                    events: {
                        click: function (e) {
                             createTableChart(res, Highcharts.dateFormat('%Y-%m-%d',this.x));
                        }
                    }
                },  
            }

        },

        tooltip: {
            pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
            valueDecimals: 2,
            split: true
        },

        legend: {
            enabled: true
        },

        series: seriesOptions,

        exporting: {
            dateFormat:"%Y-%m-%d",
            enabled:true
        },
    },
    function (chart) {
            // apply the date pickers
            setTimeout(function () {
                $('input.highcharts-range-selector', $(chart.container).parent())
                    .datepicker();
            }, 0);       
        }
    );

    // Set the datepicker's date format
    $.datepicker.setDefaults({
        dateFormat: 'yy-mm-dd',
        onSelect: function () {
            this.onchange();
            this.onblur();
        }
    });

}

</script>