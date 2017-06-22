<div id="{{$REPORT_TYPE}}_donutchart">
    <div><label class="text-muted"></label></div>
    <div class="col-lg-12 col-md-12 col-xs-12">
        <div id="container_donut_chart_{{$REPORT_TYPE}}_1"  style="height: 500px;"></div>
    </div>
    <div class="col-lg-12 col-md-12 col-xs-12">
        <div id="container_donut_chart_{{$REPORT_TYPE}}_2"  style="height: 500px;"></div>    
    </div>
    <div class="col-lg-12 col-md-12 col-xs-12">
        <div id="container_donut_chart_{{$REPORT_TYPE}}_3"  style="height: 500px;"></div>    
    </div>
    <div class="col-lg-12 col-md-12 col-xs-12">
        <div id="container_donut_chart_{{$REPORT_TYPE}}_4"  style="height: 500px;"></div>    
    </div>
</div>

<script>
var updateDailyRegisterDonutChart = function(r, queryDate){
    $('#{{$REPORT_TYPE}}_donutchart label.text-muted').text(queryDate);
    setDailyRegisterDonutChartData(r,'1', queryDate, $('#container_donut_chart_{{$REPORT_TYPE}}_1').highcharts());
    setDailyRegisterDonutChartData(r,'2', queryDate, $('#container_donut_chart_{{$REPORT_TYPE}}_2').highcharts());
    setDailyRegisterDonutChartData(r,'3', queryDate, $('#container_donut_chart_{{$REPORT_TYPE}}_3').highcharts());
    setDailyRegisterDonutChartData(r,'4', queryDate, $('#container_donut_chart_{{$REPORT_TYPE}}_4').highcharts());
}

var setDailyRegisterDonutChartData = function(r,type,queryDate,chart){

    var colors = Highcharts.getOptions().colors,
        categories = [],
        data = [],
        parentData = [],
        childData = [],
        i,
        j,
        x = 0,
        dataLen = data.length,
        drillDataLen,
        brightness,
        sum = 0;
    if(type == '1' || type == '3'){ //依系統
        var dataByDevice = r[queryDate].device_type;
        for (var deviceType in dataByDevice){
             var tmpData = {
                y: 0,
                color: colors[x],
                drilldown: {
                    name: deviceType,
                    categories: [],
                    data: [],
                    color: colors[0]
                }
            }
            var tmpSubSum = 0;
            categories.push(deviceType);
            for (var companySite in dataByDevice[deviceType]){
                tmpData.drilldown.categories.push(companySite);
                    var tmpCount = 0;
                    for (var department in dataByDevice[deviceType][companySite]){
                        if(type == '1'){ //當日註冊「設備」
                            tmpCount = tmpCount + dataByDevice[deviceType][companySite][department].count;
                        }else if(type == '3'){ //當日註冊「用戶」
                            tmpCount = tmpCount + dataByDevice[deviceType][companySite][department].users.length;
                        }
                    }
                    tmpData.drilldown.data.push(tmpCount);
                    tmpSubSum = tmpSubSum + tmpCount;
            }
            sum = sum + tmpSubSum;
            tmpData.y = tmpSubSum;
            data.push(tmpData);
            x++;
        }
    }// endif (type == '1' || type =='3')
    else if(type == '2' || type == '4'){
        var dataByDevice = r[queryDate].device_type;
        var arrangeData = {};
        for (var deviceType in dataByDevice){
            for (var companySite in dataByDevice[deviceType]){
                for (var department in dataByDevice[deviceType][companySite]){
                    if(!arrangeData.hasOwnProperty(companySite)){
                        arrangeData[companySite] = {};
                    }
                    if(!arrangeData[companySite].hasOwnProperty(department)){
                         arrangeData[companySite][department] = {'device': 0,'user' : 0};
                    }
                    arrangeData[companySite][department].device = dataByDevice[deviceType][companySite][department].count;
                    arrangeData[companySite][department].user = dataByDevice[deviceType][companySite][department].users.length;
                }
            }
        }
        for (var companySite in arrangeData){
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
            categories.push(companySite);
            var tmpSubSum = 0;
            var tmpCount = 0;
            for (var department in arrangeData[companySite]){
                tmpData.drilldown.categories.push(department);
                if(type == '2'){ //當日註冊「設備」
                    tmpCount = arrangeData[companySite][department].device;
                }else if(type == '4'){ //當日註冊「用戶」
                    tmpCount = arrangeData[companySite][department].user;
                }
                tmpData.drilldown.data.push(tmpCount); 
                tmpSubSum = tmpSubSum + tmpCount;
            }
        }
        sum = sum + tmpSubSum;
        tmpData.y = tmpSubSum;
        data.push(tmpData);
        x++;

    }// end else if(type == '2' || type == '4')

    var dataLen = data.length;
    // Build the data arrays
    for (i = 0; i < dataLen; i += 1) {
        // add site data
        parentData.push({
            name: categories[i],
            y: Math.round(data[i].y / sum * 100 * 10) / 10,
            color: data[i].color
        });
        // add department data
        drillDataLen = data[i].drilldown.data.length;
        for (j = 0; j < drillDataLen; j += 1) {
            brightness = 0.2 - (j / drillDataLen) / 5;
            childData.push({
                name: data[i].drilldown.categories[j],
                y: Math.round(data[i].drilldown.data[j] / sum * 100 * 10) / 10,
                color: Highcharts.Color(data[i].color).brighten(brightness).get()
            });
        }
    }

    var title;
    switch (type) {
        case '1':
            title='當日註冊設備比例(依系統)';
            break;
        case '2':
            title='當日註冊設備比例(依部門)';
            break;
        case '3':
            title='當日註冊用戶比例(依系統)';
            break;
        case '4':
            title='當日註冊用戶比例(依部門)';
            break;
    }

    chart.setTitle({ text: title });
    chart.series[0].setData(parentData);
    chart.series[1].setData(childData);
}

var creatDailyRegisterDunutChart = function(options){
    Highcharts.chart('container_donut_chart_{{$REPORT_TYPE}}_1',options);
    Highcharts.chart('container_donut_chart_{{$REPORT_TYPE}}_2',options);
    Highcharts.chart('container_donut_chart_{{$REPORT_TYPE}}_3',options);
    Highcharts.chart('container_donut_chart_{{$REPORT_TYPE}}_4',options);
}

</script>