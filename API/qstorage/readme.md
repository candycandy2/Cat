
QStorage API Readme.md
=============================

## Version x.x.x - Published 2018 May 23

## Contents
- [常用 API 說明](#常用-API-說明)
    - [Addportrait](#Addportrait)
    - [Deleteportrait](#Deleteportrait)
    - [sastoken](#sastoken)
    - [UploadPicture](#UploadPicture)
    - [DeletePicture](#DeletePicture)
- [手動 Deploy](#DeployProcedure)


----
<h2 id="API-分類">API 分類</h2>

Portrait | Token | Picture
:------------ | :------------- | :-------------
 1.Add Portrait <br> 2.DELETE Portrait | 1.sastoken  |  1.UploadPicture <br> 2.DeletePicture

----
<h2 id="常用-API-說明">常用 API 說明</h2>

<h2 id="Addportrait">Add portrait</h2>

### 描述
```
上傳大頭圖片。
```

### Method
```
POST portrait
```

### Authentication
```
required
```

### Header Parameters
欄位名稱 | 是否必填 | 描述
:------------ | :------------- | :-------------
content-type | 必填 | 訊息體類型，ex.使用POST方法傳輸, 類型需為multipart/form-data
app-key | 必填 | 專案名稱, 此專案名稱為 appqplay
signature-time | 必填 | 產生Signature當下的時間(unix timestamp型式), 共10碼
signature | 必填 | "Base64( HMAC-SHA256( SignatureTime , YourAppSecretKey ) )
account | 必填 | 工號, ex:1607279

### URL Parameters

參數名稱 | 是否必填 | 資料類型 | 描述
:------------ | :------------- | :------------- | :-------------
lang | Required | string | Switch response language , allow 'en-us'、'zh-tw'、'zh-cn'
uuid | Required | string | Mobile uuid that has been registered.

### Request Body

參數名稱 | 是否必填 | 資料類型 | 描述
:------------ | :------------- | :------------- | :-------------
files | Required | string | {"fileUrls":[<br>"https://bqgroupstoragedev.blob.core.windows.net/appqforumdev-picture-13-5dd5d090b10ddabf/5ab493cb1263b/5ab493cb1263b_1024.jpg",<br>"https://bqgroupstoragedev.blob.core.windows.net/appqforumdev-picture-13-76f99fb4f1a24d29/5aa7810f13643/5aa7810f13643_1024.jpg"<br>]}

### Response
節點標識 | 父節點標識 | 出現次數 | 資料類型 | 描述
:------------ | :------------- | :------------- | :------------- | :-------------
ResultCode | NA | 1 | String | 回應代碼
Message | NA | 1 | String | 回應訊息描述
Content | NA | 0-1 | Container | 回應訊息內容Container
type | Content | 0-1 | String | mimetype, ex: image/jpeg
original_width | Content | 0-1 | Integer | Width, pixels
original_height | Content | 0-1 | Integer | Height, pixels
original_size | Content | 0-1 | Integer | SIZE, bits
original_url | Content | 0-1 | String | URL 永久有效, 可以用工號組合PATH
target | Content | 0-1 | String | server folder path, ex: "appqplaydev-portrait"
thumbnail_1024_width | Content | 0-1 | Integer | Width, pixels
thumbnail_1024_height | Content | 0-1 | Integer | Height, pixels
thumbnail_1024_url | Content | 0-1 | String | URL 永久有效, 可以用工號組合PATH

### Error Code

| Result Code | Descriptopn |
|--|--|
|1 | Success. Return uploaded picture information in 'Content', while upload success, you can read this portrait in time via use return url，it will been compress to different ratios and convert to .png file|
997901|The length of field is too long
997902|Mandatory Field Lost
997903|Field Format Error
997904|Account Not Exist
999005|Content type parameter invalid
999006|Input format is invalid
997905|Upload data type is not allow
997908|File size exceeds the allowable limit
997999|Unknown Error

### Example

Response sample
```json
{
    "ResultCode": "1",
    "Message": "",
    "Content": {
        "type": "image/png",
        "original_width": 110,
        "original_height": 120,
        "original_size": 3340,
        "original_url": "https://bqgroupstoragedev.blob.core.windows.net/appqplaydev-portrait/1607279/1607279_full.png",
        "target": "appqplaydev-portrait",
        "thumbnail_1024_width": 110,
        "thumbnail_1024_height": 120,
        "thumbnail_1024_url": "https://bqgroupstoragedev.blob.core.windows.net/appqplaydev-portrait/1607279/1607279_1024.png"
    }
}
```

<h2 id="Deleteportrait">Delete portrait</h2>

### 描述
```
刪除大頭圖片。
```

### Method
```
DELETE portrait
```

### Authentication
```
required
```

### Header Parameters
同上

### URL Parameters
同上

### Response
節點標識 | 父節點標識 | 出現次數 | 資料類型 | 描述
:------------ | :------------- | :------------- | :------------- | :-------------
result_code | NA | 1 | String | 回應代碼
message | NA | 1 | String | 回應訊息描述
content | NA | 0-1 | Container | 回應訊息內容Container

### Error Code
同上

### Example

Response sample
```json
{
    "ResultCode": "1",
    "Message": "",
    "Content": ""
}
```
<h2 id="sastoken">sastoken</h2>

### 描述
```
Get SAS token for Azure Perminssion
```

### Method
```
GET /sastoken/{resource}
```

### Authentication
```
required
```
### Path Parameters
欄位名稱 | 是否必填 | 描述
:------------ | :------------- | :-------------
resource | 必填 | 欲取得的資源類型 ex : container 或 blob

### Header Parameters
欄位名稱 | 是否必填 | 描述
:------------ | :------------- | :-------------
content-type | 必填 | 訊息體類型，ex.使用POST方法傳輸, 類型需為multipart/form-data
app-key | 必填 | 專案名稱, 此專案名稱為 appqplay
signature-time | 必填 | 產生Signature當下的時間(unix timestamp型式), 共10碼
signature | 必填 | "Base64( HMAC-SHA256( SignatureTime , YourAppSecretKey ) )
account | 必填 | 工號, ex:1607279
target | 必填 | 欲取得的目標名稱，如果url的resource是container,請填入container名稱<br>ex: appqforumdev-picture-13-76f99fb4f1a24d29<br>如果resource是blob，請填入blob名稱<br>ex: appqforumdev-picture-13-76f99fb4f1a24d29/5aa8d448cc978/5aa8d448cc978_full.jpg

### URL Parameters

參數名稱 | 是否必填 | 資料類型 | 描述
:------------ | :------------- | :------------- | :-------------
lang | Required | string | Switch response language , allow 'en-us'、'zh-tw'、'zh-cn'
uuid | Required | string | Mobile uuid that has been registered.
start | Not Required | string | Signed start date. allow ISO date String ex:2018-03-16T03:30:00Z
expiry | Not Required | string | Signed expiry date. allow ISO date string ex:2018-03-17T12:30:00Z
sp | Not Required | string | Signed permission .allow r,w

### Response
節點標識 | 父節點標識 | 出現次數 | 資料類型 | 描述
:------------ | :------------- | :------------- | :------------- | :-------------
result_code | NA | 1 | String | 回應代碼
message | NA | 1 | String | 回應訊息描述
content | NA | 0-1 | Container | 回應訊息內容Container
target | content | 0-1 | String | 取得的contaier或blob名稱<br>ex: appqforumdev-picture-13-76f99fb4f1a24d29
sas_token | content | 0-1 | String | 取得的sas token <br>Ex:sv=2016-05-31&sr=c&st=2018-03-13T07:30:00Z&se=2018-0315T08:00:00Z&sp=r&sig=NohzmEtj4UTk6iCs8juJo0w%2FrZ4izxj8bVq2Fqg5Ub4%3D

### Error Code
| Result Code | Descriptopn |
|--|--|
|1 | Success. Return sas token in 'Content'
997902|Mandatory Field Lost
997903|Field Format Error
997904|Account Not Exist
999006|Input format is invalid
997999|Unknown Error

### Example

Request sample
```
?lang=en-us&uuid=1517bfd3f7a87ab988&start=2018-03-13T07:30:00Z&expiry=2018-03-15T08:00:00Z&sp=r
``` 

Javascript
```js
var dt = new Date(new Date());
var srart = dt.toISOString().replace(/\\.\[0-9\]*/,'');
```

Response sample
```json
{
  "ResultCode": "1",
  "Message": "",
  "Content": {
    "target":"appqforumdev-picture-13-76f99fb4f1a24d29",
    "sas_token":"sv=2016-05-31&sr=c&st=2018-03-13T07:30:00Z&se=2018-03-15T08:00:00Z&sp=r&sig=NohzmEtj4UTk6iCs8juJo0w%2FrZ4izxj8bVq2Fqg5Ub4%3D"
}
```

<h2 id="UploadPicture">UploadPicture</h2>

### 描述
```
上傳圖片。
```

### Method
```
POST /picture/upload 
```

### Authentication
```
required
```

### Header Parameters
欄位名稱 | 是否必填 | 描述
:------------ | :------------- | :-------------
content-type | 必填 | 訊息體類型，ex.使用POST方法傳輸, 類型需為multipart/form-data
app-key | 必填 | 專案名稱, 此專案名稱為 appqplay
signature-time | 必填 | 產生Signature當下的時間(unix timestamp型式), 共10碼
signature | 必填 | "Base64( HMAC-SHA256( SignatureTime , YourAppSecretKey ) )
account | 必填 | 工號, ex:1607279
resource-id | 非必填 | string | This id must discuss with qstorage PM, that will determine where the file located.

### URL Parameters

參數名稱 | 是否必填 | 資料類型 | 描述
:------------ | :------------- | :------------- | :-------------
lang | Required | string | Switch response language , allow 'en-us'、'zh-tw'、'zh-cn'
uuid | Required | string | Mobile uuid that has been registered.

### Request Body

參數名稱 | 是否必填 | 資料類型 | 描述
:------------ | :------------- | :------------- | :-------------
files | Required | string | {"fileUrls":[<br>"https://bqgroupstoragedev.blob.core.windows.net/appqforumdev-picture-13-5dd5d090b10ddabf/5ab493cb1263b/5ab493cb1263b_1024.jpg",<br>"https://bqgroupstoragedev.blob.core.windows.net/appqforumdev-picture-13-76f99fb4f1a24d29/5aa7810f13643/5aa7810f13643_1024.jpg"<br>]}

### Response
節點標識 | 父節點標識 | 出現次數 | 資料類型 | 描述
:------------ | :------------- | :------------- | :------------- | :-------------
result_code | NA | 1 | String | 回應代碼
message | NA | 1 | String | 回應訊息描述
content | NA | 0-1 | Container | 回應訊息內容Container
type | content | 0-1 | String | mimetype, ex: image/jpeg
original_width | content | 0-1 | Integer | Width, pixels
original_height | content | 0-1 | Integer | Height, pixels
original_size | content | 0-1 | Integer | SIZE, bits
original_url | content | 0-1 | String | URL 30分鐘內有效, 另要搭配sas_token, ex: original_url + ? + sas_token
target | content | 0-1 | String | ex: "appqforumdev-picture-13-76f99fb4f1a24d29"
sas_token | content | 0-1 | String | token, ex:"sv=2016-05-31&sr=c&st=2018-03-13T07:30:00Z&se=2018-03-15T08:00:00Z&sp=r&sig=NohzmEtj4UTk6iCs8juJo0w%2FrZ4izxj8bVq2Fqg5Ub4%3D"
thumbnail_1024_width | content | 0-1 | Integer | Width, pixels
thumbnail_1024_height | content | 0-1 | Integer | Height, pixels
thumbnail_1024_url | content | 0-1 | String | URL 30分鐘內有效, 另要搭配sas_token, ex: thumbnail_1024_url + ? + sas_token

### Error Code
| Result Code | Descriptopn |
|--|--|
|1 | Success. Return uploaded picture information in 'Content', while upload success, you have 30minutes to use url with sas_token as url parameter to view the file. if time's up,please call **picture/sastoken/container/read** API to extend the permission time |
997901|The length of field is too long
997902|Mandatory Field Lost
997903|Field Format Error
997904|Account Not Exist
999005|Content type parameter invalid
999006|Input format is invalid
997905|Upload data type is not allow
997908|File size exceeds the allowable limit
997999|Unknown Error

### Example
Use form post to upload file,please keep the content-type **multipart/from-data**,this is a example use curl
```
 curl -F 'files=@D:temp\img\testimage.jpeg'
```

Response sample
```json
{
  "ResultCode": "1",
  "Message": "",
  "Content": {
    "type": "image/jpeg",
    "original_width": 110,
    "original_height": 120,
    "original_size": 3340,
    "original_url": "https://bqgroupstoragedev.blob.core.windows.net/appqforumdev-picture-13-76f99fb4f1a24d29/5aa8d448cc978/5aa8d448cc978_full.jpg",
    "target":"appqforumdev-picture-13-76f99fb4f1a24d29",
    "sas_token": "sv=2016-05-31&sr=c&st=2018-03-14T07:50:33Z&se=2018-03-14T08:20:33Z&sp=r&sig=jadOwP38qf5cEB4G8n2mX7Y9uONoOi53ByDieOTTOEo%3D",
    "thumbnail_1024_width": 110,
    "thumbnail_1024_height": 120,
    "thumbnail_1024_url": "https://bqgroupstoragedev.blob.core.windows.net/appqforumdev-picture-13-76f99fb4f1a24d29/5aa8d448cc978/5aa8d448cc978_1024.jpg"
  }
}
```

<h2 id="DeletePicture">Delete Picture</h2>

### 描述
```
刪除上傳圖片。
```

### Method
```
GET /picture/delete
```

### Authentication
```
required
```

### Header Parameters
欄位名稱 | 是否必填 | 描述
:------------ | :------------- | :-------------
content-type | 必填 | 訊息體類型，ex.使用POST方法傳輸, 類型需為multipart/form-data
app-key | 必填 | 專案名稱, 此專案名稱為 appqplay
signature-time | 必填 | 產生Signature當下的時間(unix timestamp型式), 共10碼
signature | 必填 | "Base64( HMAC-SHA256( SignatureTime , YourAppSecretKey ) )
account | 必填 | 工號, ex:1607279

### URL Parameters

參數名稱 | 是否必填 | 資料類型 | 描述
:------------ | :------------- | :------------- | :-------------
lang | Required | string | Switch response language , allow 'en-us'、'zh-tw'、'zh-cn'
uuid | Required | string | Mobile uuid that has been registered.

### Response
節點標識 | 父節點標識 | 出現次數 | 資料類型 | 描述
:------------ | :------------- | :------------- | :------------- | :-------------
result_code | NA | 1 | String | 回應代碼
message | NA | 1 | String | 回應訊息描述
content | NA | 0-1 | Container | 回應訊息內容Container

### Error Code
| Result Code | Descriptopn |
|--|--|
|1 | Success. Return sas token in 'Content'
997902|Mandatory Field Lost
997903|Field Format Error
997904|Account Not Exist
999006|Input format is invalid
997999|Unknown Error

### Example

Response Body
```json
{
    "ResultCode": "1",
    "Message": "",
    "Content": ""
}
```

<h2 id="DeployProcedure">手動 Deploy</h2>

### 1. 基礎建設    
    a. install microsoftAzureStorage
	    覆蓋 API\qstorage\composer
        覆蓋 API\qstorage\composer.json
        移除 API\qstorage\composer.lock
        執行 composer update

### 2. 環境設定
    a. 修改 .env
        /*
        |--------------------------------------------------------------------------
        | Azure Blob Parameters
        |--------------------------------------------------------------------------
        |azure_storage : Blob 服務的連接字串   
        */ 
        AZURE_STORAGE=DefaultEndpointsProtocol=https;AccountName=bqgroupstoragetest;AccountKey=pjyJja+uY+7bpk0mrCzQzVswYpURA3IoB5eP3zN5BeUZdMGzNKnEwYwOZP3BxeK8lM9xqnBBa1McI8eaUbI5Vw==
    b. 修改 config\app.php
        /*    
        |--------------------------------------------------------------------------    
        | Azure Blob Parameters    
        |--------------------------------------------------------------------------    
        |azure_storage : Blob 服務的連接字串    
        */   
        'azure_storage' => env('AZURE_STORAGE'),

### 3. 資料設定
    N/A

### 4. 檔案覆蓋
    a. 共更新 21 個檔案，新增 Jenkins 專案 DeployBackEnd-Staging-QStorage 處理檔案更新
    
```qstorage

API/qstorage/app/Entity/AbstractFile.php
API/qstorage/app/Entity/ImageFile.php
API/qstorage/app/Entity/Picture.php
API/qstorage/app/Entity/Portrait.php

API/qstorage/app/lib/CommonUtil.php
API/qstorage/app/lib/Verify.php
API/qstorage/app/lib/ResultCode.php

API/qstorage/app/Services/AzureBlobService.php
API/qstorage/app/Services/ServerFileService.php
API/qstorage/app/Services/AzureBlobService.php

API/qstorage/app/Http/Controllers/AccessController.php
API/qstorage/app/Http/Controllers/PortraitController.php
API/qstorage/app/Http/Controllers/PictureController.php

API/qstorage/tests/PortraitControllerUnitTest.php
API/qstorage/tests/stubs/test.jpg
API/qstorage/tests/AccessControllerUnitTest.php
API/qstorage/tests/AzureBlobServiceUnitTest.php
API/qstorage/tests/PictureControllerUnitTest.php
API/qstorage/tests/AzureBlobServiceUnitTest.php
API/qstorage/tests/PictureControllerUnitTest.php

API/qstorage/app/Http/routes.php

```

    b. 共更新 1 個檔案，新增 Jenkins 專案 DeployBackEnd-Staging-QStorage 處理檔案更新


```QForum

API/QForum/app/Http/Controllers/JobController.php

```


### 5. 更新後尚須確認事項
    a. QStorage 需要把staging、production的圖片上傳至Azuere，並更新qp_attach表的file_url
    b. 請測試 ENS圖片上傳功能、QForum deleteAttachJob API，詳細的測項請參考PIS、PES
    c. mongoDB qstorage.qs_api_log有寫入正確資料

