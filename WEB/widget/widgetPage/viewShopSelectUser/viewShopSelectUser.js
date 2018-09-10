$("#viewShopSelectUser").pagecontainer({
    create: function (event, ui) {

        //快速获取当天交易记录（QPlay使用者）
        function getCurrentTradeRecord() {
            var self = this;

            this.successCallback = function () {
                if (data['result_code'] == '1') {
                    var record_list = data['content'];

                    var content = '';
                    for (var i in record_list) {
                        if (record_list[i]['trade_record'].trade_success == 'Y') {
                            content += '<li class="qplay-user-list"><div><div>QTY 早餐吧 / No.' +
                                record_list[i]['trade_record'].trade_id +
                                '</div><div>TWD ' + record_list[i]['trade_record'].trade_point +
                                '</div></div><div>' + record_list[i]['trade_record'].trade_time + '</div></li>';
                        }
                    }

                    $('.qplay-user ul').html('').append(content);
                    setRecordListHeight();
                }
            };

            this.failCallback = function () { };

            var __construct = function () {
                QPlayAPIEx("GET", "checkTradeRecord", self.successCallback, self.failCallback, null, null, "low", 30000, true);
            }();
        }

        function setRecordListHeight() {
            var headHeight = $('#viewShopSelectUser .page-header').height();
            var blankHeight = $('.select-user-blank').height();
            var listHeight = $('.select-user-list').height();

            var totalHeight;
            if (device.platform === "iOS") {
                totalHeight = (headHeight + blankHeight + listHeight + iOSFixedTopPX()).toString();
            } else {
                totalHeight = (headHeight + blankHeight + listHeight).toString();
            }

            $('.select-user-scroll > div').css('height', totalHeight + 'px');
        }

        /********************************** page event ***********************************/
        $("#viewShopSelectUser").on("pagebeforeshow", function (event, ui) {

        });

        $("#viewShopSelectUser").one("pageshow", function (event, ui) {
            $('inputEmpNo').attr('placeholder', langStr['wgt_067']);
        });

        $("#viewShopSelectUser").on("pageshow", function (event, ui) {
            //Call API
            //getCurrentTradeRecord();
        });

        $("#viewShopSelectUser").on("pagehide", function (event, ui) {

        });


        /********************************** dom event *************************************/
        //切换类型
        $('.select-user-type > div').on('click', function () {
            var type = $(this).attr('data-type');
            var has = $(this).hasClass('type-active');

            if (!has && type == 'qplay') {
                $('.other-user-title').removeClass('type-active');
                $('.other-user').hide();
                $('.qplay-user-title').addClass('type-active');
                $('.select-user-scroll').show();
            } else if (!has && type == 'other') {
                $('.qplay-user-title').removeClass('type-active');
                $('.select-user-scroll').hide();
                $('.other-user-title').addClass('type-active');
                $('.other-user').show();
            }

        });

        //刷新列表
        $('#qplayRefresh').on('click', function () {
            //Call API
            //getCurrentTradeRecord();
        });

        //输入工号
        $('#inputEmpNo').on('input', function () {
            var val = $.trim($(this).val());
            if (val != '') {
                $('.other-user-pwd').addClass('button-active');
            } else {
                $('.other-user-pwd').removeClass('button-active');
            }
        });

        //清除工号
        $('#clearEmpNo').on('click', function () {
            $('#inputEmpNo').val('');
            $('.other-user-pwd').removeClass('button-active');
        });

        //下一步
        $('.other-user-pwd').on('click', function () {
            var has = $(this).hasClass('button-active');
            if (has) {
                //API:工号是否存在
                checkWidgetPage('viewShopUserAcount');
            }
        });


    }
});