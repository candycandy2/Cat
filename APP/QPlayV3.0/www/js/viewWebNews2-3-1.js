function cleanHTML(input) {
    // 1. remove line breaks / Mso classes
    var stringStripper = /(\n|\r| class=(")?Mso[a-zA-Z]+(")?)/g;
    var outputstringStripper = input.replace(stringStripper, ' ');
    // 2. strip Word generated HTML comments
    var commentSripper = new RegExp('<!--(.*?)-->', 'g');
    var output = outputstringStripper.replace(commentSripper, '');
    var tagStripper = new RegExp('<(/)*(meta|link|span|table|tbody|td|tr|body|div|strong|\\?xml:|st1:|o:)(.*?)>', 'gi');
    // 3. remove tags leave content if any
    output = output.replace(tagStripper, '');
    // 4. Remove everything in between and including tags '<style(.)style(.)>'
    var badTags = ['style', 'script', 'applet', 'embed', 'noframes', 'noscript'];

    for (var i = 0; i < badTags.length; i++) {
        tagStripper = new RegExp('<' + badTags[i] + '.*?' + badTags[i] + '(.*?)>', 'gi');
        output = output.replace(tagStripper, '');
    }
    // 5. remove attributes ' style="..."'
    var badAttributes = ['style', 'start'];
    for (i = 0; i < badAttributes.length; i++) {
        var attributeStripper = new RegExp(' ' + badAttributes[i] + '="(.*?)"', 'gi');
        output = output.replace(attributeStripper, '');
    }
    return output;
}

$("#viewWebNews2-3-1").pagecontainer({
    create: function(event, ui) {

        var messageExist = true;
        window.canvasChangeTop = false;

        /********************************** function *************************************/
        function renderCanvas(content) {

            $("#viewWebNews2-3-1 .portal-header").hide();

            $("#htmlContent").css({
                top: 0,
                left: 0
            });

            $("#htmlContent").html(content).promise().done(function() {

                var screenWidth = document.documentElement.clientWidth;
                var $images = $('#htmlContent img');
                var loaded_images_count = 0;
                var loaded_finish = false;

                if ($images.length > 0) {
                    $images.load(function() {

                        loaded_images_count++;

                        if (loaded_images_count == $images.length) {
                            if ($("#htmlContent")[0].scrollWidth < screenWidth) {
                                $("#htmlContent").css("width", (screenWidth) + "px");
                            }

                            loaded_finish = true;
                            $("#messageLoadErrorPopup").popup("close");
                            $("#viewWebNews2-3-1").css("min-height", document.documentElement.clientHeight + "px");

                            setTimeout(function() {
                                doPanZoom();
                            }, 500);
                        }

                    });

                    setTimeout(function() {
                        if (!loaded_finish) {
                            $("#messageLoadErrorPopup").popup("open");
                            $("#viewWebNews2-3-1").css("min-height", document.documentElement.clientHeight + "px");
                        }
                    }, 3000);
                } else {
                    if ($("#htmlContent")[0].scrollWidth < screenWidth) {
                        $("#htmlContent").css("width", (screenWidth) + "px");
                    }

                    // setTimeout(function() {
                    //     doPanZoom();
                    // }, 500);
                }

                function doPanZoom() {

                    window.minScale = parseInt(document.documentElement.clientWidth * 100 / $("#htmlContent")[0].scrollWidth * 0.9, 10) / 100;
                    var marginLeft = parseInt(document.documentElement.clientWidth * 10 / 100, 10);

                    //Resize HtmlContent
                    $("#htmlContent").css("width", $("#htmlContent")[0].scrollWidth + "px");
                    $("#htmlContent").css("height", $("#htmlContent")[0].scrollHeight + "px");

                    //Remove Listener Event
                    $("#PortalContent").off("scroll");
                    $("#htmlContent").off("panzoomstart");
                    $("#htmlContent").off("panzoomzoom");
                    $("#htmlContent").off("panzoomend");

                    //Panzoom Initial
                    $("#htmlContent").panzoom();
                    $("#htmlContent").panzoom("option", {
                        minScale: minScale
                    });

                    $("#htmlContent").panzoom("zoom", minScale, { silent: true });

                    //Resize PortalContent
                    var screenHeight = document.documentElement.clientHeight;
                    var screenWidth = document.documentElement.clientWidth;
                    $("#PortalContent").css("overflow-y", "auto");
                    $("#PortalContent").css("overflow-x", "hidden");
                    $("#viewWebNews2-3-1 .page-main").css("overflow-x", "auto");
                    $("#PortalContent").css("top", "0px");
                    var portalHeaderHeight = $("#viewWebNews2-3-1 .portal-header").height() + 5;

                    if (device.platform === "iOS") {
                        portalHeaderHeight += iOSFixedTopPX();
                    }

                    $("#PortalContent").css("padding-top", "0px");
                    var matrixNewTopY = parseInt(portalHeaderHeight, 10);

                    $("#PortalContent").css("height", screenHeight + "px");
                    $("#PortalContent").css("width", screenWidth + "px");

                    //Reset matrix of canvas
                    var canvasHeight = $("#htmlContent").height();
                    var canvasWidth = $("#htmlContent").width();
                    var matrix = $("#htmlContent").panzoom("getMatrix");
                    var matrixLeftX = document.documentElement.clientWidth - $("#htmlContent").width();
                    var matrixNewLeftX = Math.abs(parseInt((screenWidth - canvasWidth * matrix[0]) / 2, 10));

                    $("#htmlContent").css({
                        transform: " matrix(" + matrix[0] + "," + matrix[1] + "," + matrix[2] + "," + matrix[3] + "," + matrixNewLeftX + "," + matrixNewTopY + ")"
                    });

                    $("#htmlContent").offset({
                        left: matrixNewLeftX,
                        top: matrixNewTopY
                    });

                    loadingMask("hide");

                    //panzoom start event
                    $("#htmlContent").on("panzoomstart", function(e, panzoom, matrix, changed) {
                        var canvasWidth = $("#htmlContent").width() * matrix[0];
                        var screenWidth = document.documentElement.clientWidth;

                        $("#viewWebNews2-3-1 .page-main").css("overflow-x", "auto");
                        $("#PortalContent").css({
                            "overflow-y": "auto",
                            "overflow-x": "auto",
                            "top": "0px",
                            "height": screenHeight + "px",
                            "width": canvasWidth + "px"
                        });

                        if (device.platform === "iOS") {
                            $("#PortalContent").css("width", screenWidth + "px");
                        }
                    });

                    //panzoom start zoom
                    $("#htmlContent").on("panzoomzoom", function(e, panzoom, scale, opts) {
                        $("#htmlContent").panzoom("option", {
                            disablePan: true
                        });

                        var matrix = $("#htmlContent").panzoom("getMatrix");
                        var canvasWidth = $("#htmlContent").width() * matrix[0];

                        $("#viewWebNews2-3-1 .page-main").css("overflow-x", "auto");
                        $("#PortalContent").css({
                            "overflow-y": "auto",
                            "overflow-x": "auto",
                            "top": "0px",
                            "height": screenHeight + "px",
                            "width": canvasWidth + "px"
                        });

                        $("#htmlContent").css({
                            transform: " matrix(" + scale + "," + matrix[1] + "," + matrix[2] + "," + scale + ", 0, " + matrix[5] + ")"
                        });
                    });

                    //panzoom end event
                    $("#htmlContent").on("panzoomend", function(e, panzoom, matrix, changed) {

                        var canvasWidth;
                        var screenWidth;
                        var canvasOffsetTop;

                        matrix = $("#htmlContent").panzoom("getMatrix");

                        if (matrix[0] == minScale) {

                            screenWidth = document.documentElement.clientWidth;
                            $("#PortalContent").css({
                                "width": screenWidth + "px",
                                "overflow-x": "hidden"
                            });

                            canvasWidth = $("#htmlContent").width();
                            canvasOffset = $("#htmlContent").offset();
                            canvasOffsetTop = canvasOffset.top;
                            var left = Math.abs(parseInt((screenWidth - canvasWidth * matrix[0]) / 2, 10));

                            $("#htmlContent").css({
                                top: matrixNewTopY,
                                transform: " matrix(" + matrix[0] + "," + matrix[1] + "," + matrix[2] + "," + matrix[3] + ", 0, 0)"
                            });

                            $("#htmlContent").offset({
                                top: matrixNewTopY,
                                left: left
                            });

                        } else if (matrix[0] > minScale) {

                            canvasWidth = $("#htmlContent").width() * matrix[0];
                            screenWidth = document.documentElement.clientWidth;

                            $("#viewWebNews2-3-1 .page-main").css("overflow-x", "auto");
                            $("#PortalContent").css({
                                "overflow-y": "auto",
                                "overflow-x": "auto",
                                "top": "0px",
                                "height": screenHeight + "px",
                                "width": canvasWidth + "px"
                            });

                            if (device.platform === "iOS") {
                                $("#PortalContent").css("width", screenWidth + "px");
                            }

                            $("#htmlContent").css({
                                top: 0,
                                transform: " matrix(" + matrix[0] + "," + matrix[1] + "," + matrix[2] + "," + matrix[3] + ", 0, 0)"
                            });

                            canvasOffset = $("#htmlContent").offset();
                            canvasOffsetTop = canvasOffset.top;

                            $("#htmlContent").offset({
                                top: canvasOffsetTop,
                                left: 0
                            });

                        }

                    });

                    //Set Scroll Event
                    $("#PortalContent").on("scroll", function() {

                        var matrix = $("#htmlContent").panzoom("getMatrix");
                        var canvasHeight = $("#htmlContent").height();
                        var headerHeight = $("#viewWebNews2-3-1 .page-header").height();
                        var portalHeaderHeight = $("#viewWebNews2-3-1 .portal-header").height();
                        var scrollTop = $("#PortalContent").scrollTop();
                        var limitPercent = matrix[0];

                        if (device.platform === "iOS") {
                            headerHeight += iOSFixedTopPX();
                        }

                        if ((canvasHeight * matrix[0] - scrollTop) < (screenHeight * limitPercent - headerHeight - portalHeaderHeight)) {
                            $("#PortalContent").animate({
                                scrollTop: ((canvasHeight * matrix[0]) - (screenHeight * limitPercent - headerHeight - portalHeaderHeight))
                            }, 0);
                        }

                    });

                    //Prevent Link Action
                    $("#htmlContent a").on("click", function(event) {
                        event.preventDefault();
                    });
                }

            });
        }

        function QueryPortalListDetail(varURL) {
            (function() {

                $("#htmlContent").load(varURL, function() {
                    $("#htmlContent").find("meta").remove();
                    $("#htmlContent").find("title").remove();
                    $("#htmlContent").find("base").remove();

                    renderCanvas($("#htmlContent").html());

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

        function QueryMessageDetail() {
            var self = this;

            var queryStr = "&message_send_row_id=" + messageRowId;

            this.successCallback = function(data) {
                console.log(data);
                var resultcode = data.result_code;
                var content = data.content;

                function NoticeTypeShow(template_id) {
                    for (var i = 0; i <= 17; i++) {
                        $("#notice" + i).hide();
                    }
                    if (template_id <= 10) {
                        $("#notice" + template_id).show().addClass("notice-priority-normal");
                    } else if (template_id >= 11) {
                        $("#notice" + template_id).show().addClass("notice-priority-high");
                    }
                }

                if (resultcode === 1) {

                    messageExist = true;
                    updateReadDelete(content.message_type, "read");

                    //If template_id == 999, it's Portal Event,
                    //need to be render become canvas
                    if (content.template_id === 999) {
                        //review by alan
                        //loadingMask("show");

                        $("#ITSEventNewContent").hide();
                        $("#PortalContent").show();
                        $(".footer-news").hide();
                        $(".footer-portal").show();

                        $("#viewWebNews2-3-1 .page-main").css("opacity", 1);
                        //review by alan
                        portalURL = content.message_text;

                        $("#htmlContent").html("");
                        $("#htmlContent").css({
                            "width": 0,
                            "height": 0
                        });

                        QueryPortalListDetail(portalURL);
                    } else {
                        if (content.message_type === "news") {

                            $(".news-header").removeClass("header-event");
                            $(".news-header").removeClass("header-event-red");
                            $(".news-header").removeClass("header-service");
                            $(".news-header").removeClass("header-service-red");
                            NoticeTypeShow(content.template_id);
                            if (content.template_id <= 10) {

                                $(".news-header").addClass("header-service");
                                $(".priority-high").hide();
                                $(".priority-normal").show();

                            } else if (content.template_id >= 11) {

                                $(".news-header").addClass("header-service-red");
                                $(".priority-high").show();
                                $(".priority-normal").hide();
                            }

                        } else if (content.message_type === "event") {

                            $(".news-header").removeClass("header-service");
                            $(".news-header").removeClass("header-service-red");
                            $(".news-header").removeClass("header-event");
                            $(".news-header").removeClass("header-event-red");
                            NoticeTypeShow(content.template_id);
                            if (content.template_id <= 10) {

                                $(".news-header").addClass("header-event");
                                $(".priority-high").hide();
                                $(".priority-normal").show();

                            } else if (content.template_id >= 11) {

                                $(".news-header").addClass("header-event-red");
                                $(".priority-high").show();
                                $(".priority-normal").hide();
                            }

                        }

                        $("#newsDetailCreateTime").html(content.create_time.substr(0, 10));
                        $("#newsDetailTitle").html(content.message_title);
                        $("#newsAuthor").html(content.create_user);

                        $("#eventNewsContent").html(cleanHTML(content.message_text));
                        $("#viewWebNews2-3-1 .page-main").css("opacity", 1);
                    }

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

        window.updateReadDelete = function(type, status) {
            var self = this;

            var queryStr = "&message_send_row_id=" + messageRowId + "&message_type=" + type + "&status=" + status;

            this.successCallback = function(data) {
                console.log(data);
                var doUpdateLocalStorage = false;

                messagecontent_ = JSON.parse(window.localStorage.getItem("messagecontent"));
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

                    messageRowId = messageRowId.toString();

                    if (messageRowId.indexOf(",") !== -1) {
                        singleMessage = false;
                    }

                    if (singleMessage) {
                        if (messageArrIndex === null) {
                            for (i = 0; i < messagecontent.message_list.length; i++) {
                                if (messagecontent.message_list[i].message_send_row_id.toString() === messageRowId) {
                                    messageArrIndex = i;
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
                        var messageRowIdArr = messageRowId.split(",");

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

                    UpdateMessageListContent(messagecontent);

                    loginData.messagecontent = messagecontent;
                    messageArrIndex = null;

                    updateMessageList("closePopup");
                    //如果是read，只需添加普通字体的样式；如果是delete，需要删除对应元素
                    if (status == 'read') {
                        updateNewMessageList(type);
                        cordova.plugins.notification.badge.decrease(1, function(badge) {
                            // badge is now 9 (11 - 2)
                        });
                    } else if (status == 'delete') {
                        updateNewMessageList(type, status);
                    }

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

        function updateNewMessageList(type, status) {
            status = status || null;
            if (status != null) {
                $('.' + type + '-content li[data-rowid=' + messageRowId + ']').remove();
            } else {
                $('.' + type + '-content li[data-rowid=' + messageRowId + ']').find('.msg-content-title').addClass('read-font-normal');
            }
        }


        /********************************** page event *************************************/
        $("#viewWebNews2-3-1").one("pagebeforeshow", function(event, ui) {
            //Message Load Error Popup
            var messageLoadErrorPopupData = {
                id: "messageLoadErrorPopup",
                content: $("template#tplMessageLoadErrorPopup").html()
            };

            tplJS.Popup("viewWebNews2-3-1", "viewWebNews2-3-1Content", "append", messageLoadErrorPopupData);
        });

        $("#viewWebNews2-3-1").on("pagebeforeshow", function(event, ui) {
            if (eventType === "Event" || eventType === "News" || portalURL == "") {
                $("#ITSEventNewContent").show();
                $("#PortalContent").hide();
                $(".footer-news").show();
                $(".footer-portal").hide();

                $("#viewWebNews2-3-1 .page-main").css("opacity", 0);
                var messageDetail = new QueryMessageDetail();
            } else {
                //review by alan
                //for speed up
                //loadingMask("show");

                $("#ITSEventNewContent").hide();
                $("#PortalContent").show();
                $(".footer-news").hide();
                $(".footer-portal").show();

                $("#htmlContent").html("");
                $("#htmlContent").css({
                    "width": 0,
                    "height": 0
                });

                QueryPortalListDetail(portalURL);
            }

            if (device.platform === "iOS") {
                var portalHeaderTop = parseInt(document.documentElement.clientWidth * 13 / 100, 10) + iOSFixedTopPX();
                $("#viewWebNews2-3-1 .portal-header").css("top", portalHeaderTop);
            }
        });

        $("#viewWebNews2-3-1").on("pageshow", function(event, ui) {

            //RWD header & footer
            var header = {
                width: 600,
                height: 172
            };

            var footerImage = {
                width: 98,
                height: 65
            };

            var tempWidth;
            var tempHeight;
            var tempTop;
            var footerWidth;
            var footerHeight;

            tempWidth = $("#viewWebNews2-3-1 .news-header").width();
            tempHeight = header.height * tempWidth / header.width;
            $("#viewWebNews2-3-1 .news-header").css('height', tempHeight + 'px');

            tempTop = tempHeight * 0.2;
            $("#viewWebNews2-3-1 .priority-title").css('top', tempTop + 'px');

            tempTop = tempHeight * 0.35;
            $("#viewWebNews2-3-1 .header-date").css('top', tempTop + 'px');

            footerWidth = $("#viewWebNews2-3-1 .footer-top").width();

            if (footerWidth * 0.2 < footerImage.width) {
                tempWidth = footerWidth * 0.2;
                tempHeight = footerImage.height * tempWidth / footerImage.width;

                $("#viewWebNews2-3-1 .footer-top").css('height', tempHeight + 'px');

                $("#viewWebNews2-3-1 .footer-benq").css({
                    'width': tempWidth + 'px',
                    'height': tempHeight + 'px'
                });
                $("#viewWebNews2-3-1 .footer-qisda").css({
                    'width': tempWidth + 'px',
                    'height': tempHeight + 'px'
                });

                $("#viewWebNews2-3-1 .footer-text").css({
                    'width': (footerWidth - tempWidth * 2) - 15 + 'px',
                    'padding-top': tempHeight * 0.4 + 'px',
                    'font-size': '10px'
                });
            } else {
                $("#viewWebNews2-3-1 .footer-top").css('height', footerImage.height + 'px');

                $("#viewWebNews2-3-1 .footer-benq").css({
                    'width': footerImage.width + 'px',
                    'height': footerImage.height + 'px'
                });
                $("#viewWebNews2-3-1 .footer-qisda").css({
                    'width': footerImage.width + 'px',
                    'height': footerImage.height + 'px'
                });

                $("#viewWebNews2-3-1 .footer-text").css({
                    'width': (footerWidth - footerImage.width * 2) - 15 + 'px',
                    'padding-top': footerImage.height * 0.4 + 'px',
                    'font-size': '12px'
                });
            }
        });

        $("#viewWebNews2-3-1").on("pageshow", function(event, ui) {
            if (!messageExist) {
                $('#messageNotExist').popup('open');
            }
        });

        /********************************** dom event *************************************/
        $("#confirmMessageNotExist").on("click", function() {
            messageExist = true;
            $('#messageNotExist').popup('close');
            checkAppPage('viewMessageList');
        });

        $("#goList.nav-button").on("click", function() {
            // if (messageFrom == 'viewMain3' || messageFrom == 'push' || messageFrom == 'messageWidget') {
            //     if (widgetUpdateMsg) {
            //         $('.messageWidget').message('refresh');
            //         widgetUpdateMsg = false;
            //     }
            //     checkAppPage('viewMain3');

            // } else if (messageFrom == 'viewMessageList') {
            //     checkAppPage('viewMessageList');

            // } else {
            //     checkAppPage('#viewMain3');
            // }

        });

        $(document).on("click", "#messageLoadErrorPopup #retry", function() {
            $("#messageLoadErrorPopup").popup("close");
        });

        $(document).on("click", "#messageLoadErrorPopup #back", function() {
            checkAppPage('viewMessageList');
        });
    }
});