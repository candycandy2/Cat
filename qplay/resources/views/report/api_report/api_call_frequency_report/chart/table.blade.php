<div id="table_{{$REPORT_TYPE}}_1">
    <div><label class="text-muted">2017-03-03</label></div>
    <div class="table-responsive">
        <table class="table table-bordered table-striped report-table">
           <thead>
              <tr>
                 <th rowspan="2" data-field="_id.action" class="table-title">
                    <div class="th-inner ">API 名稱</div>
                 </th>
                 <th rowspan="2" data-field="1" class="table-title bg-color-blue">
                    <div class="th-inner ">API 呼叫次數</div>
                 </th>
                 <th rowspan="2" data-field="2" class="table-title bg-color-pink">
                    <div class="th-inner ">API 呼叫人數</div>
                 </th>
                 <th class="js-data-title table-title bg-color-blue">
                    <div class="th-inner">API 呼叫次數_公司+地區</div>
                 </th>
                 <th class="js-data-title table-title bg-color-pink">
                    <div class="th-inner">API 呼叫人數_公司+地區</div>
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

var createCallApiTableChart = function(res,date){
    var $tableChartDiv = $('#table_{{$REPORT_TYPE}}_1');
    $tableChartDiv.find('.text-muted').text(date);
    $tableChartDiv.find('thead > tr.js-sub-title').empty();
    $tableChartDiv.find('tbody').empty();
    
    createCallApiTableTable(res,date);
    sortTable('table_{{$REPORT_TYPE}}_1');
    
    //set donut chart
    if(typeof res[date] == 'undefined'){
       $tableChartDiv.hide();
       $('#{{$REPORT_TYPE}}_donutchart').hide();
    }else{
        $tableChartDiv.show();
        $('#{{$REPORT_TYPE}}_donutchart').show();
        updateApiLogDonutChart(res[date].actions,$.trim($tableChartDiv.find('table u').eq(0).text()));
    }
    
}
var createCallApiTableTable = function(res, date){

    if(typeof res[date] == 'undefined'){
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

    var $tableChartDiv = $('#table_{{$REPORT_TYPE}}_1');
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
</script>