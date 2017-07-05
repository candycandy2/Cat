/*Multi Line*/
var createDailyRegisterMultiLine = function (res){

    var registerDeviceData=[],
        registerUSerData=[],
        seriesOptions = [],
        options = getMultiLineChartOpt();
    for (var k in res){
        if (typeof res[k] !== 'function') {
             var tmpDeviceArr = [dateToUTC(k),res[k].count];
             var tmpUsersArr = [dateToUTC(k),res[k].users.length];
             registerDeviceData.push(tmpDeviceArr);
             registerUSerData.push(tmpUsersArr);
        }
    }
    options.series = [{
        name:"每日註冊設備數",
        data:[]
    },{
        name:"每日註冊用戶數",
        data:[]
    }];

    options.plotOptions.series.point.events = {
        click: function (e) {
             createDailyRegisterTableChart(res, Highcharts.dateFormat('%Y-%m-%d',this.x));
             updateDailyRegisterDonutChart(res, Highcharts.dateFormat('%Y-%m-%d',this.x));
        }
    };
    createDailyRegisterMultiLineChart(options);
    var chart = $('#container_stock_register_daily_1').highcharts();
    chart.series[0].setData(registerDeviceData);
    chart.series[1].setData(registerUSerData);
}

function createDailyRegisterMultiLineChart(options) {
    
    Highcharts.stockChart('container_stock_register_daily_1', options,
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

/*Dunut Chart*/
var updateDailyRegisterDonutChart = function(r, queryDate){
    $('#register_daily_donutchart label.text-muted').text(queryDate);
    setDailyRegisterDonutChartData(r,'1', queryDate, $('#container_donut_chart_register_daily_1').highcharts());
    setDailyRegisterDonutChartData(r,'2', queryDate, $('#container_donut_chart_register_daily_2').highcharts());
    setDailyRegisterDonutChartData(r,'3', queryDate, $('#container_donut_chart_register_daily_3').highcharts());
    setDailyRegisterDonutChartData(r,'4', queryDate, $('#container_donut_chart_register_daily_4').highcharts());
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
    Highcharts.chart('container_donut_chart_register_daily_1',options);
    Highcharts.chart('container_donut_chart_register_daily_2',options);
    Highcharts.chart('container_donut_chart_register_daily_3',options);
    Highcharts.chart('container_donut_chart_register_daily_4',options);
}

/*Table*/
var createDailyRegisterTableChart = function(res,date){

    var $tableChartDiv = $('#table_register_daily_1');
    $tableChartDiv.find('.text-muted').text(date);
    $tableChartDiv.find('thead > tr.js-sub-title').empty();
    $tableChartDiv.find('tbody').empty();
    createDailyRegisterTable(res,date);
    sortTable('table_register_daily_1');    
}
var createDailyRegisterTable = function(res, date){
    var $tableChartDiv = $('#table_register_daily_1');
    if(typeof res[date] == 'undefined'){
        $tableChartDiv.find('tbody').html('<tr><td colspan="5">沒有匹配的紀錄</td></tr>');
        return false;
    }
    
    var dataArray = res[date].device_type;
    var deviceTypeArray =[];
    var companySiteArray = [];
    var departmentArray = [];
    for(var deviceType in dataArray){
        if($.inArray(deviceType,deviceTypeArray) == -1){
            deviceTypeArray.push(deviceType);
        }
        for(var companySite in dataArray[deviceType]){
            if($.inArray(companySite,companySiteArray) == -1){
                companySiteArray.push(companySite);
            }

            for(var department in dataArray[deviceType][companySite]){
                if($.inArray(department,departmentArray) == -1){
                    departmentArray.push(department);
                }
            }
        }
    }

    $tableChartDiv.find('.js-data-title').attr('colspan',companySiteArray.length);
    //register device
    var td = '<td class="js-v-t text-blod" nowrap="nowrap" >0</td><td class="js-v-d text-blod" nowrap="nowrap">0</td>';
    $.each(companySiteArray, function(index, companySite){
        var th = '<th class="table-title bg-color-blue"><div class="th-inner fit-cell">'+companySite+'</div></th>';
        td+= '<td class="js-'+companySite+'_t">0</td>';
        $tableChartDiv.find('.js-sub-title').append(th);
    });
    //register users
    $.each(companySiteArray, function(index, companySite){
        var th = '<th class="table-title bg-color-pink"><div class="th-inner fit-cell">'+companySite+'</div></th>';
        td+= '<td class="js-'+companySite+'_d">0</td>';
        $tableChartDiv.find('.js-sub-title').append(th);
    });
    //api deviceType row
    $.each(deviceTypeArray, function(index, deviceType){
        var tr = '<tr class="js-' + deviceType + '" ><th scope="row">' + deviceType + '</th>' + td + '</tr>';
        $tableChartDiv.find('.js-row').append(tr);
    });

    //append result data
    var totalDistinctUserCount = [];
    $.each(deviceTypeArray, function(index, deviceType){
        $.each(companySiteArray, function(subIndex, companySite){
             var tmpTimesCount = 0;
             var tmpUsersCount = 0;
            $.each(departmentArray, function(nodeIndex, department){
                if( (typeof dataArray[deviceType][companySite] != 'undefined') && (typeof dataArray[deviceType][companySite][department] != 'undefined')){
                    tmpTimesCount = tmpTimesCount + dataArray[deviceType][companySite][department].count;
                    tmpUsersCount = tmpUsersCount + dataArray[deviceType][companySite][department].users.length;
                    $.each(dataArray[deviceType][companySite][department].users,function(i,user){
                        if($.inArray(user, totalDistinctUserCount ) == -1){
                            totalDistinctUserCount.push(user);
                        }
                    });
                }
            });
            $tableChartDiv.find('table .js-'+deviceType+' .js-'+companySite+'_t').html(tmpTimesCount);
            $tableChartDiv.find('table .js-'+deviceType+' .js-'+companySite+'_d').html(tmpUsersCount);
        });

    });

    //add last total row
    $tableChartDiv.find('.js-row').append('<tr class="js-total"><th scope="row"></th>'+td+'</tr>');
    $tableChartDiv.find('.js-row > tr.js-total td').html(0);

    //  operate company-side total
    var htotalArr = {'t':[],'d':[]};
    $.each(companySiteArray, function(index, companySite){
        var vtotalArr = {'t':0,'d':0};
        $.each(vtotalArr, function(type,cnt){
           $companySiteObj =  $tableChartDiv.find('td.js-' + companySite + '_' + type);
           var i=0;
            $.each($companySiteObj, function(subIndexnx,companySiteDataObj){
                if(typeof htotalArr[type][i] =='undefined'){
                    htotalArr[type][i] = 0;
                }
                if(typeof vtotalArr[type][i] =='undefined'){
                    vtotalArr[type][i] = 0;
                }
                htotalArr[type][i] =  parseInt(htotalArr[type][i]) + parseInt($(companySiteDataObj).html())
                vtotalArr[type] =  parseInt(vtotalArr[type]) + parseInt($(companySiteDataObj).html());
                i++;
            });
            //modify last one
            if(type == 't'){
                htotalArr[type][i-1] = parseInt(htotalArr[type][i-1]) + parseInt(vtotalArr[type]);
                $tableChartDiv.find('table .js-'+'total'+' .js-'+companySite+'_' + type).html(vtotalArr[type]);
            }else{
                htotalArr[type][i-1] = totalDistinctUserCount.length;//real distinct user count
                $tableChartDiv.find('table .js-'+'total'+' .js-'+companySite+'_' + type).html(vtotalArr[type]);
            }
        });   
         
     });
    // operate device and  users total
    $.each(htotalArr,function(type,hTotal){
        $vTotalObj = $tableChartDiv.find('table').find('.js-v-' + type);
        $.each($vTotalObj, function(index){
            var percent = (htotalArr[type][index]/htotalArr[type][$vTotalObj.length-1]) * 100 ;
            $(this).html(htotalArr[type][index] + '<span>(' + Math.round(percent * 10) / 10 + ' % )</span>');
        });
     });
     $tableChartDiv.find('.js-v-t span').css('color','#8085e9');
     $tableChartDiv.find('.js-v-d span').css('color','Orange');
}