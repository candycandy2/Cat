<?php

namespace App\Repositories;

use App\Models\QP_Board;
use App\Models\QP_Board_Company;
use App\Models\QP_Board_User;
use DB;
class BoardRepository
{

    protected $board;
    protected $boardCompany;

    public function __construct(QP_Board $board,
                                QP_Board_Company $boardCompany,
                                QP_Board_User $boardUser)
    {   
        $this->board = $board;
        $this->boardCompany = $boardCompany;
        $this->boardUser = $boardUser;
    }

    /**
     * 取得討論版資訊
     * @param  int  $boardId 討論版id
     * @return mixed
     */
    public function getBoard($boardId){
        return $this->board->where('row_id',$boardId)
                    ->select('board_type_id', 'board_name', 'manager', 
                             'public_type','status','created_user',
                             'updated_user','created_at','updated_at')
                    ->first();
    }

    /**
     * 取得用戶所有討論版
     * @param  string $empNo   員工編號
     * @param  string $company 公司名稱
     * @return mixed
     */
    public function getUserBoards($empNo, $company){

        $companyBoards = $this->boardCompany->where('qp_board_company.company', $company)
                                       ->join('qp_board','qp_board.row_id','=','qp_board_company.board_id')
                                       ->join('qp_board_type','qp_board.board_type_id','=','qp_board_type.row_id')
                                       ->select('board_type_id', 'type_name', 'qp_board.row_id as board_id','board_name', 'manager', 'qp_board.status', 'public_type');

        $userBoards = $this->boardUser->where('qp_board_user.emp_no', $empNo)
                                        ->join('qp_board','qp_board.row_id','=','qp_board_user.board_id')
                                        ->join('qp_user','qp_user.emp_no','=','qp_board_user.emp_no')
                                        ->join('qp_board_type','qp_board.board_type_id','=','qp_board_type.row_id')
                                        ->select('board_type_id', 'type_name', 'qp_board.row_id as board_id','board_name', 'manager', 'qp_board.status', 'public_type');

        return $this->board
                ->where('public_type',1)
                ->join('qp_board_type','qp_board.board_type_id','=','qp_board_type.row_id')
                ->select('board_type_id', 'type_name', 'qp_board.row_id as board_id','board_name', 'manager', 'qp_board.status', 'public_type')
                ->union($companyBoards)
                ->union($userBoards)
                ->get();
    }

    /**
     * 檢查使用者是否有該版權限
     * @param  [type] $boardId [description]
     * @param  [type] $empNo   [description]
     * @return [type]          [description]
     */
    public function checkBoardUser($boardId, $empNo){
       return $this->boardUser
        ->where('board_id', $boardId)
        ->where('emp_no', $empNo)
        ->select('row_id')
        ->get();
    }

    public function checkBoardCompany($boardId, $companyName){
       return $this->boardCompany
        ->where('board_id', $boardId)
        ->where('company', $companyName)
        ->select('row_id')
        ->get();
    }
}
