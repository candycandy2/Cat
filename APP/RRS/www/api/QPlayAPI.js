//qplayAPI - RRS

function QPlayAPI(requestType, asyncType, requestAction, successCallback, failCallback, queryData) {

    failCallback = failCallback || null;
    queryData = queryData || null;

    function requestSuccess(data) {
        checkTokenValid(data['ResultCode'], data['token_valid'], successCallback, data);
    }

    function requestError(data) {
        checkNetwork();
        if (data.statusText == 'timeout') {
            // this.tryCount++;
            // if (this.tryCount <= this.retryLimit) {
            //     //try again
            //     $.ajax(this);
            //     return;
            // }            
            // return;

            // loadingMask('hide');
            // var activePage = $.mobile.activePage.attr("id");
            // $('#' + activePage).trigger('create');

            //$('#' + activePage).listview('refresh');
            //$.mobile.changePage('#' + activePage);
            //$(":mobile-pagecontainer").pagecontainer('change', '#' + activePage, { reload: true });
            //$(":mobile-pagecontainer").pagecontainer("change", "#storeMainPage", {  reload : true, allowSamePageTransition : true, transition : "none" });
        }
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
            'token': loginData.token
        },
        // tryCount: 0,
        // retryLimit: 3,
        url: serverURL + "/" + appApiPath + "/public/v101/custom/rrs/" + requestAction + "?lang=en-us&uuid=" + loginData.uuid,
        dataType: "json",
        data: queryData,
        cache: false,
        timeout: 3000,
        async: asyncType,
        success: requestSuccess,
        error: requestError
    });
}
