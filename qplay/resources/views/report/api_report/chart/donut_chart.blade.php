
<div class="col-lg-6 col-md-6 col-xs-12">
    <div id="container_donut_chart_t"></div>
</div>
<div class="col-lg-6 col-md-6 col-xs-12">
    <div id="container_donut_chart_d"></div>    
</div>


<script>

var getApiLogDonutChart = function(){
    var mydata = {app_key:"{{$data['app_key']}}"};
    var mydataStr = $.toJSON(mydata);
    $.ajax({
      url:"reportDetail/getCallApiReportDonutChart",
      type:"POST",
      dataType:"json",
      contentType: "application/json",
      data:mydataStr,
      success: function(r){
            if(!$.isEmptyObject(r)){
                var queryAction = $('#report_table tbody tr th').eq(0).text();
                createTotalChart(r, queryAction);
                createDistinctChart(r,queryAction);
            }
       }
    });
}

var createTotalChart = function(r, queryAction){
    var title='API【'+ queryAction +'】呼叫次數比例(依部門)';
    createdDunutChart(r,'t',title, 'container_donut_chart_t', queryAction);
}
var createDistinctChart = function(r, queryAction){
    var title='API【'+ queryAction +'】呼叫人數比例(依部門)';
    createdDunutChart(r,'d',title, 'container_donut_chart_d', queryAction);
}
var createdDunutChart = function(r, type, title, id, queryAction){
    var colors = Highcharts.getOptions().colors,
        categories = [],
        data = [],
        browserData = [],
        versionsData = [],
        i,
        j,
        drillDataLen,
        brightness,
        x=0;
    $.each(r[queryAction], function(site, value) {
         var dataRow = [];
         var subDataRow = [];

         categories.push(site);
       
         dataRow.color = colors[x];
         subDataRow.name = site + ' departments';
         var subCategories = [];
         var subValue = [];
         var subValueSum = 0;
         $.each(value, function(department, value) {
            subCategories.push(department);
            var tmpValue = value.totalCountPercent;
            if(type == 'd'){
                tmpValue = value.distinctCountPercent;
            }
            subValue.push(tmpValue);
            subValueSum = subValueSum + tmpValue;
         });
         dataRow.y = subValueSum;
         subDataRow.categories = subCategories;
         subDataRow.data = subValue;
         subDataRow.color =  colors[x];
         dataRow.drilldown = subDataRow;
         data.push(dataRow)
         x++;
    });
    var dataLen = data.length;

    // Build the data arrays
    for (i = 0; i < dataLen; i += 1) {

        // add browser data
        browserData.push({
            name: categories[i],
            y: data[i].y,
            color: data[i].color
        });

        // add version data
        drillDataLen = data[i].drilldown.data.length;
        for (j = 0; j < drillDataLen; j += 1) {
            brightness = 0.2 - (j / drillDataLen) / 5;
            versionsData.push({
                name: data[i].drilldown.categories[j],
                y: data[i].drilldown.data[j],
                color: Highcharts.Color(data[i].color).brighten(brightness).get()
            });
        }
    }

    // Create the chart
    Highcharts.chart(id, {
        chart: {
            type: 'pie'
        },
        title: {
            text: title
        },
        subtitle: {
            text: ''
        },
        yAxis: {
            title: {
                text: 'Total percent market share'
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
            data: browserData,
            size: '60%',
            dataLabels: {
                formatter: function () {
                    return this.y > 5 ? this.point.name : null;
                },
                color: '#ffffff',
                distance: -30
            }
        }, {
            name: 'Departments',
            data: versionsData,
            size: '80%',
            innerSize: '60%',
            dataLabels: {
                formatter: function () {
                    // display only if larger than 1
                    return this.y > 1 ? '<b>' + this.point.name + ':</b> ' +
                        this.y + '%' : null;
                }
            },
            id: 'sites'
        }],
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 400
                },
                chartOptions: {
                    series: [{
                        id: 'sites',
                        dataLabels: {
                            enabled: false
                        }
                    }]
                }
            }]
        }
    });
}

</script>