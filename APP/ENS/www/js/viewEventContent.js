
$("#viewEventContent").pagecontainer({
    create: function(event, ui) {

        window.eventRowID;
        var eventFinish;
        window.eventContentData;
        var taskData;
        var taskRowID;
        window.chatroomID;
        var photoUrl;
        var resizePhotoWidth;
        var resizePhotoHeight;
        var uploadPhoto = false;
        /********************************** function *************************************/

        window.getEventDetail = function(eventID, action, callBack) {
            eventRowID = eventID;
            //action >
            //member: get member list
            //function: get fucntion list
            //authority: check the authority to read this Event
            action = action || null;
            //Dor check Event Read Authority
            callBack = callBack || null;

            var self = this;
            this.readAuthority = true;
            var queryData = "<LayoutHeader><event_row_id>" + eventID + "</event_row_id><emp_no>" + loginData["emp_no"] + "</emp_no></LayoutHeader>";

            this.successCallback = function(data) {

                var resultCode = data['ResultCode'];

                if (resultCode === 1) {

                    if (action === "member") {
                        //Define in viewEventList
                        memberListPopup(data['Content']);
                    } else if (action === "function") {
                        //Define in viewEventList
                        functionListPopup(data['Content']);
                    } else {

                        eventContentData = data['Content'];

                        //Event List Msg
                        var eventListMsgHTML = $("template#tplEventListMsg").html();
                        var eventListMsg = $(eventListMsgHTML);
                        eventListMsg.css("margin-bottom", "2.14vw");

                        //Status: 未完成 / 完成
                        var event_status = data['Content'].event_status;
                        if (event_status === "完成") {
                            eventListMsg.find(".event-list-msg-top .event-status .done").show();
                            eventListMsg.find(".event-list-msg-top .event-status .unfinished").hide();

                            eventFinish = true;
                        } else {
                            eventFinish = false;
                        }

                        //Before Edit, check Event Status again
                        if (action === "checkStatusBeforeEdit") {
                            if (!eventFinish) {
                                $.mobile.changePage('#viewEventAdd');
                            } else {
                                $("#eventFinishedConfirm").popup("open");
                            }
                            return;
                        }

                        $("#contentEventContent .event-list-msg").remove();

                        //Created User
                        if (data['Content'].updated_user === null) {
                            var eventOwner = data['Content'].created_user;
                        } else {
                            var eventOwner = data['Content'].updated_user;
                        }
                        eventListMsg.find(".event-list-msg-top .name").html(eventOwner);

                        //Create Datetime - Convert with TimeZone
                        if (data['Content'].updated_at === null) {
                            var eventDateTime = data['Content'].created_at;
                        } else {
                            var eventDateTime = data['Content'].updated_at;
                        }
                        var tempDate = dateFormatYMD(eventDateTime);
                        var createTime = new Date(tempDate);
                        var createTimeConvert = createTime.TimeZoneConvert();
                        createTimeConvert = createTimeConvert.substr(0, parseInt(createTimeConvert.length - 3, 10));
                        eventListMsg.find(".event-list-msg-top .time").html(createTimeConvert);

                        //Event ID Number
                        eventListMsg.find(".event-list-msg-top .link .text").html(data['Content'].event_row_id);

                        //Event Related Link
                        eventListMsg.find(".event-list-msg-top .link .text").html(data['Content'].event_row_id);

                        if (data['Content'].related_event_row_id !== 0) {
                            eventListMsg.find(".event-list-msg-top .link-event").data("value", data['Content'].related_event_row_id);
                        } else {
                            eventListMsg.find(".event-list-msg-top .link-event").hide();
                        }

                        //Event Title
                        eventListMsg.find(".event-list-msg-top .description").html(data['Content'].event_title);

                        //Type: 緊急通報 / 一般通報
                        var event_type = data['Content'].event_type;
                        var pageTitle = "緊急";
                        if (event_type === "一般通報") {
                            pageTitle = "一般";
                            eventListMsg.find(".event-list-msg-top .link .normal").show();
                            eventListMsg.find(".event-list-msg-top .link .urgent").hide();
                        }
                        $("#pageTitle").html(pageTitle);

                        //Event Desc
                        var desc = "<div style='margin-top:0.98vw;'>" + data['Content'].event_desc + "</div>";
                        eventListMsg.find(".event-list-msg-top").append(desc);

                        //User Count
                        eventListMsg.find(".event-list-msg-bottom .member .text").html(data['Content'].user_count);

                        //Seen Count
                        eventListMsg.find(".event-list-msg-bottom .view .text").html(data['Content'].seen_count);

                        //Task finish Count
                        eventListMsg.find(".event-list-msg-bottom .member-done .text").html(data['Content'].task_finish_count);

                        //Message Count
                        chatroomID = data['Content'].chatroom_id;
                        var msgCount = 0;

                        for (j=0; j<messageCountData.length; j++) {
                            if (messageCountData[j]["target_id"] === data['Content'].chatroom_id) {
                                msgCount = messageCountData[j]["count"];
                                break;
                            }
                        }
                        eventListMsg.find(".event-list-msg-bottom .message .text").html(msgCount);

                        $("#contentEventContent").prepend(eventListMsg);

                        //Complete Datetime
                        var completeTime = new Date(parseInt(data['Content'].estimated_complete_date * 1000, 10));
                        var completeTimeText = completeTime.getFullYear() + "/" + padLeft(parseInt(completeTime.getMonth() + 1, 10), 2) + "/" +
                        padLeft(completeTime.getUTCDate(), 2) + " " + padLeft(completeTime.getHours(), 2) + ":" +
                        padLeft(completeTime.getMinutes(), 2);
                        $("#contentEventContent .datetime").html(completeTimeText);

                        //Related Event
                        if (data['Content'].related_event_row_id === 0) {
                            //No Related Event
                            $("#contentEventContent .relate-event-content").hide();
                        } else {
                            $("#contentEventContent .relate-event").html(data['Content'].related_event_row_id);
                            $("#contentEventContent .relate-event-content").show();
                            $('<hr class="ui-hr ui-hr-absolute">').insertAfter("#contentEventContent .relate-event-content");
                            $("#contentEventContent .relate-event-content .event-content-data-list").css("margin-bottom", "1vw");
                        }

                        //Task List
                        taskData = data['Content'].task_detail;
                        $("#contentEventContent #eventTaskListContent div").remove();
                        var eventTaskListBeforeHTML = $("#contentEventContent").find("template#tplEventTaskListBefore").html();
                        var eventTaskListAfterHTML = $("#contentEventContent").find("template#tplEventTaskListAfter").html();

                        for (var i=0; i<data['Content'].task_detail.length; i++) {
                            if (data['Content'].task_detail[i].task_status === "未完成") {
                                //Before Done
                                var eventTaskList = $(eventTaskListBeforeHTML);
                            } else {
                                //After Done
                                var completeTime = new Date(data['Content'].task_detail[i].close_task_date * 1000);
                                var completeTimeText = completeTime.getFullYear() + "/" + padLeft(parseInt(completeTime.getMonth() + 1, 10), 2) + "/" +
                                padLeft(completeTime.getUTCDate(), 2) + " " + padLeft(completeTime.getHours(), 2) + ":" +
                                padLeft(completeTime.getMinutes(), 2);

                                var eventTaskList = $(eventTaskListAfterHTML);
                                eventTaskList.find(".user").html(data['Content'].task_detail[i].close_task_user_id);
                                eventTaskList.find(".datetime").html(completeTimeText);
                            }
                            eventTaskList.find(".title").html(data['Content'].task_detail[i].task_location);
                            eventTaskList.find(".function").html(data['Content'].task_detail[i].task_function);

                            $("#contentEventContent #eventTaskListContent").append(eventTaskList);
                        }

                        $("#eventTaskListContent").css("margin-bottom", "1.5vw");

                        //ChatRoom Message List
                        chatRoomListView();

                        //Update User Read Status & Time
                        //note: if Event status=finish or User=create_user or User has readed, do not update Event Status
                        if (!eventFinish) {
                            if (loginData["loginid"] !== data['Content'].created_user) {
                                for (var i=0; i<data['Content'].user_event.length; i++) {
                                    if (data['Content'].user_event[i].emp_no === loginData["emp_no"]) {
                                        if (data['Content'].user_event[i].read_time === 0) {
                                            var updateEventStatusObj = new updateEventStatus();
                                        }
                                        break;
                                    }
                                }
                            }
                        }
                    }

                } else if (resultCode === "014904") {
                    loadingMask("hide");

                    //the user have no authority to read this event
                    self.readAuthority = false;

                    if (typeof callBack === "function") {
                        callBack(self.readAuthority);
                    }
                }
            };

            this.failCallback = function(data) {};

            var __construct = function() {
                CustomAPI("POST", true, "getEventDetail", self.successCallback, self.failCallback, queryData, "");
            }();

        };

        window.chatRoomListView = function(action) {
            action = action || null;
            var messages = chatRoom.getMsg(chatroomID);

            if (messages) {
                $("#msgContentHR").show();
                $(".message-content").show();
                $("#messageContent .message-data-list").remove();

                //Message List
                var messageListHTML = $("template#tplMessageList").html();
                var latestUser;
                var latstMsg;

                for (var i=0; i<messages.length; i++) {
                    var messageList = $(messageListHTML);

                    messageList.find(".user").html(messages[i]["from_id"]);
                    messageList.find(".datetime").html(messages[i]["ctimeText"]);

                    if (messages[i]["msg_type"] === "text") {
                        messageList.find(".text").removeClass("hide");
                        messageList.find(".text").html(messages[i]["msg_body"]["text"]);
                    } else if (messages[i]["msg_type"] === "image") {
                        messageList.find(".image").removeClass("hide");
                        messageList.find(".image img").prop("src", "http://media.file.jpush.cn/" + messages[i]["msg_body"]["media_id"]);
                        //messageList.find(".image img").prop("src", "https://dl.im.jiguang.cn/qiniu/image/j/54BAF99DD8326F50087B260036BFE6A9");
                        messageList.find(".image img").data("width", messages[i]["msg_body"]["width"]);
                        messageList.find(".image img").data("height", messages[i]["msg_body"]["height"]);
                    }

                    if ((i+1) == messages.length) {
                        messageList.find(".ui-hr").remove();
                        latestUser = messages[i]["from_id"];

                        if (messages[i]["msg_type"] === "text") {
                            latstMsg = messages[i]["msg_body"]["text"];
                        } else if (messages[i]["msg_type"] === "image") {
                            latstMsg = "上傳了一張圖片";
                        }
                    }

                    $("#messageContent").append(messageList);
                }

                //Message-preview
                if (action === "showPreview") {
                    $(".message-preview").html(latestUser + " : " + latstMsg);
                    $(".message-preview").show();
                } else {
                    $(".message-preview").html("");
                    $(".message-preview").hide();
                }

            } else {
                //empty message
                $("#msgContentHR").hide();
                $(".message-content").hide();
            }

            loadingMask("hide");
            footerFixed();
        };

        function updateEventStatus() {
            //Update 1. [event_status] 2. [read_time]
            //Now only for read_time
            var self = this;

            var specificDoneDateTime = new Date();
            var specificTimeStamp = specificDoneDateTime.TimeStamp();

            var queryDataObj = {
                lang: "zh-tw",
                need_push: "Y",
                app_key: appKey,
                event_row_id: eventRowID,
                read_time: specificTimeStamp,
                emp_no: loginData["emp_no"]
            };

            var queryDataParameter = processLocalData.createXMLDataString(queryDataObj);
            var queryData = "<LayoutHeader>" + queryDataParameter + "</LayoutHeader>";

            this.successCallback = function(data) {

                var resultCode = data['ResultCode'];

                if (resultCode === "014901") {
                    //Update Success, then update count of viewer in Top of Page
                    var countView = $("#viewEventContent .event-list-msg .view .text").html();
                    var newCountView = parseInt(countView, 10) + 1;
                    $("#viewEventContent .event-list-msg .view .text").html(newCountView);
                } else if (resultCode === "014910") {

                }
            };

            this.failCallback = function(data) {};

            var __construct = function() {
                CustomAPI("POST", true, "updateEventStatus", self.successCallback, self.failCallback, queryData, "");
            }();
        }

        function updateTaskStatus(status) {
            //status
            //0: not finish
            //1: finished

            var self = this;

            var queryDataObj = {
                lang: "zh-tw",
                need_push: "Y",
                app_key: appKey,
                task_row_id: taskRowID,
                task_status: status,
                emp_no: loginData["emp_no"]
            };

            var queryDataParameter = processLocalData.createXMLDataString(queryDataObj);
            var queryData = "<LayoutHeader>" + queryDataParameter + "</LayoutHeader>";

            this.successCallback = function(data) {

                var resultCode = data['ResultCode'];

                if (resultCode === "014901") {
                    var eventDetail = new getEventDetail(eventRowID);
                } else if (resultCode === "014910") {

                }
            };

            this.failCallback = function(data) {};

            var __construct = function() {
                loadingMask("show");
                CustomAPI("POST", true, "updateTaskStatus", self.successCallback, self.failCallback, queryData, "");
            }();
        }

        function checkReportAuthority(dom, action) {
            //First, check Event Finish, if finished, can not edit Task Status.
            if (eventFinish) {
                return;
            };

            //Only [admin] & Function Member can do report
            var isAdmin = checkAuthority("admin");
            var isMember = false;
            var location = $(dom).find(".title").text();
            var functionName = $(dom).find(".function").text();

            for (var i=0; i<taskData.length; i++) {
                if (taskData[i].task_location === location && taskData[i].task_function === functionName) {

                    taskRowID = taskData[i].task_row_id;

                    for (var j=0; j<taskData[i].user_task.length; j++) {
                        if (loginData["emp_no"] === taskData[i].user_task[j].emp_no) {
                            isMember = true;
                        }
                    }
                }
            }

            if (isAdmin || isMember) {
                if (action === "report") {
                    $("#eventReportWorkDoneConfirm").popup("open");
                } else {
                    $("#eventCancelWorkDoneConfirm").popup("open");
                }
            }
        }

        //For Plugin Camera
        function setOptions(srcType) {
            var options = {
                // Some common settings are 20, 50, and 100
                quality: 50,
                destinationType: Camera.DestinationType.FILE_URI,
                // In this app, dynamically set the picture source, Camera or photo gallery
                sourceType: srcType,
                encodingType: Camera.EncodingType.JPEG,
                mediaType: Camera.MediaType.PICTURE,
                allowEdit: true,
                correctOrientation: true  //Corrects Android orientation quirks
            }
            return options;
        }

        //For Plugin Camera
        function openFilePicker(selection) {
            //var srcType = Camera.PictureSourceType.SAVEDPHOTOALBUM;
            var srcType = Camera.PictureSourceType.PHOTOLIBRARY;
            //var srcType = Camera.PictureSourceType.CAMERA;
            var options = setOptions(srcType);
            var func = createNewFileEntry;

            navigator.camera.getPicture(function cameraSuccess(imageUri) {
                photoUrl = imageUri;

                $("<img id='myTempImage' style='display:none;' src='" + photoUrl + "'>").load(function() {
                    $(this).appendTo("#tempImage");
                    confirmPhoto($("#myTempImage").width(), $("#myTempImage").height());
                });

            }, function cameraError(error) {
                console.debug("Unable to obtain picture: " + error, "app");

            }, options);
        }

        //For Plugin Camera
        function createNewFileEntry(imgUri) {
            window.resolveLocalFileSystemURL(cordova.file.cacheDirectory, function success(dirEntry) {

                // JPEG file
                dirEntry.getFile("tempFile.jpeg", { create: true, exclusive: false }, function (fileEntry) {
                    // Do something with it, like write to it, upload it, etc.
                    // writeFile(fileEntry, imgUri);
                    console.log("got file: " + fileEntry.fullPath);
                    // displayFileData(fileEntry.fullPath, "File copied to");
                }, onErrorCreateFile);

            }, onErrorResolveUrl);
        }

        //For Plugin Camera
        function getFileEntry(imgUri) {
            window.resolveLocalFileSystemURL(imgUri, function success(fileEntry) {

                // Do something with the FileEntry object, like write to it, upload it, etc.
                // writeFile(fileEntry, imgUri);
                console.log("got file: " + fileEntry.fullPath);
                //displayFileData(fileEntry.nativeURL, "Native URL");

            }, function () {
              // If don't get the FileEntry (which may happen when testing
              // on some emulators), copy to a new FileEntry.
                createNewFileEntry(imgUri);
            });
        }

        //Full-screen Photo to confirm > cancel or confirm
        function confirmPhoto(imageWidth, imageHeight) {
            var clientHeight = document.documentElement.clientHeight;
            var clientWidth = document.documentElement.clientWidth;
            var resizeWidthPercent = parseFloat(clientWidth / imageWidth).toFixed(2);
            var buttonHeight = parseFloat($(window).height() * 0.1306).toFixed(2);

            resizePhotoWidth = parseInt(imageWidth * resizeWidthPercent, 10);
            resizePhotoHeight = parseInt(imageHeight * resizeWidthPercent - buttonHeight, 10);

            var imageContent = '<img src="' + photoUrl + '" width="' + resizePhotoWidth + '" height="' + resizePhotoHeight + '">';

            var buttonContent = '<div class="button-content bottom font-style3"><span id="photoCancel">重新選擇</span><span id="photoConfirm">使用照片</span></div>';
            $('<div class="event-content-photo-full-screen">' + imageContent + buttonContent + '</div').appendTo("body");

            if (device.platform === "iOS") {
                $(".event-content-photo-full-screen img").css("padding-top", "20px");
            }

            $(".event-content-photo-full-screen").css("top", $(document).scrollTop());

            $('body').css({
                'overflow': 'hidden',
                'touch-action': 'none'
            });

            $('body').on('touchmove', function(e) {
                $(window).scrollTop(0);
                e.preventDefault();
                e.stopPropagation();
            });

            //Photo Confirm - Button Event
            $("#photoCancel").on("click", function() {
                confirmPhotoClose();
                //openFilePicker();
                $("#msgPhoto").trigger("click");
            });

            $("#photoConfirm").on("click", function() {
                confirmPhotoOK();
            });

            loadingMask("hide");
        }

        function confirmPhotoClose() {
            $(".event-content-photo-full-screen").remove();
        }

        function confirmPhotoOK() {
            var image = document.getElementById('finalImage');
            image.src = photoUrl;
            uploadPhoto = true;

            $(".previewImageDiv").show();
            $(".previewImageDiv-AddHeight").show();

            $(".event-content-photo-full-screen").remove();

            $('body').css({
                'overflow': 'auto',
                'touch-action': 'auto'
            });
            $('body').off('touchmove');
        }

        function fullScreenPhoto(action) {

            var imgSrc = "";
            if (action === "download") {
                imgSrc = photoUrl;
            }

            var imageContent = '<img id="fullScreenImg" src="' + imgSrc + '" width="' + resizePhotoWidth + '" height="' + resizePhotoHeight + '">';
            var buttonContent = '<div class="button-content top"><div class="back-button"><span class="back"></span></div></div>';
            $('<div class="event-content-photo-full-screen">' + imageContent + buttonContent + '</div').appendTo("body");

            var buttonHeight = $(".event-content-photo-full-screen .button-content").height();

            if (device.platform === "iOS") {
                $(".event-content-photo-full-screen .button-content").css("padding-top", "20px");
                var paddingTop = buttonHeight + 20;
            } else {
                var paddingTop = buttonHeight;
            }

            $(".event-content-photo-full-screen #fullScreenImg").css("padding-top", paddingTop + "px");
            $(".event-content-photo-full-screen").css("top", $(document).scrollTop());

            if (action === "upload") {
                var file = $("input[type=file]")[0].files[0];
                var img = document.getElementById("fullScreenImg");
                var reader;

                reader = new FileReader();
                reader.onload = (function (theImg) {
                    return function (evt) {
                        theImg.src = evt.target.result;
                        loadingMask("hide");
                    };
                }(img));
                reader.readAsDataURL(file);
            } else {
                loadingMask("hide");
            }

            $('body').css({
                'overflow': 'hidden',
                'touch-action': 'none'
            });

            $('body').on('touchmove', function(e) {
                $(window).scrollTop(0);
                e.preventDefault();
                e.stopPropagation();
            });

            //Back Button
            $(".button-content .back-button").on("click", function() {
                $(".event-content-photo-full-screen").remove();
                $(".event-content-footer").removeClass("ui-fixed-hidden");

                $('body').css({
                    'overflow': 'auto',
                    'touch-action': 'auto'
                });
                $('body').off('touchmove');
            });
        }

        function callFileReader(file) {
            if (typeof FileReader !== "undefined") {
                //var container = document.getElementById(containerid);
                //var img = document.createElement("img");
                //container.appendChild(img);
                var imgSmall = document.getElementById("finalImage");
                var imgOriginal = document.getElementById("myTempImage");
                var reader;

                //small preview image
                reader = new FileReader();
                reader.onload = (function (theImg) {
                    return function (evt) {
                        theImg.src = evt.target.result;
                        $(".previewImageDiv").show();
                        $(".previewImageDiv-AddHeight").show();
                    };
                }(imgSmall));
                reader.readAsDataURL(file);

                //original image
                reader = new FileReader();
                reader.onload = (function (theImg) {
                    return function (evt) {
                        theImg.src = evt.target.result;
                        photoUrl = theImg.src;

                        $("<img/>").attr("src", theImg.src).load(function() {
                            confirmPhoto(this.width, this.height);
                        });
                    };
                }(imgOriginal));
                reader.readAsDataURL(file);
            } else {
                console.log("FileReader------------------no support");
            }
        }

        /********************************** page event *************************************/
        $("#viewEventContent").one("pagebeforeshow", function(event, ui) {

            //UI Popup : Report Event Work Done Confirm
            var eventReportWorkDoneConfirmData = {
                id: "eventReportWorkDoneConfirm",
                content: $("template#tplEventReportWorkDoneConfirm").html()
            };

            tplJS.Popup("viewEventContent", "contentEventContent", "append", eventReportWorkDoneConfirmData);

            //UI Popup : Event Edit Cancel Confirm
            var eventCancelWorkDoneConfirmData = {
                id: "eventCancelWorkDoneConfirm",
                content: $("template#tplEventCancelWorkDoneConfirm").html()
            };

            tplJS.Popup("viewEventContent", "contentEventContent", "append", eventCancelWorkDoneConfirmData);

            //UI Popup : Event has finished Confirm
            var eventFinishedConfirmData = {
                id: "eventFinishedConfirm",
                content: $("template#tplEventFinishedConfirm").html()
            };

            tplJS.Popup("viewEventContent", "contentEventContent", "append", eventFinishedConfirmData);
        });

        $("#viewEventContent").on("pageshow", function(event, ui) {
            prevPageID = "viewEventContent";

            //Only [admin] can Edit Event
            if (checkAuthority("admin")) {
                if (!eventFinish) {
                    $("#eventEdit").show();
                }
            }

            $(".previewImageDiv").hide();
            $(".previewImageDiv-AddHeight").hide();
            $('#msgText').prop('placeholder', "請輸入訊息");
            $("#msgText").val("");

            /*
            //Open Camera in Mobile Phone
            navigator.camera.getPicture(onSuccess, onFail, {
                quality: 50,
                destinationType: Camera.DestinationType.FILE_URI
            });

            function onSuccess(imageURI) {
                console.log(imageURI);
                var image = document.getElementById('myImage');
                image.src = imageURI;
            }

            function onFail(message) {
                alert('Failed because: ' + message);
            }
            */
        });
        /********************************** dom event *************************************/

        //Open Photo Library
        $(document).on("click", "#viewEventContent #cameraButton", function() {
            loadingMask("show");
            //openFilePicker();
            var msgPhoto = $("#msgPhoto").clone();
            $("#viewEventContent .event-content-footer #msgPhoto").remove();
            $(msgPhoto).appendTo("#viewEventContent .event-content-footer .center").trigger("click");
        });

        $(document).on("change", "#msgPhoto", function() {
            var file = $("input[type=file]")[0].files[0];
            console.log(file.name + "\n" +
                  file.type + "\n" +
                  file.size + "\n" +
                  file.lastModifiedDate);

            var test = new File(
                [""],
                "Screenshot_2017-02-17-10-19-35.png",
                {
                    type: "image/png",
                    lastModified: 1487297975850,
                    lastModifiedDate: new Date(),
                    name: "Screenshot_2017-02-17-10-19-35.png",
                    size: 137032,
                    webkitRelativePath: ""
                }
            )
            console.log(test);

            callFileReader(file);
        });

        //Photo - Small Preview
        $(document).on("click", ".previewImageDiv .delete-button", function() {
            uploadPhoto = false;
            $(".previewImageDiv").hide();
            $(".previewImageDiv-AddHeight").hide();

            footerFixed();
        });

        //Photo - FullScreen Preview
        $(document).on("click", "#finalImage", function() {
            loadingMask("show");
            fullScreenPhoto("upload");
        });

        //Event Related Content
        $(document).on("click", ".relate-event", function() {
            ahowEventData(this, "authority2");
        });

        //Event Edit Button
        $(document).on("click", "#eventEdit", function() {
            if (!eventFinish) {
                //check Event finish status again
                var eventDetail = new getEventDetail(eventRowID, "checkStatusBeforeEdit");
            }
        });

        //Report Event Work Done
        $(document).on("click", ".work-before", function() {
            checkReportAuthority(this, "report");
        });

        $(document).on("click", "#eventReportWorkDoneConfirm .cancel", function() {
            $("#eventReportWorkDoneConfirm").popup("close");
            footerFixed();
        });

        $(document).on("click", "#eventReportWorkDoneConfirm .confirm", function() {
            $("#eventReportWorkDoneConfirm").popup("close");
            footerFixed();
            updateTaskStatus(1);
        });

        //Cancel Event Work Done
        $(document).on("click", ".work-after", function() {
            checkReportAuthority(this, "cancel");
        });

        $(document).on("click", "#eventCancelWorkDoneConfirm .cancel", function() {
            $("#eventCancelWorkDoneConfirm").popup("close");
            footerFixed();
        });

        $(document).on("click", "#eventCancelWorkDoneConfirm .confirm", function() {
            $("#eventCancelWorkDoneConfirm").popup("close");
            footerFixed();
            updateTaskStatus(0);
        });

        //Event Finished
        $(document).on("click", "#eventFinishedConfirm .confirm", function() {
            $("#eventFinishedConfirm").popup("close");
            footerFixed();
        });

        //Chatroom Msg Button
        $(document).on("click", "#msgButton", function() {

            var gid = chatroomID;
            var gname = chatroomID + "-room";

            var uploadText = true;
            var msg = $("#msgText").val();

            var uploadImg = false;
            var fid = "msgPhoto";

            if (msg.length === 0) {
                uploadText = false;
            }

            if (uploadText) {
                if (msgController.isInited) {

                    loadingMask("show");

                    msgController.SendText(gid, gname, msg, function(successResult) {
                        console.log("---------------successResult");
                        console.log(successResult);

                        if (successResult["result"]["code"] === 0) {
                            var chatRoomID = successResult["result"]["target_gid"];
                            var ctime = successResult["content"]["create_time"].toString().substr(0, 10);
                            var createTime = new Date(ctime * 1000);

                            var objData = {
                                msg_id: successResult["result"]["msg_id"],
                                ctime: ctime,
                                ctimeText: createTime.getFullYear() + "/" + padLeft(parseInt(createTime.getMonth() + 1, 10), 2) + "/" +
                                    padLeft(createTime.getUTCDate(), 2) + " " + padLeft(createTime.getHours(), 2) + ":" +
                                    padLeft(createTime.getMinutes(), 2),
                                from_id: successResult["content"]["from_id"],
                                msg_type: successResult["content"]["msg_type"],
                                msg_body: successResult["content"]["msg_body"]
                            };

                            chatRoom.storeMsg(chatRoomID, objData, chatRoom.refreshMsg);
                            $("#msgText").val("");
                        }
                    }, function(errorResult) {
                        console.log("---------------errorResult");
                        console.log(errorResult);
                    });
                }
            }

            if ($(".previewImageDiv").css("display") === "block") {
                uploadImg = true;
            }

            if (uploadImg) {
                if (msgController.isInited) {

                    loadingMask("show");

                    msgController.SendImage(gid, gname, fid, function(successResult) {
                        console.log("---------------successResult");
                        console.log(successResult);

                        if (successResult["result"]["code"] === 0) {
                            var chatRoomID = successResult["result"]["target_gid"];
                            var ctime = successResult["content"]["create_time"].toString().substr(0, 10);
                            var createTime = new Date(ctime * 1000);

                            var objData = {
                                msg_id: successResult["result"]["msg_id"],
                                ctime: ctime,
                                ctimeText: createTime.getFullYear() + "/" + padLeft(parseInt(createTime.getMonth() + 1, 10), 2) + "/" +
                                    padLeft(createTime.getUTCDate(), 2) + " " + padLeft(createTime.getHours(), 2) + ":" +
                                    padLeft(createTime.getMinutes(), 2),
                                from_id: successResult["content"]["from_id"],
                                msg_type: successResult["content"]["msg_type"],
                                msg_body: successResult["content"]["msg_body"]
                            };

                            chatRoom.storeMsg(chatRoomID, objData, chatRoom.refreshMsg);

                            $(".previewImageDiv").hide();
                            $(".previewImageDiv-AddHeight").hide();
                            loadingMask("hide");
                        }

                    }, function(errorResult) {
                        console.log("---------------errorResult");
                        console.log(errorResult);
                    });
                }
            }

            if (!msgController.isInited) {
                initialMessage();
            }
        });

        //Chatroom msg-image click full screen
        $(document).on("click", ".chat-img", function() {
            var imageWidth = $(this).data("width");
            var imageHeight = $(this).data("height");
            var clientHeight = document.documentElement.clientHeight;
            var clientWidth = document.documentElement.clientWidth;
            var resizeWidthPercent = parseFloat(clientWidth / imageWidth).toFixed(2);
            var buttonHeight = parseFloat($(window).height() * 0.1306).toFixed(2);

            resizePhotoWidth = parseInt(imageWidth * resizeWidthPercent, 10);
            resizePhotoHeight = parseInt(imageHeight * resizeWidthPercent - buttonHeight, 10);

            photoUrl = $(this).prop("src");

            fullScreenPhoto("download");
        });

        //Hide message-preview when scrolling page
        $(window).scroll(function() {
            if($(window).scrollTop() + $(window).height() + $("#viewEventContent .ui-footer").height() >= $(document).height()) {
                $(".message-preview").html("");
                $(".message-preview").hide();
            }
            footerFixed();
        });

        //iOS open keyboard
        $(document).on("click", "#msgText", function() {
            if (device.platform === "iOS") {
                $(".ui-footer").removeClass("ui-footer-fixed");
                var scrollHeight = $("body")[0].scrollHeight - $("#viewEventContent .ui-footer").height() - $("#viewEventContent .ui-header").height();
                $(window).scrollTop(scrollHeight);
            }
        });

        $(document).on("focusout", "#msgText", function() {
            $(".ui-footer").addClass("ui-footer-fixed");
        });
    }
});
