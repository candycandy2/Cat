//qplayAPI - YellowPage

var serverURL = "https://qplay.benq.com"; // QTT Outside API Server
var appSecretKey = "c103dd9568f8493187e02d4680e1bf2f";

function QPlayAPI(requestType, requestAction, successCallback, failCallback = null, queryData = null) {

    var signatureTime = getSignature("getTime");
    var signatureInBase64 = getSignature("getInBase64", signatureTime);

    $.ajax({
        type: requestType,
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'App-Key': 'yellowpage',
            'Signature-Time': signatureTime,
            'Signature': signatureInBase64,
            'token': loginData.token
        },
        url: serverURL + "/qplayApi/public/index.php/v101/yellowpage/" + requestAction + "?lang=en-us&uuid=" + loginData.uuid,
        dataType: "json",
        data: queryData,
        cache: false,
        success: successCallback,
        fail: failCallback
    });
    
}
