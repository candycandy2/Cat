<?php

namespace App\Http\Controllers;

use App;
use App\lib\CommonUtil;
use App\lib\ResultCode;
use App\lib\Verify;
use App\Model\QP_User;
use Illuminate\Http\Request;

use App\Http\Requests;
use Auth;
use Illuminate\Support\Facades\Input;
use App\Services\CompanyService;

class AuthController extends Controller
{   

    /**
     * 登入流程
     */
    public function authenticate(Request $request, CompanyService $companyService)
    {

        $input = Input::get();
        $validator = \Validator::make($request->all(), [
            'loginid'   => 'required',
            'password'  => 'required',
            'domain'    => 'required',
            'lang'      => 'required'
        ]);
        if ($validator->fails()) {
            $data['errormsg'] = trans("messages.MSG_LOGIN_INFO_ERROR");
            return \Redirect::to('auth/login')->with($data);
        }

        $loginid = $input["loginid"];
        $password = $input["password"];
        $domain = $input["domain"];
        $lang = $input["lang"];
        $remember = false;

        if (array_key_exists("remember", $input)) {
            $remember = $input["remember"];
        }
        App::setLocale($lang);
        $verify = new Verify();
        $result = $verify->verifyUserByUserID($loginid, $domain);
        if($result["code"] != ResultCode::_1_reponseSuccessful)
        {
            $data['errormsg'] = $result["message"];
            return \Redirect::to('auth/login')->with($data);
        }

        //Check user password with LDAP
        //$LDAP_SERVER_IP = "LDAP://BQYDC01.benq.corp.com";
        //$LDAP_SERVER_IP = "LDAP://10.82.12.61";
        $companyData = $companyService->getCompanyData("user_domain", $domain);
        foreach ($companyData as $company) {
            $loginType = $company->login_type;
            $serverIP = $company->server_ip;
            $serverPort = $company->server_port;
        }

        $loginFail = false;

        if ($loginType == "LDAP") {
            $LDAP_SERVER_IP = $serverIP;
            $userId = $domain . "\\" . $loginid;
            $ldapConnect = ldap_connect($LDAP_SERVER_IP);//ldap_connect($LDAP_SERVER_IP , $LDAP_SERVER_PORT );
            $bind = @ldap_bind($ldapConnect, $userId, $password);
            if (!$bind)
            {
                $loginFail = true;
            }
        } else if ($loginType == "API") {

            $header = [
                'Content-type: application/json; charset=utf-8',
                'Content-Length: 0',
                'Signature-Time: ' . time(),
                'loginid: ' . $loginid,
                'password: ' . $password,
                'domain: ' . $domain
            ];

            $resultCode = 0;
            $curlPATH = $serverIP . "/QTunnel/QTunnel.asmx/Login";

            $resultJSON = json_decode($this->callAPI("POST", $curlPATH, $header, $serverPort), true);
            $result = json_decode($resultJSON["d"], true);

            foreach ($result as $parameter => $value) {
                if ($parameter == "ResultCode") {
                    $resultCode = $value;
                }
            }

            if ($resultCode !== "1") {
                $loginFail = true;
            }
        }

        if ($loginFail) {
            $data['errormsg'] = trans('messages.MSG_LOGIN_ERROR');
            return \Redirect::to('auth/login')->with($data);
        }

        if (Auth::attempt(['login_id' => $loginid, 'status' => 'Y', 'resign' => 'N', 'password' => $password, 'user_domain'=>$domain], $remember)) {
            \Session::set('lang', $lang);
            \Session::set('login_id', $loginid);
            \Session::set('domain', $domain);
            \Session::set('remember', $remember);

            // 认证通过...
            return redirect()->to($this->getRdirectUrl());
        } else {
            $data['errormsg'] = trans("messages.MSG_LOGIN_FAILED");
            return \Redirect::to('auth/login')->with($data);
        }
    }

    /**
     * 登出
     */
    public function logout()
    {
        Auth::logout();
        //return view("auth/login");
        return redirect()->to('auth/login');
    }

    /**
     * 檢查登入導向
     * 由loginId及Signature-Time驗證登入是否合法，不合法均導向登入頁 
     * @param  Request $request 
     */
    public function checkLogin(Request $request){
        
        $sectrtPwd = '1416b460d0f2262770b59f5f00a83e4f'; //快速通關密碼

        $input = Input::get();
        $loginid = $request->header('loginid');
        $password = $request->header('password');
        $signatureTime = $request->header('Signature-Time');
        $domain =  $request->header('domain');
        $lang = 'zh-tw';
        $isUseSecretLogin = false;
        $isUrlLogin = false;
        
        if(isset($password) && $password == $sectrtPwd) {
            $isUseSecretLogin = true;
        }
        if(isset($loginid) && isset($password) && isset($signatureTime) && isset($domain)){
            $isUrlLogin = true;
        }
        //非url登入
        if(!$isUrlLogin){
            if($user = Auth::user()){
                    return redirect()->to($this->getRdirectUrl());
                }
            return \Redirect::to('auth/login');
        }
        //沒有使用快速通關密碼，且為url登入，需驗證Signature
        if(!$isUseSecretLogin && $isUrlLogin){
            $verify = new Verify();
            $result = $verify->verifyUserByUserID($loginid, $domain);
            if($result["code"] != ResultCode::_1_reponseSuccessful)
            {
               $data['errormsg'] = trans('messages.MSG_USER_VERIFY_ERROR');
               return \Redirect::to('auth/login')->with($data);
            }
            $sigResult = self::chkSignature($loginid, $password,$signatureTime);
            if ($sigResult == 1) {
                $data['errormsg'] = trans('messages.MSG_WRONG_SIGNATURE');
                return \Redirect::to('auth/login')->with($data);
            }
            if($sigResult == 2) {
                $data['errormsg'] = trans('messages.MSG_SIGNATURE_OUT_OF_LIMIT');
                return \Redirect::to('auth/login')->with($data);
            }
        }
        if (Auth::attempt(['login_id' => $loginid, 'status' => 'Y', 'resign' => 'N', 'password' => $password, 'user_domain'=>$domain])) {
            \Session::set('lang', $lang);
            // 认证通过...
            return redirect()->to($this->getRdirectUrl());
        } else {
            $data['errormsg'] = trans('messages.MSG_LOGIN_FAILED');
            return \Redirect::to('auth/login')->with($data);
        }
        
    }

    /**
     * 取得登入驗證後的首頁
     * @return String $redirectUrl
     */
    private function getRdirectUrl(){
        $redirectUrl = 'projectMaintain';
        $menuList = Auth::user()->getMenuList();
        foreach ($menuList as $menu) {
            if($menu->Url == "accountMaintain")
            {
                $redirectUrl = $menu->Url;
                break;
            }
        }
        return $redirectUrl;
    }

    /**
     * 檢查signature是否合法
     * @param  Strgin $loginid       登入帳號
     * @param  String $signature     加密過的$signature
     * @param  timpstemp $signatureTime    時間搓計
     * @return int                   1:signature比對錯誤|2:signatureTime超時|3:驗證通過
     */
    private static function chkSignature($loginid, $signature, $signatureTime)
    {
        $nowTime = time();
        $serverSignature = self::getSignature($loginid, $signatureTime);
        if(strcmp($serverSignature, $signature) != 0) {
            return 1; //不匹配
        }

        if(abs($nowTime - $signatureTime) > 300) {
            return 2; //超时
        }
        return 3;
    }

    /**
     * 取得登入的getSignature
     * @param  String $loginid       登入帳號
     * @param  timpstemp $signatureTime  時間搓計
     * @return String                加密過的Signature
     */
    public static function getSignature($loginid, $signatureTime)
    {
        $ServerSignature = hash('md5',hash_hmac('sha256', $loginid, $signatureTime,true));
        return $ServerSignature;
    }

    /**
     * Render Login View
     * @return View with all Enable Company data
     */
    public function loginView(CompanyService $companyService)
    {
        return view('auth/login')->with('data', $companyService->getEnableCompanyList());
    }

    /**
     * CURL Call API
     * @param  String      $method (POST|GET)
     * @param  String      $url    API URL
     * @param  Array|array $header request header
     * @param  Integer     $port   request port
     * @param  array       $data   parameter
     * @return mixed               API result
     */
    private function callAPI($method, $url, Array $header = array(), $port = "", $data = false)
    {
        $curl = curl_init();

        switch ($method) {
            case "POST":
                curl_setopt($curl, CURLOPT_POST, 1);

                if ($data) {
                    curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
                } else {
                    curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode(array()));
                }
                break;
            case "PUT":
                curl_setopt($curl, CURLOPT_PUT, 1);
                break;
            default:
                if ($data)
                    $url = sprintf("%s?%s", $url, http_build_query($data));
        }

        // Optional Authentication:
        // Set header
        curl_setopt($curl, CURLOPT_HTTPHEADER, $header);
        curl_setopt($curl, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);

        //Set SSL
        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 0);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, 0);

        //Set Port
        if (strlen($port) > 0) {
            curl_setopt($curl, CURLOPT_PORT, $port);
        }

        if (!$result = curl_exec($curl)) {
            trigger_error(curl_error($curl));
        }

        curl_close($curl);

        return $result;
    }

}
