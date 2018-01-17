<?php

namespace App\Http\Controllers;

use Validator;
use Illuminate\Http\Request;
use App\Http\Requests;
use App\Services\PostService;
use App\Services\UserService;
use App\Services\AttachService;
use App\Services\BoardService;
use App\Services\CommentService;
use Webpatser\Uuid\Uuid;
use App\lib\ResultCode;


class PostController extends Controller
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
     * 透過此API可以取得討論版的PostId，
     * 待newPost時需傳入此參數作為post的row_id
     *
     * @return \Illuminate\Http\Response
     */
    public function getPostId(Request $request)
    {   
       $uuid = str_replace("-", "", Uuid::generate());
       return $result = response()->json(['ResultCode'=>ResultCode::_1_reponseSuccessful,
                    'Message'=>"",
                    'Content'=>$uuid]);
    }

    /**
     * 透過此API可以新增討論版的一篇Post
     *
     * @return \Illuminate\Http\Response
     */
    public function newPost(Request $request)
    {
        $xml=simplexml_load_string($request['strXml']);
        $data = json_decode(json_encode($xml),TRUE);
        $requiredRule = [
            'board_id' => 'required',
            'post_id' => 'required',
            'post_title' => 'required',
            'content' => 'required'
        ];

        $rangeRule = [
            'board_id' => 'numeric',
            'post_id' => 'string|size:32',
            'post_title' => 'string|size:99',
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
        $boardId = $data['board_id'];
        $postId = $data['post_id'];
        $fileList = isset($data['file_list'])?$data['file_list']:null;

        $userData = $this->userService->getUserData($empNo);
        $hasAuth = $this->boardService->checkUserBoardAuth($boardId, $userData);
        if(!$hasAuth){
            return response()->json(['ResultCode'=>ResultCode::_047904_NoAuthorityToAccessThisBoard,
                        'Message'=>"沒有該討論版權限",
                        'Content'=>""]);
        }
        //new Post and add attach
        \DB::beginTransaction();
        try{
            $realPostId = $this->postService->newPost($data, $userData);
            if(is_array($fileList)){
                $attachResult = $this->attachService->addAttach($data, $userData);
            }

            \DB::commit();
            return response()->json(['ResultCode'=>ResultCode::_1_reponseSuccessful,
                        'Message'=>"Success",
                        'Content'=>array("post_id"=> $realPostId)]);
        } catch (\Exception $e){
            \DB::rollBack();
            throw $e;
        }
    }

    /**
     * 透過此API可以刪除討論版上的貼文,
     * 僅能刪除自己的貼文,但是manager可以刪除他人貼文
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function deletePost($id)
    {
        //
    }

    /**
     * 透過此API可以獲得某個討論版內的post
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function getPostList()
    {
        $xml=simplexml_load_string($request['strXml']);
        $data = json_decode(json_encode($xml),TRUE);
        $requiredRule = [
            'board_id' => 'required'
        ];

        $rangeRule = [
            'board_id' => 'numeric'
        ];

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
        $boardId = $data['board_id'];

        $userData = $this->userService->getUserData($empNo);
        $hasAuth = $this->boardService->checkUserBoardAuth($boardId, $userData);
        if(!$hasAuth){
            return response()->json(['ResultCode'=>ResultCode::_047904_NoAuthorityToAccessThisBoard,
                        'Message'=>"沒有該討論版權限",
                        'Content'=>""]);
        }


    }

    /**
     * 透過此API可以獲得每一個貼文的所有資訊, 包含所有回應
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function getPostDetails(Request $request)
    {
        $xml=simplexml_load_string($request['strXml']);
        $data = json_decode(json_encode($xml),TRUE);
        $requiredRule = [
            'board_id' => 'required',
            'post_id' => 'required',
            'reply_from_seq' => 'required',
            'reply_to_seq' => 'required'
        ];

        $rangeRule = [
            'board_id' => 'numeric',
            'post_id' => 'string|size:32',
            'reply_from_seq' => 'numeric',
            'reply_to_seq' => 'numeric'
        ];

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
        $boardId = $data['board_id'];
        $postId = $data['post_id'];

        $userData = $this->userService->getUserData($empNo);
        $hasAuth = $this->boardService->checkUserBoardAuth($boardId, $userData);
        if(!$hasAuth){
            return response()->json(['ResultCode'=>ResultCode::_047904_NoAuthorityToAccessThisBoard,
                        'Message'=>"沒有該討論版權限",
                        'Content'=>""]);
        }

        $post = $this->postService->getPostData($postId);
         $comments = $this->commentService->getComments($postId);
        $post['reply_list'] = $comments;
       
        
        return response()->json(['ResultCode'=>ResultCode::_1_reponseSuccessful,
                    'Message'=>"Success",
                    'Content'=>$post]);

    }
}
