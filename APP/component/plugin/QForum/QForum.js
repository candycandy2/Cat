
//Plugin - QForum
//
//--need:
//-- 1. Plugin - QStorage
//-- 2. Plugin - ckeditor
//
var QForum = {
    appKey: "appqforum",
    appSecretKey: "c40a5073000796596c2ba5e70579b1e6",
    viewList: ["footer", "popup", "replyListView"],
    dependency: ["QStorage"],
    boardList: [],
    boardID: 0,
    postID: "",
    pageID: "",
    replyLastID: 0,
    replyDataRange: 10,
    commentID: "",
    commentAction: "",
    commentActionText: {
        "new": "回覆已送出",
        "update": "回覆已送出",
        "delete": "回覆已刪除"
    },
    commentDeleteText: "留言已刪除",
    deviceOriginalSize: {
        "width": 0,
        "height": 0
    },
    editorOriginalSize: {
        "width": 0,
        "height": 0
    },
    iOSTriggerKeyboardEvent: false,
    editor: {
        editable: null,
        selection: null,
        range: null
    },
    initial: function() {

        //Handle dependency
        window.retryCheckDependency = setInterval(function() {
            for (var i=0; i<QForum.dependency.length; i++) {
                if (typeof window[QForum.dependency[i]] !== "undefined") {

                    if ((i + 1) == QForum.dependency.length) {
                        if (typeof window.stopCheckDependency !== "undefined") {
                            window.stopCheckDependency();
                            checkDependencyFinish();
                        }
                    }

                }
            }
        }, 100);

        window.stopCheckDependency = function() {
            if (window.retryCheckDependency != null) {
                clearInterval(window.retryCheckDependency);
                window.retryCheckDependency = null;
            }
        };

        var checkDependencyFinish = function() {
            //Load CSS
            var link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = "plugin/QForum/QForum.css";
            document.head.appendChild(link);

            //According to the Parent versionName, decide APPKey > [dev] / [test] / []
            if (loginData["versionName"].indexOf("Staging") !== -1) {
                QForum.appKey = "appqforumtest";
            } else if (loginData["versionName"].indexOf("Development") !== -1) {
                QForum.appKey = "appqforumdev";
            } else {
                QForum.appKey = "appqforum";
            }

            //Check if QForum is be used as plugin.
            if (window.appKey == QForum.appKey) {

            } else {

            }

            //Load View
            $.map(QForum.viewList, function(value, key) {
                (function(viewID, viewIndex) {
                    $.get("plugin/QForum/view/" + viewID + ".html", function(data) {

                        $.mobile.pageContainer.append(data);

                        if ((viewIndex + 1) == QForum.viewList.length) {
                            //Create Prompt Popup
                            QForum.VIEW.promptPopup();

                            //Create Delete Confirm Popup
                            QForum.VIEW.deleteConfirmPopup();
                        }

                    }, "html");
                }(value, key));
            });

            //Get Board List
            QForum.API.getBoardList();

            //QStorage Initial
            QStorage.initial();

            //For detect keyboard show up in Android
            if (device.platform === "Android") {
                QForum.EVENT.detectKeyboardShowUp();
            }

        }

    },
    getSignature: function(action, signatureTime) {
        if (action === "getTime") {
            return Math.round(new Date().getTime() / 1000);
        } else {
            var hash = CryptoJS.HmacSHA256(signatureTime.toString(), QForum.appSecretKey);
            return CryptoJS.enc.Base64.stringify(hash);
        }
    },
    CustomAPI: function(requestType, asyncType, requestAction, successCallback, failCallback, queryData, queryStr) {

        failCallback = failCallback || null;
        queryData = queryData || null;
        queryStr = queryStr || "";

        function requestSuccess(data) {
            checkTokenValid(data['ResultCode'], data['token_valid'], successCallback, data);
        }

        function requestError(data) {
            errorHandler(data);

            if (typeof failCallback === "function") {
                failCallback();
            }
        }

        var signatureTime = QForum.getSignature("getTime");
        var signatureInBase64 = QForum.getSignature("getInBase64", signatureTime);

        $.ajax({
            type: requestType,
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'App-Key': QForum.appKey,
                'Signature-Time': signatureTime,
                'Signature': signatureInBase64,
                'token': loginData.token
            },
            url: serverURL + "/qplayApi/public/v101/custom/" + QForum.appKey + "/" + requestAction + "?lang=" + browserLanguage + "&uuid=" + loginData.uuid + queryStr,
            dataType: "json",
            data: queryData,
            async: asyncType,
            cache: false,
            timeout: 30000,
            success: requestSuccess,
            error: requestError
        });

    },
    createXMLDataString: function(data) {
        var XMLDataString = "";

        $.each(data, function(key, value) {
            XMLDataString += "<" + key + ">" + htmlspecialchars(value) + "</" + key + ">";
        });

        return XMLDataString;
    },
    METHOD: {
        setBoardID: function() {
            if (appKeyOriginal == "appens") {

                //window.retrySetBoardID = setInterval(function() {
                    if (QForum.boardList.length > 0) {

                        //if (typeof window.stopRetrySetBoardID !== "undefined") {
                        //    window.stopRetrySetBoardID();
                        //}

                        for (var i=0; i<QForum.boardList.length; i++) {
                            if (QForum.boardList[i].board_type_name == "ENS") {
                                if (QForum.boardList[i].board_name == projectName) {
                                    QForum.boardID = QForum.boardList[i].board_id;
                                }
                            }
                        }
                    }
                //}, 500);

                /*
                window.stopRetrySetBoardID = function() {
                    if (window.retrySetBoardID != null) {
                        clearInterval(window.retrySetBoardID);
                        window.retrySetBoardID = null;
                    }
                };
                */

            } else {
                QForum.boardID = boardID;
            }
        },
        setPostID: function(postID) {
            QForum.postID = postID;
        },
        setPageID: function(pageID) {
            QForum.pageID = pageID;
        },
        setReplyLastID: function(replyLastID) {
            QForum.replyLastID = replyLastID;
        },
        getEditorContent: function() {
            return window.CKEDITOR.instances.editor.getData();
        },
        clearEditorContent: function(htmlContent) {
            window.CKEDITOR.instances.editor.setData(htmlContent);
        }
    },
    API: {
        getBoardList: function() {
            window.retryGetBoardList = setInterval(function() {
                if (loginData["emp_no"].length > 0) {
                    (function() {

                        if (typeof window.stopRetryGetBoardList !== "undefined") {
                            window.stopRetryGetBoardList();
                        }

                        var queryDataObj = {
                            emp_no: loginData["emp_no"],
                            source: window.appKey
                        };

                        var queryDataParameter = QForum.createXMLDataString(queryDataObj);
                        var queryData = "<LayoutHeader>" + queryDataParameter + "</LayoutHeader>";

                        var successCallback = function(data) {
                            QForum.boardList = data["Content"].board_list;
                            QForum.METHOD.setBoardID();
                        };

                        var failCallback = function(data) {};

                        QForum.CustomAPI("POST", true, "getBoardList", successCallback, failCallback, queryData, "");

                    }());
                }
            }, 500);

            window.stopRetryGetBoardList = function() {
                if (window.retryGetBoardList != null) {
                    clearInterval(window.retryGetBoardList);
                    window.retryGetBoardList = null;
                }
            };
        },
        getPostDetails: function(replyCallback) {
            replyCallback = replyCallback || false;

            (function(replyCallback) {

                var replyFromSeq = (QForum.replyLastID + 1);
                var replyToSeq = (replyFromSeq + QForum.replyDataRange - 1);

                var queryDataObj = {
                    emp_no: loginData["emp_no"],
                    source: window.appKey,
                    board_id: QForum.boardID,
                    post_id: QForum.postID,
                    reply_from_seq: replyFromSeq,
                    reply_to_seq: replyToSeq
                };

                var queryDataParameter = QForum.createXMLDataString(queryDataObj);
                var queryData = "<LayoutHeader>" + queryDataParameter + "</LayoutHeader>";

                var successCallback = function(data) {

                    var resultCode = data['ResultCode'];

                    if (resultCode === "1") {
                        //window.postCreater = data["Content"].post_creator;
                        //window.postContent = data["Content"].post_content;
                        //window.postCreateTime = data["Content"].post_create_time;
                        QForum.VIEW.replyListView(data["Content"].reply_list, replyCallback);
                    }

                };

                var failCallback = function(data) {};

                QForum.CustomAPI("POST", true, "getPostDetails", successCallback, failCallback, queryData, "");

            }(replyCallback));
        },
        newComment: function(content) {
            (function(content) {

                loadingMask("show");

                var queryDataObj = {
                    emp_no: loginData["emp_no"],
                    source: window.appKey,
                    post_id: QForum.postID,
                    content: content
                };

                var queryDataParameter = QForum.createXMLDataString(queryDataObj);

                //Check if comment has img which was upload by QStorage.
                var fileListParameter = "";
                var uploadDatas = QStorage.getUploadDatas();

                if (uploadDatas.length > 0) {

                    fileListParameter = "<file_list>";

                    for (var i=0; i<uploadDatas.length; i++) {
                        fileListParameter += "<file>" + uploadDatas[i] + "</file>";
                    }

                    fileListParameter += "</file_list>"

                }

                var queryData = "<LayoutHeader>" + queryDataParameter + fileListParameter + "</LayoutHeader>";

                var successCallback = function(data) {
                    var resultCode = data['ResultCode'];

                    if (resultCode === "1") {
                        //Clear File Path of Upload Data in QStorage
                        QStorage.clearUploadDatas();

                        //Refresh Reply ListView
                        QForum.API.getPostDetails(true);

                        if (device.platform === "iOS") {
                            window.CKEDITOR.instances.editor.resize(QForum.editorOriginalSize.width, QForum.editorOriginalSize.height);

                            $(".QForum-Content.reply-fullscreen-popup").height( (window.innerHeight - 20) );

                            $("#" + QForum.pageID).addClass("ui-page-active");

                            window.stopCheckiOSKeyboardHide();
                        }
                    }
                };

                var failCallback = function(data) {};

                QForum.CustomAPI("POST", true, "newComment", successCallback, failCallback, queryData, "");

            }(content));
        },
        modifyComment: function(content) {
            (function(content) {

                loadingMask("show");

                var queryDataObj = {
                    emp_no: loginData["emp_no"],
                    source: window.appKey,
                    comment_id: QForum.commentID,
                    content: content
                };

                var queryDataParameter = QForum.createXMLDataString(queryDataObj);

                //Set editor content in hide-content, then check it.
                $(".QForum-Content.reply-fullscreen-popup .QForum.main .QForum.hide-content").html(content);

                //Check if comment has img exist.
                var fileListParameter = "";
                var imgDomArray = $(".QForum-Content.reply-fullscreen-popup .QForum.main .QForum.hide-content").find("img");

                if (imgDomArray.length > 0) {

                    fileListParameter = "<file_list>";

                    for (var i=0; i<imgDomArray.length; i++) {
                        fileListParameter += "<file>" + imgDomArray[i].src + "</file>";
                    }

                    fileListParameter += "</file_list>";

                }

                var queryData = "<LayoutHeader>" + queryDataParameter + fileListParameter + "</LayoutHeader>";

                var successCallback = function(data) {
                    var resultCode = data['ResultCode'];

                    if (resultCode === "1") {
                        //Clear File Path of Upload Data in QStorage
                        QStorage.clearUploadDatas();

                        //Refresh Reply ListView
                        QForum.API.getPostDetails(true);
                    }
                };

                var failCallback = function(data) {};

                QForum.CustomAPI("POST", true, "modifyComment", successCallback, failCallback, queryData, "");

            }(content));
        },
        deleteComment: function() {
            (function() {

                loadingMask("show");

                var queryDataObj = {
                    emp_no: loginData["emp_no"],
                    source: window.appKey,
                    comment_id: QForum.commentID
                };

                var queryDataParameter = QForum.createXMLDataString(queryDataObj);
                var queryData = "<LayoutHeader>" + queryDataParameter + "</LayoutHeader>";

                var successCallback = function(data) {
                    var resultCode = data['ResultCode'];

                    if (resultCode === "1") {
                        //Clear File Path of Upload Data in QStorage
                        QStorage.clearUploadDatas();

                        //Refresh Reply ListView
                        QForum.API.getPostDetails(true);
                    }
                };

                var failCallback = function(data) {};

                QForum.CustomAPI("POST", true, "deleteComment", successCallback, failCallback, queryData, "");

            }());
        }
    },
    VIEW: {
        createReplyUI: function(postID, pageID) {

            QForum.METHOD.setPostID(postID);
            QForum.METHOD.setPageID(pageID);
            QForum.METHOD.setReplyLastID(0);

            //Create Reply Button
            QForum.VIEW.replyButtonFooter();

        },
        replyButtonFooter: function() {

            if ($("#" + QForum.pageID + " .QForum-Content .reply-button").length == 0) {
                var replyButtonFooterHTML = $($("template#tplQForumReplyButtonFooter").html());
                $("#" + QForum.pageID).append(replyButtonFooterHTML).trigger("create");

                //Bind Event
                QForum.EVENT.replyButtonClick();

                //Create FullScreen Reply Editor Popup
                QForum.VIEW.replyFullScreenPopup();
            }

            QForum.API.getPostDetails();
        },
        replyFullScreenPopup: function(action) {
            action = action || null;

            var showPopup = false;

            if ($(".QForum-Content.reply-fullscreen-popup").length == 0) {

                var replyFullScreenPopupHTML = $($("template#tplQForumReplyFullScreenPopup").html());
                $("body").append(replyFullScreenPopupHTML);

                //For iOS, overlap
                if (device.platform === "iOS") {
                    var height = parseInt(document.documentElement.clientHeight - 20, 10);

                    $(".QForum-Content.reply-fullscreen-popup").css({
                        "height": height + "px",
                        "margin-top": "20px"
                    });
                }

                //Plugin ckditor - initSample
                window.initSample();

                //Bind Event
                QForum.EVENT.editorKeyIn();
                QForum.EVENT.replySubmit();
                QForum.EVENT.replyCancel();

                //For detect keyboard show up in iOS
                if (device.platform === "iOS") {
                    QForum.EVENT.detectKeyboardShowUp();
                }

            } else {

                if (action != null) {
                    if (action === "new") {

                        //Clear ckeditor content
                        QForum.METHOD.clearEditorContent("");

                        QForum.commentAction = "new";
                        showPopup = true;

                    } else if (action === "update") {

                        //Set ckeditor content
                        var htmlContent = $("#comment-" + QForum.commentID + " .QForum.content").html();
                        QForum.METHOD.clearEditorContent(htmlContent);

                        //Set Submit Button
                        $("#replySubmit.QForum").removeClass("none-work");

                        QForum.commentAction = "update";
                        showPopup = true;

                    }
                }

            }

            if (showPopup) {

                $(".QForum-Content.reply-fullscreen-popup").show();

                //Resize Editor
                var width = parseInt(document.documentElement.clientWidth * 92 / 100, 10);
                var height = parseInt(document.documentElement.clientHeight * 82 / 100, 10);

                //Auto set top of .cke_chrome / .cke_top
                var hederHeight = parseInt(document.documentElement.clientWidth * 13.1 / 100, 10);
                var marginTop = parseInt(document.documentElement.clientWidth * 2.73 / 100, 10);
                var toolBarHeight = 42;

                //For iOS, overlap
                if (device.platform === "iOS") {
                    height -= 20;
                    hederHeight += 20;
                }

                //For small size screen, toolbar become 2 lines
                if ($(".cke_top").height() > 33) {
                    //height -= 33;
                }

                QForum.editorOriginalSize.width = width;
                QForum.editorOriginalSize.height = height;

                window.CKEDITOR.instances.editor.resize(width, height);

                $(".QForum-Content.reply-fullscreen-popup .main .cke_chrome").css({
                    "top": (hederHeight + marginTop + toolBarHeight) + "px"
                });

                $(".QForum-Content.reply-fullscreen-popup .main .cke_top").css({
                    "top": hederHeight + "px"
                });
            }

        },
        replyListView: function(replyDataList, replyCallback) {

            if (replyDataList.length > 0) {
                if ($("#" + QForum.pageID + " .QForum-Content.reply-listview").length == 0) {

                    var replyListViewHTML = $($("template#tplQForumReplyListView").html());
                    $("#" + QForum.pageID + " .page-main").append(replyListViewHTML);

                }

                //Clear list-data
                if (QForum.replyLastID == 0) {
                    $("#" + QForum.pageID + " .QForum-Content.reply-listview .QForum.list-data").remove();
                }

                var replyListDataHTML = $("template#tplQForumReplyListData").html();

                for (var i=0; i<replyDataList.length; i++) {
                    (function(i, replyDataList) {

                        var tempDate = dateFormatYMD(replyDataList[i].reply_create_time);
                        var createTime = new Date(tempDate);
                        var createTimeConvert = createTime.TimeZoneConvert();
                        createTimeConvert = createTimeConvert.substr(0, parseInt(createTimeConvert.length - 3, 10));

                        var replyListData = $(replyListDataHTML);
                        replyListData.prop("id", "comment-" + replyDataList[i].comment_id);
                        replyListData.find(".title .name").html(replyDataList[i].reply_user);
                        replyListData.find(".time .time-1").html(createTimeConvert);
                        replyListData.find(".content").html(replyDataList[i].reply_content);

                        //Check if this comment has been delete or edit
                        if (replyDataList[i].reply_delete_time != null) {

                            replyListData.find(".content").html("<span class='delete-text'>" + QForum.commentDeleteText + "</span>");

                            tempDate = dateFormatYMD(replyDataList[i].reply_delete_time);
                            createTime = new Date(tempDate);
                            createTimeConvert = createTime.TimeZoneConvert();
                            createTimeConvert = createTimeConvert.substr(0, parseInt(createTimeConvert.length - 3, 10));

                            replyListData.find(".time .time-2 .text-time").html(createTimeConvert);
                            replyListData.find(".time .time-2 .text-delete").removeClass("hide");
                            replyListData.find(".time .time-2").removeClass("hide");

                        } else if (replyDataList[i].reply_update_time != null) {

                            tempDate = dateFormatYMD(replyDataList[i].reply_update_time);
                            createTime = new Date(tempDate);
                            createTimeConvert = createTime.TimeZoneConvert();
                            createTimeConvert = createTimeConvert.substr(0, parseInt(createTimeConvert.length - 3, 10));

                            replyListData.find(".time .time-2 .text-time").html(createTimeConvert);
                            replyListData.find(".time .time-2 .text-edit").removeClass("hide");
                            replyListData.find(".time .time-2").removeClass("hide");

                        }

                        //Only current user can edit/delete comment
                        if (replyDataList[i].reply_user === loginData["loginid"]) {
                            replyListData.find(".title .button").removeClass("hide");
                        }

                        $("#" + QForum.pageID + " .QForum-Content.reply-listview").append(replyListData);

                        //Set QForum.replyLastID
                        if (i == (replyDataList.length - 1)) {
                            //QForum.METHOD.setReplyLastID(replyDataList[i].sequence_id);

                            //Hide Reply-Fullscreen Popup
                            $(".QForum-Content.reply-fullscreen-popup").hide();
                            loadingMask("hide");

                            //Reply Succes show Prompt
                            if (replyCallback) {
                                QForum.VIEW.promptPopup(QForum.commentActionText[QForum.commentAction]);
                            }
                        }

                    }(i, replyDataList));
                }

                //Bind Event
                QForum.EVENT.replySelect();
            } else {
                $("#" + QForum.pageID + " .QForum-Content.reply-listview").remove();
            }

        },
        promptPopup: function(text) {
            text = text || null;

            if ($(".QForum-Content.prompt-popup").length == 0) {

                var replyPromptPopupHTML = $($("template#tplQForumPromptPopup").html());
                $("body").append(replyPromptPopupHTML);

                //For iOS, overlap
                if (device.platform === "iOS") {
                    var height = parseInt(document.documentElement.clientHeight - 20, 10);

                    $(".QForum-Content.prompt-popup").css({
                        "height": height + "px",
                        "margin-top": "20px"
                    });
                }

            }

            if (text != null) {
                $(".QForum-Content.prompt-popup .main .text").html(text);
                $(".QForum-Content.prompt-popup").show();
                tplJS.preventPageScroll();

                setTimeout(function() {
                    $(".QForum-Content.prompt-popup").hide();
                    tplJS.recoveryPageScroll();
                }, 3000);
            }

        },
        deleteConfirmPopup: function() {

            if ($("#QForumDeleteConfirmPopup").length == 0) {

                var noRelatedEventExistData = {
                    id: "QForumDeleteConfirmPopup",
                    content: $("template#tplQForumDeleteConfirmPopup").html()
                };

                tplJS.Popup(null, null, "append", noRelatedEventExistData);

                //Bind Event
                QForum.EVENT.replyDeleteConfirm();

            } else {
                $("#QForumDeleteConfirmPopup").popup("open");
            }

        }
    },
    EVENT: {
        detectKeyboardShowUp: function() {

            //Auto re-size height of editor, when keyboard show up.
            QForum.deviceOriginalSize.width = $(window).width();
            QForum.deviceOriginalSize.height = $(window).height();

            if (device.platform === "Android") {
                $(window).resize(function() {

                    if (typeof $(".QForum-Content.reply-fullscreen-popup").css("display") === "undefined" || 
                        $(".QForum-Content.reply-fullscreen-popup").css("display") == "none") {
                        return;
                    }

                    var newWindowWidth = $(window).width();
                    var newWindowHeight = $(window).height();
                    var headerHeight = $(".QForum-Content.reply-fullscreen-popup .QForum.header").height();
                    var toolbarHeight = $(".QForum-Content.reply-fullscreen-popup .QForum.main .cke_top").height();
                    var marginTopBottom = parseInt(document.documentElement.clientWidth * (2.73 + 4.3) / 100, 10);

                    if (newWindowHeight == QForum.deviceOriginalSize.height) {
                        console.log("--------------------keyboard hide");

                        window.CKEDITOR.instances.editor.resize(QForum.editorOriginalSize.width, QForum.editorOriginalSize.height);

                        $("#" + QForum.pageID).addClass("ui-page-active");
                    } else if (newWindowHeight < QForum.deviceOriginalSize.height) {
                        console.log("--------------------keyboard show up");

                        var editorTempWidth = $("#cke_editor").width();
                        var editorTempHeight = parseInt(newWindowHeight - headerHeight - toolbarHeight - marginTopBottom, 10);

                        window.CKEDITOR.instances.editor.resize(editorTempWidth, editorTempHeight);

                        $("#" + QForum.pageID).removeClass("ui-page-active");
                    }

                });
            } else if (device.platform === "iOS") {
                window.CKEDITOR.instances.editor.on("blur", function(e) {

                    console.log("--------------------keyboard hide");

                    if (typeof $(".QForum-Content.reply-fullscreen-popup").css("display") === "undefined") {
                        return;
                    }

                    setTimeout(function() {

                        window.CKEDITOR.instances.editor.resize(QForum.editorOriginalSize.width, QForum.editorOriginalSize.height);

                        $(".QForum-Content.reply-fullscreen-popup").height( (window.innerHeight - 20) );

                        $("#" + QForum.pageID).addClass("ui-page-active");

                    }, 100);

                });

                window.CKEDITOR.instances.editor.on("focus", function(e) {

                    console.log("--------------------keyboard show up");

                    //QForum.editor.editable = window.CKEDITOR.instances.editor.editable();
                    //QForum.editor.selection = window.CKEDITOR.instances.editor.getSelection();
                    //QForum.editor.range = QForum.editor.selection.getRanges()[0];

                    if (typeof $(".QForum-Content.reply-fullscreen-popup").css("display") === "undefined") {
                        return;
                    }

                    var headerHeight = $(".QForum-Content.reply-fullscreen-popup .QForum.header").height();
                    var toolbarHeight = $(".QForum-Content.reply-fullscreen-popup .QForum.main .cke_top").height();
                    var marginTopBottom = parseInt(document.documentElement.clientWidth * (2.73 + 4.3) / 100, 10);

                    setTimeout(function() {

                        var editorTempWidth = $("#cke_editor").width();
                        var editorTempHeight = parseInt(window.innerHeight - headerHeight - toolbarHeight - marginTopBottom - 20, 10);

                        window.CKEDITOR.instances.editor.resize(editorTempWidth, editorTempHeight);

                        $("#" + QForum.pageID).removeClass("ui-page-active");

                    }, 100);

                    setTimeout(function() {
                        tplJS.preventPageScroll();
                    }, 150);

                    setTimeout(function() {
                        $('html, body').animate({
                            scrollTop: 0
                        }, 0);

                        $(".QForum-Content.reply-fullscreen-popup").css({
                            "top": 0,
                            "height": (window.innerHeight - 20)
                        });
                    }, 200);

                    //Prevent [blur] event not trigger
                    window.checkiOSKeyboardHide = setInterval(function() {
                        if (window.innerHeight >= document.documentElement.clientHeight) {
                            if (typeof window.stopCheckiOSKeyboardHide !== "undefined") {

                                if (typeof $(".QForum-Content.reply-fullscreen-popup").css("display") === "undefined") {
                                    return;
                                }

                                window.CKEDITOR.instances.editor.resize(QForum.editorOriginalSize.width, QForum.editorOriginalSize.height);

                                $(".QForum-Content.reply-fullscreen-popup").height( (window.innerHeight - 20) );

                                $("#" + QForum.pageID).addClass("ui-page-active");

                                window.stopCheckiOSKeyboardHide();

                            }
                        }
                    }, 100);

                });

                window.stopCheckiOSKeyboardHide = function() {
                    if (window.checkiOSKeyboardHide != null) {
                        clearInterval(window.checkiOSKeyboardHide);
                        window.checkiOSKeyboardHide = null;
                    }
                };

            }

        },
        editorKeyIn: function() {

            window.CKEDITOR.instances.editor.on('key', function(e) {
                var self = this;

                if (device.platform === "iOS") {
                    if (!QForum.iOSTriggerKeyboardEvent) {
                        tplJS.recoveryPageScroll();
                        QForum.iOSTriggerKeyboardEvent = true;
                    }
                }

                setTimeout(function() {
                    if (self.getData().length > 0) {
                        $("#replySubmit.QForum").removeClass("none-work");
                    } else {
                        $("#replySubmit.QForum").addClass("none-work");
                    }
                }, 500);

                if (device.platform === "iOS") {
                    setTimeout(function() {
                        tplJS.preventPageScroll();
                    }, 50);

                    setTimeout(function() {
                        $('html, body').animate({
                            scrollTop: 0
                        }, 0);

                        $(".QForum-Content.reply-fullscreen-popup").css({
                            "top": 0,
                            "height": (window.innerHeight - 20)
                        });
                    }, 100);
                }
            });

        },
        replySubmit: function() {

            $("#replySubmit.QForum").off("vclick");

            $(document).on({
                vclick: function() {
                    setTimeout(function() {
                        if (!$(this).hasClass("none-work")) {

                            if (QForum.commentAction === "new") {
                                QForum.API.newComment(QForum.METHOD.getEditorContent());
                            } else if (QForum.commentAction === "update") {
                                QForum.API.modifyComment(QForum.METHOD.getEditorContent());
                            }

                        }
                    }, 500);
                }
            }, "#replySubmit.QForum");

        },
        replyCancel: function() {

            $("#replyCancel.QForum").off("vclick");

            $(document).on({
                vclick: function() {
                    setTimeout(function() {
                        $(".QForum-Content.reply-fullscreen-popup").hide();
                    }, 500);
                }
            }, "#replyCancel.QForum");

        },
        replySelect: function() {

            $("#" + QForum.pageID + " .QForum-Content.reply-listview .QForum.list-data .QForum.reply-select").off("change");

            $("#" + QForum.pageID + " .QForum-Content.reply-listview .QForum.list-data .QForum.reply-select").one("change", function() {
                var self = this;

                setTimeout(function() {
                    QForum.commentID = $(self).parents(".QForum.list-data").prop("id").substr(8);
                    console.log("commentID:"+QForum.commentID);

                    var action = $(self).val();
                    console.log($(self).val());

                    $("#comment-" + QForum.commentID + " .QForum.reply-select option:eq(0)").prop("selected", true);

                    if (action === "edit") {
                        QForum.VIEW.replyFullScreenPopup("update");
                    } else if (action === "delete") {

                        QForum.commentAction = "delete";
                        QForum.VIEW.deleteConfirmPopup();

                    }

                    QForum.EVENT.replySelect();
                }, 500);
            });

        },
        replyButtonClick: function() {

            $(document).on({
                vclick: function(event) {
                    setTimeout(function() {
                        QForum.VIEW.replyFullScreenPopup("new");
                    }, 500);

                    footerFixed();
                }
            }, "#" + QForum.pageID + " .QForum-Content .reply-button");

        },
        replyDeleteConfirm: function() {

            $(document).on({
                vclick: function(event) {
                    setTimeout(function() {
                        var dom = $(event.target);

                        if (dom.hasClass("cancel") || dom.parent().hasClass("cancel")) {
                            $("#QForumDeleteConfirmPopup").popup("close");
                        } else if (dom.hasClass("confirm") || dom.parent().hasClass("confirm")) {
                            $("#QForumDeleteConfirmPopup").popup("close");
                            QForum.API.deleteComment();
                        }
                    }, 500);
                }
            }, "#QForumDeleteConfirmPopup");

        }
    }
};

QForum.initial();
