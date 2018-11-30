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
                $('.staff-more').html('').append(moreImg);
                //3.update
                $('.staff-update-time').text(updateTime());

            }, "html");

            //点击更多，跳转到快速叫茶
            contentItem.on('click', '.staff-more', function() {
                //var targetPage = $('.active-menu').data('view');
                //checkWidgetPage(targetPage, pageVisitedList);
                checkWidgetPage('viewStaffAdminMain', pageVisitedList);
            });

            //添加staff菜單
            $.get(serverURL + "/widget/staffAdmin/menu.html", function(data) {
                $.mobile.pageContainer.append(data);

                //ios top
                if(device.platform === "iOS") {
                    $('.staff-menu-mask').css('top', iOSFixedTopPX().toString() + 'px');
                }

            }, 'html');

            //调出菜单(如果需要在其他頁面使用，必須添加樣式staff-menu-btn)
            $(document).on('click', '.staff-menu-btn', function() {
                $('.staff-menu-mask').show();
                $('.staff-menu-main').animate({left: '40vw'}, 300);
            });

            //右滑隐藏菜单
            $(document).on('swiperight', '.staff-menu-mask', function() {
                $('.staff-menu-main').animate({left: '100vw'}, 300, function(){
                    $('.staff-menu-mask').hide();
                });
            });

            //点击非菜单区域隐藏菜单
            $(document).on('tap', '.staff-menu-mask', function(e) {
                if(e.target != this) {
                    return;
                } else {
                    $('.staff-menu-main').animate({left: '100vw'}, 300, function(){
                        $('.staff-menu-mask').hide();
                    });
                }
            });

            //選擇菜單
            $(document).on('tap', '.staff-menu-list li', function(e) {
                //1. get active page & target page
                var activePage = $.mobile.pageContainer.pagecontainer("getActivePage")[0].id;
                var targetPage = $(this).data('view');
                if(activePage != targetPage) {
                    //2. remove class
                    $('.staff-menu-list').find('.active-menu').removeClass('active-menu');
                    //3. add class
                    $(this).addClass('active-menu');
                }

                //4. close panel
                $('.staff-menu-main').animate({left: '100vw'}, 300, function(){
                    $('.staff-menu-mask').hide();
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
            //1. panel
            var panelShow = $('.staff-menu-mask').css('display') == 'block' ? true : false;
            if(panelShow) {
                $('.staff-menu-main').animate({left: '100vw'}, 300, function(){
                    $('.staff-menu-mask').hide();
                });
            }

            //2. back page
            var curPage = pageVisitedList[pageVisitedList.length - 1];
            $.each($('.staff-menu-list li'), function(index, item) {
                if(curPage == $(item).data('view')) {
                    $('.staff-menu-list').find('.active-menu').removeClass('active-menu');
                    $('.staff-menu-list li[data-view="' + curPage + '"]').addClass('active-menu');
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