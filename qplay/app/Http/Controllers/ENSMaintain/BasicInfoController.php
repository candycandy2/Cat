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

    /**
     * 建構子，初始化引入相關服務
     * @param BasicInfoService $basicInfoService 地點基本資訊服務
     * @param EnUserGroupRepository $enUserGroupRepository ENS管理員
     * @param UserRepository $userRepository 用戶
     */
    public function __construct(BasicInfoService $basicInfoService,
                                EnUserGroupRepository $enUserGroupRepository,
                                UserRepository $userRepository)
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
       $project = $input['project'];
       return $this->basicInfoService->getBasicInfo($project);
    }

    /**
     * 取得管理者資訊
     * @return mixed
     */
    public function getUserGroupInfo(){
       $input = Input::get();
       $project = $input['project'];
       return $this->basicInfoService->getUserGroupInfo($project);   
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