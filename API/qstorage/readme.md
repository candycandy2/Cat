
# QStorage API
## QStorage Restful API
### Authentication
##### Resuest Header
```
Content-Type:multipart/form-data
app-key:appqforumdev
signature-Time:1520329467
signature:kTC59b6mTvgiaabWpZ5Jvi9Xqj/XmqGrWACw4VGOxI=
account:1607279
```

 - app-key : This is key is registered by qplay.  
 - signature-time  : Unix timestamp that signatuer has been greated. allow 15 minute. 
 - signature  : base64(sha256(timestamp, secretKey)), secretKey is the prokect  secret that apply from qplay.
 - account : User's employee No.

### Picture API

 **1. UploadPicture**
##### Resuest
```
POST /picture/upload 
```
##### Url Parameter
```
?lang=en-us&uuid=1517bfd3f7a87ab988
``` 
- lang :  Switch response language , allow 'en-us'、'zh-tw'、'zh-cn'
- uuid:  Mobile uuid that has been registered.
##### Resuest Header
```
resource-id:1/bb2cbbc0eb8411e7b4f300016cd4175c
``` 
 - resource-id : This id must discuss with qstorage PM, that will determine where the file located.
##### Request Params
Use form post to upload file,please keep the content-type **multipart/from-data**,this is a example use curl
```
 curl -F 'files=@D:temp\img\testimage.jpeg'
```
##### Response Body
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
##### Response Data
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
##### Response Data
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
##### Response Data
| Result Code | Descriptopn |
|--|--|
|1 | Success. Return sas token in 'Content'
997902|Mandatory Field Lost
997903|Field Format Error
997904|Account Not Exist
999006|Input format is invalid
997999|Unknown Error