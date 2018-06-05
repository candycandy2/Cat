QTunnel API Readme.md
=============================

## Version 1.2.18 - Published 2018 Feb 23

## Contents
- [API 分類](#API-分類)
- [常用 API 說明](#常用-API-說明)
    - [login](#login)

----
<h2 id="API-分類">API 分類</h2>

Login | 
:------------ | 
1.login <br> 2.logout | 


![screen shot 2018-05-24 at 6 05 59 pm](https://user-images.githubusercontent.com/1924451/40479083-549bd988-5f7d-11e8-923a-9fd3367d11a1.png)

----
<h2 id="常用-API-說明">常用 API 說明</h2>

```
QTunnel APIs, 在DMZ區提供介接的服務, 目前提供Login的介接
相關防火牆, VPN, NAT設置, 必須提前完成
```

----
## *login*
```
檢查Login資訊, 轉譯LDAP的資訊, 回傳成功/失敗等相關資訊
```

### 請求方法
```
GET /login?lang=en-us
```

### header請求參數
    login需要將帳號密碼欄位透過HTTP Header送出, 所以包含下面參數：
欄位名稱 | 是否必填 | 描述
:------------ | :------------- | :-------------
content-type | 必填 | 訊息體類型，ex.使用POST方法傳輸, 類型需為application/json
signature-time | 必填 | 產生Signature當下的時間(unix timestamp型式), 共10碼<br>ex: 2016/5/31 14:49:24 換算為 unix time 為 1464677364 如何在不同编程语言中获取现在的 Unix 时间戳(Unix timestamp)可參考以下程式碼 (#注1)
domain | 必填 | AD domain
loginid | 必填 | AD login id
password | 必填 | AD login password


### 網址列請求參數
參數名稱 | 是否必填 | 資料類型 | 描述
:------------ | :------------- | :------------- | :-------------
lang | Required | string | Switch response language , allow 'en-us'、'zh-tw'、'zh-cn'

### 回應訊息
節點標識 | 父節點標識 | 出現次數 | 資料類型 | 描述
:------------ | :------------- | :------------- | :------------- | :-------------
ResultCode | NA | 1 | String | 回應代碼
Message | NA | 1 | String | 回應訊息描述
Content | NA | 0-1 | Container | 回應訊息內容Container

### Error Code
| Result Code | Descriptopn |
|--|--|
|1 | Success. 
997902|Password Incorrect
997903|Field Format Error
997904|Account Incorrect
997905|Account Has Been Disabled

### Example
``` c#
public bool ValidateUidPwdAndGetUserTypeGlobal(string TPXId, string password)
        {

            string strADPath = "LDAP://a.b.c/dc=a,dc=b,dc=c";
            try
            {
                DirectoryEntry objDirEntry = new DirectoryEntry(strADPath, TPXId, password);
                
                DirectorySearcher search = new DirectorySearcher(objDirEntry);
                search.Filter = "(samaccountname=" + TPXId + ")";
                SearchResult result = search.FindOne();
                if (null == result)
                {
                    return false;
                }
                else
                    return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }
```
<h4 id="注1">注1</h4>

程式語言 | 獲取方式
:------------ | :-------------
Java | time
JavaScript | Math.round(new Date().getTime()/1000)getTime()返回数值的单位是毫秒
Microsoft .NET / C#  | epoch = (DateTime.Now.ToUniversalTime().Ticks - 621355968000000000) / 10000000
MySQL | SELECT unix_timestamp(now())
Perl | time
PHP | time()
