//QPlayAPINewHeader
//priority == "high" "low" "", default == "high"
//timer == integer, default ==
//asyncType == boolean, default == true

function QPlayAPINewHeader(requestType, requestAction, headerKey1, headerKey2, headerValue1, headerValue2, successCallback, failCallback, queryData, queryStr, priority, timer, asyncType) {
    //API [checkAppVersion] [getSecurityList]
    //even though these 2 API were from QPlay, the API path is [/public/v101/qplay/],
    //but, when other APP call these 2 API,
    //need to set the specific [App-Key] and [appSecretKey] by the APP, not by QPlay.

    //queryStr: start with [&], ex: &account=test&pwd=123

    priority = priority || "high";
    timer = timer || 30000;
    asyncType = asyncType || true;
    failCallback = failCallback || null;
    queryData = queryData || null;
    queryStr = queryStr || "";
    headerKey1 = headerKey1 || null;
    headerKey2 = headerKey2 || null;

    function requestSuccess(data) {
        checkTokenValid(data['result_code'], data['token_valid'], successCallback, data);

        var dataArr = [
            "Call API",
            requestAction,
            data['result_code']
        ];
        LogFile.createAndWriteFile(dataArr);
    }

    // review by alan
    function requestError(data) {
        if (priority != "low") {
            errorHandler(data, requestAction);
            if (failCallback != null) {
                failCallback();
            }
        }
    }

    var signatureTime = getSignature("getTime");
    var signatureInBase64 = getSignature("getInBase64", signatureTime);

    var headerData = {
        'Content-Type': 'application/json; charset=utf-8',
        'App-Key': appKey,
        'Signature-Time': signatureTime,
        'Signature': signatureInBase64,
        'token': loginData.token,
        'push-token': loginData.pushToken
    }
    if(headerKey1 !== null) {
        headerData[headerKey1] = headerValue1;
    }
    if(headerKey2 !== null) {
        headerData[headerKey2] = headerValue2;
    }

    $.ajax({
        type: requestType,
        headers: headerData,
        url: serverURL + "/" + appApiPath + "/public/v101/qplay/" + requestAction + "?lang=" + browserLanguage + "&uuid=" + loginData.uuid + queryStr,
        dataType: "json",
        data: queryData,
        cache: false,
        async: asyncType,
        timeout: timer,
        success: requestSuccess,
        error: requestError
    });

    if (window.ga !== undefined) {
        window.ga.trackEvent('QPlayAPI', requestAction, appKey, serverURL + "/" + appApiPath + "/public/v101/qplay/" + requestAction + "?lang=" + browserLanguage + "&uuid=" + loginData.uuid + queryStr);
    }

}