<?php

namespace App\Repositories;

use App\Models\QP_Board;
use App\Models\QP_Board_Company;
use App\Models\QP_Board_User;
use App\lib\CommonUtil;
use Config;
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
    public function getUserBoards($empNo, $company, $source){
        
        $isENSapp = ($source == CommonUtil::getContextAppKey(\Config::get('app.env'),'ens'))?true:false;

        $companyBoards = $this->boardCompany->where('qp_board_company.company', $company)
                                       ->join('qp_board','qp_board.row_id','=','qp_board_company.board_id')
                                       ->join('qp_board_type','qp_board.board_type_id','=','qp_board_type.row_id')
                                       ->where('qp_board.public_type',2)
                                       ->where('qp_board.status','Y')
                                       ->select('board_type_id', 'type_name', 'qp_board.row_id as board_id','board_name', 'manager', 'qp_board.status', 'public_type');

        if($isENSapp){
            $companyBoards = $companyBoards->where('type_name','ENS');  
        }

        $userBoards = $this->boardUser->where('qp_board_user.emp_no', $empNo)
                                        ->join('qp_board','qp_board.row_id','=','qp_board_user.board_id')
                                        ->join('qp_user','qp_user.emp_no','=','qp_board_user.emp_no')
                                        ->join('qp_board_type','qp_board.board_type_id','=','qp_board_type.row_id')
                                        ->where('qp_board.public_type',3)
                                        ->where('qp_board.status','Y')
                                        ->select('board_type_id', 'type_name', 'qp_board.row_id as board_id','board_name', 'manager', 'qp_board.status', 'public_type');
        if($isENSapp){
            $userBoards = $userBoards->where('type_name','ENS');  
        }

        $board =  $this->board
                ->where('public_type',1)
                ->where('qp_board.status','Y')
                ->join('qp_board_type','qp_board.board_type_id','=','qp_board_type.row_id')
                ->select('board_type_id', 'type_name', 'qp_board.row_id as board_id','board_name', 'manager', 'qp_board.status', 'public_type')
                ->union($companyBoards)
                ->union($userBoards);
        if($isENSapp){
            $board = $board->where('type_name','ENS');  
        }

        return $board->get();
    }

}
