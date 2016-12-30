//qplayAPI - YellowPage

function QPlayAPI(requestType, requestAction, successCallback, failCallback, queryData) {

    failCallback = failCallback || null;
    queryData = queryData || null;

    function requestSuccess(data) {
        checkTokenValid(data['ResultCode'], data['token_valid'], successCallback, data);
    }

    function requestError(data) {
        checkNetwork();
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
        url: serverURL + "/" + appApiPath + "/public/v101/custom/yellowpage/" + requestAction + "?lang=en-us&uuid=" + loginData.uuid,
        dataType: "json",
        data: queryData,
        cache: false,
        timeout: 3000,
        success: requestSuccess,
        error: requestError
    });
    
}
