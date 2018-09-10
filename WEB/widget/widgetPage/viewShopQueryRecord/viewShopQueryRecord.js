$("#viewShopQueryRecord").pagecontainer({
    create: function (event, ui) {

        function initialRecordType() {
            var typeData = {
                id: "shopQueryType",
                option: [],
                title: "",
                defaultText: "请选择消费券类型",
                changeDefaultText: true,
                attr: {
                    class: "tpl-dropdown-list-icon-arrow-incline"
                }
            }

            // var type_list = JSON.parse(window.localStorage.getItem('point_type_list'))['content'];
            // for (var i in type_list) {
            //     typeData["option"][i] = {};
            //     typeData["option"][i]["value"] = type_list.point_type_id;
            //     typeData["option"][i]["text"] = type_list.point_type_name;
            // }

            typeData["option"][0] = {};
            typeData["option"][0]["value"] = "1";
            typeData["option"][0]["text"] = "BenQ消费券";
            typeData["option"][1] = {};
            typeData["option"][1]["value"] = "2";
            typeData["option"][1]["text"] = "Qisda消费券";
            typeData["option"][2] = {};
            typeData["option"][2]["value"] = "3";
            typeData["option"][2]["text"] = "Qisda派遣";
            typeData["option"][3] = {};
            typeData["option"][3]["value"] = "4";
            typeData["option"][3]["text"] = "明基能源Esco";
            typeData["option"][4] = {};
            typeData["option"][4]["value"] = "5";
            typeData["option"][4]["text"] = "亚太消费券";

            tplJS.DropdownList("viewShopQueryRecord", "shopRecordType", "prepend", "typeB", typeData);
            //调整popup高度
            $('#shopQueryType-option-list').css({
                'margin-top': '3vw'
            });
            //调整select宽度
            var selectWidth = $('#shopQueryType').width();
            tplJS.reSizeDropdownList('shopQueryType', null, widthUnitConversion(selectWidth) - 5);
            $('#shopQueryType').css('padding', '0');
            $('#shopQueryType-option').find('.close').css({
                'top': '0',
                'left': '88%'
            });
        }

        //宽度转换
        function widthUnitConversion(num) {
            return Math.floor(num * 100 / document.documentElement.clientWidth * 100) / 100;
        }

        function initialDatetimePicker() {
            $('#shopStart').text(langStr['wgt_053']);
            $('#shopStartDate').datetimepicker({
                format: 'Y',
                timepicker: false
            });

            $('#shopEnd').text(langStr['wgt_054']);
            $('#shopEndDate').datetimepicker({
                format: 'm',
                timepicker: false
            });
        }


        //检查表单
        function checkForm(type) {
            var typeVal = $('#shopQueryType').val();
            var startVal = $('#shopStartDate').val();
            var endVal = $('#shopEndDate').val();
            if (typeVal != '请选择消费券类型' && startVal != '' && endVal != '') {
                $('.shop-query-search').addClass('button-active');
            } else {
                $('.shop-query-search').removeClass('button-active');
            }

            if (type !== null) {
                var queryData = {
                    type: typeVal,
                    start: startVal.replace(/\//g, '-').substring(0, 7),
                    end: endVal.replace(/\//g, '-').substring(0, 7)
                };
                window.sessionStorage.setItem('query_shop_record', JSON.stringify(queryData));
            }
        }

        /********************************** page event ***********************************/
        $("#viewShopQueryRecord").on("pagebeforeshow", function (event, ui) {

        });

        $("#viewShopQueryRecord").one("pageshow", function (event, ui) {
            initialRecordType();
            initialDatetimePicker();
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
            checkForm();
        });

        $('#shopStart').on('click', function () {
            $('#shopStartDate').datetimepicker('show');
        });

        $('#shopStartDate').on('change', function () {
            var val = $(this).val();
            $('#shopStart').text(val);
            checkForm();
        });

        $('#shopEnd').on('click', function () {
            $('#shopEndDate').datetimepicker('show');
        });

        $('#shopEndDate').on('change', function () {
            var val = $(this).val();
            $('#shopEnd').text(val);
            checkForm();
        });

        $('.shop-query-search').on('click', function () {
            var has = $(this).hasClass('button-active');
            if (has) {
                checkForm('save');
                checkWidgetPage('viewShopRecordList');
            }
        });


    }
});