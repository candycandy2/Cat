<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Input;
use App\lib\CommonUtil;
use App\lib\ResultCode;
use App\Entity\Picture;
use App\Services\AzureBlobService;
use App\Services\ServerFileService;
use File;

class PictureController extends Controller
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
    public function uploadPicture(Request $request)
    {
        $contentType = $request->header('Content-Type');
        $appKey = $request->header('app-key');

        $uuid =  $request->uuid;
        $lang = $request->lang;

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

        $file = $request->file('files');
        $result = [];
        $resourceId = $request->header('resource-id');
        if(is_null($resourceId) || $resourceId == ""){
              return array("code"=>ResultCode::_999001_requestParameterLostOrIncorrect,
                "message"=>trans('result_code.'.ResultCode::_999001_requestParameterLostOrIncorrect));
        }
        //1.upload file size to server
        $picture = new Picture($appKey, $resourceId, $file);
        $tempFile = $picture->saveOnServer($file);
        try {
            //2.upload file to blob
            $result = $picture->uploadToBlob($tempFile);
            //3.delete server file
            $picture->deleteServerFile($picture->destinationPath);
        } catch (Exceptions $e) {
            $picture->deleteServerFile($picture->destinationPath);
            throw $e;
        }
        return $result = response()->json(['ResultCode'=>ResultCode::_1_reponseSuccessful,
            'Message'=>"",
            'Content'=>$result ]);
    }

    /**
     * 透過此API可以刪除一張圖片相關聯的所有物件,包含原圖及縮圖
     * @param  Request $request
     * @return json
     */
    public function deleteFile(Request $request)
    {
        $contentType = $request->header('Content-Type');
        $appKey = $request->header('app-key');
        
        if (!$request->isJson()) {
            return array("code"=>ResultCode::_999006_contentTypeParameterInvalid,
                "message"=>trans('result_code.'.ResultCode::_999006_contentTypeParameterInvalid));
        }

        $validator = \Validator::make($request->all(),
            [
            'fileUrls'=>'required'
            ],
            [
                'required' => ResultCode::_999001_requestParameterLostOrIncorrect
            ]
        );
        
        if ($validator->fails()) {
            return response()->json(['ResultCode'=>$validator->errors()->first(),
                                      'Message'=>trans('result_code.'.$validator->errors()->first())], 200);
        }

        $fileUrls = $request->get("fileUrls");
        $pictrue = new Picture($appKey);
        $pictrue->deleteBlob($fileUrls);
        
        return response()->json(['ResultCode'=>ResultCode::_1_reponseSuccessful,
            'Message'=>"",
            'Content'=>""]);
    }
}
