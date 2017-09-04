//$(document).one("pagecreate", "#viewWebNews2-3-1", function() {

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

            /********************************** function *************************************/
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
                        $("#newsContent").html(cleanHTML(content.message_text));

                        $("#viewWebNews2-3-1 .page-main").css("opacity", 1);

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
                $("#viewWebNews2-3-1 .page-main").css("opacity", 0);
                var messageDetail = new QueryMessageDetail();
            });

            $("#viewWebNews2-3-1").one("pageshow", function(event, ui) {

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
        }
    });

//});
