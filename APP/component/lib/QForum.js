
//APP need have a div with class-name = "QForum-Content"
var QForum = {
    appKey: "appqforum",
    appSecretKey: "",
    initial: function() {

        //According to the Parent versionName, decide APPKey > [dev] / [test] / []
        if (loginData["versionName"].indexOf("Staging") !== -1) {
            QForum.appKey = "appqforumtest";
        } else if (loginData["versionName"].indexOf("Development") !== -1) {
            QForum.appKey = "appqforumdev";
        } else {
            QForum.appKey = "appqforum";
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
};
