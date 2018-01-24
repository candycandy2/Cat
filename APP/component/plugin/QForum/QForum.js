
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

        //Get Board List
        QForum.API.getBoardList();

        //Load View
        $.map(QForum.viewList, function(value, key) {
            (function(viewID) {
                $.get("plugin/QForum/view/" + viewID + ".html", function(data) {
                    $.mobile.pageContainer.append(data);
                }, "html");
            }(value));
        });

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

                for (var i=0; i<QForum.boardList.length; i++) {
                    if (QForum.boardList[i].board_type_name == "ENS") {
                        if (QForum.boardList[i].board_name == projectName) {
                            QForum.boardID = QForum.boardList[i].board_id;
                        }
                    }
                }

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
        clearEditorContent: function() {
            window.CKEDITOR.instances.editor.setData("");
        }
    },
    API: {
        getBoardList: function() {
            (function() {

                var queryData = "<LayoutHeader><emp_no>" + loginData["emp_no"] + "</emp_no></LayoutHeader>";

                var successCallback = function(data) {
                    QForum.boardList = data["Content"].board_list;
                    QForum.METHOD.setBoardID();
                };

                var failCallback = function(data) {};

                QForum.CustomAPI("POST", true, "getBoardList", successCallback, failCallback, queryData, "");

            }());
        },
        getPostDetails: function(fromID) {
            fromID = fromID || null;

            (function(fromID) {

                var replyFromSeq = (QForum.replyLastID + 1);
                var replyToSeq = (replyFromSeq + QForum.replyDataRange - 1);

                var queryDataObj = {
                    emp_no: loginData["emp_no"],
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
                        QForum.VIEW.replyListView(data["Content"].reply_list);
                    }

                };

                var failCallback = function(data) {};

                QForum.CustomAPI("POST", true, "getPostDetails", successCallback, failCallback, queryData, "");

            }(fromID));
        },
        newComment: function(content) {
            (function() {

                loadingMask("show");

                var queryDataObj = {
                    emp_no: loginData["emp_no"],
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
                    QForum.API.getPostDetails();
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

                //Create Popup
                QForum.VIEW.replyFullScreenPopup();

                //Bind Event
                QForum.EVENT.replyButtonClick();
                QForum.EVENT.replySubmit();
                QForum.EVENT.replyCancel();
            }

            QForum.API.getPostDetails();
        },
        replyFullScreenPopup: function() {

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

                initSample();

                QForum.EVENT.editorKeyIn();

            }

        },
        replyListView: function(replyDataList) {

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
                    var tempDate = dateFormatYMD(replyDataList[i].reply_create_time);
                    var createTime = new Date(tempDate);
                    var createTimeConvert = createTime.TimeZoneConvert();
                    createTimeConvert = createTimeConvert.substr(0, parseInt(createTimeConvert.length - 3, 10));

                    var replyListData = $(replyListDataHTML);
                    replyListData.find(".title .name").html(replyDataList[i].reply_user);
                    replyListData.find(".time .time-1").html(createTimeConvert);
                    replyListData.find(".content").html(replyDataList[i].reply_content);

                    $("#" + QForum.pageID + " .QForum-Content.reply-listview").append(replyListData);

                    //Set QForum.replyLastID
                    if (i == (replyDataList.length - 1)) {
                        QForum.METHOD.setReplyLastID(replyDataList[i].sequence_id);
                    }
                }
            } else {
                $("#" + QForum.pageID + " .QForum-Content.reply-listview").remove();
            }

            $(".QForum-Content.reply-fullscreen-popup").hide();
            loadingMask("hide");

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

            $("#replySubmit.QForum").off("click");

            $(document).on({
                click: function() {
                    if (!$(this).hasClass("none-work")) {
                        QForum.API.newComment(QForum.METHOD.getEditorContent());
                    }
                }
            }, "#replySubmit.QForum");

        },
        replyCancel: function() {

            $("#replyCancel.QForum").off("click");

            $(document).on({
                click: function() {
                    $(".QForum-Content.reply-fullscreen-popup").hide();
                }
            }, "#replyCancel.QForum");

        },
        replyButtonClick: function() {

            $(document).on({
                click: function(event) {

                    //QStorage Initial
                    QStorage.initial();

                    QForum.METHOD.clearEditorContent();
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
            }, ".QForum-Content .reply-button");

        }
    }
};

QForum.initial();
