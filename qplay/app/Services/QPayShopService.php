<?php
/**
 * QPay Shop - Service
 * @author  Cleo.W.Chan cleo.w.chan@benq.com
 */
namespace App\Services;

use App\lib\ResultCode;
use App\Repositories\QPayShopRepository;
use App\Repositories\UserRepository;
use Auth;
use DB;

class QPayShopService
{
    protected $qpayShopRepository;
    protected $userRepository;

    /**
     * QPayMemberService constructor.
     * @param UserRepository $UserRepository
     */
    public function __construct(QPayShopRepository $qpayShopRepository,
                                UserRepository $userRepository)
    {
        $this->qpayShopRepository = $qpayShopRepository;
        $this->userRepository = $userRepository;
    }

    /**
     * Get enable qpay shop list
     * @return mixed
     */
    public function getQPayShopList(){
       return $this->qpayShopRepository->getQPayShopList();
    }

    /**
     * Add a new shop
     * @param  string $name    shop name
     * @param  string $address shop address
     * @param  string $tel     shop tel
     * @param  string $loginId  QAccount login id
     * @param  string $pwd      password
     * @return boolean
     */
    public function newQPayShop($name, $address, $tel, $loginId, $pwd){

        $now = date('Y-m-d H:i:s',time());

        $options = [
            'cost' => '08',
        ];
        $pwdEncode = password_hash($pwd, PASSWORD_BCRYPT, $options);

        $data = ['emp_name'     =>$name,
                'ext_no'        =>$tel,
                'login_id'      =>$loginId,
                'password'      =>$pwdEncode,
                'emp_id'        =>$pwd,
                'emp_no'        =>$loginId,
                'user_domain'   =>'shop',
                'site_code'     =>'shop',
                'company'       =>'shop',
                'department'    =>'shop',
                'status'        =>'Y',
                'resign'        =>'N',
                'ad_flag'       =>'N',
                'source_from'   =>'shop',
                'created_at'    =>$now,
                'created_user'  =>Auth::user()->row_id
                ];
        $newUserId = $this->userRepository->newUser($data);

        $shopInfo = [
                'user_row_id'   =>$newUserId,
                'address'       =>$address,
                'trade_status'  =>'N',
                'created_at'    =>$now,
                'created_user'  =>Auth::user()->row_id
                ];
                
        $newShopRs = $this->qpayShopRepository->newShop($shopInfo);

        return $newShopRs;
        
    }

     /**
     * Update QAccount user status
     * if set requset parameter action = 'close', user will be blocked,and can't use QPlay;
     * else set request parameter action = 'open', user can use QPlay
     * @param  Request $request 
     * @return json
     */
    public function updateUserStatus($userId, $status){
        return $this->userRepository->updateUserStatus($userId, $status);
    }

    /**
     * Update QPay trade status
     * @param  int    $shopId qpay_shop.row_id as shop id
     * @param  string $status N|Y
     * @return boolean save() result
     */
    public function updateTradeStatus($shopId, $status){
        return $this->qpayShopRepository->updateTradeStatus($shopId, $status);
    }

    /**
     * Reset QAccount Password
     * @param  int $userId       qp_user.row_id
     * @param  string $resetPwd  the password which will be updated to
     * @param  string $updatedAt update time
     * @return boolean
     */
    public function resetQAccountPwd($userId, $resetPwd, $updatedAt){
        
        $user = $this->userRepository->getUserInfo($userId);

        if(is_null($user)){
            return null;
        }

        if($resetPwd == null){
            $resetPwd = $user->emp_id;
        }

        $options = [
            'cost' => '08',
        ];

        $pwd = password_hash($resetPwd, PASSWORD_BCRYPT, $options);
        
        return $this->userRepository->resetQAccountPassword($userId, $pwd, Auth::user()->row_id, $updatedAt);
    }

    /**
     * Update shop information
     * @param  int    $shopId  qpay_shop.row_id
     * @param  string $name    shop name
     * @param  string $address shop address
     * @param  string $tel     shop tel
     * @param  string $loginId shop login_id
     * @return boolean
     */
    public function updateShop($shopId, $name, $address, $tel, $loginId){
    
        DB::beginTransaction();

        try {

           $shopUserInfo = $this->qpayShopRepository->getShopUserByShopId($shopId);

           $userData = ['emp_name'      => $name,
                        'ext_no'        => $tel,
                        'login_id'      => $loginId,
                        'updated_user'  => Auth::user()->row_id
                       ];
           $updateUserRs = $this->userRepository->updateUser($shopUserInfo->user_row_id, $userData);

           $shopData = ['address'       => $address,
                        'updated_user'  => Auth::user()->row_id
                        ];

           $updateShopRs = $this->qpayShopRepository->updateShop($shopId, $shopData);
            
            DB::commit();

        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }

       return $updateShopRs;

    }

    /**
     * Soft dalete shop
     * @param  Array $shopIdList  the shop id list which will be deleted
     * @return boolean
     */
    public function deleteShop($shopIdList){
        
        DB::beginTransaction();
        try {
            $now = date('Y-m-d H:i:s',time());
            $deleteRs = true;
            foreach ($shopIdList as $shopId) {

               $shopUserInfo = $this->qpayShopRepository->getShopUserByShopId($shopId);

               $userData = [
                            'updated_user'  => Auth::user()->row_id,
                            'deleted_at'    => $now 
                           ];
               $updateUserRs = $this->userRepository->updateUser($shopUserInfo->user_row_id, $userData);

               $shopData = [
                            'updated_user'  => Auth::user()->row_id,
                            'deleted_at'    => $now,
                            'trade_status'  => 'N'
                            ];

               $updateShopRs = $this->qpayShopRepository->updateShop($shopId, $shopData);
               
            }
        DB::commit();

        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }

        return $updateShopRs;
    }

    /**
     * 
     * Get specific shop user data
     * @param  int $shopId qpay_shop.row_id as shop id
     * @return mixed
     */
    public function getShopUserByShopId($shopId){

        return $this->qpayShopRepository->getShopUserByShopId($shopId);

    }

    /**
     * get all QPay shop list
     * @return mixed
     */
    public function getAllShopList(){
        return $this->qpayShopRepository->getAllShopList();
    }
}