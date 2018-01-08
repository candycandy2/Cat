<?php
/**
 * 用戶相關資料處理
 * @author Cleo.W.Chan
 */
namespace App\Repositories;

use App\Model\QP_User;
use App\Model\QP_QChat_User_Detail;
use DB;

class UserRepository
{

    protected $user;
    protected $qChatUserDetail;
    
    /**
     * ParameterRepository constructor.
     * @param QP_User $user
     */
    public function __construct(QP_User $user,
                                QP_QChat_User_Detail $qChatUserDetail)
    {   
        $this->user = $user;
        $this->qChatUserDetail = $qChatUserDetail;
    }

    /**
     * 取得使用者清單，最多10筆。
     * @param  String $searchType   1:name
     *                              2:department
     *                              3:only same department 只找尋同公司同部門的人
     *
     * @param  String $mode         查詢模式
     *                              1:只有好友
     *                              2:非好友
     *                              3:全部
     * @param  Strgin $searchString 當search_type = 1 or 2時, search_string欄位必填
     *                              當search_type=3時, search_string是非必填
     *                              會直接按emp_no查找相同公司,相同部門的人
     * @param  String $empNo         使用者的員工編號
     * @return mixed
     */
    public function getList($searchType, $mode, $empNo, $searchString=""){
        return $this->getSql($searchType, $mode, $empNo, $searchString)->limit(10)->get();
    }

    /**
     * 取得使用者筆數
     * @param  String $searchType   1:name
     *                              2:department
     *                              3:only same department 只找尋同公司同部門的人
     *
     * @param  String $mode         查詢模式
     *                              1:只有好友
     *                              2:非好友
     *                              3:全部
     * @param  Strgin $searchString 當search_type = 1 or 2時, search_string欄位必填
     *                              當search_type=3時, search_string是非必填
     *                              會直接按emp_no查找相同公司,相同部門的人
     * @param  String $empNo         使用者的員工編號
     * @return mixed
     */
    public function getCount($searchType, $mode, $empNo, $searchString=""){
        return $this->getSql($searchType, $mode, $empNo, $searchString)->get()->count();
    }

    /**
     * 取得保護名單的用戶層級
     * @param  String $empNo 員工編號
     * @return mixed
     */
    public function getUserLevel($empNo){
         return $this->user
                    ->Leftjoin('qp_protect_user','qp_user.emp_no','=','qp_protect_user.emp_no')
                    ->where('qp_user.emp_no',$empNo)
                    ->select('login_id', 'level')
                    ->first();
    }

    /**
     * 依員工編號取得用戶基本資料
     * @param  String $empNo 員工編號
     * @return mixed
     */
    public function getUserData($empNo){
        return $this->user
                ->where('emp_no',$empNo)
                ->select('row_id', 'emp_no', 'email', 'ext_no', 'site_code','login_id')
                ->first();

    }

    /**
     * 依員工帳號取得用戶基本資料
     * @param  String $loginId 員工帳號
     * @return mixed
     */
    public function getUserDataByLoginId($loginId){
        return $this->user
                ->where('login_id',$loginId)
                ->select('row_id', 'emp_no', 'email', 'ext_no', 'site_code','login_id')
                ->first();

    }

    /**
     * 取得所有使用者清單基礎語法。
     * @param  String $searchType   1:name
     *                              2:department
     *                              3:only same department 只找尋同公司同部門的人
     *
     * @param  String $mode         查詢模式
     *                              1:只有好友
     *                              2:非好友
     *                              3:全部
     * @param  Strgin $searchString 當search_type = 1 or 2時, search_string欄位必填
     *                              當search_type=3時, search_string是非必填
     *                              會直接按emp_no查找相同公司,相同部門的人
     * @param  String $empNo         使用者的員工編號
     * @return query object
     */
    private function getSql($searchType, $mode, $empNo, $searchString="") {

        if($searchType == '3'){
            $userDep = $this->user
                          ->where('emp_no','=',$empNo)
                          ->select('department','company')
                          ->first();
        }
        $query =  $this->user
             ->Leftjoin(DB::raw("(SELECT from_emp_no,target_emp_no,status,invitation_reason,reject_reason
                  FROM qp_friend_matrix
                  Where from_emp_no = ".$empNo."
                  ) as friend_ship"),function($join){
                  $join->on("friend_ship.target_emp_no","=","qp_user.emp_no");
              })
            ->Leftjoin('qp_qchat_user_detail','qp_user.emp_no','=','qp_qchat_user_detail.emp_no')
            ->Leftjoin('qp_protect_user','qp_user.emp_no','=','qp_protect_user.emp_no')
            ->where('qp_user.resign','=','N')
            ->where('qp_user.status','=','Y')
            ->where('qp_user.emp_no','<>',$empNo);
            if($searchType == '1' && trim($searchString)!=""){
                $query->where('login_id','LIKE','%'.$searchString.'%');
            }else if($searchType == '2'  && trim($searchString)!=""){
                $query->where('department','LIKE','%'.$searchString.'%');
            }
            if($searchType == '3' && !is_null($userDep->department) && !is_null($userDep->company)){
                $query->where('department','=',$userDep->department)
                      ->where('company','=',$userDep->company);
                if(trim($searchString)!=""){
                    $query->where('login_id','LIKE','%'.$searchString.'%');
                }
            }
            if($mode == 1){
                $query->where('friend_ship.status','=','1');
            }else if($mode == 2){
                $query->where(function ($query){
                    return $query->where('friend_ship.status', '=', null)
                          ->orWhere('friend_ship.status', '<>', '1');
                });
            }
           return $query ->select(
                                 'login_id as name',
                                 'qp_user.register_message as registered',
                                 DB::raw('IF (friend_ship.status is NULL, 0, friend_ship.status) as status'),
                                 DB::raw('IF (qp_protect_user.row_id is NULL,"N","Y") as protected'),
                                 'qp_user.emp_no',
                                 'user_domain as domain',
                                 'site_code',
                                 'email',
                                 'ext_no',
                                 'memo',
                                 'portrait_path');
                
    }

    /**
     * 取得特定使用者的推播token
     * @param  String $empNo 員工編號
     * @return mixed
     */
    public function getUserPushToken($empNo){
        return $this->user
                    ->join('qp_qchat_push_token','qp_user.emp_no','=','qp_qchat_push_token.emp_no')
                    ->where('qp_user.emp_no',$empNo)
                    ->select('push_token')
                    ->get();
    }

    /**
     * 取得用戶詳細資料
     * @param  String $empNo 使用者的emp_no
     * @return mixed
     */
    public function getQUserDetail($empNo){
        return $this->qChatUserDetail->where('emp_no','=',$empNo)->get();
    }

    /**
     * 新增用戶詳細資料
     * @param  String $empNo  使用者的emp_no
     * @param  Array  $data   新增的資料內容
     * @param  int    $userId 使用者的qp_user.row_id
     * @return int            影響的筆數
     */
    public function insertUserDetail($empNo, $data, $userId){
        $data['emp_no'] = $empNo;
        $data['created_user'] = $userId;
        return $this->qChatUserDetail
                ->create($data);
    }

    /**
     * 更新用戶詳細資料       
     * @param  String $empNo  使用者的emp_no
     * @param  Array  $data   更新的資料內容
     * @param  int    $userId 使用者的qp_user.row_id
     * @return int            影響的筆數
     */
    public function updateUserDetail($empNo, $data, $userId){
       $data['updated_user'] = $userId;
       return $this->qChatUserDetail
          ->where('emp_no','=', $empNo)
          ->update($data);
    }

    /**
     * 依員工編號取得用戶詳細資料
     * @param  String $empNo 員工編號
     * @param  String $destinationEmpNo 特定的用戶員工編號
     * @return mixed
     */
    public function getUserDetailByEmpNo($empNo, $destinationEmpNo){
        $query =  $this->user
        ->Leftjoin(DB::raw("(SELECT from_emp_no,target_emp_no,status,invitation_reason,reject_reason
                  FROM qp_friend_matrix
                  Where from_emp_no = ".$empNo."
                  ) as friend_ship"),function($join){
                  $join->on("friend_ship.target_emp_no","=","qp_user.emp_no");
              })
        ->Leftjoin('qp_qchat_user_detail','qp_user.emp_no','=','qp_qchat_user_detail.emp_no')
        ->Leftjoin('qp_protect_user','qp_user.emp_no','=','qp_protect_user.emp_no')
        ->where('qp_user.emp_no','=',$destinationEmpNo);
       return $query ->select(
                             'login_id as name',
                             'qp_user.register_message as registered',
                             DB::raw('IF (friend_ship.status is NULL, 0, friend_ship.status) as status'),
                             DB::raw('IF (qp_protect_user.row_id is NULL,"N","Y") as protected'),
                             'qp_user.emp_no',
                             'user_domain as domain',
                             'site_code',
                             'email',
                             'ext_no',
                             'memo',
                             'portrait_path')->get();
    }
    /**
     * 取得使用這註冊QPlay狀態
     * @return mixed
     */
    public function getQMessageRegister($destinationEmpNo){
        return $this->user
                ->where('emp_no','=', $destinationEmpNo)
                ->select('register_message')
                ->first();
    }
}