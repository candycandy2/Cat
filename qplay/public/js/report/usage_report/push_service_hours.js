var pushServiceHours = pushServiceHours || function() {
        
        
        var showRank = 3; //前3名

        var iniReport = function(appKey){
                var res={};
                var appRankRes = {};
                var from = '2016-12-27';
                var to = '2017-07-25';
                var mydata = {app_key:appKey,from:from, to:to, timeOffset:timeOffset},
                    mydataStr = $.toJSON(mydata);
                $.ajax({
                  url:"reportDetail/getPushServiceRank",
                  type:"POST",
                  dataType:"json",
                  contentType: "application/json",
                  data:mydataStr,
                    success: function(r){
                        $.each(r,function(i, data){
                            arrangeDataToArray(data, res);
                            arrangeDataToObj(data, appRankRes);
                        });
                        createColumnChart(res);
                        createTotalRankTable(res, showRank);
                        createAppRankTable(appRankRes, showRank);
                    },
                    error: function (e) {
                        showMessageDialog(Messages.Error,Messages.MSG_OPERATION_FAILED, e.responseText);
                    }
                }).done(function() {
                    $('.loader').hide();
                });
    
        }
        var arrangeDataToArray = function(data, res){
            var d = data._id;
            if(!res.hasOwnProperty(d.app_key)){
                res[d.app_key] = [];
            }
            for (var i = 0; i < 24; i++) { 
                if(!res[d.app_key].hasOwnProperty(i)){
                    res[d.app_key][i] = 0;
                }
            }
            res[d.app_key][parseInt(d.interval)] = data.count;
        }
        
        var arrangeDataToObj = function(data, appRankRes){
           var d = data._id;
           if(typeof appRankRes[d.app_key] == 'undefined' || appRankRes[d.app_key].length < showRank){
               if(!appRankRes.hasOwnProperty(d.app_key)){
                    appRankRes[d.app_key] = [];
                }
               var tmp = {};
               tmp.interval =  parseInt(d.interval);
               tmp.count = data.count;
               appRankRes[d.app_key].push(tmp);
           }else{
            return false;
           }
        }

        var createColumnChart = function(result){ 
            var options = getColumnChartOpt();
            $('#container_column_push_service_hours_1').highcharts('StockChart',options);
            $.each(result,function(j, data){
                var chart = $('#container_column_push_service_hours_1').highcharts();
                chart.addSeries({
                    name:j,
                    data: data
                });
            });
        }
        var createTotalRankTable = function(result, showRank){
           var topRes = findTopInterval(result, showRank);
            $thead = $('#table_push_service_hours_1 thead');
            $tbody = $('#table_push_service_hours_1 tbody');
            $tbody.empty();
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
        }
        var createAppRankTable = function(result, showRank){
            $thead = $('#table_push_service_hours_2 thead');
            $tbody = $('#table_push_service_hours_2 tbody');
            $thead.find('tr').empty().append('<th class="table-title">排名</th>');
            $tbody.empty();
            var tr = '';
            for (var k = 1; k <= showRank; k++) {
                tr = tr + '<tr><th  class="table-title" >TOP ' + k + '</th></tr>';
            }
            $tbody.append(tr);
            var col = 1;
            $.each(result,function(app,record){
                    var thClass = (col % 2 == 0)?'bg-color-pink':'bg-color-blue';
                        thClass = thClass + ' table-title';
                        $thead.find('tr').append('<th class="' + thClass + '">' + app + '</th><th class="' + thClass + '">推播次數</th>');
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
        return{
             iniReport:function(appKey){
                return iniReport(appKey);
             }
        }
    }();