## Restful API
### User API
#### 1. Register
##### Resuest
```
POST /getaccountingrate?LAST_UPDATE_DATE=1464677364
```
##### Request Params
 1. LAST_UPDATE_DATE (unix timestamp型式), 共10碼, 範例 2016/5/31 14:49:24換算為unix time為1464677364

##### Response
```json
{
    "ResultCode":1,
    "Message":"Success",
    "Content":[
                {
                  "From_Currency": "AED",
                  "To_Currency": "NTD",
                  "Ex_Date": "2017/3/1",
                  "Ex_Rate": "8.3523",
                  "LAST_UPDATE_DATE": "1464677364"

                },
                {
                  "From_Currency": "EUR",
                  "To_Currency": "RUB",
                  "Ex_Date": "2017/3/1",
                  "Ex_Rate": "61.134",
                  "LAST_UPDATE_DATE": "1464677364"

                }
              ]
}

```

```json 空值範例
{
    "ResultCode":1,
    "Message":"Success",
    "Content":[]
}

```
##### Response Data
```
如果成功, ResultCode 1, Message 'Success'
如果有Error, 請固定前三碼016, 後三碼從001開始, 然後給錯誤訊息
下面是範例
 1. 1       'Success'
 2. 016001  'Unknow error'
```
 
 ```
 當下的時間(unix timestamp型式), 共10碼
ex: 2016/5/31 14:49:24換算為unix time為1464677364
如何在不同编程语言中获取现在的Unix时间戳(Unix timestamp)可以
參考以下程式碼
程式語言	獲取方式
Java	time
JavaScript	Math.round(new Date().getTime()/1000)getTime()返回数值的单位是毫秒
Microsoft .NET / C#	epoch = (DateTime.Now.ToUniversalTime().Ticks - 621355968000000000) / 10000000
MySQL	SELECT unix_timestamp(now())
Perl	time
PHP	time()
PostgreSQL	SELECT extract(epoch FROM now())
Python	先 import time 然后 time.time()
Ruby	获取Unix时间戳：Time.now 或 Time.new
显示Unix时间戳：Time.now.to_i
SQL Server	SELECT DATEDIFF(s,'1970-01-01 00:00:00',GETUTCDATE())
Unix/Linux	date+%s
VBScript/ASP	DateDiff("s","01/01/1970 00:00:00",Now())
其他操作系统
(如果Perl被安装在系统中)	命令行状态：perl -e "print time"
```
