<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Input;
use App\lib\CommonUtil;
use App\lib\ResultCode;
use Illuminate\Contracts\Validation;
use File;

class PictureController extends Controller
{

    /**
     * 透過此API可以上傳圖片到QStorage的專案資料夾中
     * @return json
     */
    public function uploaPicture(Request $request){
  
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

        $path = str_replace('/', DIRECTORY_SEPARATOR, $resourceId);
        $compressSetting = $this->getCompressSetting();
        $result = [];
         
        $ext = pathinfo($file->getClientOriginalName(), PATHINFO_EXTENSION);
        $folderName = uniqid();
        $fullSizeName = $folderName. '_full.'. $ext;
        $node = $appKey. DIRECTORY_SEPARATOR. 'picture'. $path. $folderName;
        $destinationPath = public_path($node);
        $urlNode = str_replace(DIRECTORY_SEPARATOR, '/', $node).'/';

        $file->move($destinationPath,$fullSizeName);
        $fullSizeFile = $destinationPath. DIRECTORY_SEPARATOR. $fullSizeName;
        list($original_width, $original_height, $original_type)=getimagesize($fullSizeFile);
        $result['type'] = CommonUtil::getMineTypeWithExt($ext);
        $result['original_width'] = $original_width;
        $result['original_height'] = $original_height;
        $result['original_size'] =  filesize ($fullSizeFile);
        $result['original_url'] =  url($urlNode. $fullSizeName);

        foreach ($compressSetting as $longSide => $quility) {
            $compressSizeName = $folderName. '_'. $longSide . '.'. $ext;
            $compressSizeFile = $destinationPath. DIRECTORY_SEPARATOR. $compressSizeName;
            CommonUtil::compressImage( $fullSizeFile, $compressSizeFile, $longSide, $quility);
            list($thumbnail_width,$thumbnail_height,$thumbnail_type)=getimagesize($compressSizeFile);
            $result['thumbnail_'.$longSide.'_width'] = $thumbnail_width;
            $result['thumbnail_'.$longSide.'_height'] = $thumbnail_height;
            $result['thumbnail_'.$longSide.'_url'] = url($urlNode. $compressSizeName);
        }
        
        return $result = response()->json(['ResultCode'=>ResultCode::_1_reponseSuccessful,
            'Message'=>"",
            'Content'=>$result]);

    }

    private function getCompressSetting(){
        return ['1024'=>30];
    }

}
