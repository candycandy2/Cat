//qplayAPI - EIS
//TODO: need to chang for EIS
function QPlayAPI(requestType, requestAction, successCallback, failCallback, queryData) {

    failCallback = failCallback || null;
    queryData = queryData || null;

    function requestSuccess(data) {
        checkTokenValid(data['ResultCode'], data['token_valid'], successCallback, data);

        var dataArr = [
            "Call API",
            requestAction,
            data['result_code']
        ];
        LogFile.createAndWriteFile(dataArr);
    }

    function requestError(data) {
        checkNetwork(data);
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
        url: serverURL + "/" + appApiPath + "/public/v101/custom/" + appKey + "/" + requestAction + "?lang=en-us&uuid=" + loginData.uuid,
//        url: serverURL + "/" + appApiPath + "/public/v101/custom/" + appKey + "/" + requestAction + "?lang=en-us&uuid=" + loginData.uuid,
        dataType: "json",
        data: queryData,
        cache: false,
        timeout: 3000,
        success: requestSuccess,
        error: requestError
    });
    
}
