<?php
/**
 * Qstorage相關元件
 */
namespace App\lib;

use App\lib\CommonUtil;
use Config;

class Qstorage
{    

    /**
     * 刪除附件
     * @param  Array  $fileUrls   欲刪除的檔案路徑
     * @param  Array  $queryParam query param
     * @return json
     */
    public function deleteAttach(Array $data, Array $queryParam=[])
    {       
            $apiFunction = 'picture/delete';
            $signatureTime = time();
            $url = Config::get('app.qstorage_api_server').$apiFunction.'?'.http_build_query($queryParam);
            $appKey = 'appqforumdev';
            $header = array('Content-Type: application/json',
                        'App-Key: '.$appKey,
                        'Signature-Time: '.$signatureTime,
                        'Signature: '.CommonUtil::getCustomSignature($signatureTime, $appKey));
            $data = json_encode($data);
            $result = CommonUtil::callAPI('POST', $url,  $header, $data);
            return $result;
    }
}