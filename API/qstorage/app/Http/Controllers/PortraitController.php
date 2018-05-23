<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Input;
use App\lib\CommonUtil;
use App\lib\ResultCode;
use App\Entity\Portrait;
use App\Services\AzureBlobService;
use App\Services\ServerFileService;
use File;

class PortraitController extends Controller
{
    protected $azureBlobService;
    protected $serverFileService;
    
    /**
     * 建構子，初始化引入相關服務
     * @param AzureBlobService $azureBlobService Azure雲端儲存服務
     * @param ServerFileService $serverFileService Server檔案儲存服務
     */
    public function __construct(
        AzureBlobService $azureBlobService,
        ServerFileService $serverFileService
    ) {
        $this->azureBlobService = $azureBlobService;
        $this->serverFileService = $serverFileService;
    }


    /**
     * 透過此API可以上傳圖片到QStorage的專案資料夾中
     * @return json
     */
    public function uploadPortrait(Request $request)
    {
        $contentType = $request->header('Content-Type');
        $appKey = $request->header('app-key');

        $uuid =  $request->uuid;
        $lang = $request->lang;
        
        if (CommonUtil::getContextAppKey()!=$appKey) {
            return array("code"=>ResultCode::_999010_appKeyIncorrect,
                "message"=>trans('result_code.'.ResultCode::_999010_appKeyIncorrect));
        }

        if (explode(';', $contentType)[0] != "multipart/form-data") {
            return array("code"=>ResultCode::_999006_contentTypeParameterInvalid,
                "message"=>trans('result_code.'.ResultCode::_999006_contentTypeParameterInvalid));
        }
        
        $validator = \Validator::make($request->all(),
        
            [
            'files'=>'required|image|max:10240'
            ],
            [
                'required' => ResultCode::_999001_requestParameterLostOrIncorrect,
                'image' => ResultCode::_997907_UploadDataTypeIsNotAllow,
                'max' => ResultCode::_997908_FileSizeExceedsTheAllowableLimit
            ]
            
        );

        if ($validator->fails()) {
            return response()->json(['ResultCode'=>$validator->errors()->first(),
                                      'Message'=>trans('result_code.'.$validator->errors()->first())], 200);
        }

        if (CommonUtil::getContextAppKey()!=$appKey) {
            return array("code"=>ResultCode::_999010_appKeyIncorrect,
                "message"=>trans('result_code.'.ResultCode::_999010_appKeyIncorrect));
        }

        $file = $request->file('files');
        $result = [];
        $empNo = $request->header('account');
    
        //1.upload file to server
        $portrait = new Portrait($appKey, $empNo, $file);
        $tempFile = $portrait->saveOnServer($file);
        try {
            //2.upload file to blob
            $result = $portrait->uploadToBlob($tempFile);
            
            //3.delete server file
            $portrait->deleteServerFile($portrait->destinationPath);
        } catch (Exceptions $e) {
            $picture->deleteServerFile($picture->destinationPath);
            throw $e;
        }
        return $result = response()->json(['ResultCode'=>ResultCode::_1_reponseSuccessful,
            'Message'=>"",
            'Content'=>$result ]);
    }

    /**
     * 透過此API可以刪除大頭照
     * @param  Request $request
     * @return json
     */
    public function deletePortrait(Request $request)
    {
        $empNo = $request->header('account');
        $appKey = $request->header('app-key');
        
        if (CommonUtil::getContextAppKey()!=$appKey) {
            return array("code"=>ResultCode::_999010_appKeyIncorrect,
                "message"=>trans('result_code.'.ResultCode::_999010_appKeyIncorrect));
        }
        
        $portrait = new Portrait($appKey, $empNo);
        $portrait->deleteBlob();
           
        return response()->json(['ResultCode'=>ResultCode::_1_reponseSuccessful,
            'Message'=>"",
            'Content'=>""]);
    }
}
