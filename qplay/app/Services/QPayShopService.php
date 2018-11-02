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

    public function getQPayShopList(){
       return $this->qpayShopRepository->getQPayShopList();
    }

    public function newQPayShop($name, $address, $tel, $loginId, $pwd){

        $options = [
            'cost' => '08',
        ];
        $pwdEncode = password_hash($pwd, PASSWORD_BCRYPT, $options);

        $data = ['emp_name' =>$name,
                'ext_no'       => $tel,
                'login_id'  =>$loginId,
                'password'  =>$pwdEncode,
                'emp_id'    =>$pwd,
                'emp_no'    =>$loginId,
                'user_domain'=>'shop',
                'site_code'  =>'shop',
                'company'    =>'shop',
                'department' =>'shop',
                'status'=>'N',
                'resign'=>'N',
                'source_from'=>'shop',
                'created_user'=>Auth::user()->row_id
                ];

        $shopInfo = [
                ];
                
        $this->userRepository->newUser($data);
        $this->qpayShopRepository->newShop($shopInfo);
    }

}