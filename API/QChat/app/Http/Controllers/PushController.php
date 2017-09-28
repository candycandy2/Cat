<?php
namespace App\Http\Controllers;

use Validator;
use App\lib\ResultCode;
use Illuminate\Support\Facades\Input;
use App\Services\UserService;
use App\Services\PushService;

class PushController extends Controller
{

    protected $xml;
    protected $data;
    protected $userService;
    protected $historyService;

    /**
     * PushController constructor.
     * @param UserService $userService
     * @param PushService $pushService
     */
    public function __construct(UserService $userService, PushService $pushService)
    {   
        $this->userService = $userService;
        $this->pushService = $pushService;

        $input = Input::get();
        $this->xml=simplexml_load_string($input['strXml']);
        $this->data=json_decode(json_encode($this->xml),TRUE);
    }
    
    public function sendPushToken(){

        $required = Validator::make($this->data, [
            'emp_no' => 'required',
            'device_type'=>'required',
            'push_token'=>'required'
        ]);

        $range = Validator::make($this->data, [
            'device_type' => 'in:android,ios'
        ]);

        if($required->fails())
        {
            return $result = response()->json(['ResultCode'=>ResultCode::_025903_MandatoryFieldLost,
                    'Message'=>"必填字段缺失",
                    'Content'=>""]);
        }

        if($range->fails())
        {
            return $result = response()->json(['ResultCode'=>ResultCode::_025905_FieldFormatError,
                    'Message'=>"欄位格式錯誤",
                    'Content'=>""]);
        }
        \DB::beginTransaction();
        try {

            $userData = $this->userService->getUserData($this->data['emp_no']);
            $createdUder = $userData['row_id'];
           
            $this->pushService->savePushToken($this->data['emp_no'], 
                                             $this->data['push_token'],
                                             $this->data['device_type'],
                                             $createdUder);
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
