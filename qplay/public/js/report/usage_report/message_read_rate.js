var messageReadRate = messageReadRate || function() {     
        var reportStartDate = "";
        var reportEndDate = "";
        var iniReport = function(appKey, from, to){
                var storage = ExtSessionStorage(appKey);
                $('.loader').show();
                var mydata = {app_key:appKey, timeOffset:timeOffset},
                    mydataStr = $.toJSON(mydata),
                    res={};
                // if(storage("messageReadRate")){
                //     $('.loader').hide();
                //     res =JSON.parse(storage("messageReadRate"));
                //     reportEndDate = ($.isEmptyObject(res))?"":Object.keys(res).sort()[Object.keys(res).length-1];
                //     console.log(res);
                //     createMultiLine(res);
                //     createTableChart('table_message_read_rate_1', res, reportEndDate);
                //     createColumnChart('container_column_message_read_rate_1',res[reportEndDate]);
                // }else{
                    $.ajax({
                      url:"reportDetail/getMessageReadReport",
                      type:"POST",
                      dataType:"json",
                      contentType: "application/json",
                      data:mydataStr,
                        success: function(r){
                            $.each(r,function(i,data){
                                var d = data;
                                if(!res.hasOwnProperty(d.message_send_date)){
                                    res[d.message_send_date] = {'source':{},'send_count':0};
                                }
                                if(!res[d.message_send_date].source.hasOwnProperty(d.message_source)){
                                    res[d.message_send_date].source[d.message_source] = {};
                                }
                                var sourceArray =  res[d.message_send_date].source[d.message_source];
                                if(!sourceArray.hasOwnProperty(d.company_site)){
                                    sourceArray[d.company_site] = {'read' : parseInt(d.is_read), 'not_read' : parseInt(d.not_read), 'total':d.total};
                                    res[d.message_send_date].send_count = res[d.message_send_date].send_count + d.total;
                                }
                            });
                            //storage("messageReadRate",JSON.stringify(res));
                            reportEndDate = ($.isEmptyObject(res))?"":Object.keys(res).sort()[Object.keys(res).length-1];
                            createMultiLine(res);
                            createTableChart('table_message_read_rate_1', res, reportEndDate);
                            createColumnChart('container_column_message_read_rate_1',res[reportEndDate]);
                        },
                        error: function (e) {
                            showMessageDialog(Messages.Error,Messages.MSG_OPERATION_FAILED, e.responseText);
                        }
                    }).done(function() {
                        $('.loader').hide();
                    });
                //}
        }
        var createMultiLine = function(result){
            var sendMessageData=[],
            seriesOptions = [],
            options = getMultiLineChartOpt();
       
            for (var k in result){
                if (typeof result[k] !== 'function') {
                    var tmpMessageArr = [dateToUTC(k),result[k].send_count];
                    sendMessageData.push(tmpMessageArr);
                    sendMessageData = sortObject(sendMessageData);
                }
            }

            options.series = [{
                name:Messages.MESSAGE_COUNT,
                data:[]
            }];

            options.plotOptions.series.point.events = {
                click: function (e) {
                     var selectDate = Highcharts.dateFormat('%Y-%m-%d',this.x);
                     createTableChart('table_message_read_rate_1', result, selectDate);
                     setColumnData('container_column_message_read_rate_1',result[selectDate]);
                }
            };
            var containerId = 'container_stock_message_read_rate_1';
            createMultiLineChart(containerId, options);
            var chart = $('#'+ containerId).highcharts();
            chart.series[0].setData(sendMessageData);
        }

        var createMultiLineChart = function (containerId, options) {
            Highcharts.stockChart(containerId, options,
            function (chart) {
                    // apply the date pickers
                    setTimeout(function () {
                        $('input.highcharts-range-selector', $(chart.container).parent())
                            .datepicker();
                    }, 0);       
                }
            );

            // Set the datepicker's date format
            $.datepicker.setDefaults({
                dateFormat: 'yy-mm-dd',
                onSelect: function () {
                    this.onchange();
                    this.onblur();
                }
            });
        }
        var createColumnChart = function(containerId, result){
           if(!$('#' + containerId).highcharts()){
                var options = getSimpleColumnChartOpt();
                options.series = [{
                                    name: Messages.ALREADY_READ,
                                    maxPointWidth:50,
                                    data: []
                                },
                                {
                                    name: Messages.NOT_READ,
                                    maxPointWidth:50,
                                    data: []
                                }
                                ];
                options.yAxis.title.text=Messages.READ_RATE;
                Highcharts.chart(containerId,options);
            }
           setColumnData(containerId, result);
        }
        var setColumnData = function(containerId, result){
            var chart = $('#'+containerId).highcharts();
            chart.setTitle({ text: Messages.DAILY_READ_RATE });
            var categories = [];
            var readData = [];
            var notReadData = [];
            $.each(result.source,function(sourceName, SiteCompanyData){
                categories.push(sourceName);
                chart.xAxis[0].setCategories(categories);
                var readCount = 0;
                var notReadCount = 0;
                $.each(SiteCompanyData, function(index, data){
                    readCount = readCount + data.read;
                    notReadCount = notReadCount + data.not_read;
                });
                readData.push(readCount);
                notReadData.push(notReadCount);   
            });
            chart.series[0].setData(readData);
            chart.series[1].setData(notReadData);
        }
        var setRangeSelector = function(e){
            $.datepicker.setDefaults({
                dateFormat: 'yy-mm-dd',
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
                }
        }
       
        /** Table **/
        var createTableChart = function(containerId, result, date){
            var $tableChartDiv = $('#' + containerId);
            $tableChartDiv.find('.text-muted').text(date);
            $tableChartDiv.find('thead > tr.js-sub-title').empty();
            $tableChartDiv.find('tbody').empty();
            createTable(containerId, result,date);
            sortTable(containerId);
        }
        var createTable = function(containerId, result, date){
            
            var $tableChartDiv = $('#' + containerId);
            
            if(typeof result[date] == 'undefined'){
                $tableChartDiv.find('tbody').html('<tr><td colspan="5">' +Messages.NO_DATA_TO_DISPLAY + '</td></tr>');
                return false;
            }

            var dataArray = result[date].source;
            var sourceArray =[];
            var companySiteArray = [];
            for(var sourceName in dataArray){
                if($.inArray(sourceName,sourceArray) == -1){
                    sourceArray.push(sourceName);
                }
                for(var companySite in dataArray[sourceName]){
                    if($.inArray(companySite,companySiteArray) == -1){
                        companySiteArray.push(companySite);
                    }
                }
            }
            $tableChartDiv.find('.js-data-title').attr('colspan',companySiteArray.length);
            //blue column
            var td = '<td class="js-v-t text-blod" nowrap="nowrap" >0</td><td class="js-v-d text-blod" nowrap="nowrap">0</td>';
            $.each(companySiteArray, function(index, companySite){
                var th = '<th class="table-title bg-color-blue"><div class="th-inner fit-cell">'+companySite+'</div></th>';
                td+= '<td class="js-'+companySite+'_t">0</td>';
                $tableChartDiv.find('.js-sub-title').append(th);
            });
            //pink column
            $.each(companySiteArray, function(index, companySite){
                var th = '<th class="table-title bg-color-pink"><div class="th-inner fit-cell">'+companySite+'</div></th>';
                td+= '<td class="js-'+companySite+'_d">0</td>';
                $tableChartDiv.find('.js-sub-title').append(th);
            });
            //message source row
            $.each(sourceArray, function(index, sourceName){
                var sourceStr =  sourceName.replace(/\s+/g, "");
                var tr = '<tr class="js-' + sourceStr + '"><th scope="row">' + sourceName + '</th>' + td + '</tr>';
                $tableChartDiv.find('.js-row').append(tr);
            });

            //append result data
            var totalDistinctUserCount = [];
            var tmpUsers = [];
            $.each(sourceArray, function(index, sourceName){

                $.each(companySiteArray, function(subIndex, companySite){
                     var sendCount = 0;
                     var readCount = 0;
                    if(!tmpUsers.hasOwnProperty(companySite)){
                        tmpUsers[companySite] = [];
                     }
                    if( (typeof dataArray[sourceName][companySite] != 'undefined')){
                        sendCount = sendCount + dataArray[sourceName][companySite].total;
                        readCount = readCount + dataArray[sourceName][companySite].read;
                    }
                     var sourceStr =  sourceName.replace(/\s+/g, "");
                    $tableChartDiv.find('table .js-'+sourceStr+'> .js-'+companySite+'_t').html(sendCount);
                    $tableChartDiv.find('table .js-'+sourceStr+'> .js-'+companySite+'_d').html(readCount);
                });
            });
            //  operate company-side 
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
                });   
                 
             });
            // operate total
            $.each(htotalArr,function(type,hTotal){
                $vTotalObj = $tableChartDiv.find('table').find('.js-v-' + type);
                $.each($vTotalObj, function(index){
                    $(this).html(htotalArr[type][index]);
                });
             });
            
            $tableChartDiv.find('table u').click(function(){
               updateApiLogDonutChart(dataArray,$.trim($(this).text()));
            });

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