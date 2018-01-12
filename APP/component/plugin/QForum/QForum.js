
//APP need have a div with class-name = "QForum-Content"
var QForum = {
    appKey: "appqforum",
    appSecretKey: "",
    viewList: ["footer", "popup"],
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
    API: {
        getBoardList: function() {
            (function() {

                var successCallback = function(data) {};

                var failCallback = function(data) {};

                QForum.CustomAPI("POST", true, "getBoardList", successCallback, failCallback, queryData, "");

            }());
        },
        getPostDetails: function(postID) {
            (function() {

                var successCallback = function(data) {};

                var failCallback = function(data) {};

                QForum.CustomAPI("POST", true, "getPostDetails", successCallback, failCallback, queryData, "");

            }());
        },
        newComment: function() {
            (function() {

                var successCallback = function(data) {};

                var failCallback = function(data) {};

                QForum.CustomAPI("POST", true, "newComment", successCallback, failCallback, queryData, "");

            }());
        }
    },
    VIEW: {
        replyButtonFooter: function(pageID) {

            if ($("#" + pageID + " .QForum-Content .reply-button").length == 0) {
                var replyButtonFooterHTML = $($("template#tplReplyButtonFooter").html());
                $("#" + pageID).append(replyButtonFooterHTML).trigger("create");

                //Create Popup
                QForum.VIEW.replyFullScreenPopup();

                //Bind Event
                $(document).on({
                    click: function(event) {

                        $(".QForum-Content.reply-fullscreen-popup").show();

                        //Resize Editor
                        var width = parseInt(document.documentElement.clientWidth * 90 / 100, 10);
                        var height = parseInt(document.documentElement.clientHeight * 80 / 100, 10);

                        //For iOS, overlap
                        if (device.platform === "iOS") {
                            //height -= 20;
                        }

                        //For small size screen, toolbar become 2 lines
                        if ($(".cke_top").height() > 33) {
                            //height -= 33;
                        }

                        CKEDITOR.instances.editor.resize(width, height);

                    }
                }, ".QForum-Content .reply-button");
            }

        },
        replyFullScreenPopup: function() {

            if ($(".QForum-Content.reply-fullscreen-popup").length == 0) {

                var replyFullScreenPopupHTML = $($("template#tplReplyFullScreenPopup").html());
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

            }

        }
    }
};

QForum.initial();
