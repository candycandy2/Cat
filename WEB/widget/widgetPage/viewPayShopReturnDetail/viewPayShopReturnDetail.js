$("#viewPayShopReturnDetail").pagecontainer({
    create: function(event, ui) {

        let reasonList = [langStr['wgt_038'], langStr['wgt_158'], langStr['wgt_159'], langStr['wgt_160']];//分別爲請選擇、金額輸入錯誤、商品質量問題、其他

        //初始化退款理由
        function initReturnReason() {
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

            tplJS.DropdownList("viewPayShopReturnDetail", "qpayReturnReason", "prepend", "typeB", reasonData);
            //设置默认值0
            $('#returnReason option').attr('value', 0);
            //减少间距
            let reasonWidth = setDropdownlistWidth(3);
            tplJS.reSizeDropdownList('returnReason', null, reasonWidth);
        }

        //获取交易信息
        function getTradeDetail() {
            let detail = JSON.parse(window.sessionStorage.getItem('viewPayShopReturnDetail_parmData'));
            $('.return-detail-shop').text(detail['trade_shop']);
            $('.return-detail-id').text(detail['trade_id']);
            $('.return-detail-price').text(detail['trade_price']);
            $('.return-detail-time').text(new Date(detail['trade_time'] * 1000).yyyymmdd('/') + ' ' + new Date(detail['trade_time'] * 1000).hhmm());
        }


        /********************************** page event ***********************************/
        $("#viewPayShopReturnDetail").on("pagebeforeshow", function(event, ui) {

        });

        $("#viewPayShopReturnDetail").one("pageshow", function(event, ui) {
            var mainHeight = window.sessionStorage.getItem('pageMainHeight');
            $('#viewPayShopReturnDetail .page-main').css('height', mainHeight);
            $('.return-detail-row3').show();
            initReturnReason();
        });

        $("#viewPayShopReturnDetail").on("pageshow", function(event, ui) {
            getTradeDetail();
        });

        $("#viewPayShopReturnDetail").on("pagehide", function(event, ui) {

        });


        /********************************** dom event *************************************/
        //切换退货理由
        $('#qpayReturnReason').on('change', 'select', function() {
            let typeVal = $(this).val();
            if(typeVal == 0) {
                $('.returnToInputPwd').removeClass('active-btn-green');
                $('.return-detail-textarea').hide();
            } else if(typeVal == 3) {
                $('.returnToInputPwd').removeClass('active-btn-green');
                $('.return-detail-textarea').find('textarea').val('');
                $('.return-detail-textarea').show();
            } else {
                $('.returnToInputPwd').addClass('active-btn-green');
                $('.return-detail-textarea').hide();
            }
            let reasonWidth = setDropdownlistWidth(3);
            tplJS.reSizeDropdownList('returnReason', null, reasonWidth);
        });

        $('.return-detail-textarea textarea').on('input', function() {
            let otherVal = $.trim($(this).val());
            if(otherVal != '') {
                $('.returnToInputPwd').addClass('active-btn-green');
            } else {
                $('.returnToInputPwd').removeClass('active-btn-green');
            }
        });


    }
});