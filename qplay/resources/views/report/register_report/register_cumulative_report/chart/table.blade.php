<div id="table_{{$REPORT_TYPE}}_1">
    <div><label class="text-muted"></label></div>
    <div class="table-responsive">
        <table class="table table-bordered table-striped report-table">
           <thead>
              <tr>
                 <th rowspan="2" data-field="_id.action" class="table-title">
                    <div class="th-inner ">系統 名稱</div>
                 </th>
                 <th rowspan="2" data-field="1" class="table-title bg-color-blue">
                    <div class="th-inner ">註冊設備數</div>
                 </th>
                 <th rowspan="2" data-field="2" class="table-title bg-color-pink">
                    <div class="th-inner ">註冊用戶數</div>
                 </th>
                 <th class="js-data-title table-title bg-color-blue">
                    <div class="th-inner">註冊設備數_公司+地區</div>
                 </th>
                 <th class="js-data-title table-title bg-color-pink">
                    <div class="th-inner">註冊用戶數_公司+地區</div>
                 </th>
              </tr>
              <tr class="js-sub-title">
              </tr>
           </thead>
           <tbody class="js-row">
           </tbody>
        </table>
    </div>
</div>
<script>

var createCumulativeRegisterTableChart = function(res,date){

    var $tableChartDiv = $('#table_{{$REPORT_TYPE}}_1');
    $tableChartDiv.find('.text-muted').text(date);
    $tableChartDiv.find('thead > tr.js-sub-title').empty();
    $tableChartDiv.find('tbody').empty();
    createCumulativeRegisterTable(res,date);
    sortTable('table_{{$REPORT_TYPE}}_1');    
}
var createCumulativeRegisterTable = function(res, date){
    
    var $tableChartDiv = $('#table_{{$REPORT_TYPE}}_1');

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
</script>