<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Input;
use App\Http\Requests;
use App\lib\ResultCode;
use App\lib\CommonUtil;
use App\lib\Verify;
use JMessage\IM\User;
use JMessage\IM\Group;

class qmessageController extends Controller
{
    //Private API
    public static function getPasswordByUsername(){
        $ACTION = "getPasswordByUsername";
        $input = json_decode(file_get_contents('php://input'));
        $username = $input->username;
        if (empty($username)){
            $result  = response()->json(CommonUtil::ResultFactory(ResultCode::_998001_usernameEmptyOrInvalid,"Register failed,username is empty or invalid"));
            CommonUtil::logApi("", $ACTION,response()->json(apache_response_headers()), $result);
            return $result;
        }
        $pwd = CommonUtil::generatePasswordByUsername($username);
        $result = CommonUtil::ResultFactory(ResultCode::_1_reponseSuccessful,"Success",$pwd);
        return response()->json($result);
    }

    //Register
    public static function register()
    {
        $ACTION = "register";
        //0.调用检查
        /*$Verify = new Verify();
        $verifyResult = $Verify->verify();
        //$verifyResult = $Verify->verify(true);
        if($verifyResult["ResultCode"] != ResultCode::_1_reponseSuccessful) {
            $result  = response()->json($verifyResult);
            CommonUtil::logApi("", $ACTION,response()->json(apache_response_headers()), $result);
            return $result;
        }*/

        //1.检查用户名
        $input = json_decode(file_get_contents('php://input'));
        $username = $input->username;
        if (empty($username)){
        //if (empty($username) || CommonUtil::getUserStatusByUsername($username)!=3){
            $result  = CommonUtil::ResultFactory(ResultCode::_998001_usernameEmptyOrInvalid,"Register failed,username is empty or invalid");
            CommonUtil::logApi("", $ACTION,response()->json(apache_response_headers()), $result);
            return response()->json($result);
        }

        //2.注册
        $jim = CommonUtil::getJIM();
        $user = new User($jim);
        $password = CommonUtil::generatePasswordByUsername($username);
        $response = $user->register($username, $password);
        $result = CommonUtil::UnpackageResponse($response);
        CommonUtil::logApi("", $ACTION,response()->json(apache_response_headers()), $result);
        return response()->json($result);
    }

    public static function userstate($username){
        $ACTION = "userstate";
        if (empty($username)){
            $result  = CommonUtil::ResultFactory(ResultCode::_998001_usernameEmptyOrInvalid,"username is empty or invalid");
            CommonUtil::logApi("", $ACTION,response()->json(apache_response_headers()), $result);
            return response()->json($result);
        }
        $jim = CommonUtil::getJIM();
        $user = new User($jim);
        $response = $user->stat($username);
        $result = CommonUtil::UnpackageResponse($response);
        CommonUtil::logApi("", $ACTION,response()->json(apache_response_headers()), $result);
        return response()->json($result);
    }

    //Group
    public static function addGroup(){
        $ACTION = "addGroup";
        //0.调用检查
        /*
        $Verify = new Verify();
        $verifyResult = $Verify->verify();
        //$verifyResult = $Verify->verify(true);
        if($verifyResult["ResultCode"] != ResultCode::_1_reponseSuccessful) {
            $result  = response()->json($verifyResult);
            CommonUtil::logApi("", $ACTION,response()->json(apache_response_headers()), $result);
            return $result;
        }
        */
        //1.检查传入参数
        $input = json_decode(file_get_contents('php://input'));
        $owner = $input->owner;//$name = $input->name;
        $name = CommonUtil::guid();
        $desc = $input->desc;
        $members = $input->members;
        //(1)检查$owner
        if (empty($owner)){
            $result  = CommonUtil::ResultFactory(ResultCode::_998003_groupOwnerEmptyOrInvalid,"Group add failed,owner is empty or invalid");
            CommonUtil::logApi("", $ACTION,response()->json(apache_response_headers()), $result);
            return response()->json($result);
        }
        //(2)检查$members
        if (count($members)==0){
            $result  = CommonUtil::ResultFactory(ResultCode::_998004_groupMembersEmptyOrInvalid,"Group add failed,group member is empty or invalid");
            CommonUtil::logApi("", $ACTION,response()->json(apache_response_headers()), $result);
            return response()->json($result);
        }

        //2.增加Group
        $jim = CommonUtil::getJIM();
        $group = new Group($jim);
        $response = $group->create($owner, $desc, $desc, $members);
        $result = CommonUtil::UnpackageResponse($response);
        CommonUtil::logApi("", $ACTION,response()->json(apache_response_headers()), $result);
        return response()->json($result);
    }

    public static function deleteGroup(){
        $ACTION = "deleteGroup";
        //0.调用检查
        /*
        $Verify = new Verify();
        $verifyResult = $Verify->verify();
        //$verifyResult = $Verify->verify(true);
        if($verifyResult["ResultCode"] != ResultCode::_1_reponseSuccessful) {
            $result  = response()->json($verifyResult);
            CommonUtil::logApi("", $ACTION,response()->json(apache_response_headers()), $result);
            return $result;
        }*/

        //1.检查传入参数
        $input = json_decode(file_get_contents('php://input'));
        $gid = $input->gid;
        if (empty($gid) || !is_numeric($gid) || strlen($gid)!=8){
            $result  = CommonUtil::ResultFactory(ResultCode::_998005_groupIDEmptyOrInvalid,"Group id is empty or invalid");
            CommonUtil::logApi("", $ACTION,response()->json(apache_response_headers()), $result);
            return response()->json($result);
        }

        //2.删除Group
        $jim = CommonUtil::getJIM();
        $group = new Group($jim);
        $response = $group->delete($gid);
        $result = CommonUtil::UnpackageResponse($response);
        CommonUtil::logApi("", $ACTION,response()->json(apache_response_headers()), $result);
        return response()->json($result);
    }

    public static function getGroupList(){
        $ACTION = "getGroupList";
        //0.调用检查
        /*
        $Verify = new Verify();
        $verifyResult = $Verify->verify();
        //$verifyResult = $Verify->verify(true);
        if($verifyResult["ResultCode"] != ResultCode::_1_reponseSuccessful) {
            $result  = response()->json($verifyResult);
            CommonUtil::logApi("", $ACTION,response()->json(apache_response_headers()), $result);
            return $result;
        }*/

        //1.检查传入参数
        $input = json_decode(file_get_contents('php://input'));
        $username = $input->username;

        //2.获得Group列表
        $jim = CommonUtil::getJIM();
        $user = new User($jim);
        $response = $user->groups($username);
        $result = CommonUtil::UnpackageResponse($response);
        CommonUtil::logApi("", $ACTION,response()->json(apache_response_headers()), $result);
        return response()->json($result);
    }

    public static function addGroupMember(){
        $ACTION = "addGroupMember";
        //0.调用检查
        /*
        $Verify = new Verify();
        $verifyResult = $Verify->verify();
        //$verifyResult = $Verify->verify(true);
        if($verifyResult["ResultCode"] != ResultCode::_1_reponseSuccessful) {
            $result  = response()->json($verifyResult);
            CommonUtil::logApi("", $ACTION,response()->json(apache_response_headers()), $result);
            return $result;
        }*/

        //1.检查传入参数
        $input = json_decode(file_get_contents('php://input'));
        $gid = $input->gid;
        $usernames = $input->usernames;
        //(1)检查gid
        if (empty($gid) || !is_numeric($gid) || strlen($gid)!=8){
            $result  = CommonUtil::ResultFactory(ResultCode::_998005_groupIDEmptyOrInvalid,"Group id is empty or invalid");
            CommonUtil::logApi("", $ACTION,response()->json(apache_response_headers()), $result);
            return response()->json($result);
        }
        //(2)检查$usernames
        //if (count($usernames)==0 || !CommonUtil::checkUserListStatusByUsername($usernames)){
        if (count($usernames)==0){
            $result  = CommonUtil::ResultFactory(ResultCode::_998004_groupMembersEmptyOrInvalid,"Group add failed,group member is empty or invalid");
            CommonUtil::logApi("", $ACTION,response()->json(apache_response_headers()), $result);
            return response()->json($result);
        }

        //2.增加Group成员
        $jim = CommonUtil::getJIM();
        $group = new Group($jim);
        $response = $group->addMembers($gid, $usernames);
        $result = CommonUtil::UnpackageResponse($response);
        CommonUtil::logApi("", $ACTION,response()->json(apache_response_headers()), $result);
        return response()->json($result);
    }

    public static function deleteGroupMember(){
        $ACTION = "deleteGroupMember";
        //0.调用检查
        /*
        $Verify = new Verify();
        $verifyResult = $Verify->verify();
        //$verifyResult = $Verify->verify(true);
        if($verifyResult["ResultCode"] != ResultCode::_1_reponseSuccessful) {
            $result  = response()->json($verifyResult);
            CommonUtil::logApi("", $ACTION,response()->json(apache_response_headers()), $result);
            return $result;
        }*/

        //1.检查传入参数
        $input = json_decode(file_get_contents('php://input'));
        $gid = $input->gid;
        $usernames = $input->usernames;
        //(1)检查gid
        if (empty($gid) || !is_numeric($gid) || strlen($gid)!=8){
            $result  = CommonUtil::ResultFactory(ResultCode::_998005_groupIDEmptyOrInvalid,"Group id is empty or invalid");
            CommonUtil::logApi("", $ACTION,response()->json(apache_response_headers()), $result);
            return response()->json($result);
        }
        //(2)检查$usernames
        //if (count($usernames)==0 || !CommonUtil::checkUserListStatusByUsername($usernames)){
        if (count($usernames)==0){
            $result  = CommonUtil::ResultFactory(ResultCode::_998004_groupMembersEmptyOrInvalid,"Group delete failed,group member is empty or invalid");
            CommonUtil::logApi("", $ACTION,response()->json(apache_response_headers()), $result);
            return response()->json($result);
        }

        //2.删除Group成员
        $jim = CommonUtil::getJIM();
        $group = new Group($jim);
        $response = $group->removeMembers($gid, $usernames);
        $result = CommonUtil::UnpackageResponse($response);
        CommonUtil::logApi("", $ACTION,response()->json(apache_response_headers()), $result);
        return response()->json($result);
    }

    public static function getGroupMemberList(){
        $ACTION = "getGroupMemberList";
        //0.调用检查
        /*
        $Verify = new Verify();
        $verifyResult = $Verify->verify();
        //$verifyResult = $Verify->verify(true);
        if($verifyResult["ResultCode"] != ResultCode::_1_reponseSuccessful) {
            $result  = response()->json($verifyResult);
            CommonUtil::logApi("", $ACTION,response()->json(apache_response_headers()), $result);
            return $result;
        }*/

        //1.检查传入参数
        $input = json_decode(file_get_contents('php://input'));
        $gid = $input->gid;
        if (empty($gid) || !is_numeric($gid) || strlen($gid)!=8){
            $result  = CommonUtil::ResultFactory(ResultCode::_998005_groupIDEmptyOrInvalid,"Group id is empty or invalid");
            CommonUtil::logApi("", $ACTION,response()->json(apache_response_headers()), $result);
            return response()->json($result);
        }

        //2.获得群成员列表
        $jim = CommonUtil::getJIM();
        $group = new Group($jim);
        $response = $group->members($gid);
        $result = CommonUtil::UnpackageResponse($response);
        CommonUtil::logApi("", $ACTION,response()->json(apache_response_headers()), $result);
        return response()->json($result);
    }

    //History
    public static function storeHistoryText(){
        $ACTION = "storeHistoryText";
        $data = json_decode(file_get_contents('php://input'));
        $id = CommonUtil::saveHistory($data);
        CommonUtil::SaveHistory2MongoDB($data);
    }

    public static function storeHistoryPic(){
        $ACTION = "storeHistoryPic";
        $data = json_decode(file_get_contents('php://input'));
        CommonUtil::saveHistory($data);
        $fileInfo = [
            "msg_id"=>$data->msg_id,
            "fname"=>$data->fname,
            "fsize"=>$data->extras->fsize,
            "format"=>$data->extras->format,
            "npath"=>$data->extras->media_id,
        ];
        CommonUtil::saveHistoryFile($fileInfo);
        CommonUtil::SaveHistory2MongoDB($data,"Y");
        $baseUrl = "http://media.file.jpush.cn/";
        $fp=fsockopen('localhost',80,$errno,$errstr,5);
        if($fp){
            fputs($fp,"GET ".url()->current()."/downloadfile?filename=".urlencode($data->fname)."&url=".urlencode($baseUrl.($data->extras->media_id))."&msgid=".urlencode($data->msg_id).(PHP_OS=="WINNT"?"\r\n":"\n"));
            fclose($fp);
            return "";
        }else{
            return $errstr;
        }
    }

    public static function storeHistoryFile(){
        $ACTION = "storeHistoryFile";
        $data = json_decode(file_get_contents('php://input'));
        CommonUtil::saveHistory($data);
        $fileInfo = [
            "msg_id"=>$data->msg_id,
            "fname"=>$data->fname,
            "fsize"=>$data->extras->fsize,
            "format"=>substr(strrchr($data->fname, '.'), 1),
            "npath"=>$data->extras->media_id,
        ];
        CommonUtil::saveHistoryFile($fileInfo);
        CommonUtil::SaveHistory2MongoDB($data,"Y");
        $baseUrl = "http://media.file.jpush.cn/";
        $fp=fsockopen('localhost',80,$errno,$errstr,5);
        $url = url()->current()."/downloadfile?filename=".urlencode($data->fname)."&url=".urlencode($baseUrl.($data->extras->media_id))."&msgid=".urlencode($data->msg_id).(PHP_OS=="WINNT"?"\r\n":"\n");
        //CommonUtil::logApi("",$ACTION,response()->json(apache_response_headers()), $url);
        if($fp){
            fputs($fp,"GET ".$url);
            fclose($fp);
            return "";
        }else{
            return $errstr;
        }
    }

    public static function downloadFile(){
        $url = Input::get('url');
        $fileName = Input::get('filename');
        $msgId = Input::get('msgid');
        $path = \Config::get("app.filePath");
        $count = 1;
        $ACTION  ="downloadfile";
        try{
            do {
                $return_content = CommonUtil::http_get_data($url);
                $count++;
                if ($count>3){
                    break;
                }
            } while (strstr($return_content,"error") || empty($return_content));
            //三次尝试失败后记录log
            if (strstr($return_content,"error") || empty($return_content)){
                $result  = response()->json(CommonUtil::ResultFactory(ResultCode::_998006_downloadFileFailed,$return_content));
                CommonUtil::logApi("",$ACTION,response()->json(apache_response_headers()), $result);
                return $result;
            }
        }
        catch (\Exception $e){
            $result  = response()->json(CommonUtil::ResultFactory(ResultCode::_998006_downloadFileFailed,$e->getMessage()));
            CommonUtil::logApi("",$ACTION,response()->json(apache_response_headers()), $result);
            return $result;
        }

        if(!file_exists($path))
        {
            mkdir($path);
        }
        $fileName = $path.'/'.date("ymdhis").$fileName;
        $fp= fopen($fileName,"a"); //将文件绑定到流
        fwrite($fp,$return_content); //写入文件
        //更新lpath
        CommonUtil::updateHistory($msgId,$fileName);
    }

    public static function getMessageHistory(){
        $ACTION = "getMessageHistory";
        $entries = [];
        $data = json_decode(file_get_contents('php://input'));
        //参数：count 笔数，groupid 组id,cursor 信标
        $input = json_decode(file_get_contents('php://input'));
        $gid = $input->gid;
        $count = $input->count;
        $cursor = $input->cursor;
        //1.先检查信标->
        //1.1 不为空则检查是否存在
        if (!empty($cursor)){
            $entries = \DB::connection("qmessage")
                -> table('qm_history')
                -> where('qm_history.msg_id', '=', $cursor)
                -> select()
                -> get();
            if (count($entries)==0){//1.1.1 cursor不存在，抛异常
                $result  = response()->json(CommonUtil::ResultFactory(ResultCode::_998007_cursorEmptyOrInvalid,"Cursor is empty or invalid !"));
                CommonUtil::logApi("",$ACTION,response()->json(apache_response_headers()), $result);
                return $result;
            }else{//1.1.2 cursor存在,则返回cursor向上count笔数据
                $entries = CommonUtil::getHistoryList($gid,$count,$entries[0]->ctime);
            }
        }else{ //1.2 为空则返回最新的count笔数据
            $entries = CommonUtil::getHistoryList($gid,$count);
        }
        $package = new HistoryDTO();
        $package->count = count($entries);
        if ($package->count!=0){
            $package->cursor = $entries[($package->count)-1]->msg_id;//最早的那一笔的msg_id
            foreach ($entries as $entry) {
                $data = new HistoryMessageDTO();
                if ($entry->msg_type == "image"){
                    $data->ctime= $entry->ctime+0;
                    $data->msg_type = "image";
                    $data->from_id = $entry->from_id;
                    $data->target_id = $entry->target_id;
                    $data->content = "../".$entry->lpath;
                    //图片信息
                    $fileInfo = new HistoryFileInfoDTO();
                    $fileInfo->fname = $entry->fname;
                    $fileInfo->fsize = $entry->fsize;
                    $fileInfo->format = $entry->format;
                    $fileInfo->npath = $entry->npath;
                    $data->extras = $fileInfo;
                }
                if ($entry->msg_type == "text"){
                    $data->ctime= $entry->ctime+0;
                    $data->msg_type = "text";
                    $data->from_id = $entry->from_id;
                    $data->target_id = $entry->target_id;
                    $data->content = json_decode($entry->content)->text;
                }
                array_push($package->msgList,$data);
            }
        }

        return response()->json($package);
    }

    public static function getHistoryCount(){
        $ACTION = "getHistoryCount";
        $data = json_decode(file_get_contents('php://input'));
        $gidList = $data->target_id;
        if (  !is_array($gidList) || count($gidList)==0  ){
            $result  = response()->json(CommonUtil::ResultFactory(ResultCode::_998008_targetIdEmptyOrInvalid,"target_id is empty or invalid !"));
            CommonUtil::logApi("",$ACTION,response()->json(apache_response_headers()), $result);
            return $result;
        }
        $result_content = [];
        foreach ($gidList as $gid) {
            $count = \DB::connection("qmessage")
                -> table('qm_history')
                -> where('qm_history.target_id', '=', $gid)
                -> where('qm_history.target_type', '=', 'group')
                -> select()
                -> count();
            $groupCount = new GroupCountDTO();
            $groupCount->target_id = $gid;
            $groupCount->count = $count;
            array_push($result_content,$groupCount);
        }
        return CommonUtil::ResultFactory(ResultCode::_1_reponseSuccessful,"",$result_content);
    }

    /*
    public static function testUrl(){
        return [
            "\$_SERVER['PHP_SELF']:"=>$_SERVER['PHP_SELF']
            ,"url()->current():"=>url()->current()
        ];
    }
    */
}

//DTO
class HistoryDTO{
    public $cursor = ""; //这一次的游标
    public $count = 0; //实际的笔数
    public $msgList = [];
}

class HistoryMessageDTO{
    public $ctime = 0;
    public $msg_type = "";
    public $from_id = "";
    public $target_id = "";
    public $content = ""; //text对应string，image对应lpath
    public $extras = ""; //image的额外信息
}

class HistoryFileInfoDTO{
    public $fname = "";
    public $fsize = "";
    public $format = "";
    public $npath = "";
}

class GroupCountDTO{
    public $target_id = "";
    public $count = 0;
}
