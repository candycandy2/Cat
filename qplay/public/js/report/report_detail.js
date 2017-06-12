$(function () {
    $('#goBack').click(function(){
        window.location='../report';
    });  
    $('.dropdown-menu > li > a').click(function(){
        $('.nav-tabs > li.active').removeClass('active');
        $('#api_report > li.active').removeClass('active');
        var openId = $(this).data('tabid');
        if(openId == 'api_call_frequency_report'){
            iniApiCallFrequencyReport(appKey);
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
    var callUsersData=[],
        callTimesData=[],
        seriesOptions = [];

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
    seriesOptions[0] = {
        name:"呼叫次數",
        data:callTimesData
    }

    seriesOptions[1] = {
        name:"呼叫人數",
        data:callUsersData
    }
    createdDunutChart('container_donut_chart_t');
    createdDunutChart('container_donut_chart_d');
    createMultiLineChart('container_stock',seriesOptions, res); 
    createTableChart(res,reportEndDate);
}