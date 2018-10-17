$("#viewMessageList").pagecontainer({
    create: function(event, ui) {

        var messageType = "news",
            allChecked = false,
            deleteType,
            msgUpdateDate,
            messageExist = true;

        //获取portal
        function QueryPortalList(type) {
            (function(type) {

                //type: Announcement, Communication, CIP, CSD, ITS
                var queryData = "<LayoutHeader><PortalCategory>" + type + "</PortalCategory></LayoutHeader>";

                var successCallback = function(data) {

                    if (data["ResultCode"] === "1") {
                        //save to local data
                        window.localStorage.removeItem(queryData);
                        var jsonData = {};
                        jsonData = {
                            lastUpdateTime: new Date(),
                            content: data['Content']
                        };
                        window.localStorage.setItem(queryData, JSON.stringify(jsonData));

                        //record APP all data
                        var responsecontent = jsonData['content'];
                        //console.log(responsecontent);
                        createPortalByType(responsecontent, type.toLowerCase());

                    } else {
                        createPortalByType([], type.toLowerCase());
                    }

                    loadingMask("hide");
                };

                var failCallback = function(data) {
                    loadingMask("hide");
                };

                //review by alan
                var localdata = window.localStorage.getItem(queryData);
                var QueryData = null;
                if (localdata == null) {
                    QueryData = null;
                } else {
                    QueryData = JSON.parse(localdata);
                }
                if (QueryData === null || checkDataExpired(QueryData['lastUpdateTime'], 30, 'mm')) {
                    loadingMask("show");
                    CustomAPI("POST", true, "PortalList", successCallback, failCallback, queryData, "");
                } else {
                    var responsecontent = QueryData['content'];
                    //console.log(responsecontent);
                    createPortalByType(responsecontent, type.toLowerCase());
                }

            }(type));
        };

        //创建portal list
        function createPortalByType(arr, type) {
            if (arr.length > 0) {
                //1. content
                var content = '';
                for (var i in arr) {
                    content += '<li data-icon="false" data-rowid="' + arr[i].PortalID +
                        '"><div class="behind"><a href="#" class="ui-btn delete-btn"><img src="img/delete.png" class="msg-delete-btn"></a></div><a href="#" class="ui-portal ui-btn">' +
                        '<div class="msg-check-icon"><img src="img/checkbox.png" data-src="checkbox" class="msg-check-btn"></div><div class="msg-content-title read-font-normal"><div>' +
                        arr[i].PortalDate.replaceAll('/', '-') + '</div><div>' +
                        arr[i].PortalSubject + '</div><div style="display:none"><input type="hidden" value="' +
                        arr[i].PortalURL + '"></div></div><div class="msg-next-icon"><img src="img/nextpage.png" class="msg-next-btn"></div></a></li>';
                }

                $("." + type + "-content ul").html('').append(content);

                //2. detail
                $('a.ui-portal').on("click", function(e) {
                    e.stopImmediatePropagation();
                    e.preventDefault();

                    if (messageType != "Event" && messageType != "News") {
                        messageFrom = 'viewMessageList';
                        portalURL = $(this).find("input").val();
                        //console.log(portalURL)
                        checkWidgetPage('viewWebNews2-3-1', pageVisitedList);
                    }
                });

                //3. update date
                var portalUpdateDate = arr[0].PortalDate;
                $('.msg-update-date').text(langStr['str_079'] + portalUpdateDate);

                //4. set height
                setMsgHeightByType(messageType);

            } else {
                //无消息情况
                $("#noMessage").fadeIn(100).delay(2000).fadeOut(100);
                $('.msg-update-date').text(langStr['str_079'] + getTodayStr('/'));
                setMsgHeightByType(messageType);
            }

        }

        function getTodayStr(str) {
            var now = new Date();
            var year = now.getFullYear().toString();
            var month = now.getMonth() + 1 < 10 ? '0' + (now.getMonth() + 1).toString() : (now.getMonth() + 1).toString();
            var day = now.getDate() < 10 ? '0' + now.getDate().toString() : now.getDate().toString();
            var today = year + str + month + str + day;
            return today;
        }

        function checkPortalByFunctionList() {
            if (window.localStorage.getItem('FunctionData') !== null) {
                var function_list = JSON.parse(window.localStorage.getItem('FunctionData'))['function_list'];
                for (var i in function_list) {
                    //1. 先找到News
                    if (function_list[i].function_variable == 'News') {
                        //2. 再检查是否可用
                        if (function_list[i].function_content.right == 'Y') {
                            $('div[data-item="announcement"]').show();
                            $('div[data-item="communication"]').show();
                            $('div[data-item="cip"]').show();
                            $('div[data-item="csd"]').show();
                            $('div[data-item="its"]').show();
                        } else {
                            $('div[data-item="announcement"]').hide();
                            $('div[data-item="communication"]').hide();
                            $('div[data-item="cip"]').hide();
                            $('div[data-item="csd"]').hide();
                            $('div[data-item="its"]').hide();
                        }
                        break;
                    }
                }
            } else {
                $('div[data-item="announcement"]').hide();
                $('div[data-item="communication"]').hide();
                $('div[data-item="cip"]').hide();
                $('div[data-item="csd"]').hide();
                $('div[data-item="its"]').hide();
            }
        }

        //根据不同类型显示不同消息
        function showDiffMessageByType(type) {
            $.each($('.message-type > div'), function(index, item) {
                if ($(item).attr('class') == type + '-content') {
                    $(item).show();
                } else {
                    $(item).hide();
                }
            });
        }


        //根据message数据，动态生成html
        function createMessageByType() {
            //1. html
            //var resultArr = loginData['messagecontent']['message_list'];
            var messagecontent_ = JSON.parse(window.localStorage.getItem('messagecontentEx'));
            var resultArr = null;
            if (messagecontent_ != null)
                resultArr = messagecontent_.content.message_list;
            //console.log(resultArr);

            var newsContent = '';
            var eventContent = '';
            for (var i in resultArr) {
                if (resultArr[i]['message_type'] == 'event' && resultArr[i].read != 'D') {
                    eventContent += '<li data-icon="false" data-rowid="' + resultArr[i].message_send_row_id +
                        '"><div class="behind"><a href="#" class="ui-btn delete-btn"><img src="img/delete.png" class="msg-delete-btn"></a></div><a href="#" class="ui-message ui-btn">' +
                        '<div class="msg-check-icon"><img src="img/checkbox.png" data-src="checkbox" class="msg-check-btn"></div><div class="msg-content-title' +
                        (resultArr[i].read == "Y" ? " read-font-normal" : "") + '"><div>' +
                        resultArr[i].create_time.split(' ')[0] + '</div><div>' +
                        resultArr[i].message_title + '</div></div><div class="msg-next-icon"><img src="img/nextpage.png" class="msg-next-btn"></div></a></li>';

                } else if (resultArr[i]['message_type'] == 'news' && resultArr[i].read != 'D') {
                    newsContent += '<li data-icon="false" data-rowid="' + resultArr[i].message_send_row_id +
                        '"><div class="behind"><a href="#" class="ui-btn delete-btn"><img src="img/delete.png" class="msg-delete-btn"></a></div><a href="#" class="ui-message ui-btn">' +
                        '<div class="msg-check-icon"><img src="img/checkbox.png" data-src="checkbox" class="msg-check-btn"></div><div class="msg-content-title' +
                        (resultArr[i].read == "Y" ? " read-font-normal" : "") + '"><div>' +
                        resultArr[i].create_time.split(' ')[0] + '</div><div>' +
                        resultArr[i].message_title + '</div></div><div class="msg-next-icon"><img src="img/nextpage.png" class="msg-next-btn"></div></a></li>';
                }
            }

            $(".news-content ul").html('').append(newsContent);
            $(".event-content ul").html('').append(eventContent);

            //2. no data
            if (newsContent == '') {
                $("#noMessage").fadeIn(100).delay(2000).fadeOut(100);
            }

            //3. swipe
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
                    if (change < -50) disable_scroll() // disable scroll once we hit 10px horizontal slide
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
                        new_left = '0px';
                    }

                    // event.currentTarget.style.left = new_left
                    $(event.currentTarget).animate({ left: new_left }, 200)
                    enable_scroll()
                });

            //4. fixed top
            var msgHeaderTop = parseInt(document.documentElement.clientWidth * 13 / 100, 10);
            if (device.platform == 'iOS') {
                msgHeaderTop += iOSFixedTopPX();
            }
            $('.select-type').css('top', msgHeaderTop + 'px');
            $('.handle-msg').css('top', msgHeaderTop + 'px');

            //5. message update
            if (resultArr.length > 0) {
                msgUpdateDate = resultArr[0].create_time.split(' ')[0].replaceAll('-', '/');
            } else {
                var msgDate = parseInt(localStorage.getItem('msgDateFrom')) * 1000;
                msgUpdateDate = new Date(msgDate).toLocaleDateString(browserLanguage);
            }
            $('.msg-update-date').text(langStr['str_079'] + msgUpdateDate);

            //6. set height
            setMsgHeightByType(messageType);
        }

        //跳转详情事件
        function changeToDetail($target) {
            messageFrom = 'viewMessageList';
            messageRowId = $target.parents('li').attr('data-rowid');
            checkWidgetPage('viewWebNews2-3-1', pageVisitedList);
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
                    updateListReadDelete(content.message_type, "read", messageRowId);

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

                    checkWidgetPage("#viewWebNews2-3-1", pageVisitedList);

                } else if (resultcode === "000910") {
                    //Message was be deleted in server
                    messageExist = false;
                    updateListReadDelete("all", "delete", messageRowId);
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

        function updateListReadDelete(type, status, messageRowId_) {
            var self = this;

            var queryStr = "&message_send_row_id=" + messageRowId_ + "&message_type=" + type + "&status=" + status;

            this.successCallback = function(data) {
                //console.log(data);
                var doUpdateLocalStorage = false;

                messagecontent_ = JSON.parse(window.localStorage.getItem('messagecontentEx'));
                messagecontent = messagecontent_.content;

                if (type === "event") {
                    var resultcode = data.result_code;

                    if (resultcode === 1) {
                        doUpdateLocalStorage = true;
                    } else if (resultcode === "000910") {
                        //message not exist
                        doUpdateLocalStorage = true;
                    }
                } else if (type === "news") {
                    doUpdateLocalStorage = true;
                } else if (type === "all") {
                    doUpdateLocalStorage = true;
                }

                //Update [read / delete] status in Local Storage
                if (doUpdateLocalStorage) {

                    //Single / Multiple message update check
                    var singleMessage = true;
                    var i, j;

                    messageRowId_ = messageRowId_.toString();

                    if (messageRowId_.indexOf(",") !== -1) {
                        singleMessage = false;
                    }

                    if (singleMessage) {
                        if (messageArrIndex === null) {
                            for (i = 0; i < messagecontent.message_list.length; i++) {
                                if (messagecontent.message_list[i].message_send_row_id.toString() === messageRowId_) {
                                    messageArrIndex = i;
                                    break;
                                }
                            }
                        }

                        if (messageArrIndex !== null) {
                            if (status === "read") {
                                messagecontent.message_list[messageArrIndex].read = "Y";
                            } else if (status === "delete") {
                                messagecontent.message_list[messageArrIndex].read = "D";
                            }
                        }
                    } else {
                        var messageRowIdArr = messageRowId_.split(",");

                        for (i = 0; i < messageRowIdArr.length; i++) {

                            for (j = 0; j < messagecontent.message_list.length; j++) {
                                if (messagecontent.message_list[j].message_send_row_id.toString() === messageRowIdArr[i]) {
                                    messageArrIndex = j;
                                }
                            }

                            if (messageArrIndex !== null) {
                                if (status === "read") {
                                    messagecontent.message_list[messageArrIndex].read = "Y";
                                } else if (status === "delete") {
                                    messagecontent.message_list[messageArrIndex].read = "D";
                                }
                            }
                        }
                    }

                    UpdateMessageListContent(messagecontent,false);//from component/function

                    loginData.messagecontent = messagecontent;
                    messageArrIndex = null;

                    updateMessageListUI(type, status, messageRowId_);

                }
            };

            this.failCallback = function(data) {};

            var __construct = function() {

                //[event] need to update [read / delete] status both in Server / Local Storage
                //[news] just update [read / delete] in Local Storage
                if (type === "event") {
                    QPlayAPI("GET", "updateMessage", self.successCallback, self.failCallback, null, queryStr);
                } else if (type === "news") {
                    this.successCallback();
                } else if (type === "all") {
                    this.successCallback();
                }
            }();
        };

        function updateMessageListUI(type, status, messageRowId_) {
            if (status == 'delete') {
                $('.' + type + '-content li[data-rowid=' + messageRowId_ + ']').remove();
            } else if(status == 'read') {
                $('.' + type + '-content li[data-rowid=' + messageRowId_ + ']').find('.msg-content-title').addClass('read-font-normal');
            }

            var count = checkIconCount(type);
            if(count == 0) {
                $('.msg-delete').removeClass('enabled-font');
                $('.msg-readed').removeClass('enabled-font');
            }
        }

        //记录已选消息数量
        function checkIconCount(type) {
            var count = 0;
            $.each($('.' + type + '-content li'), function(index, item) {
                if ($(item).find('.msg-check-btn').attr('data-src') == 'checkbox_green') {
                    count++;
                }
            })
            return count;
        }

        //设置messageList高度
        function setMsgHeightByType(type) {
            var headHeight = $('#viewMessageList .page-header').height();
            var footHeight = $('.msg-update-date').height();
            var fixHeight = $('.fill-handle-blank').height();
            var contentHeight = $('.' + type + '-content').height();

            var totalHeight;
            if (device.platform === "iOS") {
                totalHeight = (contentHeight + headHeight + footHeight + fixHeight + iOSFixedTopPX()).toString();
            } else {
                totalHeight = (contentHeight + headHeight + footHeight + fixHeight).toString();
            }

            $('.message-scroll > div').css('height', totalHeight + 'px');
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
            //createMessageByType();
        });

        $("#viewMessageList").one("pageshow", function(event, ui) {
            //filter placeholder
            $('#msgFilter').attr('placeholder', langStr['str_080']);
            //check can not use portal 
            checkPortalByFunctionList();
            //content
            createMessageByType();
        });

        $("#viewMessageList").on("pageshow", function(event, ui) {
            
        });

        $("#viewMessageList").on("pagehide", function(event, ui) {

        });


        /********************************** dom event *************************************/
        //弹出message下拉菜单
        $("#viewMessageList .ui-title").on("click", function() {
            $(".select-type").slideToggle(200);
        });

        //选择message类型
        $(".select-type > div").on("click", function() {
            var self = this;
            var currentType = $(self).text();
            var lowerCase = $(self).attr('data-item');

            if (lowerCase != messageType) {
                //save type
                messageType = lowerCase;
                //change title
                $(".dropdown-title").text(currentType);

                if (messageType == 'news' || messageType == 'event') {
                    //news和event可以已读或删除
                    $('#editListview').show();
                    showDiffMessageByType(messageType);
                    //news已经有数据了，高度重设
                    setMsgHeightByType(messageType);
                    //change update date
                    $('.msg-update-date').text(langStr['str_079'] + msgUpdateDate);

                } else {
                    //portal不用编辑
                    $('#editListview').hide();
                    showDiffMessageByType(messageType);
                    QueryPortalList(currentType);

                }

            }

            $(".select-type").slideUp(200);
        });

        //编辑listview
        $('#editListview').on('click', function() {
            if ($('.select-type').css('display') == 'block') {
                $('.select-type').slideUp();
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
            $('.handle-msg').show();
            $('.fill-handle-blank').show();
            $('#viewMessageList .ui-title').off('click');
            $(document).off('click', 'a.ui-message .msg-content-title,a.ui-message .msg-next-icon');

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
            $('.handle-msg').hide();
            $('.fill-handle-blank').hide();
            $('#viewMessageList .ui-title').on('click', function() {
                $(".select-type").slideToggle(200);
            });
            $(document).on('click', 'a.ui-message .msg-content-title,a.ui-message .msg-next-icon', function() {
                changeToDetail($(this));
            });

            //已选全部变为未选
            $.each($('.msg-check-btn'), function(index, item) {
                if ($(item).attr('data-src') == 'checkbox_green') {
                    $(item).attr('data-src', 'checkbox');
                    $(item).attr('src', 'img/checkbox.png');
                }
            });
            allChecked = false;

            //删除和已读不可用
            $('.msg-delete').removeClass('enabled-font');
            $('.msg-readed').removeClass('enabled-font');
        });

        //搜索listview
        $('#searchListview').on('click', function() {
            if ($('.select-type').css('display') == 'block') {
                $('.select-type').slideUp();
            }

            $('#viewMessageList .q-btn-header').hide();
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
            $('#viewMessageList .q-btn-header').show();
            $('#cancelSearch').hide();
            if (messageType == 'news' || messageType == 'event') {
                $('#editListview').show();
            }
            $('#searchListview').show();

            $('.message-type ul').listview('refresh');
            setMsgHeightByType(messageType);
        });

        //编辑
        $('.message-scroll').on('click', '.msg-check-btn', function() {
            var $self = $(this);

            if ($self.attr('data-src') == 'checkbox') {
                $self.attr('data-src', 'checkbox_green');
                $self.attr('src', 'img/checkbox_green.png');

            } else {
                $self.attr('data-src', 'checkbox');
                $self.attr('src', 'img/checkbox.png');

            }

            if (checkIconCount(messageType) > 0) {
                $('.msg-delete').addClass('enabled-font');
                $('.msg-readed').addClass('enabled-font');

            } else {
                $('.msg-delete').removeClass('enabled-font');
                $('.msg-readed').removeClass('enabled-font');

            }
        });

        //全选
        $('.msg-select span').on('click', function() {
            if (!allChecked) {
                $('.' + messageType + '-content .msg-check-btn').attr('src', 'img/checkbox_green.png');
                $('.' + messageType + '-content .msg-check-btn').attr('data-src', 'checkbox_green');
                allChecked = true;
                $('.msg-delete').addClass('enabled-font');
                $('.msg-readed').addClass('enabled-font');

            } else {
                $('.' + messageType + '-content .msg-check-btn').attr('src', 'img/checkbox.png');
                $('.' + messageType + '-content .msg-check-btn').attr('data-src', 'checkbox');
                allChecked = false;
                $('.msg-delete').removeClass('enabled-font');
                $('.msg-readed').removeClass('enabled-font');

            }
        });

        //标记已读
        $('.msg-readed span').on('click', function() {
            var has = $(this).parent().hasClass('enabled-font');
            if (has) {
                $.each($('.' + messageType + '-content .msg-check-btn'), function(index, item) {
                    var src = $(item).attr('data-src');
                    var readed = $(item).parent().next().hasClass('read-font-normal');

                    if (src == 'checkbox_green' && !readed) {
                        messageRowId = $(item).parents('li').attr('data-rowid');
                        updateListReadDelete(messageType, 'read', messageRowId);
                    }
                })
            }
        });

        //标记删除
        $('.msg-delete span').on('click', function() {
            var has = $(this).parent().hasClass('enabled-font');
            if (has) {
                $('#confirmDeleteMsg').popup('open');
                $('#confirmDeleteMsg .header-title-main .header-text').text(messageType == 'news' ? langStr["str_039"] : langStr["str_042"]);
                deleteType = 'checkbox';
            }
        });

        //左滑删除
        $('.swipe-delete').on('click', 'a.delete-btn', function() {
            messageRowId = $(this).parents('li').attr('data-rowid');
            $('#confirmDeleteMsg').popup('open');
            $('#confirmDeleteMsg .header-title-main .header-text').text(messageType == 'news' ? langStr["str_039"] : langStr["str_042"]);
            deleteType = 'swipe';
        });

        //取消删除
        $('#viewMessageList .btn-cancel').on('click', function() {
            $('#confirmDeleteMsg').popup('close');
            if ($(this).attr('id') != 'confirmDeleteBtn') {
                $('.swipe-delete li[data-rowid="' + messageRowId + '"] > a').animate({ left: '0px' }, 200);
            }
        });

        //确定删除：分为swipe（单个）删除和checkbox（群体）删除
        $('#confirmDeleteBtn').on('click', function() {

            if (deleteType == 'swipe') {

                updateListReadDelete(messageType, 'delete', messageRowId);

            } else if (deleteType == 'checkbox') {

                $.each($('.' + messageType + '-content .msg-check-btn'), function(index, item) {
                    if ($(item).attr('data-src') == 'checkbox_green') {
                        messageRowId = $(item).parents('li').attr('data-rowid');
                        updateListReadDelete(messageType, 'delete', messageRowId);
                    }
                })

            }

            //after delete, set height
            setMsgHeightByType(messageType);

            //after delete，refresh message widget
            //$('.messageWidget').message('refresh');
            var evalString = '$(".messageWidget").message("refresh");';
            window.sessionStorage.setItem('needRefreshWidget', evalString);
            window.sessionStorage.setItem('updateHomePageHeight', 'Y');
        });

        //跳转详情
        $(document).on('click', 'a.ui-message .msg-content-title,a.ui-message .msg-next-icon', function() {
            changeToDetail($(this));
        });


    }
});