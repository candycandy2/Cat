//getMessageDetail - QPlay



function getMessageDetail(successCallback, failCallback, rowId) {

    failCallback = failCallback || null;
    
    var signatureTime = getSignature("getTime");
    var signatureInBase64 = getSignature("getInBase64", signatureTime);
    
    $.ajax({
        type: "GET",
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'app-key': 'qplay',
            'Signature-Time': signatureTime,
            'Signature': signatureInBase64,
            'token': loginData.token
        },
        url: serverURL +"/qplayApi/public/index.php/v101/qplay/getMessageDetail?lang=en-us&uuid=" + loginData.uuid + "&message_send_row_id=" + rowId,
        dataType: "json",
        cache: false,
        success: successCallback,
        fail: failCallback,
    });
    
}