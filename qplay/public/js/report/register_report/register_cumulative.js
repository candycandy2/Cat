
var iniRegisterCumulativeReport = function(appKey){
    var storage = ExtSessionStorage(appKey);
    $('.loader').show();
    var mydata = {timeOffset:timeOffset},
        mydataStr = $.toJSON(mydata),
        res={};
    if(storage("RegisterCumulative")){
        $('.loader').hide();
        res =JSON.parse(storage("RegisterCumulative"));
        createChartCumulatvieRegister(res);
    }else{
        $.ajax({
              url:"reportDetail/getRegisterCumulativeReport",
              type:"POST",
              dataType:"json",
              data:mydataStr,
              contentType: "application/json",
                success: function(r){
                    var devices = [];
                    var users = [];
                    $.each(r,function(i,d){
                        if(!res.hasOwnProperty(d.register_date)){
                            res[d.register_date] = {'devices' : [], 'users' : [], 'device_type':{}};
                        }
                        if($.inArray(d.uuid,  res[d.register_date].devices) == -1){
                            res[d.register_date].devices.push(d.uuid);
                        }

                        if($.inArray(d.user_row_id,  res[d.register_date].users) == -1){
                            res[d.register_date].users.push(d.user_row_id);
                        }

                        if(!res[d.register_date].device_type.hasOwnProperty(d.device_type)){
                            res[d.register_date].device_type[d.device_type] = {};
                        }
                        var actionArray =  res[d.register_date].device_type[d.device_type];
                        if(!actionArray.hasOwnProperty(d.company +'_'+ d.site_code)){
                            actionArray[d.company +'_'+ d.site_code] = {};
                        }
                        var companySiteArray =  actionArray[d.company +'_'+ d.site_code];
                        if(!companySiteArray.hasOwnProperty(d.department)){
                            companySiteArray[d.department] = {'devices' : [], 'users' : []};
                        }
                        var departmentArray =  companySiteArray[d.department];
                        if($.inArray(d.devices,  departmentArray.devices) == -1){
                            departmentArray.devices.push(d.uuid);
                        }
                        if($.inArray(d.user_row_id,  departmentArray.users) == -1){
                            departmentArray.users.push(d.user_row_id);
                        }
                    });
                    //caculate cumulative
                    var tmpDate;
                    $.each(res,function(i,d){
                        if(typeof tmpDate !='undefined'){
                            d.devices = unionArrays(res[tmpDate].devices,d.devices);
                            d.users = unionArrays(res[tmpDate].users,d.users);
                            var preObj = res[tmpDate].device_type;
                            var currentObj = d.device_type;
                            $.each(preObj,function(j,deviceTypeDetail){
                                if(!currentObj.hasOwnProperty(j)){
                                    currentObj[j] = {};
                                }
                                $.each(deviceTypeDetail,function(k,companySiteDetail){
                                    if(!currentObj[j].hasOwnProperty(k)){
                                        currentObj[j][k] = {};
                                    }
                                    $.each(companySiteDetail,function(l,departmentDetail){
                                        if(!currentObj[j][k].hasOwnProperty(l)){
                                            currentObj[j][k][l] = {'devices':[],'users':[]};
                                        }
                                        currentObj[j][k][l].devices = unionArrays(preObj[j][k][l].devices,currentObj[j][k][l].devices);
                                        currentObj[j][k][l].users = unionArrays(preObj[j][k][l].users,currentObj[j][k][l].users);
                                    });
                                });
                            });
                            
                        }
                        tmpDate = i;
                    });
                    storage("RegisterCumulative",JSON.stringify(res));
                    createChartCumulatvieRegister(res);
                },
                error: function (e) {
                    showMessageDialog(Messages.Error,Messages.MSG_OPERATION_FAILED, e.responseText);
                }
            }).done(function() {
                $('.loader').hide();
            });
    }

};

var createChartCumulatvieRegister = function(res){
    var reportEndDate = ($.isEmptyObject(res))?"":Object.keys(res).sort()[Object.keys(res).length-1];
    createCumulativeRegisterMultiLine(res);
    createCumulativeRegisterTableChart(res, reportEndDate);
    creatCumulativeRegisterDunutChart(getDonutChartOpt());
    updateCumulativeRegisterDonutChart(res,reportEndDate);
};

/*Multi Line*/
var createCumulativeRegisterMultiLine = function (res){

    var registerDeviceData=[],
        registerUSerData=[],
        seriesOptions = [],
        options = getMultiLineChartOpt();
    for (var k in res){
        if (typeof res[k] !== 'function') {
             var tmpDeviceArr = [dateToUTC(k),res[k].devices.length];
             var tmpUsersArr = [dateToUTC(k),res[k].users.length];
             registerDeviceData.push(tmpDeviceArr);
             registerUSerData.push(tmpUsersArr);
        }
    }
    options.series = [{
        name:Messages.CUMULATIVE_REGISTERED_DEVICE,
        data:[]
    },{
        name:Messages.CUMULATIVE_REGISTERED_USERS,
        data:[]
    }];

    options.plotOptions.series.point.events = {
        click: function (e) {
             createCumulativeRegisterTableChart(res, Highcharts.dateFormat('%Y-%m-%d',this.x));
             updateCumulativeRegisterDonutChart(res, Highcharts.dateFormat('%Y-%m-%d',this.x));
        }
    };
    createCumulativeRegisterMultiLineChart(options);
    var chart = $('#container_stock_register_cumulative_1').highcharts();
    chart.series[0].setData(registerDeviceData);
    chart.series[1].setData(registerUSerData);
}

function createCumulativeRegisterMultiLineChart(options) {
    
    Highcharts.stockChart('container_stock_register_cumulative_1', options,
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

/*Dunut chart*/
var updateCumulativeRegisterDonutChart = function(r, queryDate){
    $('#register_cumulative_donutchart label.text-muted').text(queryDate);
    setCumulativeRegisterDonutChartData(r,'1', queryDate, $('#container_donut_chart_register_cumulative_1').highcharts());
    setCumulativeRegisterDonutChartData(r,'2', queryDate, $('#container_donut_chart_register_cumulative_2').highcharts());
    setCumulativeRegisterDonutChartData(r,'3', queryDate, $('#container_donut_chart_register_cumulative_3').highcharts());
    setCumulativeRegisterDonutChartData(r,'4', queryDate, $('#container_donut_chart_register_cumulative_4').highcharts());
}

var setCumulativeRegisterDonutChartData = function(r,type,queryDate,chart){

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
                            tmpCount = tmpCount + dataByDevice[deviceType][companySite][department].devices.length;
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
                    arrangeData[companySite][department].device = dataByDevice[deviceType][companySite][department].devices.length;
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
            title = Messages.CUMULATIVE_REGISTERED_DEVICE_RATE + ' ( ' + Messages.BY_DEVICE + ' ) ';
            break;
        case '2':
            title = Messages.CUMULATIVE_REGISTERED_DEVICE_RATE + ' ( ' + Messages.BY_DEPARTMENT + ' ) ';
            break;
        case '3':
            title = Messages.CUMULATIVE_REGISTERED_USERS_RATE + ' ( ' + Messages.BY_DEVICE + ' ) ';
            break;
        case '4':
            title = Messages.CUMULATIVE_REGISTERED_USERS_RATE + ' ( ' + Messages.BY_DEPARTMENT + ' ) ';
            break;
    }

    chart.setTitle({ text: title });
    chart.series[0].setData(parentData);
    chart.series[1].setData(childData);
}

var creatCumulativeRegisterDunutChart = function(options){
    Highcharts.chart('container_donut_chart_register_cumulative_1',options);
    Highcharts.chart('container_donut_chart_register_cumulative_2',options);
    Highcharts.chart('container_donut_chart_register_cumulative_3',options);
    Highcharts.chart('container_donut_chart_register_cumulative_4',options);
}


/*Table*/
var createCumulativeRegisterTableChart = function(res,date){

    var $tableChartDiv = $('#table_register_cumulative_1');
    $tableChartDiv.find('.text-muted').text(date);
    $tableChartDiv.find('thead > tr.js-sub-title').empty();
    $tableChartDiv.find('tbody').empty();
    createCumulativeRegisterTable(res,date);
    sortTable('table_register_cumulative_1');    
}
var createCumulativeRegisterTable = function(res, date){
    
    var $tableChartDiv = $('#table_register_cumulative_1');

    if(typeof res[date] == 'undefined'){
        $tableChartDiv.find('tbody').html('<tr><td colspan="5">' + Messages.NO_DATA_TO_DISPLAY + '</td></tr>');
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
    var totalDistinctDeviceCount = [];
    $.each(deviceTypeArray, function(index, deviceType){
        $.each(companySiteArray, function(subIndex, companySite){
             var tmpDeviceCount = 0;
             var tmpUsersCount = 0;
            $.each(departmentArray, function(nodeIndex, department){
                if( (typeof dataArray[deviceType][companySite] != 'undefined') && (typeof dataArray[deviceType][companySite][department] != 'undefined')){
                    tmpDeviceCount = tmpDeviceCount + dataArray[deviceType][companySite][department].devices.length;
                    tmpUsersCount = tmpUsersCount + dataArray[deviceType][companySite][department].users.length;
                    $.each(dataArray[deviceType][companySite][department].users,function(i,user){
                        if($.inArray(user, totalDistinctUserCount ) == -1){
                            totalDistinctUserCount.push(user);
                        }
                    });
                    $.each(dataArray[deviceType][companySite][department].devices,function(i,device){
                        if($.inArray(device, totalDistinctDeviceCount ) == -1){
                            totalDistinctDeviceCount.push(device);
                        }
                    });
                }
            });
            $tableChartDiv.find('table .js-'+deviceType+' .js-'+companySite+'_t').html(tmpDeviceCount);
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
                htotalArr[type][i-1] = totalDistinctDeviceCount.length;//real distinct device count
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