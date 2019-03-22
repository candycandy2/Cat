<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" style="font-family: , Arial, sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">

<head>
    <meta name="viewport" content="width=device-width" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>QPlay|Evaluaction Alert</title>

    <style type="text/css">
        img {
            max-width: 100%;
        }
        
        body {
            -webkit-font-smoothing: antialiased;
            -webkit-text-size-adjust: none;
            width: 100% !important;
            height: 100%;
            line-height: 1.6em;
        }
        
        body {
            background-color: #f6f6f6;
        }
        
        @media only screen and (max-width: 640px) {
            body {
                padding: 0 !important;
            }
            h1 {
                font-weight: 800 !important;
                margin: 20px 0 5px !important;
            }
            h2 {
                font-weight: 800 !important;
                margin: 20px 0 5px !important;
            }
            h3 {
                font-weight: 800 !important;
                margin: 20px 0 5px !important;
            }
            h4 {
                font-weight: 800 !important;
                margin: 20px 0 5px !important;
            }
            h1 {
                font-size: 22px !important;
            }
            h2 {
                font-size: 18px !important;
            }
            h3 {
                font-size: 16px !important;
            }
            .container {
                padding: 0 !important;
                width: 100% !important;
            }
            .content {
                padding: 0 !important;
            }
            .content-wrap {
                padding: 10px !important;
            }
            .invoice {
                width: 100% !important;
            }
        }
    </style>
</head>

<body itemscope itemtype="http://schema.org/EmailMessage" style="font-family: Arial,sans-serif; box-sizing: border-box; font-size: 14px; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: none; width: 100% !important; height: 100%; line-height: 1.6em; background-color: #f6f6f6; margin: 0;" bgcolor="#f6f6f6">

    <table class="body-wrap" style="font-family: Arial,sans-serif; box-sizing: border-box; font-size: 14px; width: 100%; background-color: #f6f6f6; margin: 0;" bgcolor="#f6f6f6">
        <tr style="font-family: Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
            <td style="font-family: Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0;" valign="top"></td>
            <td class="container" width="600" style="font-family: Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; display: block !important; max-width: 600px !important; clear: both !important; margin: 0 auto;" valign="top">
                <div class="content" style="font-family: Arial,sans-serif; box-sizing: border-box; font-size: 14px; max-width: 600px; display: block; margin: 0 auto; padding: 20px;">
                    <table class="main" width="100%" cellpadding="0" cellspacing="0" style="font-family: Arial,sans-serif; box-sizing: border-box; font-size: 14px; border-radius: 3px; background-color: #fff; margin: 0; border: 1px solid #e9e9e9;" bgcolor="#fff">
                        <tr style="font-family: Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                            <td class="alert alert-warning" style="font-family: Arial,sans-serif; border: 1px solid #e9e9e9; box-sizing: border-box; font-size: 16px; vertical-align: top; color: #000; font-weight: 500; text-align: center; border-radius: 3px 3px 0 0; background-color: #fff; margin: 0; padding: 20px;" align="center" bgcolor="#fff" valign="top">
                                <b>QPlay</b> - 用戶評論通知
                            </td>
                        </tr>
                        <tr style="font-family: Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                            <td class="content-wrap" style="font-family: Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 20px;" valign="top">
                                <table width="100%" cellpadding="0" cellspacing="0" style="font-family: Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                                    <tr style="font-family: Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                                        <td class="content-block" style="font-family: Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top">
                                            Dear QPlay Team,
                                        </td>
                                        <tr style="font-family: Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                                            <td class="content-block" style="font-family: Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top">
                                                系統收到 {{$emp_name}} 的評論</br>
                                            </td>
                                        </tr>
                                    </tr>
                                    <tr style="font-family: Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0; text-align: justify; text-justify: inter-word;">
                                        <td class="content-block" style="font-family: Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top">
                                            <table width="100%" style="font-size:13px;padding:10px;border-collapse: collapse;border: 1px solid gray; margin-left:auto;margin-right:auto;">
                                                <tbody>
                                                    <tr>
                                                        <td style="background-color: #f2f2f2;border: 1px solid gray">員工編號</td>
                                                        <td style="border: 1px solid gray">{{$emp_no}}</td>
                                                    </tr>
                                                     <tr>
                                                        <td style="background-color: #f2f2f2;border: 1px solid gray">Domain</td>
                                                        <td style="border: 1px solid gray">{{$user_domain}}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style="background-color: #f2f2f2;border: 1px solid gray">Login ID</td>
                                                        <td style="border: 1px solid gray">{{$login_id}}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style="background-color: #f2f2f2;border: 1px solid gray">姓名</td>
                                                        <td style="border: 1px solid gray">{{$emp_name}}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style="background-color: #f2f2f2;border: 1px solid gray">email</td>
                                                        <td style="border: 1px solid gray">{{$email}}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style="background-color: #f2f2f2;border: 1px solid gray">分機</td>
                                                        <td style="border: 1px solid gray">{{$ext_no}}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style="background-color: #f2f2f2;border: 1px solid gray">公司</td>
                                                        <td style="border: 1px solid gray">{{$company}}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style="background-color: #f2f2f2;border: 1px solid gray">部門</td>
                                                        <td style="border: 1px solid gray">{{$department}}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style="background-color: #f2f2f2;border: 1px solid gray">使用裝置</td>
                                                        <td style="border: 1px solid gray">{{$device_type}}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style="background-color: #f2f2f2;border: 1px solid gray">發表時間</td>
                                                        <td style="border: 1px solid gray">{{$comment_time}}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style="background-color: #f2f2f2;border: 1px solid gray">評論內容</td>
                                                        <td style="border: 1px solid gray">{!!nl2br($comment)!!}
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                    <div class="footer" style="font-family: Arial,sans-serif; box-sizing: border-box; font-size: 14px; width: 100%; clear: both; color: #999; margin: 0; padding: 20px;">
                        <table width="100%" style="font-family: Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                            <tr style="font-family: Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                                <td class="aligncenter content-block" style="font-family: Arial,sans-serif; box-sizing: border-box; font-size: 12px; vertical-align: top; color: #999; text-align: center; margin: 0; padding: 0 0 20px;" align="center" valign="top">QPlay service team.</td>
                            </tr>
                        </table>
                    </div>
                </div>
            </td>
            <td style="font-family: Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0;" valign="top"></td>
        </tr>
    </table>
</body>

</html>