# isRegister

## 描述
移動裝置提供uuid給server確認是否已經認證過, 原則上一個移動裝置只需認證一次。

## Method
GET /v101/qplay/isRegister?lang=en-us

## Authentication
required

## Header Parameters
欄位名稱 | 是否必填 | 描述
------------ | ------------- | -------------
content-type | 必填 | 訊息體類型，ex.使用POST方法傳輸, 類型需為application/json
app-key | 必填 | 專案名稱, 此專案名稱為 appqplay
signature-time | 必填 | 產生Signature當下的時間(unix timestamp型式), 共10碼
signature | 必填 | "Base64( HMAC-SHA256( SignatureTime , YourAppSecretKey ) )

此專案的AppSecretKey 為swexuc453refebraXecujeruBraqAc4e"

## Parameters

參數名稱 | 是否必填 | 資料類型 | 描述
------------ | ------------- | ------------- | -------------
uuid | Required | string | "設備的unique id <br>uuid: <br>android:設備上的ANDROID_ID <br>iOS:APNS所提供的DeviceTokenex: <br>apple可能是6974ac11 870e09fa 00e2238e 8cfafc7d 2052e342 182f5b57 fabca445 42b72e1b <br>android可能是9774d56d682e549c"

## Response
節點標識 | 父節點標識 | 出現次數 | 資料類型 | 描述
------------ | ------------- | ------------- | ------------- | -------------
result_code | NA | 1 | String | 回應代碼
message | NA | 1 | String | 回應訊息描述
content | NA | 0-1 | Container | 回應訊息內容Container
is_register | content | 0-1 | Boolean | "1:true, 已經註冊<br>0:false, 未註冊"

P.S如果result_code為1, 則會帶content, 反之, 不帶content

## Example
```PHP
            $.ajax({
                url: "v101/qplay/isRegister?lang=en-us&uuid=" + uuid,//Math.uuid(),
                dataType: "json",
                type: "POST",
                contentType: "application/json",
                data:{},
                beforeSend:function (request) {
                    request.setRequestHeader("app-key", "qplay");
                    request.setRequestHeader("signature", "Moses824");
                    request.setRequestHeader("signature-time", "1000000000");
                },
                success: function (d, status, xhr) {
                    if(d.result_code == 1) {
                        if(d.content.is_register == 1) {
                            login(userName, password, company, uuid);
                        } else {
                            registerAndLogin(userName, password, company, uuid, device_type);
                        }
                    } else {
                        showMessage(d.message);
                    }
                },
                error: function (e) {
                    if(handleAJAXError(this,e)){
                        return false;
                    }
                    showMessage(e);
                }
            });

```
