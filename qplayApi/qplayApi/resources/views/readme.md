# QPlay login method
## 透過QLogin plugin(Nactive)

### component.js
getServerData()
args[1] = window.localStorage.getItem("pushToken"); //return by plugin QPush
window.plugins.qlogin.openCertificationPage(null, null, args);

### QLoginPlugin
openCertificationPage

### login.blade.php
https://qplaydev.benq.com/qplayApi/public/qplayauth_register?uuid=1114a89792a637fcd0f&device_type=ios
{"result_code":1,"message":"Call Service Success","content":{"is_register":1}}

![img_7636](https://user-images.githubusercontent.com/1924451/43822479-cbbb1b1e-9b1e-11e8-950f-7ed0e0956892.PNG)

qplayApi/resources/views/login.blade.php
onclick="tryLogin()">登入</button>

https://qplaydev.benq.com/qplayApi/public/v101/qplay/login?lang=en-us&uuid=1114a89792a637fcd0f
{“result_code":1,"message":"Login Success","token_valid":1534315718,"content":{"uuid":"1114a89792a637fcd0f","redirect_uri":"http%3A%2F%2Fwww.moses.com%2Ftest%3Ftoken%3D5b6a9246177cf%26token_valid%3D1534315718","token":"5b6a9246177cf","loginid":"Alan.Tu","emp_no":"1204125","domain":"BenQ","site_code":"BQY","company":"BenQ","ad_flag":"Y","checksum":"d0d263ed4f7e72c501839e7a7ff694b6","security_update_list":[]}}


測試連結
https://qplaydev.benq.com/qplayApi/public/qplayauth_register?uuid=1114a89792a637fcd0f&device_type=ios
