//qplayAPI - QPlay



function QPlayAPI(requestType, requestAction, successCallback, failCallback, queryData) {

    failCallback =  failCallback || null;
    queryData = queryData || null;
    
    var signatureTime = getSignature("getTime");
    var signatureInBase64 = getSignature("getInBase64", signatureTime);
    var queryStr = "";

    if (requestAction === "sendPushToken") {
        queryStr = "&app_key=appqplay&device_type=" + loginData.deviceType;
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
        url: serverURL + "/qplayApi/public/index.php/v101/qplay/" + requestAction + "?lang=en-us&uuid=" + loginData.uuid + queryStr,
        dataType: "json",
        data: queryData,
        cache: false,
        success: successCallback,
        fail: failCallback
    });
    
}
