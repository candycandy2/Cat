<?php
namespace App\Services;

use App\Repositories\BoardRepository;
use App\Repositories\BoardTypeRepository;

class BoardService
{
    protected $boardRepository;
    protected $boardTypeRepository;

    public function __construct(BoardRepository $boardRepository,
                                BoardTypeRepository $boardTypeRepository)
    {
        $this->boardRepository = $boardRepository;
        $this->boardTypeRepository = $boardTypeRepository;
    }

    /**
     * 取得員工擁有的板列表
     * @param  String $empNo 員工編號
     * @param  String $company 公司名稱
     * @return mixed
     */
    public function getUserBoards($empNo, $company, $source){
        $result = $this->boardRepository->getUserBoards($empNo, $company, $source);
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
     * 取得討論版類型列表
     * @return mixed
     */
    public function getBoardTypeList(){
        $result = [];
         $result['board_type_list'] = $this->boardTypeRepository->getBoardTypeList();
         return $result;
    }

    /**
     * 編輯版資訊
     * @param  Array  $data     修改資料
     * @param  mixed $userData  使用者資料
     * @return 
     */
    public function editBoardInfo(Array $data, $userData){
        $now = date('Y-m-d H:i:s',time());
        $tmpData = [
                'board_type_id' => $data['board_type_id'],
                'board_name' =>(isset($data['board_name']))?$data['board_name']:null,
                'manager' =>(isset($data['manager_emp_no']))?$data['manager_emp_no']:null,
                'status' => (isset($data['board_status']))?$data['board_status']:null,
                'updated_user' => $userData->row_id,
                'updated_at'=> $now
                ];
        $updateData = array_filter($tmpData, function($var){return !is_null($var);});
        return $this->boardRepository->editBoard($data['board_id'], $updateData);
    }
}