<?php

namespace App\Http\Controllers;

use DateTime;
use Illuminate\Http\Request;
use App\lib\ResultCode;
use App\lib\Qstorage;
use App\Http\Requests;
use App\Services\AttachService;
use App\Repositories\ParameterRepository;

class JobController extends Controller
{
    protected $parameterRepository;
    protected $attachService;

    public function __construct(ParameterRepository $parameterRepository,
                                AttachService $attachService)
    {
        $this->attachService = $attachService;
        $this->parameterRepository = $parameterRepository;
    }

    
    /**
     * 透過此API可以將廢棄的圖片刪除，並且將刪除的圖片移至垃圾桶
     *
     * @return \Illuminate\Http\Response
     */
    public function deleteAttachJob()
    {
        set_time_limit(0);
        \DB::beginTransaction();
        try {
            //取得上次同步的最後時間
            $lastQueryTime = $this->parameterRepository->getLastQueryTime();
            $lastEndTime = $lastQueryTime->parameter_value;

            if($lastEndTime != ""){
                $dt = DateTime::createFromFormat("Y-m-d H:i:s", $lastEndTime);
                if($dt === false || array_sum($dt->getLastErrors()) >0 ){
                    $result = ['ResultCode'=>ResultCode::_025903_MandatoryFieldLost,
                                             'Message'=>'the parameter end_time error or blank!'];
                    return response()->json($result);
                }
            }
            $attachRs = $this->attachService->getDeletedAttach($lastEndTime);
            $urls = [];
            $lastDeleteAt = $lastEndTime;
            foreach ($attachRs as $attach) {
                $urls[]=$attach->file_url;
                $lastDeleteAt = $attach->deleted_at;
            }

            $qstorage = new Qstorage();
            $data = array("fileUrls"=>$urls);
            $deleteRs = json_decode($qstorage->deleteAttach($data));
            if($deleteRs->ResultCode != ResultCode::_1_reponseSuccessful){
                $result = ['ResultCode'=>ResultCode::_047930_CallAPIFailedOrErrorOccurs,
                                             'Message'=>['error'=>$deleteRs->ResultCode,
                                                         'Message'=>$deleteRs->Message
                                                        ]
                           ];
                    return response()->json($result);
            }
            //更新結束時間
            $this->parameterRepository->updateLastQueryTime($lastDeleteAt);
            \DB::commit();

            return response()->json(['ResultCode'=>ResultCode::_1_reponseSuccessful,
                            'Message'=>"Success",
                            'Content'=>"delete picture count :".count($urls)]);

        }catch (\Exception $e) {
             \DB::rollBack();
             throw $e;
         } 

    }

}