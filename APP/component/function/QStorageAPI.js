//图片上传
function QStorageAPI(requestType, asyncType, requestAction, successCallback, failCallback, queryData, queryStr) {
    //API [checkAppVersion] [getSecurityList]
    //even though these 2 API were from QPlay, the API path is [/public/v101/qplay/],
    //but, when other APP call these 2 API,
    //need to set the specific [App-Key] and [appSecretKey] by the APP, not by QPlay.

    //requestAction = 'picture' || 'portrait'
    //queryData = new FormData()
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
        errorHandler(data, requestAction);
        if (failCallback) {
            failCallback();
        }
    }

    var signatureTime = getSignature("getTime");
    var signatureInBase64 = getSignature("getInBase64", signatureTime);

    $.ajax({
        type: requestType,
        headers: {
            'App-Key': appKey,
            'Signature-Time': signatureTime,
            'Signature': signatureInBase64,
            'account': loginData.emp_no
        },
        url: serverURL + "/qstorage/public/v101/" + requestAction + "?lang=" + browserLanguage + "&uuid=" + loginData.uuid + queryStr,
        data: queryData,
        async: asyncType,
        processData: false,
        contentType: false,
        success: requestSuccess,
        error: requestError
    });
}