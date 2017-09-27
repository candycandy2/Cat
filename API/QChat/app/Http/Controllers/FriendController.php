<?php
namespace App\Http\Controllers;

use DB;
use Validator;
use Illuminate\Support\Facades\Input;
use Illuminate\Http\Request;
use App\lib\ResultCode;
use App\Services\UserService;

class FriendController extends Controller
{
    protected $userService;
    protected $xml;
    protected $data;

    public function __construct(UserService $userService)
    {
        $input = Input::get();
        $this->userService = $userService;
        $this->xml=simplexml_load_string($input['strXml']);
        $this->data=json_decode(json_encode($this->xml),TRUE);
    }

    /**
     * 透過此API可以獲得集團內的人員基本資料
     * @param  Request $request
     * @return json
     */
    public function getQList(Request $request){

        $required = Validator::make($this->data, [
            'search_type' => 'required',
            'friend_only' => 'required',
            'emp_no' => 'required',
            'search_string' => 'required_if:search_type,==,1|
                                required_if:search_type,==,2',
        ]);

        $range = Validator::make($this->data, [
            'friend_only' => 'in:Y,N',
            'search_type' => 'in:1,2,3',
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
        if(is_array($this->data['search_string'])){
            
            if(count($this->data['search_string']) > 0){
             return $result = response()->json(['ResultCode'=>ResultCode::_025905_FieldFormatError,
                    'Message'=>"欄位格式錯誤",
                    'Content'=>""]);
            }else {
                $this->data['search_string'] = "";
            }
        }

        $searchType = $this->data['search_type'];
        $searchString = $this->data['search_string'];
        $friendOnly = $this->data['friend_only'];
        $empNo = $this->data['emp_no'];

        $userList =  $this->userService->getUserList($searchType, $friendOnly, $empNo, $searchString);

        if(!isset($userList['user_list']) || count($userList['user_list']) == 0){
             return $result = response()->json(['ResultCode'=>ResultCode::_025998_NoData,
                    'Message'=>"查無資料",
                    'Content'=>""]);
        }
        
        return $result = response()->json(['ResultCode'=>ResultCode::_025901_reponseSuccessful,
                    'Message'=>"",
                    'Content'=>$userList]);
    }
}