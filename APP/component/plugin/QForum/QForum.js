
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
    boardList: [],
    boardID: 0,
    postID: "",
    pageID: "",
    replyLastID: 0,
    replyDataRange: 10,
    commentID: "",
    initial: function() {

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

                window.retrySetBoardID = setInterval(function() {
                    if (QForum.boardList.length > 0) {

                        if (typeof window.stopRetrySetBoardID !== "undefined") {
                            window.stopRetrySetBoardID();
                        }

                        for (var i=0; i<QForum.boardList.length; i++) {
                            if (QForum.boardList[i].board_type_name == "ENS") {
                                if (QForum.boardList[i].board_name == projectName) {
                                    QForum.boardID = QForum.boardList[i].board_id;
                                }
                            }
                        }
                    }
                }, 500);

                window.stopRetrySetBoardID = function() {
                    if (window.retrySetBoardID != null) {
                        clearInterval(window.retrySetBoardID);
                        window.retrySetBoardID = null;
                    }
                };

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
            (function() {

                loadingMask("show");

                var queryDataObj = {
                    emp_no: loginData["emp_no"],
                    source: window.appKey,
                    post_id: QForum.postID,
                    content: content
                };

                var queryDataParameter = QForum.createXMLDataString(queryDataObj);

                //Check if comment has img or not.
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

                console.log(queryData);

                var successCallback = function(data) {
                    //Clear File Path of Upload Data in QStorage
                    QStorage.clearUploadDatas();

                    //Refresh Reply ListView
                    QForum.API.getPostDetails(true);
                };

                var failCallback = function(data) {};

                QForum.CustomAPI("POST", true, "newComment", successCallback, failCallback, queryData, "");

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

            } else {

                if (action != null) {
                    if (action === "new") {

                        //Clear ckeditor content
                        QForum.METHOD.clearEditorContent("");

                        showPopup = true;

                    } else if (action === "update") {

                        //Set ckeditor content
                        var htmlContent = $("#" + QForum.commentID + " .QForum.content").html();
                        QForum.METHOD.clearEditorContent(htmlContent);

                        showPopup = true;
                        //$(".QForum-Content.reply-fullscreen-popup").show();
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
                if (QForum.replyLastID == 1) {
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

                        $("#" + QForum.pageID + " .QForum-Content.reply-listview").append(replyListData);

                        //Set QForum.replyLastID
                        if (i == (replyDataList.length - 1)) {
                            QForum.METHOD.setReplyLastID(replyDataList[i].sequence_id);

                            //Hide Reply-Fullscreen Popup
                            $(".QForum-Content.reply-fullscreen-popup").hide();
                            loadingMask("hide");

                            //Reply Succes show Prompt
                            if (replyCallback) {
                                QForum.VIEW.promptPopup("回覆已送出");
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
        editorKeyIn: function() {

            window.CKEDITOR.instances.editor.on('key', function(e) {
                var self = this;

                setTimeout(function() {
                    if (self.getData().length > 0) {
                        $("#replySubmit.QForum").removeClass("none-work");
                    } else {
                        $("#replySubmit.QForum").addClass("none-work");
                    }
                }, 500);
            });

        },
        replySubmit: function() {

            $("#replySubmit.QForum").off("vclick");

            $(document).on({
                vclick: function() {
                    setTimeout(function() {
                        if (!$(this).hasClass("none-work")) {
                            QForum.API.newComment(QForum.METHOD.getEditorContent());
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
                    QForum.commentID = $(self).parents(".QForum.list-data").prop("id");
                    console.log("commentID:"+QForum.commentID);

                    var action = $(self).val();
                    console.log($(self).val());

                    $("#" + QForum.commentID + " .QForum.reply-select option:eq(0)").prop("selected", true);

                    if (action === "edit") {
                        QForum.VIEW.replyFullScreenPopup("update");
                    } else if (action === "delete") {
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
                        }
                    }, 500);
                }
            }, "#QForumDeleteConfirmPopup");

        }
    }
};

QForum.initial();
