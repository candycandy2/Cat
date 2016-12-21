
$(document).one("pagecreate", "#viewNewsEvents2-3", function(){
    
    $("#viewNewsEvents2-3").pagecontainer({
        create: function(event, ui) {

            var activeNvrBar = "";
            var activeNvrDiv = "";
            var inactiveNvrBar = "";
            var inactiveNvrDiv = "";

            /********************************** function *************************************/
            window.QueryMessageList = function() {
                var self = this;
                var queryStr = "";
                var msgDateTo = getTimestamp();

                if (msgDateFromType.length > 0) {
                    queryStr = "&date_from=" + loginData["msgDateFrom"] + "&date_to=" + msgDateTo + "&overwrite_timestamp=1";
                    msgDateFromType = "";
                    window.localStorage.setItem("msgDateFrom", loginData["msgDateFrom"]);
                }

                this.successCallback = function(data) {
                    var resultcode = data['result_code'];

                    if (resultcode === 1) {

                        var messageCount = data['content']['message_count'];
                        var messageContentIsNull = false;

                        if (window.localStorage.getItem("messagecontent") === null) {
                            //check data exit in Local Storage
                            messageContentIsNull = true;
                        } else if (window.localStorage.getItem("messagecontent") === "null") {
                            //check data in Local Storage is null
                            messageContentIsNull = true;
                        }

                        if (messageContentIsNull) {
                            loginData["messagecontent"] = data['content'];
                            window.localStorage.setItem("messagecontent", JSON.stringify(data['content']));

                            messagecontent = data['content'];
                        } else {

                            loginData["messagecontent"] = window.localStorage.getItem("messagecontent");
                            var localContent = JSON.parse(loginData["messagecontent"]);
                            messagecontent = data['content'];

                            if (messagecontent.message_count !== 0) {
                                var messageindexStart = parseInt(messagecontent.message_count - 1, 10);

                                for (var messageindex=messageindexStart; messageindex>=0; messageindex--) {
                                    var message = messagecontent.message_list[messageindex];

                                    localContent.message_count = parseInt(localContent.message_count + 1, 10);
                                    localContent.message_list.unshift(message);
                                }
                            }

                            messagecontent = localContent;
                            loginData["messagecontent"] = messagecontent;
                            window.localStorage.setItem("messagecontent", JSON.stringify(messagecontent));
                        }

                        //Check if there still have a unread message, then show [red star]
                        $("#newMsg").hide();
                        $("#newEvents").hide();
                        $("#newNews").hide();

                        for (var i=0; i<messagecontent.message_count; i++) {
                            if (messagecontent.message_list[i].read === "N") {

                                if (messagecontent.message_list[i].message_type === "event") {
                                    $("#newEvents").show();
                                } else if (messagecontent.message_list[i].message_type === "news") {
                                    $("#newNews").show();
                                }

                                $("#newMsg").show();
                            }
                        }

                        updateMessageList();

                        /*
                        //jQuery Mobile swipe setting
                        $.event.special.swipe.scrollSupressionThreshold = (screen.availWidth) / 60;
                        $.event.special.swipe.horizontalDistanceThreshold = (screen.availWidth) / 5;

                        //Show Delete
                        $('li.msg-index').on("swipeleft", function(){
                            var i = this.getAttribute('value');
                            $("#delIndex" + i).show();
                        } );

                        //Hide Delete
                        $('li.msg-index').on("swipe", function(){
                            var i = this.getAttribute('value');
                            $("#delIndex" + i).hide();
                        } );
                        */
                    } else {
  
                    }

                    if (callGetMessageList) {
                        callGetMessageList = false;
                    }

                    if (messagePageShow) {
                        loadingMask("hide");
                    }

                    if (window.localStorage.getItem("openMessage") === "true") {
                        $.mobile.changePage("#viewWebNews2-3-1");
                    }
                }; 

                this.failCallback = function(data) {};

                var __construct = function() {
                    QPlayAPI("GET", "getMessageList", self.successCallback, self.failCallback, null, queryStr);
                }();
            }

            window.updateMessageList = function(action) {
                action = action || null;

                if (messagecontent === null) {
                    return;
                }

                var newsListItems = "";
                var eventListItems = "";
                var countNews = 0;
                var countEvents = 0;

                for (var messageindex=0; messageindex<messagecontent.message_count; messageindex++) {

                    var message = messagecontent.message_list[messageindex];
                    var type = message.message_type;
                    var title = message.message_title;
                    var txt = message.message_txt;
                    var rowid = message.message_send_row_id;
                    var createTime = message.create_time;
                    var displayTime = createTime.substring(0, parseInt(createTime.length - 3, 10));
                    var readStatus = "";

                    // [D] => It meanings this message was be deleted, don't need to show.
                    if (message.read === "D") {
                        continue;
                    }

                    if (message.read === "Y") {
                        readStatus = "hide";
                    }

                    var content = "<li value=" + messageindex.toString() + " class='msg-index'>" +
                                    "<div class='msg-del-checkbox-content'>" +
                                        "<div class='msg-del-checkbox'>" +
                                            "<input type='checkbox' class='custom msgDelCheckbox' data-mini='true' id='msgDelCheckbox" + rowid + "' value=" + rowid + ">" +
                                            "<label data-role='none' class='overlap-label-icon'></label>" +
                                            "<label data-role='none' class='overlap-label-checkbox' for='msgDelCheckbox" + rowid + "'></label>" +
                                            "<input type='hidden' id='msgType" + rowid + "' value='" + type + "'>" +
                                        "</div>" +
                                    "</div>" +
                                    "<div class='msg-new-reddot-content'>" +
                                        "<div class='reddot-list " + readStatus + "'></div>" +
                                    "</div>" +
                                    "<div class='msg-list-content'>" +
                                        "<a value=" + rowid + " class='message-index'>" +
                                            "<p class='msg-list-title' style='white-space:pre-wrap; font-size:2.3vh;'>" + title + "</p>" +
                                            "<p class='msg-list-time'>" + displayTime + "</p>" +
                                            "<div id='delIndex" + rowid + "' style='position:absolute; top:0px; right:0px; width:20%; height:100%; background-color:red; z-index:10; display:none;'>" +
                                                "<p style='color:#FFF; text-align:center; margin:50% 0;'>Delete</p>" +
                                            "</div>" +
                                        "</a>" +
                                    "<div>" +
                                "</li>";

                    if (message.message_type == "news") {
                        newsListItems += content;
                        countNews++;
                    } else if (message.message_type == "event") {
                        eventListItems += content;
                        countEvents++;
                    }
                }

                $("#newslistview").html(newsListItems);
                $("#newslistview").listview('refresh');
                $("#eventlistview").html(eventListItems);
                $("#eventlistview").listview('refresh');

                $(".update-time span").html(new Date().toLocaleString());

                //If News or Events has no message, show [No News] [No Events]
                if (countNews === 0) {
                    $("#noNews").show();
                    $("#updateTimeNews").hide();
                } else {
                    $("#noNews").hide();
                    $("#updateTimeNews").show();
                }

                if (countEvents === 0) {
                    $("#noEvents").show();
                    $("#updateTimeEvents").hide();
                } else {
                    $("#noEvents").hide();
                    $("#updateTimeEvents").show();
                }

                //If News or Events has no message, hide delete button
                if (activeNvrBar === "navNews") {
                    if (countNews === 0) {
                        $("#deleteMessage").hide();
                    } else {
                        $("#deleteMessage").show();
                    }
                }

                if (activeNvrBar === "navEvents") {
                    if (countEvents === 0) {
                        $("#deleteMessage").hide();
                    } else {
                        $("#deleteMessage").show();
                    }
                }

                if (action === "closePopup") {
                    $('#deleteConfirm').popup('close');
                    editModeChange();
                }

                $('a.message-index').on("click", function(e) {
                    e.stopImmediatePropagation();
                    e.preventDefault();

                    messageRowId = $(this)[0].getAttribute("value");
                    messageArrIndex = $(this).parent().parent().val();

                    $.mobile.changePage("#viewWebNews2-3-1");
                });

                $("input.msgDelCheckbox").on("change", function() {
                    checkboxChange($(this));
                });

                $("#navMessage a").addClass("ui-btn-active");
            };

            function tabChange(action) {
                action = action || null;

                $("#" + activeNvrDiv).show();
                $("#" + inactiveNvrDiv).hide();

                if (action === "setActive") {
                    $("#" + activeNvrBar).trigger("click");
                    $("#" + activeNvrBar + " a").addClass("ui-btn-active");
                } else {
                    $("#" + activeNvrBar).addClass("ui-btn-active");
                    $("#" + inactiveNvrBar).removeClass("ui-btn-active");
                }

                //Every time change tap, need to update message data
                if (!callGetMessageList) {
                    if (loginData["msgDateFrom"] !== null) {
                        loadingMask("show");
                        var messageList = new QueryMessageList();
                    }
                }

                if (delMsgActive) {
                    editModeChange();
                }

                //change footer image button
                $("#" + activeNvrBar + " .active").css("display", "block");
                $("#" + activeNvrBar + " .inactive").hide();
                $("#" + inactiveNvrBar + " .active").hide();
                $("#" + inactiveNvrBar + " .inactive").css("display", "block");
            }

            function checkboxChange(dom) {
                dom =  dom || null;

                var checkedLength = $("input.msgDelCheckbox:checked").length;
                var disabled = false;

                if (checkedLength > 0) {
                    disabled = true;
                    $("#navMessage").hide();
                    $("#navDelete").show();
                    $("#msgFooter").css("position", "fixed");
                } else {
                    $("#navMessage").show();
                    $("#navDelete").hide();
                    $("#msgFooter").css("position", "fixed");
                }

                if (dom !== null) {

                    if (checkedLength > 0) {
                        $(".msg-del-checkbox .overlap-label-icon").css("opacity", "0.2");
                    } else {
                        $(".msg-del-checkbox .overlap-label-icon").css("opacity", "1");
                    }

                    messageArrIndex = $(dom).parent().parent().parent().val();

                    $("input.msgDelCheckbox").prop("disabled", disabled);

                    $(dom).prop("disabled", false);
                    $(dom).parent().children(".overlap-label-icon").css("opacity", "1");
                }
            }

            window.editModeChange = function () {
                var dispaly = "none";
                var btnStr = "Delete";
                var btnBackDisplay = "block";

                if (delMsgActive) {
                    delMsgActive = false;
                    $(".msg-list-content").removeClass("msg-list-content-edit");
                    $('#deleteConfirm').popup('close');
                } else {
                    delMsgActive = true;
                    dispaly = "block";
                    btnStr = "Cancel";
                    btnBackDisplay = "none";

                    $("input.msgDelCheckbox").prop("disabled", false);
                    $(".msg-del-checkbox .overlap-label-icon").css("opacity", "1");
                    $(".msg-list-content").addClass("msg-list-content-edit");
                }

                $('#viewNewsEvents2-3 :checkbox').prop('checked', false);
                $(".msg-del-checkbox-content").css("display", dispaly);
                $("#deleteMessage #deleteImg").css("display", btnBackDisplay);
                $("#deleteMessage #deleteStr").css("display", dispaly);
                $("#messageListBack").css("display", btnBackDisplay);

                checkboxChange();
            };
            /********************************** page event *************************************/
            $("#viewNewsEvents2-3").one("pagebeforeshow", function(event, ui) {
                activeNvrBar = "navNews";
                activeNvrDiv = "newspage2-3";
                inactiveNvrBar = "navEvents";
                inactiveNvrDiv = "eventspage2-3b";
            });

            $("#viewNewsEvents2-3").on("pageshow", function(event, ui) {
                if (!callGetMessageList) {
                    if (loginData["msgDateFrom"] === null) {
                        loadingMask("hide");
                        $('#selectMsgDateFrom').popup('open');
                    }
                }
            });

            $("#viewNewsEvents2-3").on("pagebeforeshow", function(event, ui) {

                messagePageShow = true;
                loadingMask("show");

                //QueryMessageList() will be called in initialSuccess(),
                //if API is not finished after User change page into viewNewsEvents2-3, do nothing,
                //if API is finished, than call get Messaage List again.
                if (!callGetMessageList) {
                    //If User first time to use QPlay, never get message data from server,
                    //need to show #selectMsgDateFrom, after User select an option, then do QueryMessageList()
                    if (loginData["msgDateFrom"] !== null) {
                        var messageList = new QueryMessageList();
                        callGetMessageList = true;
                    }
                }

                tabChange("setActive");

                //$("#deleteMessage span").html("Delete");
                $("#deleteMessage #deleteImg").css("display", "block");
                $("#deleteMessage #deleteStr").css("display", "none");
                $("#navMessage").show();
                $("#navDelete").hide();
            });

            /********************************** dom event *************************************/
            $("#navNews").on("click", function() {
                activeNvrBar = "navNews";
                inactiveNvrBar = "navEvents";
                activeNvrDiv = "newspage2-3";
                inactiveNvrDiv = "eventspage2-3b";
                tabChange();
            });

            $("#navEvents").on("click", function() {
                activeNvrBar = "navEvents";
                inactiveNvrBar = "navNews";
                activeNvrDiv = "eventspage2-3b";
                inactiveNvrDiv = "newspage2-3";
                tabChange();

                $("#newNews").hide();
                $("#newEvents").hide();
            });

            $("#selectMsgDateFromOK").on("click", function() {
                msgDateFromType = $('input[name=selectDateFrom]:checked').val();

                var clientTimestamp = getTimestamp();

                if (msgDateFromType === "month") {
                    loginData["msgDateFrom"] = parseInt(clientTimestamp - 60 * 60 * 24 * 30, 10);
                } else if (msgDateFromType === "skip") {
                    loginData["msgDateFrom"] = clientTimestamp;
                }
                
                loadingMask("show");
                var messageList = new QueryMessageList();
                $('#selectMsgDateFrom').popup('close');
            });

            $("#deleteMessage").on("click", function() {
                editModeChange();
            });

            $("#delMsgBtn").on("click", function() {
                $('#deleteConfirm').popup('open');
            });

            $("#deleteConfirm #cancel").on("click", function() {
                $('#deleteConfirm').popup('close');
            });

            $("#deleteConfirm #yes").on("click", function() {
                var msgIndex = $("input.msgDelCheckbox:checked").val();
                var msgType = $("#msgType" + msgIndex).val();
                
                messageRowId = msgIndex;
                updateReadDelete(msgType, "delete");
            });
        }
    });

});