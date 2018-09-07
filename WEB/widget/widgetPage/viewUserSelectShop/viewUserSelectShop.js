$("#viewUserSelectShop").pagecontainer({
    create: function (event, ui) {

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
        }

        /********************************** page event ***********************************/
        $("#viewUserSelectShop").on("pagebeforeshow", function (event, ui) {

        });

        $("#viewUserSelectShop").one("pageshow", function (event, ui) {
            //createShopList();
        });

        $("#viewUserSelectShop").on("pageshow", function (event, ui) {

        });

        $("#viewUserSelectShop").on("pagehide", function (event, ui) {

        });



        /********************************** dom event *************************************/
        $('.user-select-shop').on('click', '.user-select-list', function () {
            //记录 shop_id和shop_name
            var shop_id = $(this).attr('data-id');
            var shop_name = $(this).children().eq(0).text();
            var shop_obj = {
                'shop_id': shop_id,
                'shop_name': shop_name
            };
            window.sessionStorage.setItem('shop_info', JSON.stringify(shop_obj));
            checkWidgetPage('viewUserInputAmount');
        });

    }
});