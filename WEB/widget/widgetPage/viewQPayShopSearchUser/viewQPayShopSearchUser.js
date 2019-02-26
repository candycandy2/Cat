$("#viewQPayShopSearchUser").pagecontainer({
    create: function (event, ui) {

        var refreshInterval = null;//每3秒refresh金額

        //快速获取当天交易记录（QPlay使用者）
        function getCurrentTradeRecord(tab) {
            var self = this;
            var start = new Date(new Date().yyyymmdd("/") + " 00:00:00").getTime() / 1000;
            var end = new Date(new Date().yyyymmdd("/") + " 23:59:59").getTime() / 1000;
            var queryStr = '&start_date=' + start.toString() + '&end_date=' + end.toString();

            this.successCallback = function (data) {
                //console.log(data);

                if (data['result_code'] == '1') {
                    var shop_name = JSON.parse(window.sessionStorage.getItem('shop_info'))['shop_name'];
                    var record_list = data['content'].trade_record;
                    var content = '';
                    for (var i in record_list) {

                        if(record_list[i]['trade_success'] == 'Y') {
                            var tradeDate = new Date(record_list[i].trade_time * 1000).yyyymmdd('/');
                            var tradeTime = new Date(record_list[i].trade_time * 1000).hhmm();

                            content += '<li class="qplay-user-list"><div><div>' +
                                shop_name +
                                ' / No.' +
                                record_list[i].trade_id +
                                '</div><div>TWD ' +
                                (record_list[i]['cancel_trade'] == 'Y' ? '-' : '') +
                                record_list[i].trade_point +
                                '</div></div><div><div>' +
                                (record_list[i]['cancel_trade'] == 'Y' ? record_list[i]['cancel_reason'] : '') +
                                '</div><div>' +
                                tradeDate + ' ' + tradeTime +
                                '</div></div></li>';
                        }
                        
                    }

                    if(content != '') {
                        $('.today-no-record').hide();
                        $('.qplay-user-ul').html('').append(content);

                    } else {
                        //no success data
                        $('.qplay-user-ul').html('');
                        $('.today-no-record').show();
                    }
                }

                loadingMask('hide');

                if(tab == 'qplay') {
                    setRecordListHeight();
                } else {
                    //no qplay user after set height
                    window.sessionStorage.setItem('afterSetHeight', 'Y');
                }
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
                    //1.记录当前登录用户的工号
                    var emp_id = data['content'].emp_loginid;
                    window.sessionStorage.setItem('current_loginid', emp_id);
                    window.sessionStorage.setItem('current_emp', emp);

                    //2.记录当前用户的消费券余额
                    var point_now = data['content'].point_now;
                    window.sessionStorage.setItem('current_point', point_now);

                    //3.成功跳转
                    checkWidgetPage('viewQPayShopToAccount', pageVisitedList);

                } else {
                    //员工信息错误
                    popupMsgInit('.shopEmpError');
                }
            };

            this.failCallback = function () { };

            var __construct = function () {
                QPlayAPIEx("GET", "getEmpInfoForShop", self.successCallback, self.failCallback, null, queryStr, "low", 30000, true);
            }();    
        }

        //动态设置QPlay使用者高度
        function setRecordListHeight() {
            var headHeight = $('#viewQPayShopSearchUser .page-header').height();
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
        $("#viewQPayShopSearchUser").on("pagebeforeshow", function (event, ui) {

        });

        $("#viewQPayShopSearchUser").one("pageshow", function (event, ui) {
            $('#inputEmpNo').attr('placeholder', langStr['wgt_067']);
            //第一次记录当前tab
            var activeTab = $('.type-active').data('type');
            //API:快速获取当天所有交易记录（不分类别）
            getCurrentTradeRecord(activeTab);
        });

        $("#viewQPayShopSearchUser").on("pageshow", function (event, ui) {
            //進入該頁面，每3秒refresh金額
            refreshInterval = setInterval(function() {
                $('#qplayRefresh').trigger('click');
            }, 3000);
        });

        $("#viewQPayShopSearchUser").on("pagehide", function (event, ui) {
            //离开此页，初始化工号输入框和下一步按钮
            $('#inputEmpNo').val('');
            $('.other-user-pwd').removeClass('active-btn-green');
            //離開該頁面，取消refresh
            clearInterval(refreshInterval);
            refreshInterval = null;
        });


        /********************************** dom event *************************************/
        //切换类型
        $('.select-user-type > div').on('click', function () {
            var activeTab = $(this).data('type');
            var has = $(this).hasClass('type-active');

            if (!has && activeTab == 'qplay') {
                $('.other-user-title').removeClass('type-active');
                $('.other-user').hide();
                $('.qplay-user-title').addClass('type-active');
                $('.select-user-scroll').show();

            } else if (!has && activeTab == 'other') {
                $('.qplay-user-title').removeClass('type-active');
                $('.select-user-scroll').hide();
                $('.other-user-title').addClass('type-active');
                $('.other-user').show();
            }

            //切换tab时判断是否需要更新高度
            var setHeight = window.sessionStorage.getItem('afterSetHeight');
            if(setHeight == 'Y') {
                setRecordListHeight();
                window.sessionStorage.setItem('afterSetHeight', 'N');
            }
        });

        //刷新列表
        $('#qplayRefresh').on('click', function () {
            //loadingMask('show');
            var activeTab = $('.type-active').data('type');
            //API:获取当天所有类别的交易记录
            getCurrentTradeRecord(activeTab);
        });

        //输入工号
        $('#inputEmpNo').on('input', function () {
            var val = $.trim($(this).val());
            if (val != '') {
                $('.other-user-pwd').addClass('active-btn-green');
            } else {
                $('.other-user-pwd').removeClass('active-btn-green');
            }
        });

        //清除工号
        $('#clearEmpNo').on('click', function () {
            $('#inputEmpNo').val('');
            $('.other-user-pwd').removeClass('active-btn-green');
        });

        //下一步
        $('.other-user-pwd').on('click', function () {
            var has = $(this).hasClass('active-btn-green');
            if (has) {
                var emp_no = $.trim($('#inputEmpNo').val());
                //API:获取员工资料及该员工消费券余额
                getEmpInfoForShop(emp_no);
            }
        });


    }
});