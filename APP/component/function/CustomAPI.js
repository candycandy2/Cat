//Custom API

function CustomAPI(requestType, asyncType, requestAction, successCallback, failCallback, queryData, queryStr) {
    //queryStr: start with [&], ex: &account=test&pwd=123

    failCallback = failCallback || null;
    queryData = queryData || null;
    queryStr = queryStr || "";

    function requestSuccess(data) {
        checkTokenValid(data['ResultCode'], data['token_valid'], successCallback, data);

        var dataArr = [
            "Call API",
            requestAction,
            data['ResultCode']
        ];
        LogFile.createAndWriteFile(dataArr);
    }

    // review
    function requestError(data) {
        errorHandler(data);
        if (failCallback) {
            failCallback();
        }
    }

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
        url: serverURL + "/" + appApiPath + "/public/v101/custom/" + appKey + "/" + requestAction + "?lang=" + browserLanguage + "&uuid=" + loginData.uuid + queryStr,
        dataType: "json",
        data: queryData,
        async: asyncType,
        cache: false,
        timeout: 30000,
        success: requestSuccess,
        error: requestError
    });

}