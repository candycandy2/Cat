#!/usr/local/php7/bin/php -q
<?php
if(!isset($argv[1])){
	echo 'Error missing argument 2, please set sourceFrom'. PHP_EOL;
	return;
}else if(!isset($argv[2])){
	echo 'Error missing argument 3, please set execute date'. PHP_EOL;
	return;
}else if(!isset($argv[3])){
	echo 'Error missing argument 4, please set error content file path'. PHP_EOL;
	return;
}else if(!isset($argv[4])){
	$argv[4] = '';
}
$env=$argv[4];
$secretKey='swexuc453refebraXecujeruBraqAc4e';
$appKey = 'appqplay'.$env;

//send Push Message
$from = 'BenQ\\Alan.Tu';
$title = '[CRITICAL PROBLEM] '.$env.'-QPlay-API-SyncUserJob downLoad file error';
$text =  $env.'-QPlay-API-SyncUserJob DownLoad File Error<br>SourceFrom : '.$argv[1].'<br>Date : '.$argv[2]; 
$to =array('BenQ\\Cleo.W.Chan');
$pushUrl = 'https://qplay'.trim($env).'.benq.com/qplayApi/public/v101/qplay/sendPushMessage?lang=zh-tw&need_push=Y&app_key='.$appKey;
sendPushMessage($pushUrl, $appKey, $secretKey, $title, $text, $from, $to);

//send Mail
$mailfrom = 'no-reply@benq.com';
$mailfromName = 'QPlay';
$mailto = 'cleo.w.chan@benq.com';
$mailUrl = 'https://qplay'.trim($env).'.benq.com/qplayApi/public/v101/qplay/sendMail?lang=zh-tw&app_key='.$appKey;
$content = file_get_contents($argv[3]);
sendMail($mailUrl, $appKey, $secretKey, $mailfrom, $mailfromName, $mailto, $title, $content);


/**
 * 呼叫API
 * @param  String      $url       呼叫的API URL
 * @param  String      $appKey    app key
 * @param  Array|array $secretKey app SecretKey
 * @param  boolean     $title     標題
 * @param  boolean     $text      內文
 * @param  boolean     $from      寄件人
 * @param  boolean     $to        收件人
 * @param  json        $extra     附加的參數
 * @return mixed                  API result
 */

function sendPushMessage($url, $appKey, $secretKey, $title, $text, $from, $to){
	
	$signatureTime = time();
	
	
	$header = array('Content-Type: application/json',
				'App-Key: '.$appKey,
				'Signature-Time: '.$signatureTime,
				'Signature: '.getSignature($signatureTime, $secretKey));
	$data = array(
				'template_id' =>'0',
				'message_title' => base64_encode(jsEscape(html_entity_decode($title))),
				'message_type' => 'event',
				'message_text' => base64_encode(jsEscape(html_entity_decode($text))),
				'message_html' => '',
				'message_url' => '',
				'message_source' => 'qplay',
				'source_user_id' => $from,
				'destination_user_id' => $to,
				'destination_role_id' => array(),
				);
	$data = json_encode($data);
	$result = callAPI('POST', $url,  $header, $data);
	return $result;
}

function sendMail($url, $appKey, $secretKey, $from, $from_name, $to, $subject, $content){
	
	$signatureTime = time();
	
	$header = array('Content-Type: application/json',
				'App-Key: '.$appKey,
				'Signature-Time: '.$signatureTime,
				'Signature: '.getSignature($signatureTime, $secretKey));
	$data = array(
				'from' =>$from,
				'from_name' =>$from_name,
				'to' => $to,
				'subject' => $subject,
				'content'=>$content
				);
	$data = json_encode($data);
	$result = callAPI('POST', $url,  $header, $data);
	return $result;
}


/**
 * 呼叫API
 * @param  String      $method 呼叫方式(POST|GET)
 * @param  String      $url    API網址
 * @param  Array|array $header request header
 * @param  boolean     $data   傳遞的參數
 * @return mixed               API result
 */
function callAPI($method, $url, Array $header = array(), $data = false)
{
	$curl = curl_init();

	switch ($method)
	{
		case "POST":
			curl_setopt($curl, CURLOPT_POST, 1);

			if ($data)
				curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
			break;
		case "PUT":
			curl_setopt($curl, CURLOPT_PUT, 1);
			break;
		default:
			if ($data)
				$url = sprintf("%s?%s", $url, http_build_query($data));
	}

	// Optional Authentication:
	//設定header
	curl_setopt($curl, CURLOPT_HTTPHEADER, $header);
	curl_setopt($curl, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
	curl_setopt($curl, CURLOPT_URL, $url);
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);

	if( ! $result = curl_exec($curl)) 
	{ 
		trigger_error(curl_error($curl)); 
	} 

	curl_close($curl);

	return $result;
}

/**
 * 取得與QPlay Api 溝通的Signature
 * Base64( HMAC-SHA256( SignatureTime , AppSecretKey ) )
 * @param  timestamp $signatureTime 時間戳記
 * @param  string    $appSecretKey  使用的 app secrte key
 * @return String    加密後的字串
 */
function getSignature($signatureTime, $secretKey)
{
	$ServerSignature = base64_encode(hash_hmac('sha256', $signatureTime, $secretKey, true));
	return $ServerSignature;
}

/**
 * 將字串做javascript escape
 * @param  string $str Utf-8字串
 * @return string      javascript escape 後的字串
 */
function jsEscape($str){
	$ret = '';
	$len = mb_strlen($str);
	for ($i = 0; $i < $len; $i++)
	{
		$oriStr = mb_substr( $str,$i,1,"utf-8");
		$uniStr = utf8_str_to_unicode($oriStr);
		$ret .= $uniStr; 
	 }
	return $ret;
}

/**
 * utf8字符轉換成Unicode字符 (%uxxxx)
 * @param  string $utf8_str Utf-8字符
 * @return string           Unicode字符
 */
function utf8_str_to_unicode($utf8_str) {
	$conv = json_encode($utf8_str);
	$cov = preg_replace_callback("/(\\\u[0-9a-cf]{4})/i",function($conv){
		return '%'.$conv[0];
	},$conv); //emoji的unicode留下，其他改為%uXXXX
	return  json_decode($conv);
}
?>