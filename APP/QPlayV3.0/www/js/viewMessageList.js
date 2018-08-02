$("#viewMessageList").pagecontainer({
    create: function(event, ui) {

        var messageType = "News",
            newsAllChecked = false,
            eventAllChecked = false,
            deleteType, msgType;
        var messageExist = true;

        function getNewsList() {

            var self = this;
            var msgDateTo = getTimestamp();
            var queryStr = "&date_from=" + loginData["msgDateFrom"] + "&date_to=" + msgDateTo + "&overwrite_timestamp=1";

            window.localStorage.setItem("msgDateFrom", loginData["msgDateFrom"]);

            this.successCallback = function(data) {
                console.log(data);

            };

            this.failCallback = function() {};

            var __construct = function() {
                QPlayAPI("GET", "getMessageList", self.successCallback, self.failCallback, null, queryStr);
            }();
        }

        //根据message数据，动态生成html
        function createMessageByType() {
            //1. html
            var resultArr = loginData['messagecontent']['message_list'];
            //console.log(resultArr);

            var newsContent = '';
            var eventContent = '';
            for (var i in resultArr) {
                if (resultArr[i]['message_type'] == 'event' && resultArr[i].read != 'D') {
                    eventContent += '<li data-icon="false" data-rowid="' + resultArr[i].message_send_row_id +
                        '"><div class="behind"><a href="#" class="ui-btn delete-btn"><img src="img/delete.png" class="msg-delete-btn"></a></div><a href="#" class="ui-div ui-btn">' +
                        '<div class="msg-check-icon"><img src="img/checkbox.png" data-src="checkbox" class="msg-check-btn"></div><div class="msg-content-title ' +
                        (resultArr[i].read == "Y" ? "read-font-normal" : "") + '"><div>' +
                        resultArr[i].create_time.split(' ')[0] + '</div><div>' +
                        resultArr[i].message_title + '</div></div><div class="msg-next-icon"><img src="img/nextpage.png" class="msg-next-btn"></div></a></li>';

                } else if (resultArr[i]['message_type'] == 'news' && resultArr[i].read != 'D') {
                    newsContent += '<li data-icon="false" data-rowid="' + resultArr[i].message_send_row_id +
                        '"><div class="behind"><a href="#" class="ui-btn delete-btn"><img src="img/delete.png" class="msg-delete-btn"></a></div><a href="#" class="ui-div ui-btn">' +
                        '<div class="msg-check-icon"><img src="img/checkbox.png" data-src="checkbox" class="msg-check-btn"></div><div class="msg-content-title ' +
                        (resultArr[i].read == "Y" ? "read-font-normal" : "") + '"><div>' +
                        resultArr[i].create_time.split(' ')[0] + '</div><div>' +
                        resultArr[i].message_title + '</div></div><div class="msg-next-icon"><img src="img/nextpage.png" class="msg-next-btn"></div></a></li>';
                }
            }

            $(".news-content ul").html('').append(newsContent);
            $(".event-content ul").html('').append(eventContent);

            //2. swipe
            var x;
            $('.swipe-delete li > a')
                .on('touchstart', function(event) {
                    //console.log(event.originalEvent.pageX)
                    $('.swipe-delete li > a').css('left', '0px') // close em all
                    $(event.currentTarget).addClass('open')
                    //x为手指接触屏幕的点与屏幕左侧的边距，初始值（0~360）
                    x = event.originalEvent.targetTouches[0].pageX // anchor point
                })
                .on('touchmove', function(event) {
                    //结束位置 - 起始位置 = 滑动距离（-360~360），小于零表示左滑，反之右滑
                    var change = event.originalEvent.targetTouches[0].pageX - x
                    //(-100~0),右滑为0,左滑为距离
                    change = Math.min(Math.max(-100, change), 0) // restrict to -100px left, 0px right
                    event.currentTarget.style.left = change + 'px'
                    if (change < -20) disable_scroll() // disable scroll once we hit 10px horizontal slide
                })
                .on('touchend', function(event) {
                    var left = parseInt(event.currentTarget.style.left)
                    var itemWidth = $(this).prev().children("a").width()
                    var new_left;
                    // if (left < -35) {
                    //     new_left = '-100px'
                    // } else if (left > 35) {
                    //     new_left = '100px'
                    // } else {
                    //     new_left = '0px'
                    // }
                    if (left < (itemWidth - itemWidth * 2) / 3) {
                        new_left = '-' + itemWidth.toString() + 'px';
                    } else if (left > itemWidth / 3) {
                        new_left = itemWidth.toString() + 'px';
                    } else {
                        new_left = '0px'
                    }

                    // event.currentTarget.style.left = new_left
                    $(event.currentTarget).animate({ left: new_left }, 200)
                    enable_scroll()
                });

            //3. fixed top
            var msgHeaderTop = parseInt(document.documentElement.clientWidth * 13 / 100, 10);
            if (device.platform == 'iOS') {
                msgHeaderTop += iOSFixedTopPX();
            }
            $('.select-news').css('top', msgHeaderTop + 'px');
            $('.msg-tool').css('top', msgHeaderTop + 'px');

            //4. message update
            var msgUpdateDate;
            if (resultArr.length > 0) {
                msgUpdateDate = resultArr[0].create_time.split(' ')[0].replaceAll('-', '/');
            } else {
                var msgDate = parseInt(localStorage.getItem('msgDateFrom')) * 1000;
                msgUpdateDate = new Date(msgDate).toLocaleDateString('zh-cn');
            }
            $('.msg-update-date').text(langStr['str_079'] + msgUpdateDate);

            //5. to detail
            $('.swipe-delete li > a .msg-content-title,.swipe-delete li > a .msg-next-icon').on('click', function() {
                messageFrom = 'viewMessageList';
                messageRowId = $(this).parents('li').attr('data-rowid');
                $.mobile.changePage('#viewWebNews2-3-1');
            });

            //6. set height
            setMsgHeightByType();
        }

        //don't use
        function getMessageDetail() {
            var self = this;

            var queryStr = "&message_send_row_id=" + messageRowId;

            this.successCallback = function(data) {
                console.log(data);
                var resultcode = data.result_code;
                var content = data.content;

                if (resultcode === 1) {

                    messageExist = true;
                    //变为已读
                    updateReadDelete(content.message_type, "read");

                    $('.msg-detail-title').text(content.message_title);

                    //If template_id == 999, it's Portal Event,
                    //need to be render become canvas
                    if (content.template_id === 999) {
                        portalURL = content.message_text;
                        createMsgHtml(portalURL);

                        $(".PortalContent").show();
                        $(".textContent").hide();

                    } else {

                        $(".textContent").html(cleanHTML(content.message_text));
                        $(".PortalContent").hide();
                        $(".textContent").show();
                    }

                    $.mobile.changePage("#viewWebNews2-3-1");

                } else if (resultcode === "000910") {
                    //Message was be deleted in server
                    messageExist = false;
                    updateReadDelete("all", "delete");
                }

                if (window.localStorage.getItem("openMessage") === "true") {
                    loginData.openMessage = false;
                    window.localStorage.setItem("openMessage", "false");
                }
            };

            this.failCallback = function(data) {};

            var __construct = function() {
                QPlayAPI("POST", "getMessageDetail", self.successCallback, self.failCallback, null, queryStr);
            }();
        }

        function createMsgHtml(varURL) {
            (function() {
                $(".htmlContent").html("");
                $(".htmlContent").load(varURL, function() {
                    $(".htmlContent").find("meta").remove();
                    $(".htmlContent").find("title").remove();
                    $(".htmlContent").find("base").remove();

                    drawCanvas($(".htmlContent").html());

                    //Had used the URL
                    portalURL = "";
                    //Had openMessage
                    if (window.localStorage.getItem('openMessage') === "true") {
                        loginData.openMessage = false;
                        window.localStorage.setItem('openMessage', "false");
                    }
                });
            }());
        }

        function drawCanvas(content) {

            //$("#viewWebNews2-3-1 .portal-header").hide();

            $(".htmlContent").css({
                top: 0,
                left: 0
            });

            $(".htmlContent").html(content).promise().done(function() {

                var screenWidth = document.documentElement.clientWidth;
                var $images = $('.htmlContent img');
                var loaded_images_count = 0;
                var loaded_finish = false;

                if ($images.length > 0) {
                    $images.load(function() {

                        loaded_images_count++;

                        if (loaded_images_count == $images.length) {
                            if ($(".htmlContent")[0].scrollWidth < screenWidth) {
                                $(".htmlContent").css("width", (screenWidth) + "px");
                            }

                            loaded_finish = true;
                            //$("#messageLoadErrorPopup").popup("close");
                            $("#viewMessageDetail").css("min-height", document.documentElement.clientHeight + "px");

                            setTimeout(function() {
                                doPanZoom();
                            }, 500);
                        }

                    });

                    setTimeout(function() {
                        if (!loaded_finish) {
                            //$("#messageLoadErrorPopup").popup("open");
                            $("#viewMessageDetail").css("min-height", document.documentElement.clientHeight + "px");
                        }
                    }, 3000);
                } else {
                    if ($(".htmlContent")[0].scrollWidth < screenWidth) {
                        $(".htmlContent").css("width", (screenWidth) + "px");
                    }

                    // setTimeout(function() {
                    //     doPanZoom();
                    // }, 500);
                }

                //隐藏页面中的header和footer
                // $('.htmlContent center > table > tbody > tr:eq(0)').hide();
                // $('.htmlContent center > table > tbody > tr:eq(1)').hide();
                // $('.htmlContent center > table > tbody > tr:eq(2)').hide();
                // $('.htmlContent center > table > tbody > tr:eq(4)').hide();
                // $('.htmlContent center > table > tbody > tr:eq(5)').hide();
                // $('.htmlContent center > table > tbody > tr:eq(6)').hide();

                function doPanZoom() {

                    window.minScale = parseInt(document.documentElement.clientWidth * 100 / $(".htmlContent")[0].scrollWidth * 0.9, 10) / 100;
                    var marginLeft = parseInt(document.documentElement.clientWidth * 10 / 100, 10);

                    //Resize HtmlContent
                    $(".htmlContent").css("width", $(".htmlContent")[0].scrollWidth + "px");
                    $(".htmlContent").css("height", $(".htmlContent")[0].scrollHeight + "px");

                    //Remove Listener Event
                    $(".PortalContent").off("scroll");
                    $(".htmlContent").off("panzoomstart");
                    $(".htmlContent").off("panzoomzoom");
                    $(".htmlContent").off("panzoomend");

                    //Panzoom Initial
                    $(".htmlContent").panzoom();
                    $(".htmlContent").panzoom("option", {
                        minScale: minScale
                    });

                    $(".htmlContent").panzoom("zoom", minScale, { silent: true });

                    //Resize PortalContent
                    var screenHeight = document.documentElement.clientHeight;
                    var screenWidth = document.documentElement.clientWidth;
                    $(".PortalContent").css("overflow-y", "auto");
                    $(".PortalContent").css("overflow-x", "hidden");
                    $(".viewWebNews2-3-1 .page-main").css("overflow-x", "auto");
                    $(".PortalContent").css("top", "0px");
                    //var portalHeaderHeight = $("#viewWebNews2-3-1 .portal-header").height() + 5;
                    var portalHeaderHeight = 0;

                    if (device.platform === "iOS") {
                        portalHeaderHeight += iOSFixedTopPX();
                    }

                    $(".PortalContent").css("padding-top", "0px");
                    var matrixNewTopY = parseInt(portalHeaderHeight, 10);

                    $(".PortalContent").css("height", screenHeight + "px");
                    $(".PortalContent").css("width", screenWidth + "px");

                    //Reset matrix of canvas
                    var canvasHeight = $(".htmlContent").height();
                    var canvasWidth = $(".htmlContent").width();
                    var matrix = $(".htmlContent").panzoom("getMatrix");
                    var matrixLeftX = document.documentElement.clientWidth - $(".htmlContent").width();
                    var matrixNewLeftX = Math.abs(parseInt((screenWidth - canvasWidth * matrix[0]) / 2, 10));

                    $(".htmlContent").css({
                        transform: " matrix(" + matrix[0] + "," + matrix[1] + "," + matrix[2] + "," + matrix[3] + "," + matrixNewLeftX + "," + matrixNewTopY + ")"
                    });

                    $(".htmlContent").offset({
                        left: matrixNewLeftX,
                        top: matrixNewTopY
                    });

                    loadingMask("hide");

                    //panzoom start event
                    $(".htmlContent").on("panzoomstart", function(e, panzoom, matrix, changed) {
                        var canvasWidth = $(".htmlContent").width() * matrix[0];
                        var screenWidth = document.documentElement.clientWidth;

                        $("#viewMessageDetail .page-main").css("overflow-x", "auto");
                        $(".PortalContent").css({
                            "overflow-y": "auto",
                            "overflow-x": "auto",
                            "top": "0px",
                            "height": screenHeight + "px",
                            "width": canvasWidth + "px"
                        });

                        if (device.platform === "iOS") {
                            $(".PortalContent").css("width", screenWidth + "px");
                        }
                    });

                    //panzoom start zoom
                    $(".htmlContent").on("panzoomzoom", function(e, panzoom, scale, opts) {
                        $(".htmlContent").panzoom("option", {
                            disablePan: true
                        });

                        var matrix = $(".htmlContent").panzoom("getMatrix");
                        var canvasWidth = $(".htmlContent").width() * matrix[0];

                        $("#viewMessageDetail .page-main").css("overflow-x", "auto");
                        $(".PortalContent").css({
                            "overflow-y": "auto",
                            "overflow-x": "auto",
                            "top": "0px",
                            "height": screenHeight + "px",
                            "width": canvasWidth + "px"
                        });

                        $(".htmlContent").css({
                            transform: " matrix(" + scale + "," + matrix[1] + "," + matrix[2] + "," + scale + ", 0, " + matrix[5] + ")"
                        });
                    });

                    //panzoom end event
                    $(".htmlContent").on("panzoomend", function(e, panzoom, matrix, changed) {

                        var canvasWidth;
                        var screenWidth;
                        var canvasOffsetTop;

                        matrix = $(".htmlContent").panzoom("getMatrix");

                        if (matrix[0] == minScale) {

                            screenWidth = document.documentElement.clientWidth;
                            $(".PortalContent").css({
                                "width": screenWidth + "px",
                                "overflow-x": "hidden"
                            });

                            canvasWidth = $(".htmlContent").width();
                            canvasOffset = $(".htmlContent").offset();
                            canvasOffsetTop = canvasOffset.top;
                            var left = Math.abs(parseInt((screenWidth - canvasWidth * matrix[0]) / 2, 10));

                            $(".htmlContent").css({
                                top: matrixNewTopY,
                                transform: " matrix(" + matrix[0] + "," + matrix[1] + "," + matrix[2] + "," + matrix[3] + ", 0, 0)"
                            });

                            $(".htmlContent").offset({
                                top: matrixNewTopY,
                                left: left
                            });

                        } else if (matrix[0] > minScale) {

                            canvasWidth = $(".htmlContent").width() * matrix[0];
                            screenWidth = document.documentElement.clientWidth;

                            $("#viewMessageDetail .page-main").css("overflow-x", "auto");
                            $(".PortalContent").css({
                                "overflow-y": "auto",
                                "overflow-x": "auto",
                                "top": "0px",
                                "height": screenHeight + "px",
                                "width": canvasWidth + "px"
                            });

                            if (device.platform === "iOS") {
                                $(".PortalContent").css("width", screenWidth + "px");
                            }

                            $(".htmlContent").css({
                                top: 0,
                                transform: " matrix(" + matrix[0] + "," + matrix[1] + "," + matrix[2] + "," + matrix[3] + ", 0, 0)"
                            });

                            canvasOffset = $(".htmlContent").offset();
                            canvasOffsetTop = canvasOffset.top;

                            $(".htmlContent").offset({
                                top: canvasOffsetTop,
                                left: 0
                            });

                        }

                    });

                    //Set Scroll Event
                    $(".PortalContent").on("scroll", function() {

                        var matrix = $(".htmlContent").panzoom("getMatrix");
                        var canvasHeight = $(".htmlContent").height();
                        var headerHeight = $("#viewMessageDetail .page-header").height();
                        //var portalHeaderHeight = $("#viewWebNews2-3-1 .portal-header").height();
                        var portalHeaderHeight = 0;
                        var scrollTop = $(".PortalContent").scrollTop();
                        var limitPercent = matrix[0];

                        if (device.platform === "iOS") {
                            headerHeight += iOSFixedTopPX();
                        }

                        if ((canvasHeight * matrix[0] - scrollTop) < (screenHeight * limitPercent - headerHeight - portalHeaderHeight)) {
                            $(".PortalContent").animate({
                                scrollTop: ((canvasHeight * matrix[0]) - (screenHeight * limitPercent - headerHeight - portalHeaderHeight))
                            }, 0);
                        }

                    });

                    //Prevent Link Action
                    $(".htmlContent a").on("click", function(event) {
                        event.preventDefault();
                    });
                }

            });
        }

        function checkIconCount(type) {
            var count = 0;
            $.each($('.' + type + '-content li'), function(index, item) {
                if ($(item).find('.msg-check-btn').attr('data-src') == 'checkbox_green') {
                    count++;
                }
            })
            return count;
        }

        function setMsgHeightByType() {
            var updateHeight = $('.msg-update-date').height();
            var headerHeight = $('#viewMessageList .page-header').height();

            if (messageType == 'News') {
                var contentHeight = $('.news-content').height();

            } else {
                var contentHeight = $('.event-content').height();

            }

            var totalHeight = (contentHeight + updateHeight + headerHeight).toString();
            $('.message-scroll > div').css('height', totalHeight + 'px');
        }

        function viewMessageInitila() {
            $('.dropdown-title').removeClass('opacity');
            $('.dropdown-news').show();
            $('.q-btn-header').show();
            $('.header-search').hide();
            $('#cancelEdit').hide();
            $('#cancelSearch').hide();
            $('#editListview').show();
            $('#searchListview').show();
            $('.msg-tool').hide();
        }

        //swipe to delete function
        function prevent_default(event) {
            event.preventDefault();
        }

        function disable_scroll() {
            $(document).on('touchmove', prevent_default);
        }

        function enable_scroll() {
            $(document).unbind('touchmove', prevent_default);
        }

        /********************************** page event ***********************************/
        $("#viewMessageList").on("pagebeforeshow", function(event, ui) {

        });

        $("#viewMessageList").one("pageshow", function(event, ui) {
            //filter placeholder多语言设置
            $('#msgFilter').attr('placeholder', langStr['str_080']);
        });

        $("#viewMessageList").on("pageshow", function(event, ui) {
            createMessageByType();
        });

        $("#viewMessageList").on("pagehide", function(event, ui) {

        });


        /********************************** dom event *************************************/
        //返回homepage
        $('#viewMessageList .q-btn-header').on('click', function() {
            $.mobile.changePage('#viewMain3');
        });

        //弹出message下拉菜单
        $("#viewMessageList .ui-title").on("click", function() {
            $(".select-news").slideToggle(200);
        });

        //选择message类型
        $("#viewMessageList div[data-name=msgType]").on("click", function() {
            var self = this;
            var currentType = $(self).text();

            if (currentType != messageType) {

                if (currentType == 'News') {
                    $(".news-content").show();
                    $(".event-content").hide();
                } else if (currentType == 'Event') {
                    $(".event-content").show();
                    $(".news-content").hide();
                }

                messageType = currentType;
                $(".dropdown-title").text(currentType);

                setMsgHeightByType();
            }

            $(".select-news").slideUp(200);
        });

        //编辑listview
        $('#editListview').on('click', function() {
            if ($('.select-news').css('display') == 'block') {
                $(".select-news").slideUp();
            }

            //header
            $('.dropdown-title').addClass('opacity');
            $('.dropdown-news').hide();
            $('#viewMessageList .q-btn-header').hide();
            $('#editListview').hide();
            $('#searchListview').hide();
            $('#cancelEdit').show();

            //listview
            $('.msg-next-icon').hide();
            $('.msg-check-icon').show();
            $('.msg-tool').slideDown(300);
            $('.msg-tool-blank').show(300);
            $('#viewMessageList .ui-title').off('click');
        });

        //取消编辑listview
        $('#cancelEdit').on('click', function() {
            //header
            $('.dropdown-title').removeClass('opacity');
            $('.dropdown-news').show();
            $('#viewMessageList .q-btn-header').show();
            $('#cancelEdit').hide();
            $('#editListview').show();
            $('#searchListview').show();

            //listview
            $('.msg-check-icon').hide();
            $('.msg-next-icon').show();
            $('.msg-tool').slideUp(300);
            $('.msg-tool-blank').hide(300);
            $('#viewMessageList .ui-title').on('click', function() {
                $(".select-news").slideToggle(200);
            });
        });

        //搜索listview
        $('#searchListview').on('click', function() {
            if ($('.select-news').css('display') == 'block') {
                $(".select-news").slideUp();
            }

            $('.q-btn-header').hide();
            $('.header-search').show();
            $('#editListview').hide();
            $('#searchListview').hide();
            $('#cancelSearch').show();
        });

        //取消搜索listview
        $('#cancelSearch').on('click', function() {
            $('#msgFilter').val('');
            $('#msgFilter').blur();

            $('.header-search').hide();
            $('.q-btn-header').show();
            $('#cancelSearch').hide();
            $('#editListview').show();
            $('#searchListview').show();

            $(".swipe-delete").listview('refresh');
        });

        //news编辑
        $('.news-content').on('click', '.msg-check-btn', function() {
            var $self = $(this);

            if ($self.attr('data-src') == 'checkbox') {
                $self.attr('data-src', 'checkbox_green');
                $self.attr('src', 'img/checkbox_green.png');

            } else {
                $self.attr('data-src', 'checkbox');
                $self.attr('src', 'img/checkbox.png');

            }

            if (checkIconCount('news') > 0 && !$('.news-delete-btn').hasClass('enabled-font')) {
                $('.news-delete-btn').addClass('enabled-font');
                $('.news-readed-btn').addClass('enabled-font');
            } else if (checkIconCount('news') == 0 && $('.news-delete-btn').hasClass('enabled-font')) {
                $('.news-delete-btn').removeClass('enabled-font');
                $('.news-readed-btn').removeClass('enabled-font');
            }
        });

        //event编辑
        $('.event-content').on('click', '.msg-check-btn', function() {
            var $self = $(this);

            if ($self.attr('data-src') == 'checkbox') {
                $self.attr('data-src', 'checkbox_green');
                $self.attr('src', 'img/checkbox_green.png');

            } else {
                $self.attr('data-src', 'checkbox');
                $self.attr('src', 'img/checkbox.png');

            }

            if (checkIconCount('event') > 0 && !$('.event-delete-btn').hasClass('enabled-font')) {
                $('.event-delete-btn').addClass('enabled-font');
                $('.event-readed-btn').addClass('enabled-font');
            } else if (checkIconCount('event') == 0 && $('.event-delete-btn').hasClass('enabled-font')) {
                $('.event-delete-btn').removeClass('enabled-font');
                $('.event-readed-btn').removeClass('enabled-font');
            }
        });

        //news全选
        $('.news-select-btn').on('click', function() {
            if (!newsAllChecked) {
                $('.news-content .msg-check-btn').attr('src', 'img/checkbox_green.png');
                $('.news-content .msg-check-btn').attr('data-src', 'checkbox_green');
                newsAllChecked = true;
                $('.news-delete-btn').addClass('enabled-font');
                $('.news-readed-btn').addClass('enabled-font');

            } else {
                $('.news-content .msg-check-btn').attr('src', 'img/checkbox.png');
                $('.news-content .msg-check-btn').attr('data-src', 'checkbox');
                newsAllChecked = false;
                $('.news-delete-btn').removeClass('enabled-font');
                $('.news-readed-btn').removeClass('enabled-font');

            }
        });


        //event全选
        $('.event-select-btn').on('click', function() {
            if (!eventAllChecked) {
                $('.event-content .msg-check-btn').attr('src', 'img/checkbox_green.png');
                $('.event-content .msg-check-btn').attr('data-src', 'checkbox_green');
                eventAllChecked = true;
                $('.event-delete-btn').addClass('enabled-font');
                $('.event-readed-btn').addClass('enabled-font');

            } else {
                $('.event-content .msg-check-btn').attr('src', 'img/checkbox.png');
                $('.event-content .msg-check-btn').attr('data-src', 'checkbox');
                eventAllChecked = false;
                $('.event-delete-btn').removeClass('enabled-font');
                $('.event-readed-btn').removeClass('enabled-font');

            }
        });

        //news标记已读
        $('.news-readed-btn').on('click', function() {
            if ($(this).hasClass('enabled-font')) {
                $.each($('.news-content .msg-check-btn'), function(index, item) {
                    if ($(item).attr('data-src') == 'checkbox_green' && !$(item).parent().next().hasClass('read-font-normal')) {
                        messageRowId = $(item).parents('li').attr('data-rowid');
                        updateReadDelete('news', 'read');
                    }
                })
            }
        });

        //event标记已读
        $('.event-readed-btn').on('click', function() {
            if ($(this).hasClass('enabled-font')) {
                $.each($('.event-content .msg-check-btn'), function(index, item) {
                    if ($(item).attr('data-src') == 'checkbox_green' && !$(item).parent().next().hasClass('read-font-normal')) {
                        messageRowId = $(item).parents('li').attr('data-rowid');
                        updateReadDelete('event', 'read');
                    }
                })
            }
        });

        //news标记删除
        $('.news-delete-btn').on('click', function() {
            if ($(this).hasClass('enabled-font')) {
                $('#confirmDeleteMsg').popup('open');
                $('#confirmDeleteMsg .header-title-main .header-text').text(langStr["str_039"]);
                msgType = 'news';
                deleteType = 'checkbox';
            }
        });

        //event标记删除
        $('.event-delete-btn').on('click', function() {
            if ($(this).hasClass('enabled-font')) {
                $('#confirmDeleteMsg').popup('open');
                $('#confirmDeleteMsg .header-title-main .header-text').text(langStr["str_042"]);
                msgType = 'event';
                deleteType = 'checkbox';
            }
        });

        //news swipe删除
        $('.news-content').on('click', 'a.delete-btn', function() {
            messageRowId = $(this).parents('li').attr('data-rowid');
            $('#confirmDeleteMsg').popup('open');
            $('#confirmDeleteMsg .header-title-main .header-text').text(langStr["str_039"]);
            msgType = 'news';
            deleteType = 'swipe';
        });

        //event swipe删除
        $('.event-content').on('click', 'a.delete-btn', function() {
            messageRowId = $(this).parents('li').attr('data-rowid');
            $('#confirmDeleteMsg').popup('open');
            $('#confirmDeleteMsg .header-title-main .header-text').text(langStr["str_042"]);
            msgType = 'event';
            deleteType = 'swipe';
        });

        //取消删除
        $('#viewMessageList .btn-cancel').on('click', function() {
            $('#confirmDeleteMsg').popup('close');
            if ($(this).attr('id') != 'confirmDeleteBtn') {
                $('.news-content .swipe-delete li[data-rowid="' + messageRowId + '"] > a').animate({ left: '0px' }, 200);
            }
        });

        //确定删除：分为swipe（单个）删除和checkbox（群体）删除
        $('#confirmDeleteBtn').on('click', function() {

            if (deleteType == 'swipe') {

                updateReadDelete(msgType, 'delete');

            } else if (deleteType == 'checkbox') {

                $.each($('.' + msgType + '-content .msg-check-btn'), function(index, item) {
                    if ($(item).attr('data-src') == 'checkbox_green') {
                        messageRowId = $(item).parents('li').attr('data-rowid');
                        updateReadDelete(msgType, 'delete');
                    }
                })
            }
        });


    }
});