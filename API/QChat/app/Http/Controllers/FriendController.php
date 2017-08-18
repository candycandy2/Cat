<?php
namespace App\Http\Controllers;

use DB;
use Validator;
use Illuminate\Support\Facades\Input;
use Illuminate\Http\Request;
use App\lib\ResultCode;
use App\lib\Verify;
use App\Model\QP_User;

class FriendController extends Controller
{
    protected $user;
    protected $xml;

    public function __construct(QP_User $user)
    {
        $input = Input::get();
        $this->user = $user;
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
            'search_string' => 'required',
            'friend_only' => 'required',
        ]);

        $range = Validator::make($this->data, [
            'friend_only' => 'in:Y,N',
        ]);

        if($required->fails())
        {
            return $result = response()->json(['ResultCode'=>ResultCode::_025903_MandatoryFieldLost,
                    'Message'=>"Mandatory field lost",
                    'Content'=>""]);
        }

        if($range->fails())
        {
            return $result = response()->json(['ResultCode'=>ResultCode::_025905_FieldFormatError,
                    'Message'=>"Field format error",
                    'Content'=>""]);
        }
        // $result = array(
        //         'total',
        //         'cursor',
        //         'count',
        //         'messages',
        //         'set_from_name',
        //         'from_platform',
        //         'target_name',
        //         'msg_type',
        //         'version',
        //         'target_id',
        //         'sui_mtime',
        //         'from_appkey',
        //         'from_name',
        //         'msg_body',
        //         'text',
        //         'height',
        //         'hash',
        //         'width',
        //         'media_id',
        //         'fsize',
        //         'media_crc32',
        //         'from_id',
        //         'from_type',
        //         'create_time',
        //         'target_type',
        //         'msgid',
        //         'msg_ctime',
        //         'msg_level',

        //         );
        // return $result = response()->json(['ResultCode'=>ResultCode::_025901_reponseSuccessful,
        //             'Message'=>"",
        //             'Content'=>$result]);
    }
}