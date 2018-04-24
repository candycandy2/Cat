<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Input;
use App\lib\CommonUtil;
use App\lib\ResultCode;
use Illuminate\Contracts\Validation;
use App\Services\AzureBlobService;

class AccessController extends Controller
{


    protected $azureBlobService;
    
    /**
     * 建構子，初始化引入相關服務
     * @param AzureBlobService $azureBlobService Azure雲端儲存服務
     */
    public function __construct(AzureBlobService $azureBlobService)
    {
        $this->azureBlobService = $azureBlobService;
    }
    
    public function getSASToken($resourceType, Request $request){
        
        $validator = \Validator::make($request->header(), [
        'target'=>'required'
        ],
        [
            'required' => ResultCode::_999001_requestParameterLostOrIncorrect,
        ]);

        if ($validator->fails()) {
             return response()->json(['ResultCode'=>$validator->errors()->first(),
                                      'Message'=>trans('result_code.'.$validator->errors()->first())], 200);
        }
        if(!$request->exists('start') || !$request->exists('expiry')  || !$request->exists('sp') ||
            trim($request->start) == "" || trim($request->expiry) == "" || trim($request->sp) == ""){
            return response()->json(['ResultCode'=> ResultCode::_999001_requestParameterLostOrIncorrect,
                                      'Message'=>trans('result_code.'.ResultCode::_999001_requestParameterLostOrIncorrect)
                                    ], 200);   
        }

        if($request->sp != 'r'){
            return response()->json(['ResultCode'=> ResultCode::_999001_requestParameterLostOrIncorrect,
                                      'Message'=>trans('result_code.'.ResultCode::_999001_requestParameterLostOrIncorrect)
                                    ], 200);   
        }

        
        if(!in_array($resourceType,array(AzureBlobService::RESOURCE_TYPE_CONTAINER,AzureBlobService::RESOURCE_TYPE_BLOB))){
            return response()->json(['ResultCode'=> ResultCode::_999001_requestParameterLostOrIncorrect,
                                      'Message'=>trans('result_code.'.ResultCode::_999001_requestParameterLostOrIncorrect)
                                    ], 200);   
        }
        
        $result = [];
        $signedPermissions = $request->sp;
        $contentType = $request->header('Content-Type');
        $appKey = $request->header('app-key');
        $resourceName = $request->header('target');
        $signedStart = $request->start;
        $signedExpiry = $request->expiry;
        $uuid =  $request->uuid;
        $lang = $request->lang; 
        $sastoken = $this->azureBlobService->generateBlobServiceSharedAccessSignatureToken(
            $resourceType,
            $resourceName,
            $signedPermissions,
            $signedExpiry, 
            $signedStart
        );
        $result['target'] =  $resourceName;
        $result['sas_token'] =  $sastoken;
        return $result = response()->json(['ResultCode'=>ResultCode::_1_reponseSuccessful,
            'Message'=>"",
            'Content'=>$result]);
    }
}