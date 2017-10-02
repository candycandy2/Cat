<?php
namespace App\Http\Controllers\ENSMaintain;

use App\Http\Controllers\Controller;
use App\Services\BasicInfoService;
use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use App\lib\CommonUtil;
use App\lib\MessageUtil;
use App\lib\ResultCode;
use App\Repositories\UserRepository;
use App\Repositories\EnUserGroupRepository;

class BasicInfoController extends Controller
{   
    protected $basicInfoService;
    protected $enUserGroupRepository;
    protected $userRepository;
    protected $message;

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
        $this->message = new MessageUtil();
    }

    /**
     * 取得成員資訊
     * @return mixed
     */
    public function getBasicInfo(){
       $input = Input::get();
       $project = $input['project'];
       return $this->basicInfoService->getBasicInfo($project);
    }


    /**
     * 上傳成員基本資料
     * @return json
     */
    public function uploadBasicInfo(Request $request){

        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }

        $this->setLanguage();
        
        \DB::beginTransaction();
        try{

           $validator = Validator::make($request->all(), [
                    'basicInfoFile' => 'required|mimes:xls,xlsx'
                ],[
                    'required'=>trans('messages.ERR_FILE_REQUIRED'),
                    'mimes'=>trans('messages.ERR_FILE_TYPE').' :values'
                ]);
            if ($validator->fails()) {
                return $result = response()->json(['ResultCode'=>ResultCode::_000919_validateError,
                        'Message'=>"validate error",
                        'Content'=> $validator->errors()->all()]);
            }
       
            $input = $request->all();
            $project = $input['project'];
            $validRes = $this->basicInfoService->validateUploadBasicInfo($input['basicInfoFile']);
            if($validRes['ResultCode'] == ResultCode::_1_reponseSuccessful){
               $this->basicInfoService->importBasicInfo($project, $input['basicInfoFile']);
               $registerManager = $this->registerSuperUserToMessage($project)->getData();
               if($registerManager->ResultCode != ResultCode::_1_reponseSuccessful){
                    return $registerManager;
               }
               \DB::commit();
               return $result = response()->json(['ResultCode'=>ResultCode::_1_reponseSuccessful]);
            }else{
               return $result = response()->json($validRes);  
            }
        } catch (\Exception $e){
            \DB::rollBack();
            return $result = response()->json(['ResultCode'=>ResultCode::_999999_unknownError,
            'Content'=>"",
            'Message'=>$e->getMessage()]);
        }
      
    }

    public function registerSuperUser(Request $request){

        if(\Auth::user() == null || \Auth::user()->login_id == null || \Auth::user()->login_id == "")
        {
            return null;
        }
        
        $this->setLanguage();   
        $input = $request->all();
        
        $project = $input['project'];
        return $this->registerSuperUserToMessage($project);
    }

    /**
     * 向QMessage註冊主管與管理員
     * @return json
     */
    private function registerSuperUserToMessage($project){
        
        $users = $this->enUserGroupRepository->getSuperUserLoginIdNotRegister($project);
        if(count($users) == 0){
            return response()->json(['ResultCode'=>ResultCode::_1_reponseSuccessful,
                'Message'=>trans('messages.ERR_NO_USER_TO_REGISTER'),'Content'=>'']);
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
        return response()->json(['ResultCode'=>ResultCode::_1_reponseSuccessful,'Message'=>trans('messages.USER_REGISTER_SUCCESS'),'Content'=>implode(',',$registeredUser)]);
    }

    /**
     * 設定目前語系
     */
    private function setLanguage() {
        \App::setLocale("en-us");
        if(\Session::has('lang') && \Session::get("lang") != "") {
            \App::setLocale(\Session::get("lang"));
        }
    }
}