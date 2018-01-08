<?php
namespace App\Http\Controllers;
use DateTime;
use Validator;
use App\lib\ResultCode;
use App\lib\CommonUtil;
use App\lib\Logger;
use App\Repositories\ParameterRepository;
use App\Services\HistoryService;
use Illuminate\Support\Facades\Log;

class HistoryJobController extends Controller
{

    protected $parameterRepository;
    protected $historyService;

    /**
     * HistoryJobController constructor.
     * @param ParameterRepository $parameterRepository
     * @param HistoryServices $historyServices
     */
    public function __construct(ParameterRepository $parameterRepository,
                                HistoryService $historyService)
    {
        $this->parameterRepository = $parameterRepository;
        $this->historyService = $historyService;
    }
    
    /**
     * getQGroupHistoryMessageJob (後台JOB專用)
     * @return json
     */
    public function getQGroupHistoryMessageJob(){
        //$ACTION = 'getQGroupHistoryMessageJob';
        //ignore_user_abort(true);//瀏覽器關掉後也持續執行
        set_time_limit(0);//不限制time out 時間

        //Log::info($ACTION . ' 開始執行...');
        
        //取得上次同步的最後時間
        $lastQueryTime = $this->parameterRepository->getLastQueryTime();
        $lastEndTime = $lastQueryTime->parameter_value;

        $dt = DateTime::createFromFormat("Y-m-d H:i:s", $lastEndTime);
        if($dt === false || array_sum($dt->getLastErrors()) >0 ){
            $result = ['ResultCode'=>ResultCode::_025903_MandatoryFieldLost,
                                     'Message'=>'the parameter end_time error or blank!'];
            return response()->json($result);
        }
        
        //init beginTime and End Time
        $beginTime = $lastEndTime;
        $endTime = $lastEndTime;
        $interval = 7; //批次執行區間
        $count = 500;

        date_default_timezone_set('Asia/Taipei');
        $now = date("Y-m-d H:i:s");
        if($endTime == $now){
            $result = ['ResultCode'=>ResultCode::_1_reponseSuccessful,
                      'Message'=>'Messages before '.$now.' were already been synced!'];
            return response()->json($result);
        }
        $dateDiff = CommonUtil::dateDiff($beginTime,$now);
        $i=0;

        
        \DB::beginTransaction();
       try {
            //每7天為一單位，一直執行到今天為止
            do{
                $historyData =[];
                $historyFileData = [];
                $beginTime = date('Y-m-d H:i:s', strtotime($endTime));
                $tmpEndTime = date('Y-m-d H:i:s', strtotime($beginTime . ' +'.$interval.' day'));
                $diffNow = CommonUtil::dateDiff($now,$tmpEndTime);
                //加7天後區間大於執行當下時間，以當下時間當作endTime
                if($diffNow  >=0 ){
                    $endTime =  $now;
                }else{
                    $endTime =  $tmpEndTime;
                }
                $i++;
                $resData = $this->historyService->getMessageAndFile($beginTime, $endTime, $count);
                if(isset($resData->error)){
                    $result = ['ResultCode'=> ResultCode::_025930_CallAPIFailedOrErrorOccurs,
                                 'Message'=> 'Call JMessage Error : ['.$resData->error.']'.$resData->message,
                                 'Content'=> ''];
                    return response()->json($result);
                }
                $historyData = $resData['historyData'];
                $historyFileData = $resData['historyFileData'];
              
                //寫入MySQL
                $this->historyService->newMySQLHistory($historyData, $historyFileData);
              
                //更新結束時間
                $this->parameterRepository->updateLastQueryTime($endTime);

                \DB::commit();
              
                //MySql寫入後才寫入mongo，確保資料不會被多寫入
                $this->historyService->newMongoHistory($historyData, $historyFileData);
              
                 
           } while ($endTime != $now);
            $result = ['ResultCode'=>ResultCode::_1_reponseSuccessful,'Message'=>'Sync Success!'];
            return response()->json($result);
            //Log::info('Sync Success!');
          }catch (\Exception $e) {
             \DB::rollBack();
             throw $e;
         } 
    }
}
