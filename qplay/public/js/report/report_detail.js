$(function () {
    $('#goBack').click(function(){
        window.location='../report';
    });  
    $('.dropdown-menu > li > a').click(function(){
        $('.nav-tabs > li.active').removeClass('active');
        $('#api_report > li.active').removeClass('active');
        var openId = $(this).data('tabid');
        switch (openId) {
            case 'api_call_frequency_report':
                iniApiCallFrequencyReport(appKey);
                break;
            case 'api_operation_time_report':
                iniApiOperationTimeReport(appKey);
                break;
        }
        $(this).parents('li').addClass('active');
        $('.tab-content > div.active').removeClass('active').removeClass('in')
        $('#' + openId).addClass('active').addClass('in');
        
    });
});

var iniApiCallFrequencyReport = function(appKey){

    var storage = ExtSessionStorage(appKey);
    
    $('.loader').show();
    var mydata = {app_key:appKey},
        mydataStr = $.toJSON(mydata),
        res={};
    if(storage("callApiFrequency")){
        $('.loader').hide();
        res =JSON.parse(storage("callApiFrequency"));
        creatChart(res,reportEndDate);
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
                creatChart(res,reportEndDate);
            },
            error: function (e) {
                showMessageDialog(Messages.Error,Messages.MSG_OPERATION_FAILED, e.responseText);
            }
        }).done(function() {
            $('.loader').hide();
        });
    } 
}

var creatChart = function(res,reportEndDate){
    createdCallApiDunutChart(getDonutChartOpt());
    createCallApiMultiLine(res);
    createTableChart(res,reportEndDate);
}

var iniApiOperationTimeReport = function(appKey){

    var storage = ExtSessionStorage(appKey);
    $('.loader').show();
    var mydata = {app_key:appKey},
        mydataStr = $.toJSON(mydata),
        res={};
    if(storage("apiOperationTime")){
        $('.loader').hide();
        res =JSON.parse(storage("apiOperationTime"));
        creatChartOpTime(res,reportEndDate);
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
                    creatChartOpTime(res,reportEndDate);
                },
                error: function (e) {
                    showMessageDialog(Messages.Error,Messages.MSG_OPERATION_FAILED, e.responseText);
                }
            }).done(function() {
                $('.loader').hide();
            });
    }

}

var creatChartOpTime = function(res,reportEndDate){
    createApiOperationTimeMultiLine(res);
    createApiOperationTimeRangeLineChart(getRangeLineChartOpt());
    createOperationTimeTableChart(res,reportEndDate);
    
}

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
}