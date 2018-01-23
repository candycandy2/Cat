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
        $rules = [
            'board_id' => 'required|numeric|board_auth:'.$data['emp_no'],
            'post_id' => 'required|string|size:32',
            'post_title' => 'required|string|max:99',
            'content' => 'required|string',
            'file_list' => 'sometimes|required|array',
        ];

        $validator = Validator::make($data, $rules);
        if ($validator->fails()) {
             return response()->json(['ResultCode'=>$validator->errors()->first(),
                                      'Message'=>""], 200);
        }

        $postId = $data['post_id'];
        $fileList = isset($data['file_list'])?$data['file_list']:null;
        $empNo = $data['emp_no'];
        $userData = $this->userService->getUserData($empNo);
        //new Post and add attach
        \DB::beginTransaction();
        try{
            $newPostResult = $this->postService->newPost($data, $userData);
            if(is_array($fileList)){
                $attachResult = $this->attachService->addAttach($data, $userData);
            }

            \DB::commit();
            return response()->json(['ResultCode'=>ResultCode::_1_reponseSuccessful,
                        'Message'=>"Success",
                        'Content'=>array("post_id"=> $postId)]);
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
    }

    /**
     * 透過此API可以獲得某個討論版內的post
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function getPostList(Request $request)
    {
        $xml=simplexml_load_string($request['strXml']);
        $data = json_decode(json_encode($xml),TRUE);

        $validator = Validator::make($data , [
            'board_id'=> 'required|numeric|board_auth:'.$data['emp_no']
        ]);

        if ($validator->fails()) {
             return response()->json(['ResultCode'=>$validator->errors()->first(),
                                      'Message'=>""], 200);
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
        
        $boardId =  (isset($data['board_id']))?$data['board_id']:null;
        $replyFromSeq =  (isset($data['reply_from_seq']))?$data['reply_from_seq']:null;

        $validator = Validator::make($data , [
            'board_id' => 'required|numeric|board_auth:'.$data['emp_no'],
            'post_id' => 'required|string|size:32|belone_board:'.$boardId,
            'reply_from_seq' => 'required|numeric|min:1',
            'reply_to_seq' => 'required|numeric|greater_than:'.$replyFromSeq
        ]);

        if ($validator->fails()) {
             return response()->json(['ResultCode'=>$validator->errors()->first(),
                                      'Message'=>""], 200);
        }

        $postId = $data['post_id'];
        $post = $this->postService->getPostData($postId, $boardId);
        $replyCount = $this->commentService->getCommentCount($postId);
        $comments = $this->commentService->getComments($postId, $data['reply_from_seq'], $data['reply_to_seq']);
        
        $post['reply_count'] = $replyCount;
        $post['reply_list'] = $comments;
        
        
        return response()->json(['ResultCode'=>ResultCode::_1_reponseSuccessful,
                    'Message'=>"Success",
                    'Content'=>$post]);

    }
}
