//qplayAPI - YellowPage

function QPlayAPI(requestType, requestAction, successCallback, failCallback, queryData) {

    failCallback = failCallback || null;
    queryData = queryData || null;

    function requestSuccess(data) {
        checkTokenValid(data['ResultCode'], data['token_valid'], successCallback, data);
    }

    appSecretKey = "c103dd9568f8493187e02d4680e1bf2f";
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
        url: serverURL + "/" + appApiPath + "/public/index.php/v101/yellowpage/" + requestAction + "?lang=en-us&uuid=" + loginData.uuid,
        dataType: "json",
        data: queryData,
        cache: false,
        success: requestSuccess,
        fail: failCallback
    });
    
}
