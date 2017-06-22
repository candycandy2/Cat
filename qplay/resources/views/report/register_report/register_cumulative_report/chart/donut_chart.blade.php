<div id="{{$REPORT_TYPE}}_donutchart">
    <div><label class="text-muted">詳細資料</label></div>
    <div class="col-lg-12 col-md-12 col-xs-12">
        <div id="container_donut_chart_{{$REPORT_TYPE}}_t"  style="height: 500px;"></div>
    </div>
    <div class="col-lg-12 col-md-12 col-xs-12">
        <div id="container_donut_chart_{{$REPORT_TYPE}}_d"  style="height: 500px;"></div>    
    </div>
</div>

<script>
var updateApiLogDonutChart = function(r, queryAction){
    setDonutChartData(r,'t', queryAction, $('#container_donut_chart_{{$REPORT_TYPE}}_t').highcharts());
    setDonutChartData(r,'d', queryAction, $('#container_donut_chart_{{$REPORT_TYPE}}_d').highcharts());
}

var setDonutChartData = function(r,type,queryAction,chart){
     var colors = Highcharts.getOptions().colors,
        companySiteArray = [],
        categories = [],
        data = [],
        siteData = [],
        departmentData = [],
        i,
        j,
        x = 0,
        dataLen = data.length,
        drillDataLen,
        brightness,
        sum = 0;

    for (var companySite in r[queryAction]){
        var tmpData = {
            y: 0,
            color: colors[x],
            drilldown: {
                name: companySite,
                categories: [],
                data: [],
                color: colors[0]
            }
        }
        var tmpSubSum = 0;
        categories.push(companySite);
        for (var department in r[queryAction][companySite]){
            tmpData.drilldown.categories.push(department);
            if(type == 't'){
                tmpData.drilldown.data.push(r[queryAction][companySite][department].times);
                tmpSubSum = tmpSubSum + r[queryAction][companySite][department].times;
            }else{
                tmpData.drilldown.data.push(r[queryAction][companySite][department].users.length);
                tmpSubSum = tmpSubSum + r[queryAction][companySite][department].users.length;
            }
        }
        sum = sum + tmpSubSum;
        tmpData.y = tmpSubSum;
        data.push(tmpData);
        x++;
    }

     var dataLen = data.length;
    // Build the data arrays
    for (i = 0; i < dataLen; i += 1) {
        // add site data
        siteData.push({
            name: categories[i],
            y:  Math.round(data[i].y / sum * 100 * 10) / 10,
            color: data[i].color
        });

        // add department data
        drillDataLen = data[i].drilldown.data.length;
        for (j = 0; j < drillDataLen; j += 1) {
            brightness = 0.2 - (j / drillDataLen) / 5;
            departmentData.push({
                name: data[i].drilldown.categories[j],
                y: Math.round(data[i].drilldown.data[j] / sum * 100 * 10) / 10,
                color: Highcharts.Color(data[i].color).brighten(brightness).get()
            });
        }
    }

    title='API【'+ queryAction +'】呼叫次數比例(依部門)';
    if(type == 'd'){
        title='API【'+ queryAction +'】呼叫人數比例(依部門)';
    }

    chart.setTitle({ text: title });
    chart.series[0].setData(siteData);
    chart.series[1].setData(departmentData);
}

var createdCallApiDunutChart = function(options){
    Highcharts.chart('container_donut_chart_{{$REPORT_TYPE}}_t',options);
    Highcharts.chart('container_donut_chart_{{$REPORT_TYPE}}_d',options);
}
</script>