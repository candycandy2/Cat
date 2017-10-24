
    function cleanHTML(input) {
        // 1. remove line breaks / Mso classes
        var stringStripper = /(\n|\r| class=(")?Mso[a-zA-Z]+(")?)/g;
        var output = input.replace(stringStripper, ' ');
        // 2. strip Word generated HTML comments
        var commentSripper = new RegExp('<!--(.*?)-->', 'g');
        var output = output.replace(commentSripper, '');
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
        for (var i = 0; i < badAttributes.length; i++) {
            var attributeStripper = new RegExp(' ' + badAttributes[i] + '="(.*?)"', 'gi');
            output = output.replace(attributeStripper, '');
        }
        return output;
    }

    $("#viewWebNews2-3-1").pagecontainer({
        create: function(event, ui) {

            var messageExist = true;
            window.portalURL = "";
            window.canvasChangeTop = false;

            /********************************** function *************************************/
            function goBack(action) {

                $("#htmlCanvas").panzoom("zoom", minScale, { silent: true });

                if (action === "goList") {
                    $.mobile.changePage('#viewNewsEvents2-3');
                } else if (action === "goHome") {
                    $.mobile.changePage('#viewMain2-1');
                }
            }

            function renderCanvas(content) {

                var hideHTML = false;

                $("#PortalContent canvas").remove();
                $("#htmlContent").css({
                    top: 0,
                    left: 0
                });

                $("#htmlContent").html(content).promise().done(function() {

                    if ($("#htmlContent")[0].scrollWidth == 0) {
                        setTimeout(function(){
                            renderCanvas(content);
                        }, 2000);

                        return;
                    }

                    if ($("#htmlContent")[0].scrollHeight == 0) {
                        setTimeout(function(){
                            renderCanvas(content);
                        }, 2000);

                        return;
                    }

                    $("#htmlContent").css("width", $("#htmlContent")[0].scrollWidth + "px");
                    $("#htmlContent").css("height", $("#htmlContent")[0].scrollHeight + "px");

                    window.minScale = parseInt(document.documentElement.clientWidth * 100 / $("#htmlContent")[0].scrollWidth * 0.9, 10) / 100;
                    var marginLeft = parseInt(document.documentElement.clientWidth * 10 / 100, 10);

                    if (minScale == 0.9) {
                        setTimeout(function(){
                            renderCanvas(content);
                        }, 500);
                        return;
                    }

                    if (device.platform === "iOS") {
                        setTimeout(function(){
                            doHTML2Canvas();
                        }, 1000);

                        setTimeout(function(){
                            $("#PortalContent").off("scroll");
                            $("#PortalContent canvas").remove();
                            $("#htmlContent").show();
                            hideHTML = true;
                            doHTML2Canvas();
                        }, 5000);
                    } else {
                        setTimeout(function(){
                            $("#PortalContent").off("scroll");
                            $("#PortalContent canvas").remove();
                            $("#htmlContent").show();
                            hideHTML = true;
                            doHTML2Canvas();
                        }, 5000);
                    }

                    window.doHTML2Canvas = function() {
                        html2canvas($("#htmlContent"), {
                            onrendered: function(canvas) {

                                $("#PortalContent").prepend(canvas);
                                $("#PortalContent canvas").prop("id", "htmlCanvas");

                                //htmlCanvas pan-zoom
                                $("#htmlCanvas").panzoom();
                                $("#htmlCanvas").panzoom("option", {
                                    minScale: minScale
                                });

                                $("#htmlCanvas").panzoom("zoom", minScale, { silent: true });

                                var htmlCanvas = document.getElementById('htmlCanvas');
                                var dataURL = htmlCanvas.toDataURL();
                                console.log(dataURL);

                                //Resize PortalContent
                                var screenHeight = document.documentElement.clientHeight;
                                var screenWidth = document.documentElement.clientWidth;
                                $("#PortalContent").css("overflow-y", "auto");
                                $("#PortalContent").css("overflow-x", "hidden");
                                $("#viewWebNews2-3-1 .page-main").css("overflow-x", "auto");
                                $("#PortalContent").css("top", "0px");
                                var portalHeaderHeight = $("#viewWebNews2-3-1 .portal-header").height();

                                if (eventType === "Communication") {
                                    $("#PortalContent").css("padding-top", "0px");
                                    var matrixNewTopY = parseInt(portalHeaderHeight, 10);
                                } else {
                                    $("#PortalContent").css("padding-top", portalHeaderHeight + "px");
                                    var matrixNewTopY = parseInt(portalHeaderHeight * 2, 10);
                                }

                                $("#PortalContent").css("height", screenHeight + "px");
                                $("#PortalContent").css("width", screenWidth + "px");

                                //Reset matrix of canvas
                                var canvasHeight = $("#htmlCanvas").height();
                                var canvasWidth = $("#htmlCanvas").width();
                                var matrix = $("#htmlCanvas").panzoom("getMatrix");
                                var matrixLeftX = document.documentElement.clientWidth - $("#htmlCanvas").width();
                                var matrixNewLeftX = Math.abs(parseInt((screenWidth - canvasWidth * matrix[0]) / 2, 10));

                                $("#htmlCanvas").css({
                                    transform: " matrix(" + matrix[0] + "," + matrix[1] + "," + matrix[2] + "," + matrix[3] + "," + matrixNewLeftX + "," + matrixNewTopY + ")"
                                });

                                $("#htmlCanvas").offset({
                                    left: matrixNewLeftX,
                                    top: matrixNewTopY
                                });

                                if (hideHTML) {
                                    $("#htmlContent").hide();
                                    loadingMask("hide");
                                }

                                //panzoom start event
                                $("#htmlCanvas").on('panzoomstart', function(e, panzoom, matrix, changed) {
                                    var canvasWidth = $("#htmlCanvas").width() * matrix[0];
                                    var screenWidth = document.documentElement.clientWidth;
                                    $("#PortalContent").css("overflow-y", "auto");
                                    $("#PortalContent").css("overflow-x", "auto");
                                    $("#viewWebNews2-3-1 .page-main").css("overflow-x", "auto");
                                    $("#PortalContent").css("top", "0px");
                                    $("#PortalContent").css("height", screenHeight + "px");
                                    $("#PortalContent").css("width", canvasWidth + "px");
                                    if (device.platform === "iOS") {
                                        $("#PortalContent").css("width", screenWidth + "px");
                                    }

                                });

                                //panzoom start zoom
                                $("#htmlCanvas").on('panzoomzoom', function(e, panzoom, scale, opts) {
                                    $("#htmlCanvas").panzoom("option", {
                                        disablePan: true
                                    });

                                    var matrix = $("#htmlCanvas").panzoom("getMatrix");
                                    var canvasWidth = $("#htmlCanvas").width() * matrix[0];
                                    $("#PortalContent").css("overflow-y", "auto");
                                    $("#PortalContent").css("overflow-x", "auto");
                                    $("#viewWebNews2-3-1 .page-main").css("overflow-x", "auto");
                                    $("#PortalContent").css("top", "0px");
                                    $("#PortalContent").css("height", screenHeight + "px");
                                    $("#PortalContent").css("width", canvasWidth + "px");

                                    $("#htmlCanvas").css({
                                        transform: " matrix(" + scale + "," + matrix[1] + "," + matrix[2] + "," + scale + ", 0, " + matrix[5] + ")"
                                    });
                                });

                                //panzoom end event
                                $("#htmlCanvas").on('panzoomend', function(e, panzoom, matrix, changed) {

                                    var matrix = $("#htmlCanvas").panzoom("getMatrix");

                                    if (matrix[0] == minScale) {

                                        var screenWidth = document.documentElement.clientWidth;
                                        $("#PortalContent").css("width", screenWidth + "px");
                                        $("#PortalContent").css("overflow-x", "hidden");

                                        var canvasWidth = $("#htmlCanvas").width();
                                        var canvasOffset = $("#htmlCanvas").offset();
                                        var canvasOffsetTop = canvasOffset.top;
                                        var left = Math.abs(parseInt((screenWidth - canvasWidth * matrix[0]) / 2, 10));

                                        $("#htmlCanvas").offset({
                                            top: canvasOffsetTop,
                                            left: left
                                        })

                                    } else if (matrix[0] > minScale) {
                                        var canvasWidth = $("#htmlCanvas").width() * matrix[0];
                                        var screenWidth = document.documentElement.clientWidth;

                                        $("#PortalContent").css("overflow-y", "auto");
                                        $("#PortalContent").css("overflow-x", "auto");
                                        $("#viewWebNews2-3-1 .page-main").css("overflow-x", "auto");
                                        $("#PortalContent").css("top", "0px");
                                        $("#PortalContent").css("height", screenHeight + "px");
                                        $("#PortalContent").css("width", canvasWidth + "px");

                                        if (device.platform === "iOS") {
                                            $("#PortalContent").css("width", screenWidth + "px");
                                        }

                                        $("#htmlCanvas").css({
                                            top: 0,
                                            left: 0,
                                            transform: " matrix(" + matrix[0] + "," + matrix[1] + "," + matrix[2] + "," + matrix[3] + ", 0, 0)"
                                        });
                                    }

                                });

                                //Set Scroll Event
                                $("#PortalContent").on("scroll", function() {

                                    var matrix = $("#htmlCanvas").panzoom("getMatrix");
                                    var headerHeight = $("#viewWebNews2-3-1 .page-header").height();
                                    var portalHeaderHeight = $("#viewWebNews2-3-1 .portal-header").height();
                                    var scrollTop = $("#PortalContent").scrollTop();

                                    if (device.platform === "iOS") {
                                        headerHeight += 20;
                                    }

                                    if ((canvasHeight * matrix[0] - scrollTop) < (screenHeight * 0.8 - headerHeight - portalHeaderHeight)) {
                                        $("#PortalContent").animate({
                                            scrollTop: ((canvasHeight * matrix[0]) - (screenHeight * 0.8 - headerHeight - portalHeaderHeight))
                                        }, 0);
                                    }

                                });
                            },
                            useCORS: true,
                            allowTaint: true,
                            letterRendering: true,
                            logging: true,
                            taintTest: true,
                            width: parseInt($("#htmlContent")[0].scrollWidth * 1.2, 10),
                            height: parseInt($("#htmlContent")[0].scrollHeight * 1.8, 10)
                        });
                    }

                });
            }

            function QueryPortalListDetail() {
                (function() {

                    if (eventType === "Communication") {
                        $("#htmlContent").load(portalURL, function() {
                            $("#htmlContent").find("meta").remove();
                            $("#htmlContent").find("title").remove();
                            $("#htmlContent").find("base").remove();

                            $("#viewWebNews2-3-1 .portal-header").hide();
                            renderCanvas($("#htmlContent").html());
                        });
                    } else {
                        var queryData = "<LayoutHeader><PortalID>" + messageRowId + "</PortalID></LayoutHeader>";

                        var successCallback = function(data) {
                            if (data["ResultCode"] === "1") {
                                $("#viewWebNews2-3-1 .portal-header").show();
                                renderCanvas(data["Content"][0]["PortalContent"]);
                            } else if (data["ResultCode"] === "044901") {
                                //Message was be deleted in server
                                messageExist = false;
                            }
                        };

                        var failCallback = function(data) {};

                        CustomAPI("POST", true, "PortalListDetail", successCallback, failCallback, queryData, "");
                    }

                }());
            }

            function QueryMessageDetail() {
                var self = this;

                var queryStr = "&message_send_row_id=" + messageRowId;

                this.successCallback = function(data) {
                    var resultcode = data['result_code'];
                    var content = data['content'];

                    function NoticeTypeShow(template_id) {
                        for(var i=0; i<=17; i++) {
                            $("#notice" + i).hide();
                        }
                        if (template_id <= 10){
                            $("#notice" + template_id).show().addClass("notice-priority-normal");
                        }else if (template_id >= 11){
                            $("#notice" + template_id).show().addClass("notice-priority-high");
                        }
                    }

                    if (resultcode === 1) {
  
                        messageExist = true;
                        updateReadDelete(content.message_type, "read");

                        //If template_id == 999, it's Portal Event,
                        //need to be render become canvas
                        if (content.template_id === 999) {
                            loadingMask("show");

                            $("#ITSEventNewContent").hide();
                            $("#PortalContent").show();
                            $(".footer-news").hide();
                            $(".footer-portal").show();

                            $("#htmlContent").html("");
                            $("#htmlContent").show();

                            $("#viewWebNews2-3-1 .page-main").css("opacity", 1);
                            renderCanvas(content.message_text);
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

                                }else if (content.template_id >= 11) {

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

                                }else if (content.template_id >= 11) {

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
                        loginData["openMessage"] = false;
                        window.localStorage.setItem("openMessage", false);
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
                    var doUpdateLocalStorage = false;

                    if (type === "event") {
                        var resultcode = data['result_code'];

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

                        messageRowId = messageRowId.toString();

                        if (messageRowId.indexOf(",") !== -1) {
                            singleMessage = false;
                        }

                        if (singleMessage) {
                            if (messageArrIndex === null) {
                                for (var i=0; i<messagecontent.message_list.length; i++) {
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

                            for (var i=0; i<messageRowIdArr.length; i++) {

                                for (var j=0; j<messagecontent.message_list.length; j++) {
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

                        loginData["messagecontent"] = messagecontent;
                        window.localStorage.setItem("messagecontent", JSON.stringify(messagecontent));
                        messageArrIndex = null;

                        updateMessageList("closePopup");
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
            /********************************** page event *************************************/
            $("#viewWebNews2-3-1").on("pagebeforeshow", function(event, ui) {
                if (eventType === "Event" || eventType === "News") {
                    $("#ITSEventNewContent").show();
                    $("#PortalContent").hide();
                    $(".footer-news").show();
                    $(".footer-portal").hide();

                    $("#viewWebNews2-3-1 .page-main").css("opacity", 0);
                    var messageDetail = new QueryMessageDetail();
                } else {
                    loadingMask("show");

                    $("#ITSEventNewContent").hide();
                    $("#PortalContent").show();
                    $(".footer-news").hide();
                    $(".footer-portal").show();

                    $("#htmlContent").html("");
                    $("#htmlContent").show();

                    if (device.platform === "iOS") {
                        var portalHeaderTop = parseInt(document.documentElement.clientWidth * 13 / 100, 10) + 20;
                        $("#viewWebNews2-3-1 .portal-header").css("top", portalHeaderTop);
                    }

                    QueryPortalListDetail();
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
                tempHeight = header['height'] * tempWidth / header['width'];
                $("#viewWebNews2-3-1 .news-header").css('height', tempHeight + 'px');

                tempTop = tempHeight * 0.2;
                $("#viewWebNews2-3-1 .priority-title").css('top', tempTop + 'px');

                tempTop = tempHeight * 0.35;
                $("#viewWebNews2-3-1 .header-date").css('top', tempTop + 'px');

                footerWidth = $("#viewWebNews2-3-1 .footer-top").width();

                if (footerWidth * 0.2 < footerImage['width']) {
                    tempWidth = footerWidth * 0.2;
                    tempHeight = footerImage['height'] * tempWidth / footerImage['width'];

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
                    $("#viewWebNews2-3-1 .footer-top").css('height', footerImage['height'] + 'px');

                    $("#viewWebNews2-3-1 .footer-benq").css({
                        'width': footerImage['width'] + 'px',
                        'height': footerImage['height'] + 'px'
                    });
                    $("#viewWebNews2-3-1 .footer-qisda").css({
                        'width': footerImage['width'] + 'px',
                        'height': footerImage['height'] + 'px'
                    });

                    $("#viewWebNews2-3-1 .footer-text").css({
                        'width': (footerWidth - footerImage['width'] * 2) - 15 + 'px',
                        'padding-top': footerImage['height'] * 0.4 + 'px',
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
            $("#confirmMessageNotExist").on("click", function(){
                messageExist = true;
                $('#messageNotExist').popup('close');
                $.mobile.changePage("#viewNewsEvents2-3");
            });

            $(".nav-button").on("click", function(){
                var action = $(this).prop("id");
                goBack(action);
            });
        }
    });

