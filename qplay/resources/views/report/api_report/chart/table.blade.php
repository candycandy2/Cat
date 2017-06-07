<div><label class="text-muted" id="table_date">2017-03-03</label></div>
<div class="table-responsive">
    <table id="report_table" class="table table-bordered table-striped ">
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
          <tr class="js-company-site">
          </tr>
       </thead>
       <tbody class="js-row">
       </tbody>
    </table>
</div>
<script>

var createTableChart = function(res,date){
    $('#table_date').text(date);
    $('thead > tr.js-company-site').empty();
    $('tbody').empty();
    createTable(res,date);
    sortTable('#report_table');
}
var createTable = function(res, date){
    if(typeof res[date] == 'undefined'){
        return false;
    }
    var dataArray = res[date].actions
    //var htotalArr = {'t':[],'d':[]};
    //var vtotalArr = {'t':0,'d':0};
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
    $('.js-data-title').attr('colspan',companySiteArray.length);
    //call api times
    var td = '<td class="js-v-t text-blod">0</td><td class="js-v-d text-blod">0</td>';
    $.each(companySiteArray, function(index, companySite){
        var th = '<th class="table-title bg-color-blue"><div class="th-inner fit-cell">'+companySite+'</div></th>';
        td+= '<td class="js-'+companySite+'_t">0</td>';
        $('.js-company-site').append(th);
    });
    //call api user
    $.each(companySiteArray, function(index, companySite){
        var th = '<th class="table-title bg-color-pink"><div class="th-inner fit-cell">'+companySite+'</div></th>';
        td+= '<td class="js-'+companySite+'_d">0</td>';
        $('.js-company-site').append(th);
    });
    //api action row
    $.each(actionArray, function(index, actionName){
        var tr = '<tr class="js-' + actionName + '" style="cursor:pointer"><th scope="row"><u>' + actionName + '</u></th>' + td + '</tr>';
        $('.js-row').append(tr);
    });

    //append result data
    $.each(actionArray, function(index, action){
        $.each(companySiteArray, function(subIndex, companySite){
             var tmpTimesCount = 0;
             var tmpUsersCount = 0;
            $.each(departmentArray, function(nodeIndex, department){
                if( (typeof dataArray[action][companySite] != 'undefined') && (typeof dataArray[action][companySite][department] != 'undefined')){
                    tmpTimesCount = tmpTimesCount + dataArray[action][companySite][department].times;
                    tmpUsersCount = tmpTimesCount + dataArray[action][companySite][department].users.length;
                }
            });
            $('#report_table .js-'+action+' .js-'+companySite+'_t').html(tmpTimesCount);
            $('#report_table .js-'+action+' .js-'+companySite+'_d').html(tmpUsersCount);
        });

    });

    //add last total row
    $('.js-row').append('<tr class="js-total"><th scope="row"></th>'+td+'</tr>');
    $('.js-row > tr.js-total td').html(0);

    //  operate company-side total
    var htotalArr = {'t':[],'d':[]};
    $.each(companySiteArray, function(index, companySite){
        var vtotalArr = {'t':0,'d':0};
        $.each(vtotalArr, function(type,cnt){
           $companySiteObj = $('td.js-' + companySite + '_' + type);
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
            htotalArr[type][i-1] = parseInt(htotalArr[type][i-1]) + parseInt(vtotalArr[type]);
            $('#report_table .js-'+'total'+' .js-'+companySite+'_' + type).html( vtotalArr[type]);
            $('#report_table .js-'+'total'+' .js-'+companySite+'_' + type).addClass('text-blod');
        });   
         
     });
    // operate times and  users total
    $.each(htotalArr,function(type,hTotal){
        $vTotalObj = $('#report_table').find('.js-v-' + type);
        $.each($vTotalObj, function(index){
            var percent = (htotalArr[type][index]/htotalArr[type][$vTotalObj.length-1]) * 100 ;
            $(this).html(htotalArr[type][index] + '<span>(' + Math.round(percent * 10) / 10 + ' % )</span>');
        });
     });
     $('.js-v-t span').css('color','#8085e9');
     $('.js-v-d span').css('color','Orange');

     iniApiLogDonutChart(dataArray,$.trim($('#report_table u').eq(0).text()));
     $('#report_table u').click(function(){
       updateApiLogDonutChart(dataArray,$.trim($(this).text()));
     })

}

var sortTable = function(table){
    var rows = $(table + ' tbody  tr').not('.js-total').get();

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
    $(table).children('tbody').prepend(row);
    });
}
</script>