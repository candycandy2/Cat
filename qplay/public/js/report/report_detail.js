$(function () {
    $('#goBack').click(function(){
        window.location='../report';
    });  
    $('.dropdown-menu > li > a ,.signle-page > a').click(function(){
        $('.nav-tabs > li.active').removeClass('active');
        $('.dropdown-menu > li.active').removeClass('active');
        var openId = $(this).data('tabid');
        $(this).parents('li').addClass('active');
        setActiveTab(openId, appKey);
    });
    var $defaultTab = $('#navReport>li>a').first()
    if( $defaultTab.parents('li').hasClass('dropdown')){
        $defaultTab = $('#navReport>li>ul>li>a').first();   
    }
    setActiveTab($defaultTab.data('tabid'), appKey);
    $defaultTab.parents('li').addClass('active');
});

var setActiveTab = function(openId, appKey){

    switch (openId) {
        case 'api_call_frequency_report':
            iniApiCallFrequencyReport(appKey);
            break;
        case 'api_operation_time_report':
            iniApiOperationTimeReport(appKey);
            break;
        case 'register_daily_report':
            iniRegisterDailyReport(appKey);
            break;
        case 'register_cumulative_report':
            iniRegisterCumulativeReport(appKey);
            break;
        case 'summary_report':
            iniSummaryReport(appKey);
            break;
    }

    $('.tab-content > div.active').removeClass('active').removeClass('in');
    $('#' + openId).addClass('active').addClass('in');
};
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

var iniApiOperationTimeReport = function(appKey){

    var storage = ExtSessionStorage(appKey);
    $('.loader').show();
    var mydata = {app_key:appKey,timeOffset:timeOffset},
        mydataStr = $.toJSON(mydata),
        res={};
    if(storage("apiOperationTime")){
        $('.loader').hide();
        res =JSON.parse(storage("apiOperationTime"));
        creatChartOpTime(res);
    }else{
        
        $.ajax({
              url:"reportDetail/getApiOperationTimeReport",
              type:"POST",
              dataType:"json",
              contentType: "application/json",
              data:mydataStr,
                success: function(r){
                    $.each(r,function(i,data){
                        var d = data._id;
                        if(!res.hasOwnProperty(d.created_at)){
                             res[d.created_at] = {};
                        }
                        if(!res[d.created_at].hasOwnProperty(d.action)){
                            res[d.created_at][d.action] = {'max' : 0, 'min' : 0, 'avg':0};
                        }
                        var actionArray =  res[d.created_at][d.action];
                        actionArray.max = data.max * 1000;
                        actionArray.min = data.min * 1000;
                        actionArray.avg = data.avg * 1000;
                        actionArray.count = data.count;
                    });
                    storage("apiOperationTime",JSON.stringify(res));
                    creatChartOpTime(res);
                },
                error: function (e) {
                    showMessageDialog(Messages.Error,Messages.MSG_OPERATION_FAILED, e.responseText);
                }
            }).done(function() {
                $('.loader').hide();
            });
    }

};

var creatChartOpTime = function(res){
    var reportEndDate = ($.isEmptyObject(res))?"":Object.keys(res).sort()[Object.keys(res).length-1];
    createApiOperationTimeMultiLine(res);
    createApiOperationTimeRangeLineChart(getRangeLineChartOpt());
    createOperationTimeTableChart(res,reportEndDate);
};


var iniRegisterDailyReport = function(appKey){
    var storage = ExtSessionStorage(appKey);
    $('.loader').show();
    var mydata = {timeOffset:timeOffset},
        mydataStr = $.toJSON(mydata),
        res={};
    if(storage("RegisterDaily")){
        $('.loader').hide();
        res =JSON.parse(storage("RegisterDaily"));
        createChartDailyRegister(res);
    }else{
        
        $.ajax({
              url:"reportDetail/getRegisterDailyReport",
              type:"POST",
              dataType:"json",
              data:mydataStr,
              contentType: "application/json",
                success: function(r){

                    $.each(r,function(i,d){
                        if(!res.hasOwnProperty(d.register_date)){
                            res[d.register_date] = {'count' : 0, 'users' : [], 'device_type':{}};
                        }
                        res[d.register_date].count =  parseInt(res[d.register_date].count) + parseInt(d.count);
                      
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
                            companySiteArray[d.department] = {'count' : 0, 'users' : []};
                        }
                        var departmentArray =  companySiteArray[d.department];
                        departmentArray.count =  parseInt(departmentArray.count) + parseInt(d.count);
                        if($.inArray(d.user_row_id,  departmentArray.users) == -1){
                            departmentArray.users.push(d.user_row_id);
                        }
                    });
                    storage("RegisterDaily",JSON.stringify(res));
                    createChartDailyRegister(res);
                },
                error: function (e) {
                    showMessageDialog(Messages.Error,Messages.MSG_OPERATION_FAILED, e.responseText);
                }
            }).done(function() {
                $('.loader').hide();
            });
    }

};

var createChartDailyRegister = function(res){
    var reportEndDate = ($.isEmptyObject(res))?"":Object.keys(res).sort()[Object.keys(res).length-1];
    createDailyRegisterMultiLine(res);
    createDailyRegisterTableChart(res, reportEndDate);
    creatDailyRegisterDunutChart(getDonutChartOpt());
    updateDailyRegisterDonutChart(res,reportEndDate)
};

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

var iniSummaryReport = function(){
     var mydata = {timeOffset:timeOffset},
         mydataStr = $.toJSON(mydata),
         registedDeviceRes={};
         registedUserRes={};
         activeDeviceRes = {};
         activeUserRes = {};
     /* 註冊設備/用戶數 */

     $('.loader').show();
     $('.responsive_container').hide();

     $.ajax({
      url:"reportDetail/getRegisterDailyReport",
      type:"POST",
      dataType:"json",
      data:mydataStr,
      contentType: "application/json",
        success: function(r){
            $.each(r,function(i,d){
                if(!registedDeviceRes.hasOwnProperty(d.device_type)){
                    registedDeviceRes[d.device_type] = 0;
                }
                var companySite = d.company +'_'+ d.site_code;
                if(!registedUserRes.hasOwnProperty(companySite)){
                    registedUserRes[companySite] = [];
                }
                if($.inArray(d.user_row_id, registedUserRes[companySite]) == -1){
                    registedUserRes[companySite].push(d.user_row_id);
                }
                registedDeviceRes[d.device_type] = registedDeviceRes[d.device_type]  + d.count;
            });
           
            createSmmaryRegistedDeviceChart(sortObjectByKey(registedDeviceRes));
            createSmmaryRegistedUserChart(sortObjectByKey(registedUserRes));
        },
        error: function (e) {
            showMessageDialog(Messages.Error,Messages.MSG_OPERATION_FAILED, e.responseText);
        }
    }).done(function() {
        $('#registed_device_block .loader').hide();
        $('#registed_user_block .loader').hide();
        $('#registed_device_block .responsive_container').show();
        $('#registed_user_block .responsive_container').show();
    });
    /* 活躍設備/用戶數 */
    $.ajax({
      url:"reportDetail/getActiveRegisterReport",
      type:"POST",
      dataType:"json",
      contentType: "application/json",
        success: function(r){
            $.each(r,function(i,d){
                if(!activeDeviceRes.hasOwnProperty(d.device_type)){
                    activeDeviceRes[d.device_type] = 0;
                }
                var companySite = d.company +'_'+ d.site_code;
                if(!activeUserRes.hasOwnProperty(companySite)){
                    activeUserRes[companySite] = [];
                }
                if($.inArray(d.user_row_id, activeUserRes[companySite]) == -1){
                    activeUserRes[companySite].push(d.user_row_id);
                }
                activeDeviceRes[d.device_type] = activeDeviceRes[d.device_type]  + d.count;
            });
            createSmmaryActiveDeviceChart(sortObjectByKey(activeDeviceRes));
            createSmmaryActiveUserChart(sortObjectByKey(activeUserRes));
        },
        error: function (e) {
            showMessageDialog(Messages.Error,Messages.MSG_OPERATION_FAILED, e.responseText);
        }
    }).done(function() {
        $('#active_device_block .loader').hide();
        $('#active_user_block .loader').hide();
        $('#active_device_block .responsive_container').show();
        $('#active_user_block .responsive_container').show();
    });
};


var sortTable = function(table){
    var rows = $('#' + table).find('table tbody  tr').not('.js-total').get();

    rows.sort(function(a, b) {

    var A = $(a).children('td').eq(0).text().toUpperCase();
    var B = $(b).children('td').eq(0).text().toUpperCase();
    A=parseInt(A.split('(')[0]);
    B=parseInt(B.split('(')[0]);

    if(A < B) {
    return -1;
    }

    if(A > B) {
    return 1;
    }

    return 0;

    });

    $.each(rows, function(index, row) {
    $('#' + table).find('table > tbody').prepend(row);
    });
};