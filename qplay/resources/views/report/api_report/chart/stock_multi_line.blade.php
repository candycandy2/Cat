<div class="col-lg-12 col-md-12 col-xs-12" id="">
<div id="container_stock" style="height: 400px; min-width: 310px"></div>
</div>
<script>

$(function () {

    

});

var createApiLogMultiLine = function(){

    var mydata = {app_key:"{{$data['app_key']}}"},
    reportEndDate = '{{$data['reportEndDate']}}',
    mydataStr = $.toJSON(mydata),
    callUsersData=[],
    callTimesData=[],
    seriesOptions = [],
    result;
    $.ajax({
      url:"reportDetail/getCallApiReport",
      type:"POST",
      dataType:"json",
      contentType: "application/json",
      data:mydataStr,
      success: function(r){
            if(!$.isEmptyObject(r)){
                result = r;
                var res=[];
                //arrange call api data
                $.each(r,function(i,data){
                    var d = data._id;
                    if(!res.hasOwnProperty(d.created_at)){
                        res[d.created_at] = {'times' : 0, 'users' : [], 'actions':[]};
                    }
                    res[d.created_at].times =  parseInt(res[d.created_at].times) + parseInt(data.count);
                  
                    if($.inArray(d.user_row_id,  res[d.created_at].users) == -1){
                        res[d.created_at].users.push(d.user_row_id);
                    }

                    if(!res[d.created_at].actions.hasOwnProperty(d.action)){
                        res[d.created_at].actions[d.action] = [];
                    }
                    var actionArray =  res[d.created_at].actions[d.action];
                    if(!actionArray.hasOwnProperty(d.company_site)){
                        actionArray[d.company_site] = [];
                    }
                    var companySiteArray =  actionArray[d.company_site];
                    if(!companySiteArray.hasOwnProperty(d.department)){
                        companySiteArray[d.department] = {'times' : 0, 'users' : []};
                    }
                    var departmentArray =  companySiteArray[d.department];
                    departmentArray.times =  parseInt(departmentArray.times) + parseInt(data.count);
                    if($.inArray(d.user_row_id,  departmentArray.users) == -1){
                        departmentArray.users.push(d.user_row_id);
                    }
                });
                
                for (var k in res){
                    if (typeof res[k] !== 'function') {
                         var tmpTimesArr = [dateToUTC(k),res[k].times];
                         var tmpUsersArr = [dateToUTC(k),res[k].users.length];
                         callTimesData.push(tmpTimesArr);
                         callUsersData.push(tmpUsersArr);
                         callUsersData = sortObject(callUsersData);
                         callTimesData = sortObject(callTimesData);
                    }
                }
                seriesOptions[0] = {
                    name:"呼叫次數",
                    data:callTimesData
                }

                seriesOptions[1] = {
                    name:"呼叫人數",
                    data:callUsersData
                }
                createMultiLineChart('container_stock',seriesOptions, res);
                createTableChart(res,reportEndDate);
            }
       }
    });


}
/**
 * Create the chart when all data is loaded
 */
function createMultiLineChart(container, seriesOptions, res) {

    Highcharts.stockChart('container_stock', {

        rangeSelector: {
            allButtonsEnabled: true,

            buttons: [{
                type: 'week',
                count: 1,
                text: '7天',
                dataGrouping: {
                    forced: true,
                    units: [['week', [1]]]
                }
            }, {
                type: 'month',
                count: 3,
                text: '3個月',
                dataGrouping: {
                    forced: true,
                    units: [['month', [1]]]
                }
            }, {
                type: 'all',
                text: 'All',
                dataGrouping: {
                    forced: true,
                    units: [['month', [1]]]
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


function sortObject(obj){
    obj = obj.sort(function (a, b) {
     return a[0] < b[0] ? -1 : 1;
    });
    return obj;
}
</script>