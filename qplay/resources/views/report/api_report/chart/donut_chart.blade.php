
<div class="col-lg-6 col-md-6 col-xs-12">
    <div id="container_donut_chart_t"></div>
</div>
<div class="col-lg-6 col-md-6 col-xs-12">
    <div id="container_donut_chart_d"></div>    
</div>


<script>
var iniApiLogDonutChart = function(r, queryAction){
    createdDunutChart('container_donut_chart_t');
    createdDunutChart('container_donut_chart_d');
    setDonutChartData(r,'t', queryAction, $('#container_donut_chart_t').highcharts());
    setDonutChartData(r,'d', queryAction, $('#container_donut_chart_d').highcharts());
}
var updateApiLogDonutChart = function(r, queryAction){
    setDonutChartData(r,'t', queryAction, $('#container_donut_chart_t').highcharts());
    setDonutChartData(r,'d', queryAction, $('#container_donut_chart_d').highcharts());
}

var setDonutChartData = function(r,type,queryAction,chart){
     var colors = Highcharts.getOptions().colors,
        categories = [],
        data = [],
        siteData = [],
        departmentData = [],
        i,
        j,
        dataLen = data.length,
        drillDataLen,
        brightness,
        sum = 0;
    for (var companySite in r[queryAction]){
        var tmpData = {
            y: 0,
            color: colors[0],
            drilldown: {
                name: companySite,
                categories: [],
                data: [],
                color: colors[0]
            }
        }
        var tmpSubSum = 0;
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

        var dataLen = data.length;
        // Build the data arrays
        for (i = 0; i < dataLen; i += 1) {

            // add site data
            siteData.push({
                name: categories[i],
                y: data[i].y / sum * 100,
                color: data[i].color
            });

            // add department data
            drillDataLen = data[i].drilldown.data.length;
            for (j = 0; j < drillDataLen; j += 1) {
                brightness = 0.2 - (j / drillDataLen) / 5;
                departmentData.push({
                    name: data[i].drilldown.categories[j],
                    y:   Math.round(data[i].drilldown.data[j] / sum * 10) / 10 * 100,
                    color: Highcharts.Color(data[i].color).brighten(brightness).get()
                });
            }
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

var createdDunutChart = function(container){

    // Create the chart
    var chart = Highcharts.chart(container, {
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
            data: [],
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
            data: [],
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

    return chart;
}
</script>