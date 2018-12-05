//widget naming rule widget.js/list()[].name + "Widget"
var staffAdminWidget = {

    init: function(contentItem) {

        function createContent() {
            $.get(serverURL + "/widget/staffAdmin/staffAdmin.html", function(data) {
                //1.html
                contentItem.html('').append(data);
                //2.img
                var teaImg = $('<img>').attr('src', serverURL + '/widget/staffAdmin/img/widget_tea.png');
                $('.staff-icon').html('').append(teaImg);
                var moreImg = $('<img>').attr('src', serverURL + '/widget/staffAdmin/img/more_green.png');
                $('.staff-admin-more').html('').append(moreImg);
                //3.update
                $('.staff-update-time').text(updateTime());

            }, "html");

            //点击更多，跳转到快速叫茶
            contentItem.on('click', '.staff-admin-more', function() {
                var targetPage = $('.adminStaffMenu .active-menu').data('view');
                checkWidgetPage(targetPage, pageVisitedList);
            });

            //添加staff菜單
            $.get(serverURL + "/widget/staffAdmin/menu.html", function(data) {
                $.mobile.pageContainer.append(data);

                //ios top
                if(device.platform === "iOS") {
                    $('.adminStaffMenu').css('top', iOSFixedTopPX().toString() + 'px');
                }

            }, 'html');

            //调出菜单(如果需要在其他頁面使用，必須添加樣式staff-menu-btn)
            $(document).on('click', '.staff-admin-menu-btn', function() {
                $('.adminStaffMenu').show();
                $('.adminStaffMenu .staff-menu-main').animate({left: '40vw'}, 300);
            });

            //右滑隐藏菜单
            $(document).on('swiperight', '.adminStaffMenu', function() {
                $('.adminStaffMenu .staff-menu-main').animate({left: '100vw'}, 300, function(){
                    $('.adminStaffMenu').hide();
                });
            });

            //点击非菜单区域隐藏菜单
            $(document).on('tap', '.adminStaffMenu', function(e) {
                if(e.target != this) {
                    return;
                } else {
                    $('.adminStaffMenu .staff-menu-main').animate({left: '100vw'}, 300, function(){
                        $('.adminStaffMenu').hide();
                    });
                }
            });

            //選擇菜單
            $(document).on('tap', '.adminStaffMenu .staff-menu-list li', function(e) {
                //1. get active page & target page
                var activePage = $.mobile.pageContainer.pagecontainer("getActivePage")[0].id;
                var targetPage = $(this).data('view');
                if(activePage != targetPage) {
                    //2. remove class
                    $('.adminStaffMenu .staff-menu-list').find('.active-menu').removeClass('active-menu');
                    //3. add class
                    $(this).addClass('active-menu');
                }

                //4. close panel
                $('.adminStaffMenu .staff-menu-main').animate({left: '100vw'}, 300, function(){
                    $('.adminStaffMenu').hide();
                });

                //5. change page
                if(activePage != targetPage) {
                    checkWidgetPage(targetPage, pageVisitedList);
                }
            });

            //sync menu when back key
            $(document).on('click', '.staff-back', function() {
                staffBackKey();
            });
            document.addEventListener("backbutton", staffBackKey, false);

        }

        function updateTime() {
            var now = new Date();
            var date = now.yyyymmdd('/');
            var time = now.hhmm();
            return date + ' ' + time;
        }

        function staffBackKey() {
            //1. close panel
            var panelShow = $('.adminStaffMenu').css('display') == 'block' ? true : false;
            if(panelShow) {
                $('.adminStaffMenu .staff-menu-main').animate({left: '100vw'}, 300, function(){
                    $('.adminStaffMenu').hide();
                });
            }

            //2. change menu class
            var curPage = pageVisitedList[pageVisitedList.length - 1];
            $.each($('.adminStaffMenu .staff-menu-list li'), function(index, item) {
                if(curPage == $(item).data('view')) {
                    $('.adminStaffMenu .staff-menu-list').find('.active-menu').removeClass('active-menu');
                    $('.adminStaffMenu .staff-menu-list li[data-view="' + curPage + '"]').addClass('active-menu');
                }
            })
        }

        $.fn.staffAdmin = function (options) {
            options = options || {};

            return this.each(function () {
                var state = $.data(this, 'staffAdmin');
                if (state) {
                    $.extend(state.options, options);
                } else {
                    $.data(this, 'staffAdmin', {
                        options: $.extend({}, $.fn.staffAdmin.defaults, options)
                    });
                }

                createContent();

            })
        };

        $.fn.staffAdmin.methods = {
            options: function(jq) {
                return $.data(jq[0], 'staffAdmin').options;
            },
            refresh: function(jq) {
                return jq.each(function() {
                    createContent();
                });
            }
        }

        $.fn.staffAdmin.defaults = {};

        $('.staffAdminWidget').staffAdmin();
    }
}