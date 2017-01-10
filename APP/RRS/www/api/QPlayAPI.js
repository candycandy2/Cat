//qplayAPI - RRS

function QPlayAPI(requestType, asyncType, requestAction, successCallback, failCallback, queryData) {

    failCallback = failCallback || null;
    queryData = queryData || null;

    function requestSuccess(data) {
        checkTokenValid(data['ResultCode'], data['token_valid'], successCallback, data);
    }

    function requestError(data) {
        checkNetwork();
    }

    //appSecretKey = "2e936812e205445490efb447da16ca13";
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
            'X-Requested-With': 'XMLHttpRequest'
        },
        url: serverURL + "/" + appApiPath + "/public/v101/custom/rrs/" + requestAction + "?lang=en-us&uuid=" + loginData.uuid,
        dataType: "json",
        data: queryData,
        cache: false,
        timeout: 3000,
        async: asyncType,
        success: requestSuccess,
        error: requestError,
        crossDomain: false
    });

}
