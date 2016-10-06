//qplayAPI - QPlay



function QPlayAPI(requestType, requestAction, successCallback, failCallback, queryData) {

    failCallback =  failCallback || null;
    queryData = queryData || null;
    
    var signatureTime = getSignature("getTime");
    var signatureInBase64 = getSignature("getInBase64", signatureTime);

    $.ajax({
        type: requestType,
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'App-Key': 'qplay',
            'Signature-Time': signatureTime,
            'Signature': signatureInBase64,
            'token': loginData.token
        },
        url: serverURL + "/qplayApi/public/index.php/v101/qplay/" + requestAction + "?lang=en-us&uuid=" + loginData.uuid,
        dataType: "json",
        data: queryData,
        cache: false,
        success: successCallback,
        fail: failCallback
    });
    
}
