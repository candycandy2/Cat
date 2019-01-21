$("#viewQPayShopReturnReason").pagecontainer({
    create: function(event, ui) {

        let reasonList = [langStr['wgt_038'], langStr['wgt_158'], langStr['wgt_159'], langStr['wgt_160']];//分別爲請選擇、金額輸入錯誤、商品質量問題、其他

        //初始化退款理由
        function initReasonSelect() {
            let reasonData = {
                id: "returnReason",
                option: [],
                title: "",
                defaultText: langStr['wgt_038'],
                defaultValue: 0,
                changeDefaultText: true,
                attr: {
                    class: "dropdown-arrow-incline"
                }
            }

            for(var i in reasonList) {
                reasonData["option"][i] = {};
                reasonData["option"][i]["value"] = i;
                reasonData["option"][i]["text"] = reasonList[i];
            }

            tplJS.DropdownList("viewQPayShopReturnReason", "qpayReturnReason", "prepend", "typeB", reasonData);
            //设置默认值0
            $('#returnReason option').attr('value', 0);
            //减少间距
            let reasonWidth = setDropdownlistWidth(3);
            tplJS.reSizeDropdownList('returnReason', null, reasonWidth);
        }

        //获取交易信息
        function getTradeDetail() {
            let tradeInfo = JSON.parse(window.sessionStorage.getItem('viewQPayShopReturnReason_parmData'));
            $('.return-reason-shop').text(tradeInfo['trade_shop']);
            $('.return-reason-id').text(tradeInfo['trade_id']);
            $('.return-reason-price').text(tradeInfo['trade_price']);
            $('.return-reason-time').text(new Date(tradeInfo['trade_time'] * 1000).yyyymmdd('/') + ' ' + new Date(tradeInfo['trade_time'] * 1000).hhmm());
        }


        /********************************** page event ***********************************/
        $("#viewQPayShopReturnReason").on("pagebeforeshow", function(event, ui) {

        });

        $("#viewQPayShopReturnReason").one("pageshow", function(event, ui) {
            var mainHeight = window.sessionStorage.getItem('pageMainHeight');
            $('#viewQPayShopReturnReason .page-main').css('height', mainHeight);
            $('.return-reason-row3').show();
            initReasonSelect();
        });

        $("#viewQPayShopReturnReason").on("pageshow", function(event, ui) {
            getTradeDetail();
        });

        $("#viewQPayShopReturnReason").on("pagehide", function(event, ui) {

        });


        /********************************** dom event *************************************/
        //切换退货理由
        $('#qpayReturnReason').on('change', 'select', function() {
            let typeVal = $(this).val();
            if(typeVal == 0) {
                $('.returnToPassword').removeClass('active-btn-green');
                $('.return-reason-textarea').hide();
            } else if(typeVal == 3) {
                $('.returnToPassword').removeClass('active-btn-green');
                $('.return-reason-textarea').find('textarea').val('');
                $('.return-reason-textarea').show();
            } else {
                $('.returnToPassword').addClass('active-btn-green');
                $('.return-reason-textarea').hide();
            }
            let reasonWidth = setDropdownlistWidth(3);
            tplJS.reSizeDropdownList('returnReason', null, reasonWidth);
        });

        //其他理由
        $('.return-reason-textarea textarea').on('input', function() {
            let otherVal = $.trim($(this).val());
            if(otherVal != '') {
                $('.returnToPassword').addClass('active-btn-green');
            } else {
                $('.returnToPassword').removeClass('active-btn-green');
            }
        });

        //下一步
        $('.returnToPassword').on('click', function() {
            let has = $(this).hasClass('active-btn-green');
            if(has) {
                //只有退款原因是本页输入的，其他内容与前一页一致
                let tradeInfo = JSON.parse(window.sessionStorage.getItem('viewQPayShopReturnReason_parmData'));
                //如果不为其他类型，直接获取select val，如果为其他，获取textarea val
                tradeInfo['reason'] = ($('#qpayReturnReason select').val() == 3 ? $.trim($('.return-reason-textarea textarea').val()) : $('#qpayReturnReason option:selected').text());
                checkWidgetPage('viewQPayShopReturnPassword', pageVisitedList, tradeInfo);
            }
        });


    }
});