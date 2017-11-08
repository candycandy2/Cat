<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>{{$subject}}</title>
    <style type="text/css">
        /* Font Definitions */
        
        @font-face {
            font-family: 微軟正黑體;
        }
        * {
            padding: 0;
        }
        table {
            border-spacing: 0;
            border-collapse: collapse;
            background-color: #fafafa;
            font-size: 14px;
            font-family: 微軟正黑體, Arial, Helvetica, sans-serif;
            color: #333333;
        }
        .container{
            background-color: #ffffff;
            width: 100%;
            border: 0;
        }
        .black {
            background-color: #000;
        }
        .navy_up {
            height: 58px;
            background-color: #006c92;
            text-align: center;
            vertical-align: bottom;
        }
        .navy_mid{
            height:24px;
            background-color:#006c92;
            text-align:center;
            vertical-align:center;
        }
        .navy_down {
            height: 58px;
            background-color: #006c92;
            text-align: center;
            vertical-align: top;
        }
        .date {
            font-size: 24px;
            color: #fff;
            font-family: Gill Sans MT, Arial, sans-serif;
        }
        .priority {
            font-size: 20px;
            color: #fff;
            font-family: Gill Sans MT, Arial, sans-serif;
        }
        .priority_normal {
            font-size: 32px;
            color: #29bb9b;
            font-family: Gill Sans MT, Arial, sans-serif;
        }
        .title {
            color: #333333;
            font-size: 30px;
            font-weight: bold;
            height: 45px;
            font-family: 微軟正黑體, Arial, Helvetica, sans-serif;
        }
        .title_02 {
            color: #492582;
            font-size: 20px;
            font-weight: bold;
            height: 35px;
            font-family: 微軟正黑體, Arial, Helvetica, sans-serif;
        }
        .icon {
            vertical-align: top;
        }
        p {
            font-size: 14px;
            font-family: 微軟正黑體, Arial, Helvetica, sans-serif;
            line-height: 26px;
            color: #333333;
        }
        .Title {
            font-size: 14px;
            font-family: 微軟正黑體, Arial, Helvetica, sans-serif;
            line-height: 26px;
            color: #1998c5;
            font-weight: bold;
        }
        .Title1 {
            font-size: 14px;
            font-family: 微軟正黑體, Arial, Helvetica, sans-serif;
            line-height: 26px;
            color: #333333;
            font-weight: bold;
        }
    </style>
</head>

<body>
    <table class="container">
        <tr>
            <td align="center">
                <table width="600" border="0" cellspacing="0" cellpadding="0" >
                    <tr>
                        <td width="600" class="black">&nbsp;</td>
                    </tr>
                    <tr>
                        <td>
                            <table width="600" border="0" cellpadding="0" cellspacing="0" mso-cellspacing="0" mso-cellpadding="0" >
                                <tr>
                                    <td><img style="display:block; float:left; border:0; outline:0" src="{{url('images/logo.jpg')}}" width="380" height="140" />
                                    </td>
                                    <td>
                                        <table border="0" mso-cellspacing="0" mso-cellpadding="0" width="220" style="float:left;">
                                            <tr>
                                                <td class="navy_up"><span class="priority">Priority -</span> <span class="priority_normal">Normal</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="navy_mid">
                                                <table border="0" width="100%" cellpadding="0" cellspacing="0" style="font-size:0">
                                                  <tr>
                                                    <td style="background-color:#006c92; border-bottom: 1px solid #006c92; height:1px; width:10%; padding:0px 0px 0px 0px;">&nbsp;</td>
                                                    <td style="background-color:#006c92; border-bottom: 1px solid #003466; height:1px; width:80%; padding:0px 0px 0px 0px;">&nbsp;</td>
                                                    <td style="background-color:#006c92; border-bottom: 1px solid #006c92; height:1px; width:10%; padding:1px 0px 0px 0px;">&nbsp;</td>
                                                  </tr>
                                                </table>
                                                <table border="0" width="100%" cellpadding="0" cellspacing="0" style="font-size:0">
                                                 <tr>
                                                    <td style="background-color:#006c92; border-top: 1px solid #006c92; height:1px; width:10%; padding:0px 0px 0px 0px;">&nbsp;</td>
                                                    <td style="background-color:#006c92; border-top: 1px solid #339CCC; height:1px; width:80%; padding:0px 0px 0px 0px;">&nbsp;</td>
                                                    <td style="background-color:#006c92; border-top: 1px solid #006c92; height:1px; width:10%; padding:0px 0px 0px 0px;">&nbsp;</td>
                                                  </tr>
                                                </table>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="navy_down"><span class="date">{{date("Y", $sendDate)}} / {{date("M", $sendDate)}} {{date("j", $sendDate)}}</span>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td><img style="display:block; float:left; border:0; outline:0;" src="{{url('images/shadow.jpg')}}" width="600" height="40" />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <table width="600" border="0" mos-cellspacing="0" mos-cellpadding="0">
                                <tr>
                                    <td width="24">&nbsp;</td>
                                    <td width="510">
                                        <p>Hi,{{$receiver}}</p>
                                        <p>{{$sender}}使用QChat邀請您一起聊天，快安裝QPlay，別錯過同事訊息囉！ </p>
                                        <p>使用手機掃描QR Code，或在手機上點選以下連結開始安裝QPlay:
                                            <br />
                                            <br /> →我要使用連結安裝 <a href="https://qplay.benq.com/InstallQPlay/">https://qplay.benq.com/InstallQPlay/<br />
                </a>→我要掃描QR Code安裝 </p>
                                        <p><img src="{{url('images/qrcode.png')}}" width="151" height="151" />
                                        </p>
                                        <p>&nbsp;</p>
                                        <p>=====================================================</p>
                                        <p>&lt;安裝教學&gt; </p>
                                        <p class="Title">→ Step1. 開啟QPlay</p>
                                        <p>選擇公司別後並輸入個人NT帳號及密碼，帳號處直接輸入字首為大寫的名字即可
                                            <br /> (ex: Alan.TP.Wang，不是BenQ\Alan.TP.Wang，也不是Alan.TP.Wang@benq.com，只要 Alan.TP.Wang)</p>
                                        <p>*若忘記密碼，請ITS協助處理 ,若帳密皆正確，但仍無法登入，請洽QPlay@BenQ.com </p>
                                        <p>
                                            <br />
                                        </p>
                                        <p><img src="{{url('images/IMG_0383.PNG')}}" width="400" height="711" />
                                        </p>
                                        <p>&nbsp;</p>
                                        <p class="Title"><span class="Title1">→ </span> Step2. 點擊QChat App icon </p>
                                        <p class="Title"><img src="{{url('images/IMG_0384.PNG')}}" width="400" height="711" />
                                        </p>
                                        <p class="Title">&nbsp;</p>
                                        <p class="Title"><span class="Title1">→ </span>Step3. 點擊「下載」</p>
                                        <p class="Title"><img src="{{url('images/IMG_0385.PNG')}}" width="400" height="711" />
                                        </p>
                                        <p class="Title">&nbsp;</p>
                                        <p class="Title"><span class="Title1">→ </span>Step4. 回到桌面，開啟QChat，開始聊天囉！ </p>
                                        <p>&nbsp;</p>
                                    </td>
                                    <td width="24">&nbsp;</td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td><img src="{{url('images/footer02.png')}}" width="600" height="76" />
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>

</html>