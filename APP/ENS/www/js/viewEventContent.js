
$("#viewEventContent").pagecontainer({
    create: function(event, ui) {

        window.eventRowID;
        var eventFinish;
        window.eventContentData;
        var taskData;
        var taskRowID;
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
                        loadingMask("hide");

                        eventContentData = data['Content'];

                        $("#contentEventContent .event-list-msg").remove();

                        //Event List Msg
                        var eventListMsgHTML = $("template#tplEventListMsg").html();
                        var eventListMsg = $(eventListMsgHTML);
                        eventListMsg.css("margin-bottom", "2.14vw");

                        //Created User
                        eventListMsg.find(".event-list-msg-top .name").html(data['Content'].created_user);

                        //Create Datetime - Convert with TimeZone
                        var tempDate = dateFormatYMD(data['Content'].created_at);
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
                        if (event_type === "一般通報") {
                            eventListMsg.find(".event-list-msg-top .link .normal").show();
                            eventListMsg.find(".event-list-msg-top .link .urgent").hide();
                        }

                        //Status: 未完成 / 完成
                        var event_status = data['Content'].event_status;
                        if (event_status === "完成") {
                            eventListMsg.find(".event-list-msg-top .event-status .done").show();
                            eventListMsg.find(".event-list-msg-top .event-status .unfinished").hide();

                            eventFinish = true;
                        } else {
                            eventFinish = false;
                        }

                        //Event Desc
                        var desc = "<div style='margin-top:0.98vw;'>" + data['Content'].event_desc + "</div>";
                        eventListMsg.find(".event-list-msg-top").append(desc);

                        //User Count
                        eventListMsg.find(".event-list-msg-bottom .member .text").html(data['Content'].user_count);

                        //Seen Count
                        eventListMsg.find(".event-list-msg-bottom .view .text").html(data['Content'].seen_count);

                        //Task finish Count
                        eventListMsg.find(".event-list-msg-bottom .member-done .text").html(data['Content'].task_finish_count);

                        $("#contentEventContent").prepend(eventListMsg);

                        //Complete Datetime
                        var completeTime = new Date(parseInt(data['Content'].estimated_complete_date * 1000, 10));
                        var completeTimeConvert = completeTime.TimeZoneConvert();
                        completeTimeConvert = completeTimeConvert.substr(0, parseInt(completeTimeConvert.length - 3, 10));
                        $("#contentEventContent .datetime").html(completeTimeConvert);

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
                                var eventTaskList = $(eventTaskListAfterHTML);
                                eventTaskList.find(".user").html(data['Content'].task_detail[i].close_task_user_id);
                                eventTaskList.find(".datetime").html(data['Content'].task_detail[i].close_task_date);
                            }
                            eventTaskList.find(".title").html(data['Content'].task_detail[i].task_location);
                            eventTaskList.find(".function").html(data['Content'].task_detail[i].task_function);

                            $("#contentEventContent #eventTaskListContent").append(eventTaskList);
                        }

                        $("#eventTaskListContent").css("margin-bottom", "1.5vw");

                        //Message List
                        //$('<hr class="ui-hr ui-hr-absolute">').insertAfter("#eventTaskListContent");
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
            var location = $(dom).find(".title").html();
            var functionName = $(dom).find(".function").html();

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
            var srcType = Camera.PictureSourceType.SAVEDPHOTOALBUM;
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

        //Full-screen Photo to confirm > cancel or confirm
        function confirmPhoto(imageWidth, imageHeight) {
            var clientHeight = document.documentElement.clientHeight;
            var clientWidth = document.documentElement.clientWidth;
            var resizeWidthPercent = parseFloat(clientWidth / imageWidth).toFixed(2)

            resizePhotoWidth = parseInt(imageWidth * resizeWidthPercent, 10);
            resizePhotoHeight = parseInt(imageHeight * resizeWidthPercent, 10);

            var imageContent = '<img src="' + photoUrl + '" width="' + resizePhotoWidth + '" height="' + resizePhotoHeight + '">';

            var buttonContent = '<div class="button-content bottom font-style3"><span id="photoCancel">重新選擇</span><span id="photoConfirm">使用照片</span></div>';
            $('<div class="event-content-photo-full-screen">' + imageContent + buttonContent + '</div').appendTo("body");

            tplJS.preventPageScroll();

            //Photo Confirm - Button Event
            $("#photoCancel").on("click", function() {
                confirmPhotoClose();
                openFilePicker();
            });

            $("#photoConfirm").on("click", function() {
                confirmPhotoOK();
            });
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

            tplJS.recoveryPageScroll();
        }

        function fullScreenPhoto() {
            var imageContent = '<img src="' + photoUrl + '" width="' + resizePhotoWidth + '" height="' + resizePhotoHeight + '">';
            var buttonContent = '<div class="button-content top"><div class="back-button"><span class="back"></span></div></div>';
            $('<div class="event-content-photo-full-screen">' + imageContent + buttonContent + '</div').appendTo("body");

            tplJS.preventPageScroll();

            //Back Button
            $(".button-content .back-button").on("click", function() {
                $(".event-content-photo-full-screen").remove();
                $(".event-content-footer").removeClass("ui-fixed-hidden");

                tplJS.recoveryPageScroll();
            });
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

        });

        $("#viewEventContent").on("pageshow", function(event, ui) {
            prevPageID = "viewEventContent";
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
            openFilePicker();
        });

        //Photo - Small Preview
        $(document).on("click", ".previewImageDiv .delete-button", function() {
            uploadPhoto = false;
            $(".previewImageDiv").hide();
            $(".previewImageDiv-AddHeight").hide();

            $(".event-content-footer").removeClass("ui-fixed-hidden");
        });

        //Photo - FullScreen Preview
        $(document).on("click", "#finalImage", function() {
            fullScreenPhoto();
        });

        //Event Related Content
        $(document).on("click", ".relate-event", function() {
            ahowEventData(this, "authority2");
            loadingMask("show");
        });

        //Event Edit Button
        $(document).on("click", "#eventEdit", function() {
            if (!eventFinish) {
                $.mobile.changePage('#viewEventAdd');
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

        //Cancel Event Work
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
    }
});
