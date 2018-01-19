<?php

namespace App\Http\Controllers;

use Validator;
use Illuminate\Http\Request;
use App\Services\PostService;
use App\Services\UserService;
use App\Services\AttachService;
use App\Services\BoardService;
use App\Services\CommentService;
use App\lib\ResultCode;
use App\Http\Requests;

class CommentController extends Controller
{
    protected $postService;
    protected $userService;
    protected $attachService;
    protected $boardService;
    protected $commentService;

    public function __construct(PostService $postService,
                                UserService $userService,
                                AttachService $attachService,
                                BoardService $boardService,
                                CommentService $commentService)
    {
        $this->postService = $postService;
        $this->userService = $userService;
        $this->attachService = $attachService;
        $this->boardService = $boardService;
        $this->commentService = $commentService;
    }


    /**
     * 透過此API可以回應討論版的貼文
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function newComment(Request $request)
    {
        $xml=simplexml_load_string($request['strXml']);
        $data = json_decode(json_encode($xml),TRUE);
        $rules = [
            'post_id' => 'required|string|size:32|post_exist|post_auth:'.$data['emp_no'],
            'content' => 'required|string',
            'file_list' => 'sometimes|required|array'
        ];
    
        $validator = Validator::make($data, $rules);
        if ($validator->fails()) {
             return response()->json(['ResultCode'=>$validator->errors()->first(),
                                      'Message'=>""], 200);
        }   

        $empNo = $data['emp_no'];
        $fileList = isset($data['file_list'])?$data['file_list']:null;
        $userData = $this->userService->getUserData($empNo);
        //new Post and add attach
        \DB::beginTransaction();
        try{
            $commentId = $this->commentService->newComment($data, $userData);
            $data['comment_id'] = $commentId;
            if(is_array($fileList)){             
                $attavhResult = $this->attachService->addAttach($data, $userData);
            }

            \DB::commit();
            return response()->json(['ResultCode'=>ResultCode::_1_reponseSuccessful,
                        'Message'=>"Success",
                        'Content'=>array("comment_id"=> $commentId )]);
        } catch (\Exception $e){
            \DB::rollBack();
            throw $e;
        }
    }

    /**
     * 透過此API可以修改自己的評論
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function modifyComment(Request $request)
    {
        //
    }

    /**
     * 透過此API可以刪除自己的評論
     *
     * 
     * @return \Illuminate\Http\Response
     */
    public function deleteComment($id)
    {
        //
    }
}
