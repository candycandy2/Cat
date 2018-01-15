<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Input;
use App\lib\CommonUtil;
use App\lib\ResultCode;
use File;

class PictureController extends Controller
{

    /**
     * 透過此API可以上傳圖片到QStorage的專案資料夾中
     * @return json
     */
    public function uploaPicture(Request $request){
  
         $request->header('Content-Type');
         $request->header('signature-time');
         $request->header('signature');

         $appKey = $request->header('app-key');
         
         $account = $request->header('account');
         $resourceId = $request->header('resource-id');
         $uuid =  $request->uuid;
         $lang = $request->lang;
        
         $file = $request->file('files');
         $path = str_replace('/', DIRECTORY_SEPARATOR, $resourceId);
         
         $quility = 30;
         $standardArray = ['1024'=>30,
                           '300'=>100];

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

        foreach ($standardArray as $longSide => $quility) {
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
}
