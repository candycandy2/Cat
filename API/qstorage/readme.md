
QStorage API Readme.md
=============================

## Version x.x.x - Published 2018 May 23

## Contents
- [常用 API 說明](#常用-API-說明)
    - [UploadPicture](#UploadPicture)
    - [DeletePicture](#DeletePicture)
    - [sastoken](#sastoken)
    - [portrait](#getsecuritylist)
    - [portrait](#checkappversion)


----
<h2 id="API-分類">API 分類</h2>

Picture | Token | portrait
:------------ | :------------- | :-------------
1.UploadPicture <br> 2.DeletePicture | 1.sastoken  |  1.POST portrait <br> 2.DELTET portrait

----
<h2 id="常用-API-說明">常用 API 說明</h2>

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

### Parameters

參數名稱 | 是否必填 | 資料類型 | 描述
:------------ | :------------- | :------------- | :-------------
lang | Required | string | Switch response language , allow 'en-us'、'zh-tw'、'zh-cn'
uuid | Required | string | Mobile uuid that has been registered.
resource-id | Required | string | This id must discuss with qstorage PM, that will determine where the file located.

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
original_url | content | 0-1 | String | URL
target | content | 0-1 | String | ex: "appqforumdev-picture-13-76f99fb4f1a24d29"
sas_token | content | 0-1 | String | token, ex:"sv=2016-05-31&sr=c&st=2018-03-13T07:30:00Z&se=2018-03-15T08:00:00Z&sp=r&sig=NohzmEtj4UTk6iCs8juJo0w%2FrZ4izxj8bVq2Fqg5Ub4%3D"
thumbnail_1024_width | content | 0-1 | Integer | Width, pixels
thumbnail_1024_height | content | 0-1 | Integer | Height, pixels
thumbnail_1024_url | content | 0-1 | String | URL

##### Error Code
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


**2.Delete picture by url**
##### Request
```
GET /picture/delete
```
##### Url Parameter
```
?lang=en-us&uuid=1517bfd3f7a87ab988
``` 
- lang  :  Switch response language , allow 'en-us'、'zh-tw'、'zh-cn'
- uuid :  Mobile uuid that has been registered
##### Request Header
``` 
Content-Type:application/json
app-key:appqforumdev
Signature-Time:1522045522
Signature:UjU4St75nHvDC2mmWR7ZjBhV4Yd6d/zSDr/B2opjR5E=
account:1607279
``` 
##### Request Body
```json
{"fileUrls":[
  "https://bqgroupstoragedev.blob.core.windows.net/appqforumdev-picture-13-5dd5d090b10ddabf/5ab493cb1263b/5ab493cb1263b_1024.jpg",
  "https://bqgroupstoragedev.blob.core.windows.net/appqforumdev-picture-13-76f99fb4f1a24d29/5aa7810f13643/5aa7810f13643_1024.jpg",
  "https://bqgroupstoragedev.blob.core.windows.net/appqforumdev-picture-13-76f99fb4f1a24d29/5aa784c79b1e0/5aa784c79b1e0_1024.jpg"
]} 
``` 
##### Response Body
```json
{
    "ResultCode": "1",
    "Message": "",
    "Content": ""
}
```
##### Error Code
| Result Code | Descriptopn |
|--|--|
|1 | Success. Return sas token in 'Content'
997902|Mandatory Field Lost
997903|Field Format Error
997904|Account Not Exist
999006|Input format is invalid
997999|Unknown Error

### Access Security API
 **1. Get  SaS Token  With Permission**
##### Request
```
GET /sastoken/{resource}
```
- resource : Which Resource type  that you want to get , allow 'container'、'blob' 
##### Url Parameter
```
?lang=en-us&uuid=1517bfd3f7a87ab988&start=2018-03-13T07:30:00Z&expiry=2018-03-15T08:00:00Z&sp=r
``` 
- lang  :  Switch response language , allow 'en-us'、'zh-tw'、'zh-cn'
- uuid :  Mobile uuid that has been registered
- start :  Signed start date. allow ISO date String ex:2018-03-16T03:30:00Z
- expiry : Signed expiry date. allow ISO date string ex:2018-03-17T12:30:00Z
- sp :  Signed permission .allow r,w
```js
var dt = new Date(new Date());
var srart = dt.toISOString().replace(/\\.\[0-9\]*/,'');
```
##### Resuest Header
```
target:appqforumdev-picture-13-76f99fb4f1a24d29
blob-name:5aa7810f13643/5aa7810f13643_1024.jpg
``` 
- target : Which container(blob) sas token you want to get.
- blob-name : The blob name of file.
##### Response Body
```json
{
  "ResultCode": "1",
  "Message": "",
  "Content": {
    "target":"appqforumdev-picture-13-76f99fb4f1a24d29",
    "sas_token":"sv=2016-05-31&sr=c&st=2018-03-13T07:30:00Z&se=2018-03-15T08:00:00Z&sp=r&sig=NohzmEtj4UTk6iCs8juJo0w%2FrZ4izxj8bVq2Fqg5Ub4%3D"
}
```
##### Error Code
| Result Code | Descriptopn |
|--|--|
|1 | Success. Return sas token in 'Content'
997902|Mandatory Field Lost
997903|Field Format Error
997904|Account Not Exist
999006|Input format is invalid
997999|Unknown Error

### Portrait API
**1. Upload Portrait**
##### Request
```
POST portrait
```
##### Url Parameter
```
?lang=en-us&uuid=1517bfd3f7a87ab988
``` 
##### Resuest Header
```
account:0617279
``` 
- account: User Employee No. 
##### Response Body
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
##### Error Code
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

**2. Delete Portrait**
##### Request
```
DELETE portrait
```
##### Url Parameter
```
?lang=en-us&uuid=1517bfd3f7a87ab988
``` 
##### Resuest Header
```
account:0617279
``` 
- account: User Employee No. 
##### Response Body
```json
{
    "ResultCode": "1",
    "Message": "",
    "Content": ""
}
```
