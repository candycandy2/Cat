<?php
namespace App\Services;

use App\Repositories\BoardRepository;

class BoardService
{
    protected $boardRepository;

    public function __construct(BoardRepository $boardRepository)
    {
        $this->boardRepository = $boardRepository;
    }

    /**
     * 取得員工擁有的板列表
     * @param  String $empNo 員工編號
     * @param  String $company 公司名稱
     * @return mixed
     */
    public function getUserBoards($empNo, $company){
        $result = $this->boardRepository->getUserBoards($empNo, $company);
        $boards = [];
        foreach ($result as $board) {
            $boardList = [];
            $boardList['board_type_id'] = $board->board_type_id;
            $boardList['board_type_name'] = $board->type_name;
            $boardList['board_id'] = $board->board_id;
            $boardList['board_name'] = $board->board_name;
            $boardList['board_manager'] = $board->manager;
            $boardList['board_status'] = $board->status;
            $boardList['board_public_type'] = $board->public_type;
            $boards['board_list'][] = $boardList;
        }
        return $boards;
    }

    /**
     * 檢查使用者有無該版的討使用權限
     * @param  int     $boardId  討論版id
     * @param  object  $userData 使用者資料
     * @return boolean
     */
    public function checkUserBoardAuth($boardId, $userData){
        $result = false;
        $board = $this->boardRepository->getBoard($boardId);
        if(is_null($board)){ //board不存在
            return false;
        }
        $publicType = $board->public_type;
        switch ($publicType) {
            case 1:
                //開放給全集團
                $result = true;
                break;
            case 2:
                //開放給特定公司
                $companyBoards = $this->boardRepository->checkBoardCompany($boardId, $userData->company);
                if( (!is_null($userData->company)) && (count($companyBoards) > 0)){
                    $result = true;
                }
                break;
            case 3:
                //開放給特定用戶
                 $userBoards = $this->boardRepository->checkBoardUser($boardId, $userData->emp_no);
                 if( (!is_null($userData->emp_no)) && (count($userBoards) > 0)){
                    $result = true;
                }
                break;
            default:
                 $result = false;
        }
       return $result;
    }
}