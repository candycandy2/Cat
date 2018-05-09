<?php

// useage
//$API = new API_Controller() ;
//echo $API->call($method='GET', $action='checkAppVersion', $http_query, $postbody ) ;

require_once('common.php');

class API_Controller
{
	private $UrlBase = '';
	private $AppKey = '';
	private $AppSecretKey = '';
  private $expire ;
	private $Signature ;
	private $SignatureTime ;

	// samuel 20180425 {
	private $Domain = '';
	private $Loginid = '';
	private $Password = '';
	private $Redirect_uri = '';
	private $Token = '';
	// samuel 20180425 }

	//public function __construct($channel='staging', $_expire=6)
	public function __construct($_expire=6)
  {
		$this->SignatureTime = time();
    $this->expire = $_expire;
    //$this->setEnvironment($channel);
    //if(empty($this->AppKey))
    //{
    //  return array('status'=>STATE_UNKNOWN, 'message'=>'UNKNOWN, nagios failed', 'process_time'=>'0' );
    //}
	}

	//private function setEnvironment($channel)
  //{
  //      $this->UrlBase = $this->environment[$channel]['UrlBase'];
  //      $this->AppKey = $this->environment[$channel]['AppKey'];
  //      $this->AppSecretKey = $this->environment[$channel]['AppSecretKey'];
  //}

  public function setEnvironment($envArray=array())
	{
		$this->UrlBase = $envArray['UrlBase'];
		$this->AppKey = $envArray['AppKey'];
		$this->AppSecretKey = $envArray['AppSecretKey'];
		if( !empty($envArray['Domain']) ){
			$this->Domain = $envArray['Domain'];
		}
		if( !empty($envArray['Loginid']) ){
			$this->Loginid = $envArray['Loginid'];
		}
		if( !empty($envArray['Password']) ){
			$this->Password = $envArray['Password'];
		}
		if( !empty($envArray['Redirect_uri']) ){
			$this->Redirect_uri = $envArray['Redirect_uri'];
		}
		//if( !empty($envArray['$Token']) ){ $this->Token = $envArray['Token']; }
	}

	public function setToken($token)
	{
			$this->Token = $token;
	}

  public function getAppKey()
  {
    return $this->AppKey ;
  }

	private function makeSignature()
  {
		// Signature = Base64( HMAC-SHA256( SignatureTime , YourAppSecretKey ) )
		// php sample : base64_encode( hash_hmac('sha256', 'Message', 'secret', true) );
		$this->Signature = base64_encode( hash_hmac('sha256', $this->SignatureTime , $this->AppSecretKey ,true) ) ;
		return $this->Signature;
	}

	public function call( $method='GET', $action='checkAppVersion', $http_query=array(), $postbody=array(), $proxy=false)
  {
		if(empty($this->AppKey))
    {
      return array('status'=>STATE_UNKNOWN, 'message'=>'UNKNOWN, AppKey empty', 'process_time'=>'0' );
    }

		if($action=='checkAppVersion') {
			$headers = array(
				"content-type:application/json",
				"app-key:".$this->AppKey,
				"signature-time:".$this->SignatureTime,
				"signature:".$this->makeSignature(),
			);
		}
		elseif ($action=='login') {
			if(empty($this->Domain) or empty($this->Loginid) or empty($this->Password) or empty($this->Redirect_uri) )
	    {
	      return array('status'=>STATE_UNKNOWN, 'message'=>'UNKNOWN, Need login infomation', 'process_time'=>'0' );
	    }
			$headers = array(
				"content-type:application/json",
				"app-key:".$this->AppKey,
				"signature-time:".$this->SignatureTime,
				"signature:".$this->makeSignature(),
				"domain:".$this->Domain,
				"loginid:".$this->Loginid,
				"password:".$this->Password,
				"redirect-uri:".$this->Redirect_uri,
			);
		}
		else {
			if(empty($this->Token))
	    {
	      return array('status'=>STATE_UNKNOWN, 'message'=>'UNKNOWN, Token empty', 'process_time'=>'0' );
	    }
			$headers = array(
				"content-type:application/json",
				"app-key:".$this->AppKey,
				"signature-time:".$this->SignatureTime,
				"signature:".$this->makeSignature(),
				"token:".$this->Token,
			);
		}

		//print_r($headers);

		$url = $this->UrlBase . $action .'?'. http_build_query($http_query) ;

		// send api request
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($ch, CURLOPT_TIMEOUT, 30);
		curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
		curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
		curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
		curl_setopt($ch, CURLOPT_HEADER, false);
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        //curl_setopt($ch, CURLOPT_DNS_USE_GLOBAL_CACHE, false);
        //curl_setopt($ch, CURLOPT_DNS_CACHE_TIMEOUT, 2 );
    if( !empty($postbody) ){
      curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($postbody) );
    }

		// recieve api request result
    $request_start = microtime_float();
		$response = curl_exec($ch);
    $request_finish = microtime_float();
    $process_time = round($request_finish-$request_start,3) ;

    $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
		$err = curl_error($ch);
		curl_close($ch);

		$result_code_tag = '';

		if ($action==='QueryCompanyData' or $action==='ListAllMeetingRoom') {
			$result_code_tag = 'ResultCode';
		} else {
			$result_code_tag = 'result_code';
		}

		if ($err) {
      // curl error, may be timeout 30s
			return array('status'=>STATE_CRITICAL, 'message'=>'CRITICAL:'.$err, 'process_time'=>$process_time );
    }
		else {
			//print_r($result_code_tag);
			//print_r($response);
    	if ( $httpcode=='200' ){
				$result = json_decode($response, true);
				//print_r($result[$result_code_tag]);
				if( $result[$result_code_tag]==1 and $process_time < $this->expire ){
					//
					if($action=='login'){
						return array('status'=>STATE_OK, 'message'=>'OK, API works fine', 'process_time'=>$process_time, 'login_token'=> $result['content']['token'] );
					} else {
						return array('status'=>STATE_OK, 'message'=>'OK, API works fine', 'process_time'=>$process_time );
					}
				} elseif( $result[$result_code_tag]==1 and $process_time >= $this->expire ) {
          return array('status'=>STATE_WARNING, 'message'=>'WARNING, API has performance issue', 'process_time'=>$process_time );
      	}	else {
					return array('status'=>STATE_UNKNOWN, 'message'=>'UNKNOWN, API verification failed. API result code:'.$result[$result_code_tag], 'process_time'=>$process_time );
				}
			}
			else{
				print_r($response);
				return array('status'=>STATE_CRITICAL, 'message'=>'CRITICAL: http status code:'. $httpcode , 'process_time'=>$process_time );
    	}
		}
		exit;
	}
}

// Global function
function microtime_float()
{
    list($usec, $sec) = explode(" ", microtime());
    return ( (float)$usec + (float)$sec );
}
