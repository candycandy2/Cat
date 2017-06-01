
<div id="container" style="width:100%; height:400px;"></div>
<script>


var mydata = {app_key:"{{$data['app_key']}}"};
var mydataStr = $.toJSON(mydata);
var totalCountArr = [];
var distinctCountArr = [];
var startDate = [];
$.ajax({
  url:"reportDetail/getCallApiReportBasicLine",
  type:"POST",
  dataType:"json",
  contentType: "application/json",
  data:mydataStr,
  success: function(r){
    totalCountArr = r.totalCount;
    distinctCountArr = r.distinctCount;
    startDate = r.startDate.split('-');
    creatBasicLine(totalCountArr, distinctCountArr)
   }
});

var creatBasicLine = function(totalCountArr,distinctCountArr){
    Highcharts.chart('container', {
        title: {
            text: 'Solar Employment Growth by Sector, 2010-2016'
        },

        subtitle: {
            text: 'Source: thesolarfoundation.com'
        },

        xAxis: {
            type: 'datetime'
        },

        yAxis: {
            title: {
                text: 'Number of Employees'
            }
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle'
        },

        plotOptions: {
            series: {
                pointStart: Date.UTC(startDate[0], startDate[1]-1, startDate[2]),
                pointInterval: 24 * 3600 * 1000 // one day
            }
        },

        series: [{
            name: '呼叫次數',
            data: totalCountArr
        }, {
            name: '呼叫人數',
            data: distinctCountArr
        }]
    });

}


</script>