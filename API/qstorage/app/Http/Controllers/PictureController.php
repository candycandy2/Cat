<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Input;
use App\lib\CommonUtil;
use App\lib\ResultCode;
use Illuminate\Contracts\Validation;
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
    public function __construct(AzureBlobService $azureBlobService,
                                ServerFileService $serverFileService)
    {
        $this->azureBlobService = $azureBlobService;
        $this->serverFileService = $serverFileService;
    }


    /**
     * 透過此API可以上傳圖片到QStorage的專案資料夾中
     * @return json
     */
    public function uploadPicture(Request $request){
  
        $contentType = $request->header('Content-Type');
        $appKey = $request->header('app-key');
        $resourceId = $request->header('resource-id');

        $uuid =  $request->uuid;
        $lang = $request->lang;
        
        if(explode(';',$contentType)[0] != "multipart/form-data"){
            return array("code"=>ResultCode::_999006_contentTypeParameterInvalid,
                "message"=> "Content-Type錯誤");
        }
        
        $validator = \Validator::make($request->all(), [
        'files'=>'required|image|max:10240'
        ],
        [
            'required' => ResultCode::_999001_requestParameterLostOrIncorrect,
            'image' => ResultCode::_997907_UploadDataTypeIsNotAllow,
            'max' => ResultCode::_997908_FileSizeExceedsTheAllowableLimit
        ]);

        if ($validator->fails()) {
             return response()->json(['ResultCode'=>$validator->errors()->first(),
                                      'Message'=>trans('result_code.'.$validator->errors()->first())], 200);
        }

        $file = $request->file('files');
        $compressSetting = $this->getCompressSetting();
        $result = [];
        //1.upload full size to server
        $ext = pathinfo($file->getClientOriginalName(), PATHINFO_EXTENSION);
        $folderName = uniqid();
        $fullSizeName = $folderName. '_full.'. $ext;
        $destinationPath = public_path(str_replace('/', DIRECTORY_SEPARATOR, '/picture/'));
        $file->move($destinationPath,$fullSizeName);
        $fullSizeFile = $destinationPath. DIRECTORY_SEPARATOR. $fullSizeName;
        
        //2.upload full size to blob
        $containerName = str_replace('/','-', $appKey.'/picture/'. $resourceId);
        if(!$this->azureBlobService->checkContainerExist($containerName)){
            $this->azureBlobService->createContainer($containerName);
        }
        $content = fopen($fullSizeFile, "r");
        $createBlobRes = $this->azureBlobService->createBlockBlob($containerName, $folderName.'/'.$fullSizeName, $content);
        $signedStart = gmdate('Y-m-d\TH:i:s\Z',strtotime('now'));
        $signedExpiry = gmdate('Y-m-d\TH:i:s\Z',strtotime('+30minute'));
        
        //3.get container sas token
        $sasToken = $this->azureBlobService
                         ->generateBlobServiceSharedAccessSignatureToken(AzureBlobService::RESOURCE_TYPE_CONTAINER,
                                                                        $containerName,
                                                                        'r',
                                                                        $signedExpiry,
                                                                        $signedStart);
        //4.arrange original image information 
        list($original_width, $original_height, $original_type)=getimagesize($fullSizeFile);
        $result['type'] = CommonUtil::getMineTypeWithExt($ext);
        $result['original_width'] = $original_width;
        $result['original_height'] = $original_height;
        $result['original_size'] =  filesize ($fullSizeFile);
        $result['original_url'] =  null;
        $result['target'] =  $containerName;
        $result['sas_token'] =  $sasToken;

        //5.compress to each size and upload to blob
        foreach ($compressSetting as $longSide => $quility) {
            $compressSizeName = $folderName. '_'. $longSide . '.'. $ext;
            $compressSizeFile = $destinationPath. DIRECTORY_SEPARATOR. $compressSizeName;
            CommonUtil::compressImage( $fullSizeFile, $compressSizeFile, $longSide, $quility);
            list($thumbnail_width,$thumbnail_height,$thumbnail_type)=getimagesize($compressSizeFile);
            $compressContent = fopen($compressSizeFile, "r");
            $createCompressBlobRes = $this->azureBlobService->createBlockBlob($containerName, $folderName.'/'.$compressSizeName, $compressContent);
            $result['thumbnail_'.$longSide.'_width'] = $thumbnail_width;
            $result['thumbnail_'.$longSide.'_height'] = $thumbnail_height;
            $result['thumbnail_'.$longSide.'_url'] = null;
        }

        //6.get blob url to refill result url 
        $blobList = $this->azureBlobService->getFullBlobUrl($containerName, $folderName);
        foreach ($blobList as $name => $url) {
            $rate = rtrim(explode('_', $name)[1],'.'.$ext);
            if( $rate == 'full'){
                $result['original_url'] = $url;
            }else{
                $result['thumbnail_'.$rate.'_url'] = $url;
            }
        }

        //7.delete server file
        $this->serverFileService->deleteFile($destinationPath);

        return $result = response()->json(['ResultCode'=>ResultCode::_1_reponseSuccessful,
            'Message'=>"",
            'Content'=>$result]);

    }

    public function deleteFile(Request $request){
        $contentType = $request->header('Content-Type');
       
        if(!$request->isJson()){
            return array("code"=>ResultCode::_999006_contentTypeParameterInvalid,
                "message"=> "Content-Type錯誤");
        }

        $validator = \Validator::make($request->all(), [
        'fileUrls'=>'required'
        ],
        [
            'required' => ResultCode::_999001_requestParameterLostOrIncorrect
        ]);

        if ($validator->fails()) {
             return response()->json(['ResultCode'=>$validator->errors()->first(),
                                      'Message'=>trans('result_code.'.$validator->errors()->first())], 200);
        }

        $fileUrls = $request->get("fileUrls");
        foreach ($fileUrls as $value) {
            $str = preg_replace('/^https{0,1}:\/\//', '', $value);
            $temp = explode('/',$str);
            $account = explode('.',$temp[0])[0];
            $containerName = $temp[1];
            $delContainerName = 'delete-'.$containerName;
            unset($temp[0]);
            unset($temp[1]);
            $blobName = implode('/',$temp);
            if($account == $this->azureBlobService->getAccountName()){
                if(!$this->azureBlobService->checkContainerExist($delContainerName)){
                    $this->azureBlobService->createContainer($delContainerName);
                }
                $this->azureBlobService->softDeleteFile($delContainerName, $blobName, $containerName, $blobName);
            }
        }
        return response()->json(['ResultCode'=>ResultCode::_1_reponseSuccessful,
            'Message'=>"",
            'Content'=>""]);

    }

    private function getCompressSetting(){
        return ['1024'=>30];
    }

}
