<?php
/**
 * 
 * User: Cleo.W.Chan
 * Date: 16-12-16
 * Time: 下午1:25
 */

namespace App\lib;
use Illuminate\Support\Facades\Input;
use App\Models\QP_User as QP_User;
use App\Models\QP_Project as QP_Project;
use App\Models\QP_Board as QP_Board;
use App\Models\QP_Post as QP_Post;
use App\Models\QP_Comment as QP_Comment;
use App\lib\ResultCode as ResultCode;
use Request;
use DB;

class Verify
{

    /**
     * 1. 確認傳送資料是否為json
     *     Accept: application/json
     *     Content-Type: application/json
     *
     *     這三種方法是用來檢查 request 的 header。
     *     a. Request::isJson() 用來檢查 HTTP_CONTENT_TYPE是否存在 application/json
     *     b. Request::wantsJson用來檢查 HTTP_ACCEPT 是否存在 application/json
     *     c. Request::format 用來檢查 request 要求的回傳格式
     *
     * 2. 確認json格式 
     *     a.最外層一定要包strXml這個參數, 名稱大小寫皆不可更改
     *     {"strXml":"<LayoutHeader><emp_no>0407731</emp_no><source></source></LayoutHeader>"}
     *
     * 3. 確認以下必要參數是否傳遞
     *     a. emp_no
     *     b. source 呼叫的來源app
     *
     */
    public static function verify()
    {
        $request = Request::instance();
        $input = Input::get();
        $headerContentType = $request->header('Content-Type');
        
        if($headerContentType == null || trim($headerContentType) != "application/json") {
            return array("code"=>ResultCode::_047915_ContentTypeParameterInvalid,
                "message"=> "Content-Type錯誤");
        }

        if(count($input) == 0 || !array_key_exists('strXml', $input) || trim($input["strXml"]) == "") {
            return array("code"=>ResultCode::_047917_InputJsonFormatIsInvalid,
                "message"=>"傳入的json格式錯誤, Server端無法解析");
        }
    
        libxml_use_internal_errors(true);
        $xml=simplexml_load_string($input['strXml']);

        if ($xml === false) {
             return array("code"=>ResultCode::_047916_InputXmlFormatIsInvalid,
            "message"=>"傳入的xml格式錯誤, Server端無法解析");
        }

        $empNo = trim((string)$xml->emp_no[0]);
        $source = trim((string)$xml->source[0]);

        if($empNo == "" || $source ==""){
             return array("code"=>ResultCode::_047903_MandatoryFieldLost,
                "message"=>"必填字段缺失");
        }
        if( preg_match("/^[0-9]+$/", $empNo) == 0){
              return array('code'=>ResultCode::_047905_FieldFormatError,
                'message'=>"欄位格式錯誤");
        }
        if(!self::checkUserStatusByUserEmpNo($empNo)) {
            return array("code"=>ResultCode::_047908_AccountNotExist,
                "message"=>"帳號不存在");
        }
        if(!self::checkSourceProjectExist($source)) {
            return array("code"=>ResultCode::_047913_SourceProjectIsNotExist,
                "message"=>"來源專案不存在");
        }
        
        return array("code"=>ResultCode::_1_reponseSuccessful,
            "message"=>"");
    }


    public static function verifyBoarStatus($empNo, $boardId, $postId, $commentId){
        $auth = false;
        $data = null;
        if(isset($commentId)){
            $data = self::getCommentInfo($commentId);
        }else if(isset($postId)){
            $data = self::getPostInfo($postId);
        }else if(isset($boardId)){
            $data = self::getBoardInfo($boardId);
        }
        if(!is_null($data)){
            if($data->public_type == 1){ //開放給全集團
                $auth =  true;
            }else if($data->public_type == 2){//開放給特定公司
                $companys = \DB::table("qp_board_company")->where('board_id', '=', $data->board_id)
                ->lists('qp_board_company.company');
                if(count($companys) > 0){
                    $user = \DB::table("qp_user")
                            ->where('emp_no', '=', $empNo)
                            ->whereIn('company',$companys)
                            ->select('row_id','company')->get();
                    if(count($user) > 0){
                         $auth =  true;
                    }
                }
            }else if($data->public_type == 3){//開放給特定用戶
                $user = \DB::table("qp_board_user")
                        ->where('board_id', '=', $data->board_id)
                        ->where('emp_no',$empNo)
                        ->select('row_id')->get();
                if(count($user) > 0){
                     $auth =  true;
                }
            }
        }
        if(!$auth){
              return array("code"=>ResultCode::_047904_NoAuthorityToAccessThisBoard,
                          "message"=>"沒有該討論版權限"); 
        }
        if($data->board_status == 'N'){
             return array("code"=>ResultCode::_047911_BoardIsClosed,
                          "message"=>"討論版已關閉"); 
        }
        if(isset($data->post_status) && $data->post_status == 'N'){
             return array("code"=>ResultCode::_047910_PostIsClosed,
                          "message"=>"貼文已關閉"); 
        }
        if(isset($data->comment_status) && $data->comment_status == 'N'){
             return array("code"=>ResultCode::_047912_CommentIsDeleted,
                          "message"=>"回應已刪除"); 
        }

        return array("code"=>ResultCode::_1_reponseSuccessful,
            "message"=>"");
    }

    /**
     * 檢查用戶狀態
     * @param  String $empNo 員工編號
     * @return boolean       true:該用戶存在|false:用戶不存在
     */
    public static function checkUserStatusByUserEmpNo($empNo)
    {   
        $result = true;
        $userList = QP_User::where('emp_no', '=', $empNo)
            -> where('status', '<>', 'N')
            -> where('resign', '<>', 'Y')
            -> select('row_id', 'status', 'resign','emp_no')->get();

        if(count($userList) < 1) {
            $result = false; //用户不存在
        }
        return $result;
    }

    public static function checkSourceProjectExist($appKey){
        $result = true;
        $userList = QP_Project::where('app_key', '=', $appKey)
            -> select('row_id', 'app_key')->get();

        if(count($userList) < 1) {
            $result = false; //project不存在
        }
        return $result;
    }

    private static function getBoardInfo($boardId){
         return QP_Board::where('row_id', '=', $boardId)
                      ->select('row_id as board_id',
                               'public_type',
                               'status as board_status')
                      ->first();
    }

    private static function getPostInfo($postId){
        return QP_Post::where('qp_post.row_id', '=', $postId)
                      ->join('qp_board', 'qp_board.row_id', '=', 'qp_post.board_id')
                      ->select('qp_board.row_id as board_id',
                               'qp_board.public_type',
                               'qp_board.status as board_status',
                               'qp_post.status as post_status')
                      ->first();
    }

    private static function getCommentInfo($commentId){
        return QP_Comment::where('qp_comment.row_id', '=', $commentId)
                      ->join('qp_post', 'qp_post.row_id', '=', 'qp_comment.post_id')
                      ->join('qp_board', 'qp_board.row_id', '=', 'qp_post.board_id')
                      ->select('qp_board.row_id as board_id',
                               'qp_board.public_type',
                               'qp_board.status as board_status',
                               'qp_post.status as post_status',
                               'qp_post.row_id as post_id',
                               'qp_comment.status as comment_status'
                               )
                      ->first();
    }
}