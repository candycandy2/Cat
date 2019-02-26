$("#viewQPayUserQueryRecord").pagecontainer({
    create: function (event, ui) {

        //交易类型dropdownlist
        function initialRecordType() {
            var typeData = {
                id: "userQueryType",
                option: [],
                title: "",
                defaultText: langStr["wgt_032"],
                changeDefaultText: true,
                attr: {
                    class: "arrow-incline"
                }
            }

            typeData["option"][0] = {};
            typeData["option"][0]["value"] = "1";
            typeData["option"][0]["text"] = langStr["wgt_033"];
            typeData["option"][1] = {};
            typeData["option"][1]["value"] = "2";
            typeData["option"][1]["text"] = langStr["wgt_034"];

            //初始化dropdownlist
            tplJS.DropdownList("viewQPayUserQueryRecord", "userRecordType", "prepend", "typeB", typeData);

            //调整select UI
            var selectWidth = $('#userQueryType').width();
            tplJS.reSizeDropdownList('userQueryType', null, widthUnitConversion(selectWidth) - 5);
            $('#userQueryType').css('padding', '0');
            $('#userQueryType-option').find('.close').css({
                'top': '0',
                'left': '88%'
            });
            $('#userQueryType-option-list').css('margin-top', '3vw');

            //预设值
            var userRecordQuery = JSON.parse(window.localStorage.getItem('user_record_query'));
            if(userRecordQuery == null) {
                //如果没有记录查询条件，默认选中第一个
                $('#userQueryType-option').find('li:eq(0)').trigger('click');
            }
        }

        //宽度转换
        function widthUnitConversion(num) {
            return Math.floor(num * 100 / document.documentElement.clientWidth * 100) / 100;
        }

        //初始化日期选择控件
        function initialDatetimePicker() {
            $('#userStart').text(langStr['wgt_038']);
            $('#userStartDate').attr('placeholder', langStr['wgt_038']);
            $('#userStartDate').datetimepicker({
                format: 'Y/m/d',
                timepicker: false,
            });

            $('#userEnd').text(langStr['wgt_038']);
            $('#userEndDate').attr('placeholder', langStr['wgt_038']);
            $('#userEndDate').datetimepicker({
                format: 'Y/m/d',
                timepicker: false,
            });
        }

        //检查表单
        function checkForm(type) {
            var typeVal = $('#userQueryType').val();
            var startVal = $('#userStartDate').val();
            var endVal = $('#userEndDate').val();
            if (typeVal != langStr["wgt_032"] && startVal != '' && endVal != '') {
                $('.user-query-search').addClass('button-active');
            } else {
                $('.user-query-search').removeClass('button-active');
            }

            if (type == 'store' || type == 'trade') {
                var queryData = {
                    type: type,
                    start: new Date(startVal + ' 00:00:00').getTime() / 1000,
                    end: new Date(endVal + ' 23:59:59').getTime() / 1000
                };
                window.sessionStorage.setItem('query_user_record', JSON.stringify(queryData));
            }
        }


        /********************************** page event ***********************************/
        $("#viewQPayUserQueryRecord").on("pagebeforeshow", function (event, ui) {

        });

        $("#viewQPayUserQueryRecord").one("pageshow", function (event, ui) {
            initialRecordType();
            initialDatetimePicker();
        });

        $("#viewQPayUserQueryRecord").on("pageshow", function (event, ui) {

        });

        $("#viewQPayUserQueryRecord").on("pagehide", function (event, ui) {

        });



        /********************************** dom event *************************************/
        //选择交易类型
        $('#userRecordType').on('change', '#userQueryType', function () {
            var selectWidth = $('#userQueryType').width();
            tplJS.reSizeDropdownList('userQueryType', null, widthUnitConversion(selectWidth) - 6);
            checkForm();
        });

        //点击开始日期弹出日期选择控件
        $('#userStart').on('click', function () {
            $('#userStartDate').datetimepicker('show');
        });

        //点击结束日期弹出日期选择控件
        $('#userEnd').on('click', function () {
            $('#userEndDate').datetimepicker('show');
        });

        $('#userStartDate').on('change', function () {
            var val = $(this).val();
            $('#userStart').text(val);
            checkForm();
        });

        $('#userEndDate').on('change', function () {
            var val = $(this).val();
            $('#userEnd').text(val);
            checkForm();
        });

        //查询记录
        $('.user-query-search').on('click', function () {
            var has = $(this).hasClass('button-active');
            if (has) {
                loadingMask("show");

                var typeVal = $('#userQueryType').val();
                if (typeVal == '1') {
                    checkForm('trade');

                } else if (typeVal == '2') {
                    checkForm('store')
                }

                checkWidgetPage('viewQPayUserRecordList', pageVisitedList);
            }
        });



    }
});