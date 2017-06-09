<div class="table-responsive">
    <table id="report_table" class="table table-bordered table-striped ">
       <thead>
          <tr>
             <th rowspan="2" data-field="_id.action" class="table-title">
                <div class="th-inner ">API 名稱</div>
             </th>
             <th rowspan="2" data-field="1" class="table-title bg-colot-blue">
                <div class="th-inner ">API 呼叫次數</div>
             </th>
             <th rowspan="2" data-field="2" class="table-title bg-color-pink">
                <div class="th-inner ">API 呼叫人數</div>
             </th>
             <th class="js-data-title table-title bg-colot-blue">
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

var getTableView = function(){
    
    //init table
    $('#report_table tr.js-company-site').html('');
    $('#report_table tbody').html('');

    //get data
    var mydata = {app_key:"{{$data['app_key']}}"};
    var mydataStr = $.toJSON(mydata);
    $.ajax({
      url:"reportDetail/getCallApiReport",
      type:"POST",
      dataType:"json",
      contentType: "application/json",
      data:mydataStr,
      success: function(r){
        var titleArray = [];
        var actionArray =[];
        if(r.length == 0){
            $('#report_table').hide();
        }else{
            $('#report_table').show();
            $.each(r, function(action, value) {
                if($.inArray(action,actionArray) == -1){
                    actionArray.push(action);
                }
                $.each(value, function(companySite, svalue){
                    if($.inArray(companySite,titleArray) == -1){
                        titleArray.push(companySite);
                    }
                });
            });
            createTable(r, titleArray, actionArray);
            sortTable('#report_table');
            getApiLogDonutChart();
        }
       }
    });

}

var createTable = function(data, titleArray, actionArray){
    var sumTotalCount = 0;
    var sumDistinctCount = 0;
    //dynamic colspan
    $('.js-data-title').attr('colspan',titleArray.length);
    //call api times
    var td = '<td class="js-v-t text-blod">0</td><td class="js-v-d text-blod">0</td>';
    $.each(titleArray, function(index, title){
        var th = '<th class="table-title bg-colot-blue"><div class="th-inner fit-cell">'+title+'</div></th>';
        td+= '<td class="js-'+title+'_t">0</td>';
        $('.js-company-site').append(th);
    });
    //call api user
    $.each(titleArray, function(index, title){
        var th = '<th class="table-title bg-color-pink"><div class="th-inner fit-cell">'+title+'</div></th>';
        td+= '<td class="js-'+title+'_d">0</td>';
        $('.js-company-site').append(th);
    });
    //api action row
    $.each(actionArray, function(index, apiName){
        var tr = '<tr class="js-'+apiName+'"><th scope="row">'+apiName+'</th>'+td+'</tr>';
        $('.js-row').append(tr);
    });
    $('.js-row').append('<tr class="js-total"><th scope="row"></th>'+td+'</tr>');
    //append result data
    $.each(actionArray, function(index, action){
        $.each(titleArray, function(subIndex, companySite){
            if(typeof data[action][companySite] !== 'undefined'){
                var sumTotalCount = 0
                var sumDistinctCount = 0
                $.each(data[action][companySite], function(department,count){
                  sumTotalCount=sumTotalCount + parseInt(count.totalCount);
                  sumDistinctCount=sumDistinctCount + parseInt(count.distinctCount);
                });
            }
            $('#report_table .js-'+action+' .js-'+companySite+'_t').html(sumTotalCount);
            $('#report_table .js-'+action+' .js-'+companySite+'_d').html(sumDistinctCount);
        });

    });
    var htotalArr = {'t':[],'d':[]};
     //  operate company-side total
     $.each(titleArray, function(index, companySite){
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
     $.each(htotalArr,function(type,hTotal){
        $vTotalObj = $('#report_table').find('.js-v-' + type);
        $.each($vTotalObj, function(index){
            var percent = (htotalArr[type][index]/htotalArr[type][$vTotalObj.length-1]) * 100 ;
            $(this).html(htotalArr[type][index] + '<span>(' + Math.round(percent * 10) / 10 + ' % )</span>');
        });
     });
     $('.js-v-t span').css('color','#8085e9');
     $('.js-v-d span').css('color','Orange');
}

sortTable = function(table){
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