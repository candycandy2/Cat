
$("#viewInsurancePanel").pagecontainer({
    create: function(event, ui) {

        /********************************** function *************************************/

        function insurBackKey() {
            //1. close panel
            var panelShow = $('.insuranceMenu').css('display') == 'block' ? true : false;
            if(panelShow) {
                $('.insuranceMenu .staff-menu-main').animate({right: '100vw'}, 300, function(){
                    $('.insuranceMenu').hide();
                });
            }

            //2. change menu class
            var curPage = visitedPageList[visitedPageList.length - 1];
            $.each($('.insuranceMenu .staff-menu-list li'), function(index, item) {
                if(curPage == $(item).data('view')) {
                    $('.insuranceMenu .staff-menu-list').find('.active-menu').removeClass('active-menu');
                    $('.insuranceMenu .staff-menu-list li[data-view="' + curPage + '"]').addClass('active-menu');
                }
            })
        }

        /********************************** dom event *************************************/

        //调出菜单(如果需要在其他頁面使用，必須添加樣式staff-menu-btn)
        $(document).on('click', '.staff-menu-btn', function() {
            $('.insuranceMenu').show();
            $('.insuranceMenu .staff-menu-main').animate({right: '40vw'}, 300);
        });

        //右滑隐藏菜单
        $(document).on('swipeleft', '.insuranceMenu', function() {
            $('.insuranceMenu .staff-menu-main').animate({right: '100vw'}, 300, function(){
                $('.insuranceMenu').hide();
            });
        });

        //点击非菜单区域隐藏菜单
        $(document).on('tap', '.insuranceMenu', function(e) {
            if(e.target != this) {
                return;
            } else {
                $('.insuranceMenu .staff-menu-main').animate({right: '100vw'}, 300, function(){
                    $('.insuranceMenu').hide();
                });
            }
        });

        //選擇菜單
        $(document).on('tap', '.insuranceMenu .staff-menu-list li', function(e) {
            //1. get active page & target page
            var activePage = $.mobile.pageContainer.pagecontainer("getActivePage")[0].id;
            var targetPage = $(this).data('view');
            if(activePage != targetPage) {
                //2. remove class
                $('.insuranceMenu .staff-menu-list').find('.active-menu').removeClass('active-menu');
                //3. add class
                $(this).addClass('active-menu');
            }

            //4. close panel
            $('.insuranceMenu .staff-menu-main').animate({right: '100vw'}, 300, function(){
                $('.insuranceMenu').hide();
            });

            //5. change page
            if(activePage != targetPage) {
                checkWidgetPage(targetPage, visitedPageList);
            }
        });

        //sync menu when back key
        $(document).on('click', '.staff-back', function() {
            insurBackKey();
        });
        document.addEventListener("backbutton", insurBackKey, false);

});