<?php
/**
 * QP_User - Service
 * @author  Darren.K.Ti darren.k.ti@benq.com
 */
namespace App\Services;

use App\lib\ResultCode;
use App\Repositories\UserRepository;

class UserService
{
    protected $UserRepository;

    /**
     * UserService constructor.
     * @param UserRepository $UserRepository
     */
    public function __construct(UserRepository $UserRepository)
    {
        $this->UserRepository = $UserRepository;
    }

    /**
    * Login for QAccount
    * @return ResultCode
    */
    public function QAccountLogin($account, $password)
    {
        $result = $this->UserRepository->QAccountLogin($account);

        if (count($result) == 1) {

            if ($result[0]->status === "N") {
                return ResultCode::_000914_userWithoutRight;
            }

            if (password_verify($password, $result[0]->password)) {
                return ResultCode::_1_reponseSuccessful;
            } else {
                return ResultCode::_000902_passwordError;
            }

        } else {
            return ResultCode::_000901_userNotExistError;
        }
    }

    /**
     * change QAccount password
     * @param  int $userId qp_user.row_id
     * @param  string $oldPwd old password
     * @param  string $newPwd new password
     * @return string  ResultCode    
     */
    public function changeQAccountPassword($userId, $oldPwd, $newPwd, $updatedUser, $updatedAt = null){

        //1.check old passwd
        $QAccountPwd = $this->UserRepository->getUserQAccountPwd($userId);
        if (!password_verify($oldPwd, $QAccountPwd)) {
             return ResultCode::_000926_oldLoginPasswordIncorrect;
        }
        //2.update passwd
        $options = [
            'cost' => '08',
        ];
        $pwd = password_hash($newPwd, PASSWORD_BCRYPT, $options);

        $this->UserRepository->changeQAccountPassword($userId, $pwd, $updatedUser, $updatedAt);

        return ResultCode::_1_reponseSuccessful;
    }

}