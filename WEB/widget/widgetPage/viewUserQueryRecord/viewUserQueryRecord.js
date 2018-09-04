$("#viewUserQueryRecord").pagecontainer({
    create: function (event, ui) {



        function initialPage() {

        }

        //交易类型dropdownlist
        function initialRecordType() {
            var typeData = {
                id: "userQueryType",
                option: [],
                title: "",
                defaultText: langStr["wgt_032"],
                changeDefaultText: true,
                attr: {
                    class: "tpl-dropdown-list-icon-arrow-incline"
                }
            }

            typeData["option"][0] = {};
            typeData["option"][0]["value"] = "1";
            typeData["option"][0]["text"] = langStr["wgt_033"];
            typeData["option"][1] = {};
            typeData["option"][1]["value"] = "2";
            typeData["option"][1]["text"] = langStr["wgt_034"];

            tplJS.DropdownList("viewUserQueryRecord", "userRecordType", "prepend", "typeB", typeData);
            //调整select宽度
            var selectWidth = $('#userQueryType').width();
            tplJS.reSizeDropdownList('userQueryType', null, widthUnitConversion(selectWidth) - 5);
            $('#userQueryType').css('padding', '0');
            $('#userQueryType-option').find('.close').css({
                'top': '0',
                'left': '88%'
            });
            $('#userQueryType-option-list').css('margin-top', '3vw');
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
        function checkForm() {
            var typeVal = $('#userQueryType').val();
            var startVal = $('#userStartDate').val();
            var endVal = $('#userEndDate').val();
            if (typeVal != langStr["wgt_032"] && startVal != '' && endVal != '') {
                $('.user-query-search').addClass('button-active');
            } else {
                $('.user-query-search').removeClass('button-active');
            }
        }

        /********************************** page event ***********************************/
        $("#viewUserQueryRecord").on("pagebeforeshow", function (event, ui) {

        });

        $("#viewUserQueryRecord").one("pageshow", function (event, ui) {
            initialRecordType();
            initialDatetimePicker();
        });

        $("#viewUserQueryRecord").on("pageshow", function (event, ui) {

        });

        $("#viewUserQueryRecord").on("pagehide", function (event, ui) {

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
            //$('#userStartDate').blur();
            $('#userStartDate').datetimepicker('show');
        });

        //点击结束日期弹出日期选择控件
        $('#userEnd').on('click', function () {
            //$('#userEndDate').blur();
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

        $('.user-query-search').on('click', function () {
            var has = $(this).hasClass('button-active');
            if (has) {
                checkWidgetPage('viewUserRecordList');
            }
        });



    }
});