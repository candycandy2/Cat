# QMessage Web API

## Part Ⅰ.  Restful API
### User API
#### 1. Register
##### Resuest
```
POST /v101/qmessage/register 
{"username":"user1"}
```
##### Request Params
 1. allows a-z,A-Z,0-9,-.@
 2. begin with a-z,A-Z,0-9
##### Response
```json
{
    "ResultCode":1,
    "Message":"Success",
    "Content":[{"username":"user1"}]
}
```
##### Response Data
 1. 1 Success,return username in 'Content'
 2. 998001 username is empty or invalid
 3. 998002 call Jmessage API failed,check details in 'Content'

### Group API
#### 1. Add Group
##### Resuest
```
POST /v101/qmessage/group/add 
{ "owner":"Sammi.Yao","members":["Moses.zhu"],"desc":"Test Group From API"}
```

##### Request Params
 1. owner,members must exist 
 2. members should **NOT** contain owner

##### Response
```json
{
    "ResultCode": 1,
    "Message": "Success",
    "Content": {
        "gid": 21059495,
        "owner_username": "Sammi.Yao",
        "name": "9B1F51DD-74CB-985C-8030-40663530B3E3",
        "desc": "Test Group From API",
        "members_username": [
            "Moses.zhu"
        ],
        "max_member_count": 500
    }
}
```

##### Response Data
 1. 1 Success,return group id(gid),group name(gname) in 'Content'
 2. 998002 call Jmessage API failed,check details in 'Content'
 3. 998003 owner is empty or invalid
 4. 998004 member list is empty or invalid;

#### 2. Delete Group
##### Resuest
```
POST /v101/qmessage/group/delete 
{ "gid":20798373}
```

##### Request Params
 1. gid should be a number

##### Response
```json
{
    "ResultCode":1,
    "Message":"Success"
}
````

##### Response Data
 1. 1 Success,delete group success
 2. 998002 call Jmessage API failed,check details in 'Content'
 3. 998005 gid is empty or invalid

#### 3. List Group
##### Resuest
```
POST /v101/qmessage/group/list 
{ "username":"Moses.zhu"}
```

##### Request Params
 1. return groups which 'username' belongs to
 2. username must exist 

##### Response
```json
{
    "ResultCode": 1,
    "Message": "Success",
    "Content": [
        {
            "gid": 21059495,
            "mtime": "2017-02-07 10:03:53",
            "desc": "Test Group From API",
            "ctime": "2017-02-07 10:03:53",
            "max_member_count": 500,
            "name": "9B1F51DD-74CB-985C-8030-40663530B3E3"
        }
    ]
}
```

##### Response Data
 1. 1 Success,return groups info in Content(Array)
 2. 998002 call Jmessage API failed,check details in 'Content'

### Group Members API
#### 1. Add Group Members
##### Resuest
```
POST /v101/qmessage/group/members/add 
{ "gid":20798373,"usernames":["UserA"]}
```

##### Request Params
 1. 'gid' should be a number
 2. 'usernames' should be an array 

##### Response
```json
{
    "ResultCode":1,
    "Message":"Success"
}
```

##### Response Data
 1. 1 Success,add group members success
 2. 998002 call Jmessage API failed,check details in 'Content'
 3. 998004 member list is empty or invalid;
 4. 998005 gid is empty or invalid

#### 2. Delete Group Members
##### Resuest
```
POST /v101/qmessage/group/members/delete 
{ "gid":20798373,"usernames":["UserA","UserB"]}
```

##### Request Params
 1. 'gid' should be a number
 2. 'usernames' should be an array 

##### Response
```json
{
    "ResultCode":1,
    "Message":"Success"
}
```

##### Response Data
 1. 1 Success,delete group members success
 2. 998002 call Jmessage API failed,check details in 'Content'
 3. 998004 member list is empty or invalid;
 4. 998005 gid is empty or invalid

#### 3. List Group Members
##### Resuest
```
POST /v101/qmessage/group/members/list 
{ "gid":20798373}
```

##### Request Params
 1. 'gid' should be a number

##### Response
```json
{
    "ResultCode": 1,
    "Message": "Success",
    "Content": [
        {
            "ctime": "2017-02-07 10:03:53",
            "username": "Moses.zhu",
            "flag": 0
        },
        {
            "ctime": "2017-02-07 10:03:53",
            "username": "Sammi.Yao",
            "flag": 1
        }
    ]
}
```

##### Response Data
 1. 1 Success,return group members info in 'Content'
 2. 998002 call Jmessage API failed,check details in 'Content'
 3. 998005 gid is empty or invalid

### Message History API
#### 1. Get History List
##### Resuest
```
POST /v101/qmessage/history/list 
{"gid":19454745,"count":2,"cursor":"236013547"}
```

##### Request Params
 1. 'gid' should be a number
 2. 'count' refers to total you want get
 3. 'cursor' is a anchor which is used to tell server where to return message history
 4. 'cursor' will be return in every response unless no message history exists
 5.  if 'cursor' is empty, server will return the latest history messge

##### Response
```json
{
    "cursor": "236008426",
    "count": 2,
    "msgList": [
        {
            "ctime": 1486437274517,
            "msg_type": "text",
            "from_id": "Sammi.Yao",
            "target_id": "21059495",
            "content": "Test Message",
            "extras": ""
        },
        {
            "ctime": 1485913579323,
            "msg_type": "image",
            "from_id": "Moses.zhu",
            "target_id": "19454745",
            "content": "../upload/170201014620print.png",
            "extras": {
                "fname": "print.png",
                "fsize": 1057,
                "format": "png",
                "npath": "qiniu/image/j/F68182C7B100EE12B7427F5B969A6F7F"
            }
        }
    ]
}
```

##### Response Data
 1. 'cursor' represents the anchor of the oldest message in this request
 2. 'count' represents the actual total in this response
 3. 'msgList' is an array contains all details including:<br>
    (1)'ctime': time which message was created<br>
    (2)'msg_type': text or image<br>
    (3)'from_id' : who sended<br>
    (4)'target_id': to which group<br>
    (5)'content': for 'text',it's plain text;for image,it's an url<br>
    (6)'extras':for 'text',it's empty,for image,it contains image name(fname),image size(fsize),image format(format),jmessage url(npath)<br>

## Part Ⅱ. JS Plugin for Client

### Step 1. Reference
```html
<script src="jmessage-sdk-web-2.1.0.min.js"></script>
<script src="qmessage.js"></script>
```

### Step 2. Init
```js
var opts = {
    'username':username,
    'eventHandler': eventHandler,
    'messageHandler': messageHandler
    'message_key':"3c207a542c715ca5a0c7426d",
    'message_secret':"b15a6140ee8971c7598c3a0b",
    'message_api_url_prefix':"qplaytest.benq.com/qmessage/public/"
};
msgController = window.QMessage(opts);
```
1. username: string,current user
2. eventHandler:function,trigger when event received,1 parameter,like:
```js
{
    "gid": 20798373,
    "from_username": "",
    "from_appkey": "",
    "to_usernames": [
        "Sammi.Yao",
        "Moses.zhu",
        "UserA"
    ],
    "description": "",
    "rid": 85499936,
    "from_uid": 0,
    "event_id": 85499936,
    "event_type": 9,
    "extra": 0,
    "ctime": 1486434053,
    "event": "event_notification",
    "return_code": 0
}
```
3. messageHandler:function,trigger when message received,1 parameter,like:
```js
{
    "uid": 18436948,
    "messages": [
        {
            "ctime_ms": 1486089409817,
            "from_gid": 20798373,
            "msg_type": 4,
            "ctime": 1486089409,
            "msg_id": 237540677,
            "msg_level": 0,
            "from_uid": 19259602,
            "content": {
                "from_type": "user",
                "from_id": "Sammi.Yao",
                "set_from_name": 0,
                "target_name": "923F78FB-7BA9-74A9-DF61-51571D2C4918",
                "create_time": 1486089409664,
                "target_type": "group",
                "msg_body": {
                    "text": "Test Text"
                },
                "from_platform": "web",
                "msg_type": "text",
                "target_id": "20798373",
                "from_name": "Sammi.Yao",
                "version": 1
            }
        }
    ],
    "rid": 237540677,
    "event": "msg_sync"
}
```
4. message_key：appkey from jmessage
5. message_message_secret: secret from jmessage
6. message_api_url_prefix: service url without http or https,default value is empty(call current site)

### Step 3. Send Text/Image/File
#### SendText(gid,gname,text,success,error)
1. gid:group id
2. gname: group name
3. text: message to be sended
4. success: callback function on success ,1 parameter
5. error: callback function on error ,1 parameter
##### 
##### Example
```js
if(msgController.isInited){
    msgController.SendText(gid,gname,text,function(successResult){

    }, function(errorResult){
        
    });
}
```
successResult:
```js
{
    "result": {
        "target_gid": 21059495,
        "code": 0,
        "event": "send_group_msg",
        "msg_id": 240733833,
        "message": "success",
        "username": "Sammi.Yao"
    },
    "content": {
        "version": 1,
        "target_type": "group",
        "from_platform": "web",
        "target_id": "21059495",
        "target_name": "9B1F51DD-74CB-985C-8030-40663530B3E3",
        "from_id": "Sammi.Yao",
        "create_time": 1486449744851,
        "msg_type": "text",
        "msg_body": {
            "text": "Test Text"
        }
    }
}
```

#### SendImage(gid,gname,fid,success,error)
1. gid:group id
2. gname: group name
3. fid: html element id(```<input type="file"/>```) which refers image to be sended
4. success: callback function on success ,1 parameter
5. error: callback function on error ,1 parameter
##### Example
```js
if(msgController.isInited){
    msgController.SendImage(gid,gname,fid,function(successResult){

    }, function(errorResult){
        
    });
}
```
successResult:
```js
{
    "result": {
        "target_gid": 21059495,
        "code": 0,
        "event": "send_group_msg",
        "msg_id": 240726586,
        "message": "success",
        "username": "Sammi.Yao"
    },
    "content": {
        "version": 1,
        "target_type": "group",
        "from_platform": "web",
        "target_id": "21059495",
        "target_name": "9B1F51DD-74CB-985C-8030-40663530B3E3",
        "from_id": "Sammi.Yao",
        "create_time": 1486449322433,
        "msg_type": "image",
        "msg_body": {
            "media_id": "qiniu/image/j/2213A1717E9CAA481BC294ED77D29714",
            "media_crc32": 2482590675,
            "width": 20,
            "height": 20,
            "format": "png",
            "fsize": 863
        },
        "fname": "slider_handle.png"
    }
}
```

#### SendFile(gid,gname,fid,success,error)
1. gid:group id
2. gname: group name
3. fid: html element id(```<input type="file"/>```) which refers file to be sended
4. success: callback function on success ,1 parameter
5. error: callback function on error ,1 parameter
##### Example
```js
if(msgController.isInited){
    msgController.SendFile(gid,gname,fid,function(successResult){

    }, function(errorResult){
        
    });
}
```
successResult:
```js
{
    "result": {
        "target_gid": 21059495,
        "code": 0,
        "event": "send_group_msg",
        "msg_id": 278247268,
        "message": "success"
    },
    "content": {
        "version": 1,
        "target_type": "group",
        "from_platform": "web",
        "target_id": "21059495",
        "target_name": "9B1F51DD-74CB-985C-8030-40663530B3E3",
        "from_id": "Sammi.Yao",
        "create_time": 1490076642685,
        "msg_type": "file",
        "msg_body": {
            "media_id": "qiniu/file/j/6E94A97B5AD56CC1DD7B787E90C0AFD9",
            "media_crc32": 4028161950,
            "hash": "Fk6l4V01WOVIT0d-bt8OSAFbiRYQ",
            "fsize": 4249,
            "fname": "oracle.sql"
        },
        "fname": "oracle.sql"
    }
}
```

### Step 4. Close
```js
if (msgController.isInited) {
    msgController.close();
}
```
