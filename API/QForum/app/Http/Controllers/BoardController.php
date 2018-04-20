<?php

namespace App\Http\Controllers;

use Validator;
use App\lib\Verify;
use Illuminate\Http\Request;
use App\lib\ResultCode;
use App\Http\Requests;
use App\Services\UserService;
use App\Services\BoardService;

class BoardController extends Controller
{

     protected $userService;
     protected $boardService;

    public function __construct(UserService $userService,
                                BoardService $boardService)
    {
        $this->userService = $userService;
        $this->boardService = $boardService;
    }

    /**
     * 透過此API可以獲得討論版的分類
     *
     * @return \Illuminate\Http\Response
     */
    public function getBoardTypeList(Request $request)
    {
         $data = parent::getData($request);
        $empNo = $data['emp_no'];
        $source = $data['source'];
        $userData = $this->userService->getUserData($empNo);
        $boardTypeList = $this->boardService->getBoardTypeList();
         return response()->json(['ResultCode'=>ResultCode::_1_reponseSuccessful,
                        'Message'=>"Success",
                        'Content'=>$boardTypeList]);
    
    }

    /**
     * 透過此API可以獲得目前有權限的討論版
     *
     * @return \Illuminate\Http\Response
     */
    public function getBoardList(Request $request)
    {
        $data = parent::getData($request);
        $empNo = $data['emp_no'];
        $source = $data['source'];
        $userData = $this->userService->getUserData($empNo);
        $company = $userData->company;
        $boards = $this->boardService->getUserBoards($empNo,  $company, $source);
         return response()->json(['ResultCode'=>ResultCode::_1_reponseSuccessful,
                        'Message'=>"Success",
                        'Content'=>$boards]);
    }

    /**
     * 透過此API可以編輯討論版權限
     * @param  Request $request 
     * @return \Illuminate\Http\Response
     */
    public function editBoardInfo(Request $request){
        $data = parent::getData($request);
        $validator = Validator::make($data , [
            'board_id' => 'required|numeric|is_board_manager:'.$data['emp_no'],
            'board_type_id' => 'sometimes|numeric',
            'manager' => 'sometimes|string',
            'board_status' => 'sometimes|in:Y,N',
            'board_name' => 'sometimes|string'
        ]);

        if($validator->fails()) {
             return response()->json(['ResultCode'=>$validator->errors()->first(),
                                      'Message'=>""], 200);
        }
        $empNo = $data['emp_no'];

        if(isset($data['manager'])){
            $managerData = $this->userService->getUserDataByLoginId($data['manager']);
            if(is_null($managerData) || !Verify::checkUserStatusByUserEmpNo($managerData->emp_no)) {
                return array("code"=>ResultCode::_047908_AccountNotExist,
                    "message"=>"設定的管理者帳號不存在");
            } 
            $data['manager_emp_no'] = $managerData['emp_no'];
        }


        \DB::beginTransaction();
        try{
             $userData = $this->userService->getUserData($empNo);
            $this->boardService->editBoardInfo($data, $userData);
            \DB::commit();
            return response()->json(['ResultCode'=>ResultCode::_1_reponseSuccessful,
                        'Message'=>"Success",
                        'Content'=>""]);
        } catch (\Exception $e){
            \DB::rollBack();
            throw $e;
        }

    }
}