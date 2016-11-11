//apiGetMessageList - QPlay



function apiGetMessageList(successCallback, failCallback, dateFrom, dateTo) {

    failCallback = failCallback || null;
    dateFrom = dateFrom || null;
    dateTo = dateTo || null;

    var signatureTime = getSignature("getTime");
    var signatureInBase64 = getSignature("getInBase64", signatureTime);
    var queryStr = ""; 

    if (dateFrom !== null) {
        queryStr = "&date_from=" + dateFrom + "&date_to=" + dateTo;
    }

    $.ajax({
        type: "GET",
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'app-key': appKey,
            'Signature-Time': signatureTime,
            'Signature': signatureInBase64,
            'token': loginData.token
        },
        url: serverURL + "/" + appApiPath + "/public/index.php/v101/qplay/getMessageList?lang=en-us&uuid=" + loginData.uuid + queryStr,
        dataType: "json",
        cache: false,
        success: successCallback,
        fail: failCallback,
    });
    
}