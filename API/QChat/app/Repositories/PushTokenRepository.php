<?php
/**
 * PushToken相關資料處理
 * @author Cleo.W.Chan
 */
namespace App\Repositories;

use App\Model\QP_QChat_Push_Token;
use DB;

class PushTokenRepository
{
    
    protected $pushToken;
    
    /**
     * PushTokenRepository constructor.
     * @param QP_QChat_Push_Token $pushToken
     */
    public function __construct(QP_QChat_Push_Token $pushToken)
    {
        $this->pushToken = $pushToken;
    }

    /**
     * 新增push token
     * @param  String $empNo       員工編號
     * @param  String $pushToken   push token
     * @param  String $deviceType  裝置類型(ios | android)
     * @param  int    $createdUder 創建者的user_row_id
     * @return int         
     */
    public function newPushToken($empNo, $pushToken, $deviceType, $createdUder){

        $this->pushToken->emp_no = $empNo;
        $this->pushToken->push_token = $pushToken;
        $this->pushToken->device_type = $deviceType;
        $this->pushToken->created_user = $createdUder;
        return $this->pushToken->save();
    }

    /**
     * 取得特定使用者的所有push token
     * @param  String $empNo 員工編號
     * @return mixed
     */
    public function getPushTokenByEmpNo($empNo){
        return $this->pushToken->where('empNo',$empNo)->get();
    }

    /**
     * 查看pushToken是否存在
     * @param  String $deviceType  裝置類型(ios | android)
     * @param  String $token push token
     * @return int
     */
    public function getPushToken($deviceType, $pushToken){
        return $this->pushToken
              ->where('device_type',$deviceType)
              ->where('push_token',$pushToken)
              ->count();
    }

}