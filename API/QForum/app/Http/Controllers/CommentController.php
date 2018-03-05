<?php

namespace App\Http\Controllers;

use Validator;
use Illuminate\Http\Request;
use App\Services\PostService;
use App\Services\UserService;
use App\Services\AttachService;
use App\Services\BoardService;
use App\Services\CommentService;
use App\Services\SubscribeService;
use App\lib\ResultCode;
use App\lib\Push;
use App\lib\Verify;
use App\lib\CommonUtil;
use App\Http\Requests;

class CommentController extends Controller
{
    protected $postService;
    protected $userService;
    protected $attachService;
    protected $boardService;
    protected $commentService;
    protected $subscribeService;
    protected $push;

    public function __construct(PostService $postService,
                                UserService $userService,
                                AttachService $attachService,
                                BoardService $boardService,
                                CommentService $commentService,
                                SubscribeService $subscribeService,
                                Push $push)
    {
        $this->postService = $postService;
        $this->userService = $userService;
        $this->attachService = $attachService;
        $this->boardService = $boardService;
        $this->commentService = $commentService;
        $this->subscribeService = $subscribeService;
        $this->push = $push;
    }


    /**
     * 透過此API可以回應討論版的貼文
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function newComment(Request $request)
    {
        $data = parent::getData($request);
        $rules = [
            'post_id' => 'required|string|size:32',
            'content' => 'required|string',
            'file_list' => 'sometimes|required|array'
        ];
    
        $validator = Validator::make($data, $rules);
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

        $empNo = $data['emp_no'];
        $source = $data['source'];
        $userData = $this->userService->getUserData($empNo);
        //new Post and add attach
        \DB::beginTransaction();
        try{
            $commentId = $this->commentService->newComment($data, $userData);
            $postId = $data['post_id'];
            $postData = $this->postService->getPostData($postId);
            $fileData = isset($data['file_list'])?$data['file_list']:null;
            if(!is_null($fileData)){      
                $attavhResult = $this->attachService->addAttach($postId, $commentId, $fileData, $userData->row_id);
            }
            \DB::commit();
            
            //Send Push Message
            $title = $userData->login_id.' 回覆了「'.$postData->post_title.'」';
            $text = $data['content'];
            $lang = (is_null($request->input('lang')))?"en-us":$request->input('lang');
            $pushRes = $this->sendPushMessage($source, $lang, $postData, $userData, $title, $text);

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
        $data = parent::getData($request);
        $rules = [
            'comment_id' => 'required|numeric|is_my_comment:'.$data['emp_no'],
            'content' => 'required|string',
            'file_list' => 'sometimes|required|array'
        ];
    
        $validator = Validator::make($data, $rules);
        if ($validator->fails()) {
             return response()->json(['ResultCode'=>$validator->errors()->first(),
                                      'Message'=>""], 200);
        }
        
        $verifyResult = Verify::verifyBoarStatus($data['emp_no'], null, null, $data['comment_id']);
        if($verifyResult["code"] != ResultCode::_1_reponseSuccessful){
            return response()->json(["ResultCode"=>$verifyResult["code"],
                                     "Message"=> $verifyResult["message"],
                                     "Content"=>""], 200);
        }

        \DB::beginTransaction();
        try{
            $emoNo = $data['emp_no'];
            $commentId = $data['comment_id'];
            $content = $data['content'];
            $source = $data['source'];
            $userData = $this->userService->getUserData($emoNo);
            $this->commentService->modifyComment($commentId, $content, $userData->row_id);
            $comment = $this->commentService->getComment($commentId);
            $postId = $comment->post_id;
            $postData = $this->postService->getPostData($postId);
            $fileData = isset($data['file_list'])?$data['file_list']:[];
            $this->attachService->modifyAttach($postId, $commentId, $fileData, $userData->row_id);
            \DB::commit();
           
            //Send Push Message
            $title = $userData->login_id.' 回覆了「'.$postData->post_title.'」';
            $text = $content;
            $lang = (is_null($request->input('lang')))?"en-us":$request->input('lang');
            $this->sendPushMessage($source, $lang, $postData, $userData, $title, $text);

            return response()->json(['ResultCode'=>ResultCode::_1_reponseSuccessful,
                        'Message'=>"Success",
                        'Content'=>""]);
        } catch (\Exception $e){
            \DB::rollBack();
            throw $e;
        }
    }

    /**
     * 透過此API可以刪除自己的評論
     *
     * 
     * @return \Illuminate\Http\Response
     */
    public function deleteComment(Request $request)
    {
        $data = parent::getData($request);
        $rules = [
            'comment_id' => 'required|numeric|is_my_comment:'.$data['emp_no']
        ];
    
        $validator = Validator::make($data, $rules);
        if ($validator->fails()) {
             return response()->json(['ResultCode'=>$validator->errors()->first(),
                                      'Message'=>""], 200);
        }

        $verifyResult = Verify::verifyBoarStatus($data['emp_no'], null, null, $data['comment_id']);
        if($verifyResult["code"] != ResultCode::_1_reponseSuccessful){
            return response()->json(["ResultCode"=>$verifyResult["code"],
                                     "Message"=> $verifyResult["message"],
                                     "Content"=>""], 200);
        }

        \DB::beginTransaction();
        try{
            $emoNo = $data['emp_no'];
            $commentId = $data['comment_id'];
            $comment = $this->commentService->getComment($data['comment_id']);
            $postId = $comment->post_id;
            $userData = $this->userService->getUserData($emoNo);
            $userId = $userData->row_id;
            $this->commentService->softDeleteComment($commentId, $userId);
            $this->attachService->deleteAttach($postId, $commentId, $userId);
            \DB::commit();
            return response()->json(['ResultCode'=>ResultCode::_1_reponseSuccessful,
                        'Message'=>"Success",
                        'Content'=>""]);
        } catch (\Exception $e){
            \DB::rollBack();
            throw $e;
        }
    }

    private function sendPushMessage($source, $lang, $postData, $userData, $title, $text){
        $queryParam =  array(
                'app_key'   => $source,
                'lang'      => $lang,
                'need_push' => 'Y',
                );

        $title = base64_encode(CommonUtil::jsEscape(html_entity_decode($title)));
        $text = base64_encode(CommonUtil::jsEscape(html_entity_decode($text)));
        $from = $userData->user_domain.'\\'.$userData->login_id;
        $subscribeUser =  $this->subscribeService->getSubscribePostUser($postData->post_id);

        if(count($subscribeUser) > 0){
            $extra = array("post_id"=>$postData->post_id,
                           "ref_id"=>$postData->ref_id);
            $to = [];
            foreach ($subscribeUser as $userInfo) {
                $to[] = $userInfo->user_domain.'\\'.$userInfo->login_id;
            }
            return $this->push->sendPushMessage($from, $to, $title, $text, json_encode($extra), $queryParam);
        }else{
            return false;
        }
    }
}
