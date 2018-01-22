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
}