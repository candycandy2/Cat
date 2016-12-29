//qplayAPI - QPlay

function QPlayAPI(requestType, requestAction, successCallback, failCallback, queryData, queryStr) {

    failCallback =  failCallback || null;
    queryData = queryData || null;
    queryStr = queryStr || "";

    function requestSuccess(data) {
        checkTokenValid(data['result_code'], data['token_valid'], successCallback, data);
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
            'token': loginData.token,
            'push-token': loginData.pushToken
        },
        url: serverURL + "/" + appApiPath + "/public/v101/qplay/" + requestAction + "?lang=en-us&uuid=" + loginData.uuid + queryStr,
        dataType: "json",
        data: queryData,
        cache: false,
        timeout: 3000,
        success: requestSuccess,
        error: requestError
    });
    
}
