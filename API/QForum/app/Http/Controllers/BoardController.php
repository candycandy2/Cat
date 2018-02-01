<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\lib\ResultCode;
use App\Http\Requests;
use App\Services\UserService;
use App\Services\BoardService;

class BoardController extends Controller
{

     protected $postService;
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
    public function getBoardTypeList()
    {
        //
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

}
