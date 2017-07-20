<?php
namespace App\Http\Controllers\ENSMaintain;

use App\Http\Controllers\Controller;
use App\Services\BasicInfoService;
use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use App\lib\CommonUtil;
use App\lib\ResultCode;
use App\Repositories\UserRepository;
use App\Repositories\EnUserGroupRepository;

class BasicInfoController extends Controller
{   
    protected $basicInfoService;
    protected $enUserGroupRepository;
    protected $userRepository;

    /**
     * 建構子，初始化引入相關服務
     * @param BasicInfoService $basicInfoService 地點基本資訊服務
     * @param EnUserGroupRepository $enUserGroupRepository ENS管理員
     * @param UserRepository $userRepository 用戶
     */
    public function __construct(BasicInfoService $basicInfoService, EnUserGroupRepository $enUserGroupRepository, UserRepository $userRepository)
    {
        $this->basicInfoService = $basicInfoService;
        $this->enUserGroupRepository = $enUserGroupRepository;
        $this->userRepository = $userRepository;
    }

    /**
     * 取得成員資訊
     * @return mixed
     */
    public function getBasicInfo(){
       $input = Input::get();
       $appKey = CommonUtil::getContextAppKey(\Config('app.env'),$input['app_key']);
       return $this->basicInfoService->getBasicInfo($appKey);
    }


    /**
     * 上傳成員基本資料
     * @return json
     */
    public function uploadBasicInfo(Request $request){
        
        \DB::beginTransaction();
        try{

           $validator = Validator::make($request->all(), [
                    'basicInfoFile' => 'required|mimes:xls,xlsx'
                ],[
                    'required'=>'請上傳檔案',
                    'mimes'=>'請上傳檔案格式 :values'
                ]);
            if ($validator->fails()) {
                return $result = response()->json(['ResultCode'=>ResultCode::_000919_validateError,
                        'Message'=>"validate error",
                        'Content'=> $validator->errors()->all()]);
            }
       
            $input = $request->all();
            $appKey = CommonUtil::getContextAppKey(\Config('app.env'), $input['project']);
            $validRes = $this->basicInfoService->validateUploadBasicInfo($input['basicInfoFile']);
            if($validRes['ResultCode'] == ResultCode::_1_reponseSuccessful){
               $this->basicInfoService->importBasicInfo($appKey, $input['basicInfoFile']);
               $registerManager = $this->registerSuperUserToMessage($appKey)->getData();
               if($registerManager->ResultCode != ResultCode::_1_reponseSuccessful){
                    return $registerManager;
               }
               return $result = response()->json(['ResultCode'=>ResultCode::_1_reponseSuccessful]);
            }else{
               return $result = response()->json($validRes);  
            }
            
          \DB::commit();
        } catch (\Exception $e){
            \DB::rollBack();
            return $result = response()->json(['ResultCode'=>ResultCode::_999999_unknownError,
            'Content'=>"",
            'Message'=>$e->getMessage()]);
        }
      
    }

    public function registerSuperUser(Request $request){

        $input = $request->all();
        
        $appKey = CommonUtil::getContextAppKey(\Config('app.env'), $input['project']);
        return $this->registerSuperUserToMessage($appKey);
    }

    /**
     * 向QMessage註冊主管與管理員
     * @return json
     */
    private function registerSuperUserToMessage($appKey){
  
        $users = $this->enUserGroupRepository->getSuperUserLoginIdNotRegister($appKey);
        if(count($users) == 0){
            return response()->json(['ResultCode'=>ResultCode::_1_reponseSuccessful,
                'Message'=>'尚無需註冊用戶','Content'=>'']);
        }
        $registeredUser = [];
        foreach ($users as $user) {
            $res = $this->message->register($user->login_id);
            $resultCode = json_decode($res)->ResultCode;
            if( $resultCode  == ResultCode::_1_reponseSuccessful || $resultCode  == '998002'){
                 $this->userRepository->updateUserByLoginId($user->login_id, array('register_message'=>'Y'));
                 $registeredUser[] = $user->login_id;
            }else{
                return response()->json($res);
            }
        }
        return response()->json(['ResultCode'=>ResultCode::_1_reponseSuccessful,'Message'=>'用戶註冊成功','Content'=>implode(',',$registeredUser)]);
    }
}