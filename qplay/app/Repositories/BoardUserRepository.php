<?php
namespace App\Repositories;

use App\Model\QP_Board_User;


class BoardUserRepository
{
    /** @var BoardUser Inject QP_Board_User model */
    protected $boardUser;

    /*
     * BoardUserRepository constructor.
     * @param QP_Board_User $boardUser
     * 
     */
    public function __construct(QP_Board_User $boardUser)
    {     
        $this->boardUser = $boardUser;
    }

    public function insertBoardUser($data){
        return $this->boardUser->insert($data);
    }

    public function deleteUserByBoardId($boardId){
        $this->boardUser->where('board_id',$boardId)->delete();
    }

    public function arrangeInsertData($boardId, $uploadData){

        $insertData = [];
        $nowTimestamp = time();
        $now = date('Y-m-d H:i:s',$nowTimestamp);
        $insertData['board_id'] =  $boardId;
        $insertData['emp_no'] = $uploadData['empno'];
        $insertData['created_user'] = \Auth::user()->row_id;
        $insertData['created_at'] = $now;
        return $insertData;


    }
}