//QPlayAPI

function QPlayAPI(requestType, requestAction, successCallback, failCallback, queryData, queryStr) {
    //API [checkAppVersion] [getSecurityList]
    //even though these 2 API were from QPlay, the API path is [/public/v101/qplay/],
    //but, when other APP call these 2 API,
    //need to set the specific [App-Key] and [appSecretKey] by the APP, not by QPlay.

    //queryStr: start with [&], ex: &account=test&pwd=123

    failCallback = failCallback || null;
    queryData = queryData || null;
    queryStr = queryStr || "";

    function requestSuccess(data) {
        checkTokenValid(data['result_code'], data['token_valid'], successCallback, data);

        var dataArr = [
            "Call API",
            requestAction,
            data['result_code']
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
            'token': loginData.token,
            'push-token': loginData.pushToken
        },
        url: serverURL + "/" + appApiPath + "/public/v101/qplay/" + requestAction + "?lang=" + browserLanguage + "&uuid=" + loginData.uuid + queryStr,
        dataType: "json",
        data: queryData,
        cache: false,
        timeout: 30000,
        success: requestSuccess,
        error: requestError
    });

}