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
        $requiredRule = [
            'post_id' => 'required',
            'content' => 'required'
        ];

        $rangeRule = [
            'post_id' => 'string|size:32',
            'content' => 'string'
        ];
       
        //add validation when post with file
        if(isset($data['file_list']) && is_array($data['file_list'])){
            if(is_string($data['file_list']['file'])){
               $data['file_list']['file'] = (array)$data['file_list']['file'];
            }
            $requiredRule ['file_list.file'] = 'required';
            $rangeRule ['file_list.file'] = 'array';
        }
         
        $required = Validator::make($data, $requiredRule);
        if($required->fails())
        {
            return $result = response()->json(['ResultCode'=>ResultCode::_047903_MandatoryFieldLost,
                    'Message'=>"必填字段缺失",
                    'Content'=>""]);
        }
        $range = Validator::make($data, $rangeRule);
        if($range->fails())
        {
             return $result = response()->json(['ResultCode'=>ResultCode::_047905_FieldFormatError,
                    'Message'=>"欄位格式錯誤",
                    'Content'=>""]);
        }

        $empNo = $data['emp_no'];
        $postId = $data['post_id'];
        $fileList = isset($data['file_list'])?$data['file_list']:null;

        $userData = $this->userService->getUserData($empNo);
        $postData = $this->postService->getPostData($postId);
         if(is_null($postData)){
            return response()->json(['ResultCode'=>ResultCode::_047904_NoAuthorityToAccessThisBoard,
                        'Message'=>"貼文不存在",
                        'Content'=>""]);
        }
        $boardId = $postData->board_id;
        $hasAuth = $this->boardService->checkUserBoardAuth($boardId, $userData);
        if(!$hasAuth){
            return response()->json(['ResultCode'=>ResultCode::_047904_NoAuthorityToAccessThisBoard,
                        'Message'=>"沒有該討論版權限",
                        'Content'=>""]);
        }
        
       
        
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
