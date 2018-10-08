$("#viewShopSelectUser").pagecontainer({
    create: function (event, ui) {

        //快速获取当天交易记录（QPlay使用者）
        function getCurrentTradeRecord() {
            var self = this;
            let start = new Date(new Date().yyyymmdd("/") + " 00:00:00").getTime() / 1000;
            let end = new Date(new Date().yyyymmdd("/") + " 23:59:59").getTime() / 1000;
            let queryStr = '&start_date=' + start.toString() + '&end_date=' + end.toString();

            this.successCallback = function (data) {
                console.log(data);

                if (data['result_code'] == '1') {
                    var shop_name = JSON.parse(window.sessionStorage.getItem('shop_info'))['shop_name'];
                    var record_list = data['content'].trade_record;

                    var content = '';
                    for (var i in record_list) {
                        let tradeDate = new Date(record_list[i].trade_time * 1000).toLocaleDateString('zh');
                        let tradeTime = new Date(record_list[i].trade_time * 1000).toTimeString().substr(0, 5);

                        content += '<li class="qplay-user-list"><div><div>' + shop_name + ' / No.' +
                            record_list[i].trade_id + '</div><div>TWD ' + record_list[i].trade_point +
                            '</div></div><div>' + tradeDate + ' ' + tradeTime + '</div></li>';
                        
                    }

                    $('.qplay-user-ul').html('').append(content);
                    setRecordListHeight();
                }

                loadingMask('hide');
            };

            this.failCallback = function () { };

            var __construct = function () {
                QPlayAPIEx("GET", "getTradeRecordShop", self.successCallback, self.failCallback, null, queryStr, "low", 30000, true);
            }();
        }

        //店家获取员工资料（非QPlay使用者）
        function getEmpInfoForShop(emp) {
            var self = this;
            var queryStr = '&emp_no=' + emp;

            this.successCallback = function (data) {
                console.log(data);

                if (data['result_code'] == '1') {
                    //1. 记录当前登录用户的工号
                    var emp_id = data['content'].emp_loginid;
                    window.sessionStorage.setItem('current_emp', emp_id);

                    //2. 记录当前用户的消费券余额
                    var point_now = data['content'].point_now;
                    window.sessionStorage.setItem('current_point', point_now);

                } else if(data['result_code'] == '000901') {
                    //员工信息错误
                } else if(data['result_code'] == '000914') {
                    //帐号已停权
                } else {
                    //重新输入
                }
            };

            this.failCallback = function () { };

            var __construct = function () {
                QPlayAPIEx("GET", "getEmpInfoForShop", self.successCallback, self.failCallback, null, queryStr, "low", 30000, true);
            }();    
        }

        function setRecordListHeight() {
            var headHeight = $('#viewShopSelectUser .page-header').height();
            var blankHeight = $('.select-user-blank').height();
            var listHeight = $('.qplay-user-ul').height();

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
            $('#inputEmpNo').attr('placeholder', langStr['wgt_067']);
        });

        $("#viewShopSelectUser").on("pageshow", function (event, ui) {
            //API:快速获取当天所有交易记录（不分类别）
            getCurrentTradeRecord();
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
            loadingMask('show');
            //API
            getCurrentTradeRecord();
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
                var emp_no = $.trim($('#inputEmpNo').val());
                //API:获取员工资料及该员工消费券余额
                getEmpInfoForShop(emp_no);
                checkWidgetPage('viewShopUserAcount', pageVisitedList);
            }
        });


    }
});