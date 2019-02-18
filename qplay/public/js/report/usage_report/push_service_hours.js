var pushServiceHours = pushServiceHours || function() {     
        var showRank = 3; //顯示前3名
        var iniReport = function(appKey){

            var startdate = new Date();
            startdate.setDate(1);

            var enddate = new Date();
            enddate.setMonth(enddate.getMonth()+1);
            enddate.setDate(1);
            enddate.setDate(enddate.getDate()-1);

            var from = startdate.getFullYear() + "-" + (startdate.getMonth() + 1) + "-" + startdate.getDate();
            var to = enddate.getFullYear() + "-" + (enddate.getMonth() + 1) + "-" + enddate.getDate();
            updateReport(from, to);
        }
        var updateReport = function(from, to){
                var mydata = {app_key:appKey,from:from, to:to, timeOffset:timeOffset},
                    mydataStr = $.toJSON(mydata);
                showLoading('container_column_push_service_hours_1');               
                $.ajax({
                  url:"reportDetail/getPushServiceRank",
                  type:"POST",
                  dataType:"json",
                  contentType: "application/json",
                  data:mydataStr,
                    success: function(r){
                        hideLoading('container_column_push_service_hours_1');
                        $('.js-table_date').text(from + ' ~ ' + to + ' ' + Messages.POPULAR_TIMES);
                        createColumnChart(r);
                        createTotalRankTable(r, showRank);
                        createAppRankTable(r, showRank);
                    },
                    error: function (e) {
                        showMessageDialog(Messages.Error,Messages.MSG_OPERATION_FAILED, e.responseText);
                    }
                });
        }
        var createColumnChart = function(result){
            if(!$('#container_column_push_service_hours_1').highcharts()){
                var options = getColumnChartOpt();
                Highcharts.chart('container_column_push_service_hours_1',options);
            }
            setColumnData(result);
        }
        var setColumnData = function(result){
            var chart = $('#container_column_push_service_hours_1').highcharts();
            chart.setTitle({ text: 'QPlay ' + Messages.PUSH_SERVICE_HOURS });
            chart.yAxis[0].update({
                title:{
                    text:Messages.PUSH_TIMES
                }
            });
            while(chart.series.length > 0){
                chart.series[0].remove(true);
            }
            $.each(result,function(j, data){
                chart.addSeries({
                    name:j,
                    data: data
                });
            });
        }
        var createTotalRankTable = function(result, showRank){
            if(Object.keys(result).length > 0){
                $('#table_push_service_hours_1').show();
                $thead = $('#table_push_service_hours_1 thead');
                $tbody = $('#table_push_service_hours_1 tbody');
                $tbody.empty();
                var topRes = findTopInterval(result, showRank);
                var tr = '';
                for (var k = 1; k <= showRank; k++) {
                    tr = tr + '<tr><th  class="table-title" ></i> TOP ' + k + '</th></tr>';
                }
                $tbody.append(tr);
                //prefill td
                for (var k = 1; k <= showRank; k++) {
                    $( '#table_push_service_hours_1 tbody tr:nth-child('+ k +')').append('<td> - </td><td> - </td>');
                }
                //real fill td 
                $.each(topRes,function(number,data){
                    var index = number + 1;
                        start = data.interval,
                        end = (parseInt(start) + 1 < 24)?parseInt(start) + 1:'00',
                        intervalStr = start + ':00~' + end + ':00',
                        $currentTr =  $( '#table_push_service_hours_1 tbody tr:nth-child('+ index +')'),
                        intervalTd = 0,
                        countTd = intervalTd + 1;
                        $currentTr.find('td').eq(intervalTd).text(intervalStr);
                        $currentTr.find('td').eq(countTd).text(data.count);
                });
            }else{
                $('#table_push_service_hours_1').hide();
            }
        }
        var createAppRankTable = function(result, showRank){

            if(Object.keys(result).length > 0){
                 $( '#table_push_service_hours_2').show();
                $thead = $('#table_push_service_hours_2 thead');
                $tbody = $('#table_push_service_hours_2 tbody');
                $thead.find('tr').empty().append('<th class="table-title">' + Messages.RANKING + '</th>');
                $tbody.empty();
                var topRes = {};
                $.each(result,function(app,data){
                    topRes[app] = findTopInterval(result, showRank);                 
                });

                var tr = '';
                for (var k = 1; k <= showRank; k++) {
                    tr = tr + '<tr><th  class="table-title" >TOP ' + k + '</th></tr>';
                }
                $tbody.append(tr);
                var col = 1;
                $.each(topRes,function(app,record){
                        var thClass = (col % 2 == 0)?'bg-color-pink':'bg-color-blue';
                            thClass = thClass + ' table-title';
                            $thead.find('tr').append('<th class="' + thClass + '">' + app + '</th><th class="' + thClass + '">' + Messages.PUSH_TIMES + '</th>');
                        //prefill td
                        for (var k = 1; k <= showRank; k++) {
                            $( '#table_push_service_hours_2 tbody tr:nth-child('+ k +')').append('<td> - </td><td> - </td>');
                        }
                        //real fill td 
                        $.each(record, function(j, data){
                            var index = j + 1,
                                start = data.interval,
                                end = (parseInt(start) + 1 < 24)?parseInt(start) + 1:'00',
                                intervalStr = start + ':00~' + end + ':00',
                                $currentTr =  $( '#table_push_service_hours_2 tbody tr:nth-child('+ index +')'),
                                intervalTd = (col-1) * 2,
                                countTd = intervalTd + 1;
                                $currentTr.find('td').eq(intervalTd).text(intervalStr);
                                $currentTr.find('td').eq(countTd).text(data.count);
                        });
                    col++;
                });
            }else{
                $( '#table_push_service_hours_2').hide();
            }
        }
        var findTopInterval = function(result, showRank){
            var sumRes = {},
                topObj = [];

            $.each(result,function(i, data){
                $.each(data,function(j, count){
                     if(!sumRes.hasOwnProperty(j)){
                        sumRes[j] = {interval:j ,count:0};
                     }
                     sumRes[j].count = sumRes[j].count + count;
                });
            });
            //找到第一名後，把值清空，接著再找第二名，以此類推
            for (var k = 1; k <= showRank; k++) {
                topIndex = getMaxIndexFromObjByAttr(sumRes,'count');
                topObj.push({interval:sumRes[topIndex].interval,count:sumRes[topIndex].count});
                sumRes[topIndex].count = 0;
            }
            return topObj;
        }
        var showLoading = function(container){
            if(!$('#' + container).highcharts()){
                 $('.loader').show();
                 $('.container').hide();
            }else{
                 var chart = $('#' + container).highcharts();
                 chart.showLoading();
            }
        }
        var hideLoading = function(container){
            if(!$('#' + container).highcharts()){
                 $('.loader').hide();
                 $('.container').show();
            }else{
                 var chart = $('#' + container).highcharts();
                 chart.hideLoading();
            }
        }
        return{
             iniReport:function(appKey){
                return iniReport(appKey);
             }
        }
    }();