var iniApiCallFrequencyReport = function(appKey){

    var storage = ExtSessionStorage(appKey);
    $('.loader').show();
    var mydata = {app_key:appKey, timeOffset:timeOffset},
        mydataStr = $.toJSON(mydata),
        res={};
    if(storage("callApiFrequency")){
        $('.loader').hide();
        res =JSON.parse(storage("callApiFrequency"));
        creatApiCallFrequencyChart(res);
    }else{
        $.ajax({
          url:"reportDetail/getCallApiReport",
          type:"POST",
          dataType:"json",
          contentType: "application/json",
          data:mydataStr,
            success: function(r){
                $.each(r,function(i,data){
                    var d = data._id;
                    if(!res.hasOwnProperty(d.created_at)){
                        res[d.created_at] = {'times' : 0, 'users' : [], 'actions':{}};
                    }
                    res[d.created_at].times =  parseInt(res[d.created_at].times) + parseInt(data.count);
                  
                    if($.inArray(d.user_row_id,  res[d.created_at].users) == -1){
                        res[d.created_at].users.push(d.user_row_id);
                    }

                    if(!res[d.created_at].actions.hasOwnProperty(d.action)){
                        res[d.created_at].actions[d.action] = {};
                    }
                    var actionArray =  res[d.created_at].actions[d.action];
                    if(!actionArray.hasOwnProperty(d.company_site)){
                        actionArray[d.company_site] = {};
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
                storage("callApiFrequency",JSON.stringify(res));
                creatApiCallFrequencyChart(res);
            },
            error: function (e) {
                showMessageDialog(Messages.Error,Messages.MSG_OPERATION_FAILED, e.responseText);
            }
        }).done(function() {
            $('.loader').hide();
        });
    } 
};

var creatApiCallFrequencyChart = function(res){
    var reportEndDate = ($.isEmptyObject(res))?"":Object.keys(res).sort()[Object.keys(res).length-1];
    createCallApiDunutChart(getDonutChartOpt());
    createCallApiMultiLine(res);
    createCallApiTableChart(res,reportEndDate);
};

/** Multi Line **/
var createCallApiMultiLine = function (res){
    var callUsersData=[],
        callTimesData=[],
        seriesOptions = [],
        options = getMultiLineChartOpt();
   
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

    options.series = [{
        name:"呼叫次數",
        data:[]
    },{
        name:"呼叫人數",
        data:[]
    }];

    options.plotOptions.series.point.events = {
        click: function (e) {
             createCallApiTableChart(res, Highcharts.dateFormat('%Y-%m-%d',this.x));
        }
    };
    createCallApiMultiLineChart(options);
    var chart = $('#container_stock_api_call_frequency_1').highcharts();    
    chart.series[0].setData(callTimesData);
    chart.series[1].setData(callUsersData);
}

function createCallApiMultiLineChart(options) {
    Highcharts.stockChart('container_stock_api_call_frequency_1', options,
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

/** Table **/
var createCallApiTableChart = function(res,date){
    var $tableChartDiv = $('#table_api_call_frequency_1');
    $tableChartDiv.find('.text-muted').text(date);
    $tableChartDiv.find('thead > tr.js-sub-title').empty();
    $tableChartDiv.find('tbody').empty();
    
    createCallApiTable(res,date);
    sortTable('table_api_call_frequency_1');
    //set donut chart
    if(typeof res[date] != 'undefined'){
         updateApiLogDonutChart(res[date].actions,$.trim($tableChartDiv.find('table u').eq(0).text()));
    }
}
var createCallApiTable = function(res, date){
    
    var $tableChartDiv = $('#table_api_call_frequency_1');
    
    if(typeof res[date] == 'undefined'){
        $tableChartDiv.find('tbody').html('<tr><td colspan="5">沒有匹配的紀錄</td></tr>');
        return false;
    }

    var dataArray = res[date].actions
    var actionArray =[];
    var companySiteArray = [];
    var departmentArray = [];
    for(var actionName in dataArray){
        if($.inArray(actionName,actionArray) == -1){
            actionArray.push(actionName);
        }
        for(var companySite in dataArray[actionName]){
            if($.inArray(companySite,companySiteArray) == -1){
                companySiteArray.push(companySite);
            }

            for(var department in dataArray[actionName][companySite]){
                if($.inArray(department,departmentArray) == -1){
                    departmentArray.push(department);
                }
            }
        }
    }
    $tableChartDiv.find('.js-data-title').attr('colspan',companySiteArray.length);
    //call api times
    var td = '<td class="js-v-t text-blod" nowrap="nowrap" >0</td><td class="js-v-d text-blod" nowrap="nowrap">0</td>';
    $.each(companySiteArray, function(index, companySite){
        var th = '<th class="table-title bg-color-blue"><div class="th-inner fit-cell">'+companySite+'</div></th>';
        td+= '<td class="js-'+companySite+'_t">0</td>';
        $tableChartDiv.find('.js-sub-title').append(th);
    });
    //call api user
    $.each(companySiteArray, function(index, companySite){
        var th = '<th class="table-title bg-color-pink"><div class="th-inner fit-cell">'+companySite+'</div></th>';
        td+= '<td class="js-'+companySite+'_d">0</td>';
        $tableChartDiv.find('.js-sub-title').append(th);
    });
    //api action row
    $.each(actionArray, function(index, actionName){
        var tr = '<tr class="js-' + actionName + '" style="cursor:pointer"><th scope="row"><u>' + actionName + '</u></th>' + td + '</tr>';
        $tableChartDiv.find('.js-row').append(tr);
    });

    //append result data
    var totalDistinctUserCount = [];
    var tmpUsers = [];
    $.each(actionArray, function(index, action){
        $.each(companySiteArray, function(subIndex, companySite){
             var tmpTimesCount = 0;
             var tmpUsersCount = 0;
            if(!tmpUsers.hasOwnProperty(companySite)){
                tmpUsers[companySite] = [];
             }
            $.each(departmentArray, function(nodeIndex, department){
                if( (typeof dataArray[action][companySite] != 'undefined') && (typeof dataArray[action][companySite][department] != 'undefined')){
                    tmpTimesCount = tmpTimesCount + dataArray[action][companySite][department].times;
                    tmpUsersCount = tmpUsersCount + dataArray[action][companySite][department].users.length;
                    $.each(dataArray[action][companySite][department].users,function(i,user){
                        if($.inArray(user, tmpUsers[companySite] ) == -1){
                            tmpUsers[companySite].push(user);
                        }
                        if($.inArray(user, totalDistinctUserCount ) == -1){
                            totalDistinctUserCount.push(user);
                        }
                    });
                }
            });
            $tableChartDiv.find('table .js-'+action+' .js-'+companySite+'_t').html(tmpTimesCount);
            $tableChartDiv.find('table .js-'+action+' .js-'+companySite+'_d').html(tmpUsersCount);
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
                $tableChartDiv.find('table .js-'+'total'+' .js-'+companySite+'_' + type).html(tmpUsers[companySite].length);
            }
        });   
         
     });
    // operate times and  users total
    $.each(htotalArr,function(type,hTotal){
        $vTotalObj = $tableChartDiv.find('table').find('.js-v-' + type);
        $.each($vTotalObj, function(index){
            var percent = (htotalArr[type][index]/htotalArr[type][$vTotalObj.length-1]) * 100 ;
            $(this).html(htotalArr[type][index] + '<span>(' + Math.round(percent * 10) / 10 + ' % )</span>');
        });
     });
     $tableChartDiv.find('.js-v-t span').css('color','#8085e9');
     $tableChartDiv.find('.js-v-d span').css('color','Orange');
     
     $tableChartDiv.find('table u').click(function(){
       updateApiLogDonutChart(dataArray,$.trim($(this).text()));
     });

}

/** Donut Chart **/
var updateApiLogDonutChart = function(r, queryAction){
    setDonutChartData(r,'t', queryAction, $('#container_donut_chart_api_call_frequency_t').highcharts());
    setDonutChartData(r,'d', queryAction, $('#container_donut_chart_api_call_frequency_d').highcharts());
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

var createCallApiDunutChart = function(options){
    Highcharts.chart('container_donut_chart_api_call_frequency_t',options);
    Highcharts.chart('container_donut_chart_api_call_frequency_d',options);
}