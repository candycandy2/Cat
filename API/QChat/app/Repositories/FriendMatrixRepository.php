<?php
/**
 * 交友相關資料處理
 * @author Cleo.W.Chan
 */
namespace App\Repositories;

use App\Model\QP_Friend_Matrix;
use DB;

class FriendMatrixRepository
{
    
    protected $friendMatrix;
    
    /**
     * ParameterRepository constructor.
     * @param QP_Friend_Matrix $friendMatrix
     */
    public function __construct(QP_Friend_Matrix $friendMatrix){
        $this->friendMatrix = $friendMatrix;
    }

    /**
     * 取得特定用戶與對方的交友狀況
     * @param  String $fromEmpNo   用戶員工編號
     * @param  String $targetEmpNo 對方員工編號
     * @return mixed
     */
    public function getFriendShip($fromEmpNo, $targetEmpNo){
        return $this->friendMatrix
               ->where('from_emp_no','=', $fromEmpNo)
               ->where('target_emp_no', '=', $targetEmpNo)
               ->select('status')
               ->first();
    }

    /**
     * 建立新的友誼關係
     * @param  String $fromEmpNo   邀請者的員工編號
     * @param  String $targetEmpNo 受邀者的員工編號
     * @param  String  $userId     使者的qp_user.row_id
     * @return int                 新增筆數
     */
    public function newFriendShip($fromEmpNo, $targetEmpNo, $userId){
        return $this->friendMatrix
                ->create(['from_emp_no' => $fromEmpNo,
                        'target_emp_no'=> $targetEmpNo,
                        'created_user' => $userId,
                        'status'=>0]);
    }

    /**
     * 發送交友邀請給保護名單
     * @param  String $fromEmpNo       邀請者的員工編號
     * @param  String $targetEmpNo     受邀者的員工編號
     * @param  String  $userId     使者的qp_user.row_id
     * @param  String $inviationReason 邀請原因
     * @return int                     影響筆數
     */
    public function sendInvaitation($fromEmpNo, $targetEmpNo, $userId, $inviationReason){
        return $this->friendMatrix
          ->where('from_emp_no','=', $fromEmpNo)
          ->where('target_emp_no','=', $targetEmpNo)
          ->whereIn('status', array(0,3))
          ->update(['status' => 2,
                    'invitation_reason' =>$inviationReason,
                    'updated_user'=>$userId]);
    }

    /**
     * 取得好友邀請
     * @param  String $fromEmpNo       邀請者的員工編號
     * @param  String $targetEmpNo     受邀者的員工編號
     * @return json
     */
    public function getInvitation($fromEmpNo, $targetEmpNo){
        return $this->friendMatrix
          ->where('from_emp_no','=', $fromEmpNo)
          ->where('target_emp_no','=', $targetEmpNo)
          ->where('status','=', '2')
          ->select('status',
                    'invitation_reason',
                    'created_user')
          ->get();
    }
    
    /**
     * 接受好友邀請
     * @param  String $empNo           受邀者的員工編號
     * @param  String $sourceEmpNo     邀請者的員工編號
     * @param  String  $userId     使者的qp_user.row_id
     * @return int                     影響筆數
     */
    public function acceptInvitation($empNo, $sourceEmpNo, $userId){
        return $this->friendMatrix
          ->where('from_emp_no','=', $sourceEmpNo)
          ->where('target_emp_no','=', $empNo)
          ->where('status', 2)
          ->update(['status' => 1,
                    'reject_reason'=>'',
                    'updated_user'=>$userId]);
    }

    /**
     * 拒絕好友邀請關係
     * @param  String $empNo           受邀者的員工編號
     * @param  String $sourceEmpNo     邀請者的員工編號
     * @param  String  $userId     使者的qp_user.row_id
     * @param  String $reason          拒絕理由
     * @return int                     影響筆數
     */
    public function rejectInvitation($empNo, $sourceEmpNo, $userId, $rejectReason){
        return $this->friendMatrix
          ->where('from_emp_no','=', $sourceEmpNo)
          ->where('target_emp_no','=', $empNo)
          ->where('status','=', 2)
          ->update(['status' => 3,
                    'reject_reason'=>$rejectReason,
                    'updated_user'=>$userId]);
    }


    /**
     * 設定為常用好友
     * @param  String $fromEmpNo       邀請者的員工編號
     * @param  String $targetEmpNo     受邀者的員工編號
     * @param  String $userId          使用者的qp_user.row_id
     * @return int                     影響筆數
     */
    public function setFriend($fromEmpNo, $targetEmpNo, $userId){
        return $this->friendMatrix
          ->where('from_emp_no','=', $fromEmpNo)
          ->where('target_emp_no','=', $targetEmpNo)
          ->update(['status' => 1,
                    'updated_user'=>$userId]);
    }

    /**
     * 移除好友關係
     * @param  String $empNo            邀請者的員工編號
     * @param  String $destinationEmpNo 受邀者的員工編號
     * @param  String $userId           使用者的qp_user.row_id
     * @return int                      影響筆數
     */
    public function removeFriend($empNo, $destinationEmpNo, $userId){
        return $this->friendMatrix
          ->where('from_emp_no','=', $empNo)
          ->where('target_emp_no','=', $destinationEmpNo)
          ->where('status','=', 1)
          ->update(['status' => 0,
                    'updated_user'=>$userId]);
    }
}