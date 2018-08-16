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
1.login <br>  | 


![screen shot 2018-05-24 at 6 05 59 pm](https://user-images.githubusercontent.com/1924451/40479083-549bd988-5f7d-11e8-923a-9fd3367d11a1.png)

----
<h2 id="常用-API-說明">常用 API 說明</h2>

```
QTunnel APIs, 在DMZ區提供介接的服務, 目前提供Login的介接
相關防火牆, VPN, NAT設置, 必須提前完成

所需環境
1. Windos 2016 NT Server
2. IIS Server
3. GPG  https://gnupg.org/download
4. .Net Framwork 4.0 and later
5. "C:\Program Files (x86)\Microsoft Visual Studio\2017\Enterprise\MSBuild\15.0\Bin\msbuild.exe" QTunnel.sln /p:Configuration=Release /t:Clean,Build
6. "C:\Program Files (x86)\Microsoft Visual Studio\2017\Enterprise\MSBuild\15.0\Bin\msbuild.exe" QPlay.Job.SyncGaiaUser.sln /p:Configuration=Release /p:Platform=x86 /t:Clean,Build

For windows
下載網址 : https://www.gpg4win.org/
1. 安裝gpg4win-3.1.1.exe
2. 執行gpg --import qlay_B40883DB_Secret.asc
3. 可以用gpg —list-keys確認
4. 第一次安裝, 請完成認證程序, 原理是要先有一個該機器的憑證,拿這個憑證去認證其他憑證, 譬如qplay
這動作有UI可以完成程序(點選兩下qlay_B40883DB_Secret, 選擇cert按鈕)

安裝步驟
1. 建立QTunnel IIS目錄,目標 https://[IP]/QTunnel/QTunnel.asmx/Login
檔案結構如下
QTunnel/QTunnel.asmx
QTunnel/Web.config
QTunnel/bin/QTunnel.dll
QTunnel/bin/Newtonsoft.Json.dll
QTunnel/test/login.html
QTunnel/test/js/jquery-1.12.3.min.js
2. 設定QTunnel/Web.config
<add key="serverPath" value="LDAP://10.82.12.61/DC=benq,DC=corp,DC=com" />
可以使用QTunnel/LDAPTool/ldapAdmin.exe 測試, 並取得DC=benq,DC=corp,DC=com
3. 匯入qplay GPG public key
gpg --import qlay_B40883DB_Secret.asc
4. 複製SRC/SyncToFile/Job file/到可執行目錄(目前只能存取SQLServer)
5. QPlay.Job.SyncGaiaUser.exe.config文件中需要自行修改DB的connectionString和FilePath和ViewName设定。
FilePath      => Output folder
ViewName => Database table or view name
ClientSettingsProvider.ServiceUri => Database URI
  <connectionStrings>
        <add name="dbGaia" connectionString="Database=qplay;Data Source=O-A05X;User Id=sa;Password=mn-123456;" providerName="System.Data.SqlClient" />
  </connectionStrings>
  <appSettings>
        <add key="FilePath" value="E:\QTuunel\Sync" />
        <add key="ViewName" value="Qp_User_Flower"/>  
        <add key="ClientSettingsProvider.ServiceUri" value="" />
        <add key="MaxRows" value="" />
        <add key="MySQL" value="Server=10.82.246.95; database=qplay; UID=eHRDB; password=XXX" />
  </appSettings>
  
6. [Option]加密步骤：(不加密也可以使用, 資安考量, 建議加密, 目前走.Net標準程序, 加解密都由.Net處理)
6.1.打开cmd命令进到aspnet_regiis.exe目录下: cd C:\Windows\Microsoft.NET\Framework\v4.0.30319 
6.2.命令窗口执行：C:\Windows\Microsoft.NET\Framework\v4.0.30319>aspnet_regiis.exe -pef "connectionStrings" "E:\Job3\QPlay.Job.SyncGaiaUser\QPlay.Job.SyncGaiaUser"
说明.-pef 和-pdf  参数是对指定的物理目录里的Web.config文件的connectionStrings节点进行加密和解密，需要事先将QPlay.Job.SyncGaiaUser.exe.config文件改名为Web.config，
加密后的文件名再改回QPlay.Job.SyncGaiaUser.exe.config。
7. 建立排程, 每日早上五點執行一次
測試方式是會產生
http://[ip]/QTunnel/Sync/[YYYYMMDD].xls.gpg
http://[ip]/QTunnel/Sync/[YYYYMMDD].csv.gpg
https://sa.benq.com/SynceHR/20180815.xls.gpg
8. IIS文件类型的问题，在IIS设定新增MIME types :.gpg
```

----
## *login*
```
檢查Login資訊, 轉譯LDAP的資訊, 回傳成功/失敗等相關資訊
```

### 請求方法
```
GET /login
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
997906|Request Timeout

### Example
``` Javascript
    <script type="text/javascript">
        $("#subForm").on("click", function () {
            $("#prompt").text('');
            var ntDomain = $("#ntDomain").val();
            var ntName = $("#ntName").val();
            var ntPwd = $("#ntPwd").val();

            $.ajax({
                type: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Signature-Time': Math.round(new Date().getTime() / 1000),
                    'loginid': ntName,
                    'password': ntPwd,
                    'domain': ntDomain
                },
                url: 'https://aptest2016.benq.com/QTunnel/QTunnel.asmx/Login',
                dataType: "json",
                async: true,
                cache: false,
                timeout: 30000,
                success: function (data) {
                    //console.log(data);
                    $("#prompt").text(JSON.parse(data.d).Message);
                },
                error: function (msg) {
                    console.log(msg);
                }
            });
        });

    </script>
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
