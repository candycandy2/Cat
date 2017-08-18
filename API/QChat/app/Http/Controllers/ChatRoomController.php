<?php
namespace App\Http\Controllers;
use DateTime;
use Config;
use App\lib\ResultCode;
use App\lib\CommonUtil;
use App\lib\Logger;
use App\lib\JMessage;
use App\Repositories\ParameterRepository;
use App\Repositories\HistoryRepository;

class ChatRoomController extends Controller
{

    protected $parameterRepository;
    protected $historyRepository;

    /**
     * ChatRoomController constructor.
     * @param ParameterRepository $parameterRepository
     * @param HistoryRepository $historyRepository
     */
    public function __construct(ParameterRepository $parameterRepository, HistoryRepository $historyRepository)
    {
        $this->parameterRepository = $parameterRepository;
        $this->historyRepository = $historyRepository;
    }


    /**
     * getQGroupHistoryMessageJob (後台JOB專用)
     * @return json
     */
    public function getQGroupHistoryMessageJob(){
        $ACTION = 'getQGroupHistoryMessageJob';
        //取得上次同步的最後時間
        $lastQueryTime = $this->parameterRepository->getLastQueryTime();
        $lastEndTime = $lastQueryTime->parameter_value;
        $dt = DateTime::createFromFormat("Y-m-d H:i:s", $lastEndTime);
        if($dt === false || array_sum($dt->getLastErrors()) >0 ){
            $result = ['ResultCode'=>ResultCode::_025903_MandatoryFieldLost,
                                     'Message'=>'the parameter end_time error or blank!'];
            Logger::logApi('', $ACTION,response()->json(apache_response_headers()), $result);
            return response()->json($result);
        }
        //init beginTime and End Time
        $beginTime = $lastEndTime;
        $endTime = $lastEndTime;
        $interval = 7; //批次執行區間
        $count = 100;

        $now = date("Y-m-d H:i:s");
        if($endTime == $now){
            $result = ['ResultCode'=>ResultCode::_025901_reponseSuccessful,
                      'Message'=>'Messages before '.$now.' were already been synced!'];
            Logger::logApi('', $ACTION,response()->json(apache_response_headers()), $result);
            return response()->json($result);
        }
        $dateDiff = CommonUtil::dateDiff($beginTime,$now);
        $jmessage = new JMessage(Config::get("app.appKey"),Config::get("app.masterSecret"));
        $i=0;

        //每7天為一單位，一直執行到今天為止
        \DB::connection('mysql_qmessage')->beginTransaction();
        \DB::connection('mysql_ens')->beginTransaction();

        try {
            do{
                $beginTime = date('Y-m-d H:i:s', strtotime($endTime . ' +'.'1'.' second'));
                $tmpEndTime = date('Y-m-d H:i:s', strtotime($beginTime . ' +'.$interval.' day'));
                $diffNow = CommonUtil::dateDiff($now,$tmpEndTime);
                //加7天後區間大於執行當下時間，以當下時間當作endTime
                if($diffNow  >=0 ){
                    $endTime =  $now;
                }else{
                    $endTime =  $tmpEndTime;
                }
                $i++;
                echo $beginTime .'~'. $endTime;
                $resData = $jmessage->getMessage($beginTime, $endTime, $count);
                if(isset($resData->error)){
                    $result = ['ResultCode'=> ResultCode::_025925_callAPIFailedOrErrorOccurs,
                                 'Message'=> $resData->error->code.':'.$resData->error->message,
                                 'Content'=> $resData->requestUrl];
                    Logger::logApi('', $ACTION,response()->json(apache_response_headers()), $result);
                    return response()->json($result);
                }
                $historyData = $resData['historyData'];
                $historyFileData = $resData['historyFileData']; 
                if(count($historyData) > 0 ){
                    $this->historyRepository->insertHistory($historyData);
                }
                if(count($historyFileData) > 0){
                    $this->historyRepository->insertHistoryFile($historyFileData);
                }
                $this->parameterRepository->updateLastQueryTime($endTime);
            } while ($endTime != $now);

            \DB::connection('mysql_qmessage')->commit();
            \DB::connection('mysql_ens')->commit();

            $result = ['ResultCode'=>ResultCode::_025901_reponseSuccessful,'Message'=>'Sync Success!'];
            Logger::logApi('', $ACTION,response()->json(apache_response_headers()), $result);
            return response()->json($result);
            
          }catch (\Exception $e) {

             \DB::connection('mysql_qmessage')->rollBack();
             \DB::connection('mysql_ens')->rollBack();

            $result = ['ResultCode'=>ResultCode::_025999_UnknownError,'Message'=>$e->getMessage()];
            Logger::logApi('', $ACTION,response()->json(apache_response_headers()), $result);
            return response()->json($result);

         }   
    }

}
