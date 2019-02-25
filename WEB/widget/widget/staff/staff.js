//widget naming rule widget.js/list()[].name + "Widget"
var staffWidget = {

    init: function(contentItem) {

        function createContent() {
            $.get(serverURL + "/widget/widget/staff/staff.html", function(data) {
                //1.html
                contentItem.html('').append(data);
                //2.img
                //var teaImg = $('<img>').attr('src', serverURL + '/widget/widget/staff/img/widget_tea.png');
                //$('.staff-icon').html('').append(teaImg);
                var moreImg = $('<img>').attr('src', serverURL + '/widget/widget/staff/img/more_green.png');
                $('.staff-user-more').html('').append(moreImg);
                // //3.update
                $('.staff-update-time').text(updateTime());
                let staffIcon = $('<img src="' + serverURL + '/widget/widget/staff/img/widget_staff.png">');
                $('.staff-img').html('').append(staffIcon);

            }, "html");

            //点击更多，跳转到快速叫茶
            contentItem.on('click', '.staff-user-more, div.staff-btn, .staff-img img', function() {
                var targetPage = $('.userStaffMenu .active-menu').data('view');
                checkWidgetPage(targetPage, pageVisitedList);
            });

            //添加staff菜單
            $.get(serverURL + "/widget/widget/staff/menu.html", function(data) {
                $.mobile.pageContainer.append(data);

                //ios top
                if(device.platform === "iOS") {
                    $('.userStaffMenu').css('top', iOSFixedTopPX().toString() + 'px');
                }

            }, 'html');

            //调出菜单(如果需要在其他頁面使用，必須添加樣式staff-menu-btn)
            $(document).on('click', '.staff-menu-btn', function() {
                $('.userStaffMenu').show();
                $('.userStaffMenu .staff-menu-main').animate({left: '40vw'}, 300);
            });

            //右滑隐藏菜单
            $(document).on('swiperight', '.userStaffMenu', function() {
                $('.userStaffMenu .staff-menu-main').animate({left: '100vw'}, 300, function(){
                    $('.userStaffMenu').hide();
                });
            });

            //点击非菜单区域隐藏菜单
            $(document).on('tap', '.userStaffMenu', function(e) {
                if(e.target != this) {
                    return;
                } else {
                    $('.userStaffMenu .staff-menu-main').animate({left: '100vw'}, 300, function(){
                        $('.userStaffMenu').hide();
                    });
                }
            });

            //選擇菜單
            $(document).on('tap', '.userStaffMenu .staff-menu-list li', function(e) {
                //1. get active page & target page
                var activePage = $.mobile.pageContainer.pagecontainer("getActivePage")[0].id;
                var targetPage = $(this).data('view');
                if(activePage != targetPage) {
                    //2. remove class
                    $('.userStaffMenu .staff-menu-list').find('.active-menu').removeClass('active-menu');
                    //3. add class
                    $(this).addClass('active-menu');
                }

                //4. close panel
                $('.userStaffMenu .staff-menu-main').animate({left: '100vw'}, 300, function(){
                    $('.userStaffMenu').hide();
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
            var panelShow = $('.userStaffMenu').css('display') == 'block' ? true : false;
            if(panelShow) {
                $('.userStaffMenu .staff-menu-main').animate({left: '100vw'}, 300, function(){
                    $('.userStaffMenu').hide();
                });
            }

            //2. change menu class
            var curPage = pageVisitedList[pageVisitedList.length - 1];
            $.each($('.userStaffMenu .staff-menu-list li'), function(index, item) {
                if(curPage == $(item).data('view')) {
                    $('.userStaffMenu .staff-menu-list').find('.active-menu').removeClass('active-menu');
                    $('.userStaffMenu .staff-menu-list li[data-view="' + curPage + '"]').addClass('active-menu');
                }
            })
        }

        $.fn.staff = function (options) {
            options = options || {};

            return this.each(function () {
                var state = $.data(this, 'staff');
                if (state) {
                    $.extend(state.options, options);
                } else {
                    $.data(this, 'staff', {
                        options: $.extend({}, $.fn.staff.defaults, options)
                    });
                }

                createContent();

            })
        };

        $.fn.staff.methods = {
            options: function(jq) {
                return $.data(jq[0], 'staff').options;
            },
            refresh: function(jq) {
                return jq.each(function() {
                    createContent();
                });
            }
        }

        $.fn.staff.defaults = {};

        $('.staffWidget').staff();
    },
    show: function() {
        var self = this;

        let queryData = JSON.stringify({
            login_id: loginData['loginid'],
            domain: loginData['domain'],
            emp_no: loginData['emp_no'],
            service_id: 'meetingroomService',
            //service_type: 'staff',
            start_date: Math.round(new Date().getTime() / 1000),
            end_date: new Date(new Date().yyyymmdd('/') + ' 18:00').getTime() / 1000
        });

        this.successCallback = function(data) {
            //console.log(data);

            if(data['result_code'] == '1') {
                //判断是否有数据
                let arr = data['content']['service_list'][0]['record_list'];
                if(arr.length == 0) {
                    //no data
                    $('.staff-main').hide();
                    $('.staff-none').show();
                } else {
                    $('.staff-none').hide();
                    $('.staff-main').show();
                    let content = '';
                    for(var i = 0; i < arr.length; i++) {
                        if(i < 3) {
                            content += '<li>' + arr[i]['info_push_emp_content'] + '</li>';
                        } else {
                            break;
                        }
                    }
                    $('.staff-main-ul').html('').append(content);
                }
            } else {
                $('.staff-main').hide();
                $('.staff-none').show();
            }
        };

        this.failCallback = function(data) {};

        var __construct = function() {
            EmpServicePlugin.QPlayAPI("POST", "getMyReserve", self.successCallback, self.failCallback, queryData, '');
        }();
    },
    plugin: function() {
        let dependency = ['QForumPlugin', 'EmpServicePlugin', 'StatusPlugin'];
        widget.plugin(dependency);
    }
}