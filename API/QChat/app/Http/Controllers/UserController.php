<?php
namespace App\Http\Controllers;

use Validator;
use App\lib\ResultCode;
use Illuminate\Support\Facades\Input;
use App\Services\UserService;

class UserController extends Controller
{

    protected $xml;
    protected $data;
    protected $userService;

    /**
     * PushController constructor.
     * @param UserService $userService
     * @param PushService $pushService
     */
    public function __construct(UserService $userService)
    {   
        $this->userService = $userService;
        $input = Input::get();
        $this->xml=simplexml_load_string($input['strXml']);
        $this->data=json_decode(json_encode($this->xml),TRUE);
    }
    
    /**
     * 透過此API可以設定人員的詳細資料
     */
    public function setQUserDetail(){

        \DB::beginTransaction();

        try {
            if(!isset($this->data['memo'])){
                $this->data['memo'] = null;
            }
            if(is_array($this->data['memo'])){   
                if(count($this->data['memo']) > 0){
                 return $result = response()->json(['ResultCode'=>ResultCode::_025905_FieldFormatError,
                        'Message'=>"欄位格式錯誤",
                        'Content'=>""]);
                }else {
                    $this->data['memo'] = null;
                }
            }
            $empNo = $this->data['emp_no'];
            $userData = $this->userService->getUserData($empNo);
            $userId = $userData['row_id'];
            $memo = $this->data['memo'];
            $data = array('memo'=>$memo);
            $res = $this->userService->setQUserDetail($empNo, $data, $userId);
            \DB::commit();
            $result = ['ResultCode'=>ResultCode::_1_reponseSuccessful,'Message'=>''];
            return response()->json($result);
        }catch (\Exception $e) {

             \DB::rollBack();

            $result = ['ResultCode'=>ResultCode::_025999_UnknownError,'Message'=>""];
            return response()->json($result);
        }
    }
}
