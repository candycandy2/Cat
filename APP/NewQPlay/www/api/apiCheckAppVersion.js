//apiCheckAppVersion - QPlay



function apiCheckAppVersion(successCallback, failCallback, deviceType, versionCode) {

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
        },
        url: serverURL + "/" + appApiPath + "/public/index.php/v101/qplay/checkAppVersion?lang=en-us&package_name=com.benq." + appKey + 
             "&device_type=" + deviceType + "&version_code=" + versionCode,
        dataType: "json",
        cache: false,
        success: successCallback,
        fail: failCallback,
    });
    
}