$(function () {
    $( "#push_date_from" ).datepicker();
    $( "#push_date_to" ).datepicker();
      $( "#push_service_range_btn .btn").click(function(e){
            pushServiceHours.setRangeSelector(e);
      });
});

var pushServiceHours = pushServiceHours || function() {     
        var showRank = 3; //顯示前3名
        var reportStartDate = "";
        var reportEndDate = "";

        var iniReport = function(appKey, from, to){
                var mydata = {app_key:appKey,from:from, to:to, timeOffset:timeOffset},
                    mydataStr = $.toJSON(mydata);
                $.ajax({
                  url:"reportDetail/getPushServicReportEndDate",
                  type:"POST",
                  dataType:"json",
                  contentType: "application/json",
                  data:mydataStr,
                    success: function(r){
                         $('.container').show();
                        reportStartDate = r.reportStartDate,
                        reportEndDate = r.reportEndDate;
                        $( "#push_service_range_btn .btn:first" ).click();
                    },
                    error: function (e) {
                        showMessageDialog(Messages.Error,Messages.MSG_OPERATION_FAILED, e.responseText);
                    }
                }).done(function() {

                });
        }
        var updateReport = function(from, to){
                var res={};
                var appRankRes = {};
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

                        $.each(r,function(i, data){
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
                            if(typeof appRankRes[d.app_key] == 'undefined' || appRankRes[d.app_key].length < showRank){
                               if(!appRankRes.hasOwnProperty(d.app_key)){
                                    appRankRes[d.app_key] = [];
                                }
                               var tmp = {};
                               tmp.interval =  parseInt(d.interval);
                               tmp.count = data.count;
                               appRankRes[d.app_key].push(tmp);
                           }
                        });
                        createColumnChart(res);
                        createTotalRankTable(res, showRank);
                        createAppRankTable(appRankRes, showRank);
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
        var setRangeSelector = function(e){
            $.datepicker.setDefaults({
                dateFormat: 'yy-mm-dd',
                 onSelect: function(dateText) {
                    updateReport($("#push_date_from" ).val(), $("#push_date_to" ).val());
                  }
            });
            var target = $("#" + e.target.id),
                type = target.data("type"),
                count = target.data("count"),
                startDate = new Date(),
                endDate = new Date(reportEndDate.replace(new RegExp(/(-)/g), '/')),
                from = '',
                to = '';

                $('.report-button').removeClass('active');
                target.addClass('active');

                if(type == 'all'){
                      from = reportStartDate;
                      to = reportEndDate;
                }else{
                    if(type == 'day'){
                        startDate.setMonth(endDate.getMonth());
                        startDate.setDate(endDate.getDate() - count);    
                    }else if(type  == 'month'){
                        startDate.setMonth(endDate.getMonth() - count);
                        startDate.setDate(endDate.getDate());
                    }
                    startDate.setYear(endDate.getFullYear());
                    
                    from = startDate.getFullYear() + '-' + (startDate.getMonth()+1) + '-' + startDate.getDate();
                    to = endDate.getFullYear() + '-' + (endDate.getMonth()+1) + '-' + endDate.getDate();
                }
            $('#push_date_from').val($.datepicker.formatDate('yy-mm-dd', new Date(from.replace(new RegExp(/(-)/g), '/'))));
            $('#push_date_to').val($.datepicker.formatDate('yy-mm-dd', new Date(to.replace(new RegExp(/(-)/g), '/'))));
            updateReport(from, to);
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
                var tr = '';
                for (var k = 1; k <= showRank; k++) {
                    tr = tr + '<tr><th  class="table-title" >TOP ' + k + '</th></tr>';
                }
                $tbody.append(tr);
                var col = 1;
                $.each(result,function(app,record){
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
             },
             setRangeSelector:function(e){
                return setRangeSelector(e);
             }
        }
    }();