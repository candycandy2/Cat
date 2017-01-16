<?php

namespace App\Http\Controllers;

use App\lib\CommonUtil;
use App\lib\PushUtil;
use App\lib\ResultCode;
use Illuminate\Support\Facades\Input;
use App\Http\Requests;
use DB;

class testController extends Controller
{
    public function jpushTest() {
        $content = file_get_contents('php://input');
        $content = CommonUtil::prepareJSON($content);
        if (\Request::isJson($content)) {
            $jsonContent = json_decode($content, true);
            $api = $jsonContent['Api'];
            $registrationId = $jsonContent['RegistrationId'];
            $tag = $jsonContent['Tag'];
            $result = (['result_code'=>ResultCode::_999999_unknownError, 'content'=>'Api not exists!']);
            switch($api) {
                case "GetDevices":
                    $result = PushUtil::GetDevices($registrationId);
                    break;
                case "GetTags":
                    $result = PushUtil::GetTags();
                    break;
                case "IsDeviceInTag":
                    $result = PushUtil::IsDeviceInTag($registrationId, $tag);
                    break;
                case "AddDevicesToTag":
                    $result = PushUtil::AddDevicesToTag($registrationId, $tag);
                    break;
                default:
                    break;
            }
            return response()->json($result);
        }
    }
}
