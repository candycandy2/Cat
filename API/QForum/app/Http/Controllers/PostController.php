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
use App\lib\Verify;


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
        $data = parent::getData($request);
        $rules = [
            'board_id' => 'required|numeric|',
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

        //post尚未存在qp_post，不須驗證，第二個參數寫null
        $verifyResult = Verify::verifyBoarStatus($data['emp_no'], $data['board_id'], null, null);
        if($verifyResult["code"] != ResultCode::_1_reponseSuccessful){
            return response()->json(["ResultCode"=>$verifyResult["code"],
                                     "Message"=> $verifyResult["message"],
                                     "Content"=>""], 200);
        }

        $postId = $data['post_id'];
        $fileData = isset($data['file_list'])?$data['file_list']:null;
        $empNo = $data['emp_no'];
        $userData = $this->userService->getUserData($empNo);
        //new Post and add attach
        \DB::beginTransaction();
        try{
            $newPostResult = $this->postService->newPost($data, $userData);
            if(!is_null($fileData)){
                $attachResult = $this->attachService->addAttach($postId, $commentId, $fileData, $userData->row_id);
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
    public function deletePost(Request $request)
    {
        $data = parent::getData($request);

        $validator = Validator::make($data , [
            'post_id' => 'required|string|size:32|post_owner:'.$data['emp_no'],
        ]);

        if ($validator->fails()) {
             return response()->json(['ResultCode'=>$validator->errors()->first(),
                                      'Message'=>""], 200);
        }

        $verifyResult = Verify::verifyBoarStatus($data['emp_no'], null, $data['post_id'], null);
        if($verifyResult["code"] != ResultCode::_1_reponseSuccessful){
            return response()->json(["ResultCode"=>$verifyResult["code"],
                                     "Message"=> $verifyResult["message"],
                                     "Content"=>""], 200);
        }

        \DB::beginTransaction();
        try{
            $postId = $data['post_id'];
            $userData = $this->userService->getUserData($data['emp_no']);
            $this->postService->softDeletePost($postId, $userData);
            $this->attachService->deleteAttach($postId, 0, $userData->row_id);
            \DB::commit();
            return response()->json(['ResultCode'=>ResultCode::_1_reponseSuccessful,
                        'Message'=>"Success",
                        'Content'=>""]);
        } catch (\Exception $e){
            \DB::rollBack();
            throw $e;
        }
    }

    /**
     * 透過此API可以獲得某個討論版內的post
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function getPostList(Request $request)
    {
        $data = parent::getData($request);

        $validator = Validator::make($data , [
            'board_id'=> 'required|numeric'
        ]);

        if ($validator->fails()) {
             return response()->json(['ResultCode'=>$validator->errors()->first(),
                                      'Message'=>""], 200);
        }

        $verifyResult = Verify::verifyBoarStatus($data['emp_no'], $data['board_id'], null, null);
        if($verifyResult["code"] != ResultCode::_1_reponseSuccessful){
            return response()->json(["ResultCode"=>$verifyResult["code"],
                                     "Message"=> $verifyResult["message"],
                                     "Content"=>""], 200);
        }

        $postList = $this->postService->getPostList($data['board_id']);
        
        return response()->json(['ResultCode'=>ResultCode::_1_reponseSuccessful,
                    'Message'=>"Success",
                    'Content'=>$postList]);

    }

    /**
     * 透過此API可以獲得每一個貼文的所有資訊, 包含所有回應
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function getPostDetails(Request $request)
    {

        $data = parent::getData($request);
        $boardId =  (isset($data['board_id']))?$data['board_id']:null;
        $replyFromSeq =  (isset($data['reply_from_seq']))?$data['reply_from_seq']:null;

        $validator = Validator::make($data , [
            'board_id' => 'required|numeric',
            'post_id' => 'required|string|size:32',
            'reply_from_seq' => 'required|numeric|min:1',
            'reply_to_seq' => 'required|numeric|greater_than:'.$replyFromSeq
        ]);

        if ($validator->fails()) {
             return response()->json(['ResultCode'=>$validator->errors()->first(),
                                      'Message'=>""], 200);
        }

        $verifyResult = Verify::verifyBoarStatus($data['emp_no'], $data['board_id'], $data['post_id'], null);
        if($verifyResult["code"] != ResultCode::_1_reponseSuccessful){
            return response()->json(["ResultCode"=>$verifyResult["code"],
                                     "Message"=> $verifyResult["message"],
                                     "Content"=>""], 200);
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

    /**
     * 透過此API可以修改自己的貼文
     * @param  Request $request 
     * @return json
     */
    public function modifyPost(Request $request){
        
        $data = parent::getData($request);

        $validator = Validator::make($data , [
            'post_id' => 'required|string|size:32|is_my_post:'.$data['emp_no'],
            'post_title' => 'required|string|max:99',
            'content' => 'required',
            'file_list' => 'sometimes|required|array',
        ]);

        if($validator->fails()) {
             return response()->json(['ResultCode'=>$validator->errors()->first(),
                                      'Message'=>""], 200);
        }
        
        $verifyResult = Verify::verifyBoarStatus($data['emp_no'], null, $data['post_id'], null);
        if($verifyResult["code"] != ResultCode::_1_reponseSuccessful){
            return response()->json(["ResultCode"=>$verifyResult["code"],
                                     "Message"=> $verifyResult["message"],
                                     "Content"=>""], 200);
        }

        \DB::beginTransaction();
        try{
            
            $userData = $this->userService->getUserData($data['emp_no']);
            $fileData = isset($data['file_list'])?$data['file_list']:[];
            $this->postService->modifyPost($data, $userData);
            $this->attachService->modifyAttach($data['post_id'], 0, $fileData, $userData->row_id);
            
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
