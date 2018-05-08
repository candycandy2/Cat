//CustomEx API
//priority == "high" "low" "", default == "high"
//expiredTimeSeconds == integer, default == 3600

function CustomAPIEx(requestType, asyncType, requestAction, successCallback, failCallback, queryData, queryStr, expiredTimeSeconds, priority) {
    //queryStr: start with [&], ex: &account=test&pwd=123

    failCallback = failCallback || null;
    queryData = queryData || null;
    queryStr = queryStr || "";
    expiredTimeSeconds = expiredTimeSeconds || 60 * 60;
    priority = priority || "high";

    var urlStr = serverURL + "/" + appApiPath + "/public/v101/custom/" + appKey + "/" + requestAction + "?lang=" + browserLanguage + "&uuid=" + loginData.uuid + queryStr;
    var keyItem = urlStr + queryData;

    function requestSuccess(data) {
        var checkTokenValidResult = checkTokenValid(data['ResultCode'], data['token_valid'], successCallback, data);

        //LOG
        var dataArr = [
            "Call API",
            requestAction,
            data['ResultCode']
        ];
        LogFile.createAndWriteFile(dataArr);
        //LOG...

        //Cache
        if (checkTokenValidResult === true) {
            // save data into localstorage
            var contentInfo = [];
            var nowTime = new Date();
            contentInfo.push({ 'result': data, 'time': nowTime });
            localStorage.setItem(keyItem, JSON.stringify(contentInfo));
        }
        //Cache...
    }

    // review by alan
    function requestError(data) {
        if (priority != "low") {
            errorHandler(data, requestAction);
            if (failCallback != null) {
                failCallback();
            }
        }
    }

    if (localStorage.getItem(keyItem) === null) {
    } else {
        var storageData = JSON.parse(localStorage.getItem(keyItem));
        if (checkDataExpired(storageData[0].time, expiredTimeSeconds, 'ss')) {
            localStorage.removeItem(keyItem);
        }
    }
    if (localStorage.getItem(keyItem) === null) {

        var signatureTime = getSignature("getTime");
        var signatureInBase64 = getSignature("getInBase64", signatureTime);

        $.ajax({
            type: requestType,
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'App-Key': appKey,
                'Signature-Time': signatureTime,
                'Signature': signatureInBase64,
                'token': loginData.token
            },
            url: urlStr,
            dataType: "json",
            data: queryData,
            async: asyncType,
            cache: false,
            timeout: 30000,
            success: requestSuccess,
            error: requestError
        });
    } else {
        var storageData = JSON.parse(localStorage.getItem(keyItem));
        successCallback(storageData[0].result);
    }

    return keyItem;
}