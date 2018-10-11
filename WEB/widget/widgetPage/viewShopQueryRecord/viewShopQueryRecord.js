$("#viewShopQueryRecord").pagecontainer({
    create: function (event, ui) {

        //初始化交易类型dropdownlist
        function initialRecordType() {
            let typeData = {
                id: "shopQueryType",
                option: [],
                title: "",
                defaultText: langStr['wgt_092'],
                changeDefaultText: true,
                attr: {
                    class: "arrow-incline"
                }
            }

            let type_list = JSON.parse(window.sessionStorage.getItem('point_type_list'));
            for (let i in type_list) {
                typeData["option"][i] = {};
                typeData["option"][i]["value"] = type_list[i].point_type_id;
                typeData["option"][i]["text"] = type_list[i].point_type_name;
            }

            // typeData["option"][0] = {};
            // typeData["option"][0]["value"] = "1";
            // typeData["option"][0]["text"] = "BenQ";
            // typeData["option"][1] = {};
            // typeData["option"][1]["value"] = "2";
            // typeData["option"][1]["text"] = "Qisda";

            //初始化dropdownlist
            tplJS.DropdownList("viewShopQueryRecord", "shopRecordType", "prepend", "typeB", typeData);

            //调整UI
            let selectWidth = $('#shopQueryType').width();
            tplJS.reSizeDropdownList('shopQueryType', null, widthUnitConversion(selectWidth) - 5);
            $('#shopQueryType').css('padding', '0');
            $('#shopQueryType-option').find('.close').css({
                'top': '0',
                'left': '88%'
            });

            //预设值
            let shopRecordQuery = JSON.parse(window.localStorage.getItem('shop_record_query'));
            if(shopRecordQuery == null) {
                //如果没有记录查询条件，默认选中第一个
                $('#shopQueryType-option').find('li:eq(0)').trigger('click');
            } else {
                let type_id = shopRecordQuery['point_type_id'];
                let found = false;
                $.each($('#shopQueryType-option li'), function(index, item) {
                    if(type_id == $(item).data('value')) {
                        $(item).trigger('click');
                        found = true;
                        return false;
                    }
                });

                if(!found) {
                    $('#shopQueryType-option').find('li:eq(0)').trigger('click');
                }
            }

        }

        //宽度转换
        function widthUnitConversion(num) {
            return Math.floor(num * 100 / document.documentElement.clientWidth * 100) / 100;
        }

        //初始化年&月dropdownlist
        function initialYearAndMonth() {
            //1.年份dropdownlist
            var yearData = {
                id: "shopQueryYear",
                option: [],
                title: "",
                defaultText: langStr['wgt_053'],
                changeDefaultText: true,
                attr: {
                    class: "arrow-incline"
                }
            }

            //数据：显示2年，去年和当年
            var currentYear = new Date().getFullYear();
            var currenMonth = new Date().getMonth();
            yearData["option"][0] = {};
            yearData["option"][0]["value"] = currentYear - 1;
            yearData["option"][0]["text"] = (currentYear - 1).toString() + langStr['wgt_093'];
            yearData["option"][1] = {};
            yearData["option"][1]["value"] = currentYear;
            yearData["option"][1]["text"] = currentYear.toString() + langStr['wgt_093'];

            //初始化年份dropdownlist
            tplJS.DropdownList("viewShopQueryRecord", "shopRecordYear", "prepend", "typeB", yearData);

            //调整UI
            var yearWidth = $('#shopQueryYear').width();
            tplJS.reSizeDropdownList('shopQueryYear', null, widthUnitConversion(yearWidth) - 5);
            $('#shopQueryYear').css('padding', '0');
            $('#shopQueryYear-option').find('.close').css({
                'top': '0',
                'left': '88%'
            });

            //预设值为当前年份
            let shopRecordQuery = JSON.parse(window.localStorage.getItem('shop_record_query'));
            if(shopRecordQuery == null) {
                //如果没有记录查询条件，默认选中当前年份
                $('#shopQueryYear-option').find('li:eq(1)').trigger('click');
            } else {
                let year_val =  new Date(shopRecordQuery['start_date'] * 1000).getFullYear();
                let found = false;
                $.each($('#shopQueryYear-option li'), function(index, item) {
                    if(year_val == $(item).data('value')) {
                        $(item).trigger('click');
                        found = true;
                        return false;
                    }
                });

                if(!found) {
                    $('#shopQueryYear-option').find('li:eq(1)').trigger('click');
                }
            }

            //2.月份dropdownlist
            var monthData = {
                id: "shopQueryMonth",
                option: [],
                title: "",
                defaultText: langStr['wgt_054'],
                changeDefaultText: true,
                attr: {
                    class: "arrow-incline"
                }
            }

            //数据：显示12个月
            for(var i = 0; i < 12; i++) {
                monthData["option"][i] = {};
                monthData["option"][i]["value"] = i + 1;
                monthData["option"][i]["text"] = (i + 1).toString() + langStr['wgt_094'];
            }

            //初始化月份dropdownlist
            tplJS.DropdownList("viewShopQueryRecord", "shopRecordMonth", "prepend", "typeB", monthData);

            //调整UI
            var monthWidth = $('#shopQueryMonth').width();
            tplJS.reSizeDropdownList('shopQueryMonth', null, widthUnitConversion(monthWidth) - 5);
            $('#shopQueryMonth').css('padding', '0');
            $('#shopQueryMonth-option').find('.close').css({
                'top': '0',
                'left': '88%'
            });

            //预设值为当前月份
            if(shopRecordQuery == null) {
                //如果没有记录查询条件，默认选中当前月份
                $('#shopQueryMonth-option').find('li:eq(' + currenMonth + ')').trigger('click');
            } else {
                let month_val =  new Date(shopRecordQuery['start_date'] * 1000).getMonth() + 1;
                let found = false;
                $.each($('#shopQueryMonth-option li'), function(index, item) {
                    if(month_val == $(item).data('value')) {
                        $(item).trigger('click');
                        found = true;
                        return false;
                    }
                });

                if(!found) {
                    $('#shopQueryMonth-option').find('li:eq(' + currenMonth + ')').trigger('click');
                }
            }
        }

        //根据年月返回该月最后一天
        function getLastDayByMonth(year, month) {
            var d = new Date(year, month, 0);
            return d.getDate();
        }


        /********************************** page event ***********************************/
        $("#viewShopQueryRecord").on("pagebeforeshow", function (event, ui) {

        });

        $("#viewShopQueryRecord").one("pageshow", function (event, ui) {
            initialRecordType();
            initialYearAndMonth();
        });

        $("#viewShopQueryRecord").on("pageshow", function (event, ui) {

        });

        $("#viewShopQueryRecord").on("pagehide", function (event, ui) {

        });


        /********************************** dom event *************************************/
        //选择交易类型
        $('#shopRecordType').on('change', '#shopQueryType', function () {
            var selectWidth = $('#shopQueryType').width();
            tplJS.reSizeDropdownList('shopQueryType', null, widthUnitConversion(selectWidth) - 6);
        });

        //选择年份
        $('#shopRecordYear').on('change', '#shopQueryYear', function () {
            var selectWidth = $('#shopQueryYear').width();
            tplJS.reSizeDropdownList('shopQueryYear', null, widthUnitConversion(selectWidth) - 6);
        });

        //选择月份
        $('#shopRecordMonth').on('change', '#shopQueryMonth', function () {
            var selectWidth = $('#shopQueryMonth').width();
            tplJS.reSizeDropdownList('shopQueryMonth', null, widthUnitConversion(selectWidth) - 6);
        });

        //查询
        $('.shop-query-search').on('click', function () {
            var has = $(this).hasClass('button-active');
            if (has) {
                //1.获取dropdownlist值
                let trade_type = $('#shopQueryType').val();
                let type_name = $('#shopQueryType option:selected').text();
                let trade_year = $('#shopQueryYear').val();
                let trade_month = $('#shopQueryMonth').val();
                //2.根据年月获取该月最后一天
                let last_day = getLastDayByMonth(trade_year, trade_month);
                //3.日期转时间戳，且开始时间为该月第一天00:00:00，结束时间为该月最后一天23:59:59
                let trade_start = new Date(trade_year + '/' + trade_month + '/1 00:00:00').getTime() / 1000;
                let trade_end = new Date(trade_year + '/' + trade_month + '/' + last_day + ' 23:59:59').getTime() / 1000;
                //4.记录查询条件
                let shop_query_data = {
                    'point_type_id': parseInt(trade_type),
                    'point_type_name': type_name,
                    'start_date': trade_start,
                    'end_date': trade_end
                }
                window.localStorage.setItem('shop_record_query', JSON.stringify(shop_query_data));
                //5.跳转
                loadingMask("show");
                checkWidgetPage('viewShopRecordList', pageVisitedList);
            }
        });


    }
});