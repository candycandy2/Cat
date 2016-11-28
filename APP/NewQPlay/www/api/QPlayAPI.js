//qplayAPI - QPlay



function QPlayAPI(requestType, requestAction, successCallback, failCallback, queryData, queryStr) {

    failCallback =  failCallback || null;
    queryData = queryData || null;
    queryStr = queryStr || "";
    
    var signatureTime = getSignature("getTime");
    var signatureInBase64 = getSignature("getInBase64", signatureTime);

    if (loginData.uuid.length === 0) {
        var deviceUUID = device.uuid;
    } else {
        var deviceUUID = loginData.uuid;
    }

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
        url: serverURL + "/" + appApiPath + "/public/index.php/v101/qplay/" + requestAction + "?lang=en-us&uuid=" + deviceUUID + queryStr,
        dataType: "json",
        data: queryData,
        cache: false,
        success: successCallback,
        fail: failCallback
    });
    
}
