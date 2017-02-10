<?php

namespace App\Http\Controllers;

use App\lib\CommonUtil;
use App\lib\ResultCode;
use App\lib\Verify;
use App\Model\QP_User;
use Illuminate\Http\Request;

use App\Http\Requests;
use Auth;
use Illuminate\Support\Facades\Input;

class AuthController extends Controller
{
    public function authenticate()
    {
        $input = Input::get();
        $loginid = $input["loginid"];
        $password = $input["password"];
        $domain = $input["domain"];
        $lang = $input["lang"];
        $remember = false;
        if(array_key_exists("remember", $input)) {
            $remember = $input["remember"];
        }
        //TODO real login
        $verify = new Verify();
        $result = $verify->verifyUserByUserID($loginid, $domain);
        if($result["code"] != ResultCode::_1_reponseSuccessful)
        {
            //return $result["message"];
            $data['errormsg'] = $result["message"];
            return \Redirect::to('auth/login')->with($data);
        }

        if (Auth::attempt(['login_id' => $loginid, 'status' => 'Y', 'resign' => 'N', 'password' => $password, 'user_domain'=>$domain], $remember)) {
            \Session::set('lang', $lang);

            //Check user password with LDAP
            //$LDAP_SERVER_IP = "LDAP://BQYDC01.benq.corp.com";
            $LDAP_SERVER_IP = "LDAP://10.82.12.61";
            $userId = $domain . "\\" . $loginid;
            $ldapConnect = ldap_connect($LDAP_SERVER_IP);//ldap_connect($LDAP_SERVER_IP , $LDAP_SERVER_PORT );
            $bind = @ldap_bind($ldapConnect, $userId, $password);
            if(!$bind)
            {
                $data['errormsg'] = "Login Failed";
                return \Redirect::to('auth/login')->with($data);
            }
            // 认证通过...
            //return Auth::id();
            //return redirect()->intended('dashboard');
            $menuList = Auth::user()->getMenuList();
            if(count($menuList) > 0)
            {
                foreach ($menuList as $menu) {
                    if($menu->Url == "accountMaintain")
                    {
                        return redirect()->to($menu->Url);
                    }
                }
                foreach ($menuList as $menu) {
                    if($menu->Url == "about")
                    {
                        return redirect()->to($menu->Url);
                    }
                }
                foreach ($menuList as $menu) {
                    if($menu->Url != "")
                    {
                        return redirect()->to($menu->Url);
                    }
                }
            }
            $data['errormsg'] = "No authority to access the system";
            return \Redirect::to('auth/login')->with($data);
            //return view("user_maintain/account_maintain");
        } else {
            $data['errormsg'] = "Login Failed";
            return \Redirect::to('auth/login')->with($data);
        }
    }

    public function logout()
    {
        Auth::logout();
        //return view("auth/login");
        return redirect()->to('auth/login');
    }
}
