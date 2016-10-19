//apiGetMessageList - QPlay



function apiGetMessageList(successCallback, failCallback, dateFrom, dateTo, countFrom, countTo) {

    failCallback = failCallback || null;
    
    var signatureTime = getSignature("getTime");
    var signatureInBase64 = getSignature("getInBase64", signatureTime);
    
    $.ajax({
        type: "GET",
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'app-key': appKey,
            'Signature-Time': signatureTime,
            'Signature': signatureInBase64,
            'token': loginData.token
        },
        url: serverURL +"/qplayApi/public/index.php/v101/qplay/getMessageList?lang=en-us&uuid=" + loginData.uuid + "&date_from=" + dateFrom + "&date_to=" + dateTo + "&count_from=" + countFrom + "&count_to=" + countTo,
        dataType: "json",
        cache: false,
        success: successCallback,
        fail: failCallback,
    });
    
}