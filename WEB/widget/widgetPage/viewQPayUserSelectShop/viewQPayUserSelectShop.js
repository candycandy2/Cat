$("#viewQPayUserSelectShop").pagecontainer({
    create: function (event, ui) {

        //生成店家列表
        function createShopList() {
            var shop_list = JSON.parse(window.sessionStorage.getItem('shop_list'));
            var content = '';
            for (var i in shop_list) {
                content += '<li class="user-select-list" data-id="' +
                    shop_list[i].shop_id +
                    '"><div>' +
                    shop_list[i].shop_name +
                    '</div><div><img src="img/nextpage.png"></div></li>';
            }
            $('.user-select-shop ul').html('').append(content);

            setShopListHeight();
        }

        //设置高度
        function setShopListHeight() {
            var headHeight = $('#viewQPayUserSelectShop .page-header').height();
            var titleHeight = $('.user-select-title').height();
            var mainHeight = $('.user-select-shop').height();
            var totalHeight;

            if (device.platform === "iOS") {
                totalHeight = (headHeight + titleHeight + mainHeight + iOSFixedTopPX()).toString();
            } else {
                totalHeight = (headHeight + titleHeight + mainHeight).toString();
            }
            $('.user-select > div').css('height', totalHeight + 'px');
        }


        /********************************** page event ***********************************/
        $("#viewQPayUserSelectShop").on("pagebeforeshow", function (event, ui) {
            createShopList();
        });

        $("#viewQPayUserSelectShop").one("pageshow", function (event, ui) {
            createShopList();
        });

        $("#viewQPayUserSelectShop").on("pageshow", function (event, ui) {

        });

        $("#viewQPayUserSelectShop").on("pagehide", function (event, ui) {

        });


        /********************************** dom event *************************************/
        $('.user-select-shop').on('click', '.user-select-list', function () {
            //记录 shop_id和shop_name
            var shop_id = $(this).data('id');
            var shop_name = $(this).children(':first').text();
            var shop_obj = {
                'shop_id': shop_id,
                'shop_name': shop_name
            };
            window.sessionStorage.setItem('shop_info', JSON.stringify(shop_obj));
            //初始化后一页（输入金额页面）
            window.sessionStorage.setItem('initialAmountPage', 'Y');
            checkWidgetPage('viewQPayUserInputPrice', pageVisitedList);
        });


    }
});