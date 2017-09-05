<?php
/**
 * 處理App Pic相關商業邏輯
 * @author  Cleo.W.Chan cleo.w.chan@benq.com
 */
namespace App\Services;

use App\Repositories\AppPicRepository;
use App\lib\FilePath;
use \DB;

class AppPicService
{   

    protected $appPicRepository;

    public function __construct(AppPicRepository $appPicRepository)
    {
        $this->appPicRepository = $appPicRepository;
    }

    /**
     * save App Screenshot
     * @param  int    $appId     qpp id
     * @param  Array  $input     form post data
     */
    public function saveAppScreenShot($appId, $input){
      
            $delPic = (isset($input['delPic']))?$input['delPic']:"";
            $insPic  =(isset($input['insPic']))?$input['insPic']:array();

            $objGetPattern = array(
                            'android'=>"/^androidScreenUpload_/",
                            'ios'=>"/^iosScreenUpload_/"
                            );
            $sreenShot = null;
            foreach ($objGetPattern as $deviceType => $regx) {
                $fileList = $this->getArrayByKeyRegex($regx, $input);
                foreach($fileList as $filesKey => $files) { 
                    foreach ($files as $file) {
                        $sreenShot[$deviceType]=$fileList;
                    }
                }
            }

            //刪除使用者刪除的圖片
            $delPicArr = explode(',',$delPic);
            $this->deletePic($appId, $delPicArr);
             
            //刪除此App所有screen shot
            $this->appPicRepository->delPicByAppId($appId);
            $insertArray = array();
            $now = date('Y-m-d H:i:s',time());
            $picCount;

            foreach ($insPic as $seq => $item) {

                $picItem = explode(',',$item);
                $deviceType = $picItem[1];
                $langId = $picItem[0];
                $picName = $picItem[2];
                if(!isset($picCount[$deviceType][$langId])){
                    $picCount[$deviceType][$langId] = 0;
                }
                $insertArray[] = array(
                    'app_row_id'=>$appId,
                    'lang_row_id'=> $langId,
                    'pic_type'=>$deviceType.'_screenshot',
                    'sequence_by_type'=>$seq+1,
                    'pic_url'=>$picName,
                    'created_user'=>\Auth::user()->row_id,
                    'updated_user'=>\Auth::user()->row_id,
                    'created_at'=>$now,
                    'updated_at'=>$now
                );
                if( $picItem[3] == ""){
                    if(isset($sreenShot)){
                        $screenshotUploadPath =  FilePath::getScreenShotUploadPath($appId,$langId,$deviceType);
                        $sreenShot[$deviceType][$deviceType.'ScreenUpload_'.$langId][$picCount[$deviceType][$langId]]->move($screenshotUploadPath,$picName);
                        $picCount[$deviceType][$langId]++;
                    }
                }
            }
            $this->appPicRepository->insertPic($insertArray);
    }

    /**
     * 刪除Screen Shot 
     * @param  Array $delPicArr 用戶選擇刪除的檔案
     * 
     */
    public function deletePic($appId, $delPicArr){

        foreach($delPicArr as $picId){
            $appPic = $this->appPicRepository->getPicById($picId);
            if(isset($appPic)){
                $picName = $appPic->pic_url;
                $langRowId = $appPic->lang_row_id;
                $deviceType = explode('_',$appPic->pic_type)[0];
                $screenshotFile = FilePath::getScreenShotUploadPath($appId,$langRowId,$deviceType).$picName;
                if (file_exists($screenshotFile)){
                    unlink($screenshotFile);
                }
            }
        }
    }

    /**
     * 刪除app_pic下同語言所有資料
     * @param  int $appId   qp_app.row_id
     * @param  Array $langAry 欲刪除那些語言的資料
     * @return int 
     */
    public function delAllPicByLangId($appId, $langAry){
        return $this->appPicRepository->delAllPicByLangId($appId, $langAry); 
    }

    /**
     * Find array by key match the pattern
     * @param  String  $pattern The pattern to search for, as a string.
     * @param  Array  $input   The input array.
     * @param  integer $flags   If set to PREG_GREP_INVERT, this function returns the elements of the input array that do
     *                          not match the given pattern.
     * @return Array           Returns an array indexed using the keys from the input array.
     * @author Cleo.W.Chan
     */
    private function getArrayByKeyRegex( $pattern, $input, $flags = 0 )
    {
        $keys = preg_grep( $pattern, array_keys( $input ), $flags );
        $vals = array();
        foreach ( $keys as $key )
        {
            $vals[$key] = $input[$key];
        }
        return $vals;
    }


}