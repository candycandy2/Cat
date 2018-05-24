#!/usr/bin/php
<?php
$shortopts = "";
$options = getopt($shortopts, array("env:"));
$channel = (!empty($options['env'])) ? $options['env'] : 'staging';  // 'staging' or 'production' or 'dev'

require_once('API_Controller.php');

// checkAppVersion
$API = new API_Controller($_expire=6 );
if ($channel == 'production') {
  $API->setEnvironment($envCheckAppVersion_production);
  $response = $API->call( $method='GET', $action='checkAppVersion', $http_query_checkAppVersion_production );
} elseif ($channel == 'staging') {
  $API->setEnvironment($envCheckAppVersion_staging);
  $response = $API->call( $method='GET', $action='checkAppVersion', $http_query_checkAppVersion_staging );
} else { // 'dev' or others
  $API->setEnvironment($envCheckAppVersion_dev);
  $response = $API->call( $method='GET', $action='checkAppVersion', $http_query_checkAppVersion_dev );
}

//print_r($response);
//

if($response['status']!=STATE_OK){
  echo $channel. " checkAppVersion => ". $response['message'] .", process time:". $response['process_time'] ."s | time=".$response['process_time']."s \n";
  exit($response['status']);
}

$Token = '';

// login api
$APIlogin = new API_Controller($_expire=6);
if ($channel == 'production') {
  $APIlogin->setEnvironment($envLogin_production);
  $response = $APIlogin->call($method='GET', $action='login', $http_query_login_production);
} elseif ($channel == 'staging') {
  $APIlogin->setEnvironment($envLogin_staging);
  $response = $APIlogin->call($method='GET', $action='login', $http_query_login_staging);
} else { // 'dev' or others
  $APIlogin->setEnvironment($envLogin_dev);
  $response = $APIlogin->call($method='GET', $action='login', $http_query_login_dev);
}
//print_r($response);
//

if($response['status']==STATE_OK){
  $Token = $response['login_token'];
} else {
  echo $channel. " login => ". $response['message'] .", process time:". $response['process_time'] ."s | time=".$response['process_time']."s \n";
  exit($response['status']);
}

// getAppList api
$APIgetAppList = new API_Controller($_expire=6);
$APIgetAppList->setToken($Token);
if ($channel == 'production') {
  $APIgetAppList->setEnvironment($envQPlay_production);
  $response = $APIgetAppList->call($method='GET', $action='getAppList', $http_query_production);
} elseif ($channel == 'staging') {
  $APIgetAppList->setEnvironment($envQPlay_staging);
  $response = $APIgetAppList->call($method='GET', $action='getAppList', $http_query_staging);
} else { // 'dev' or others
  $APIgetAppList->setEnvironment($envQPlay_dev);
  $response = $APIgetAppList->call($method='GET', $action='getAppList', $http_query_dev);
}

//print_r($response);
echo $channel. " getAppList => ", $response['message'] .", process time:". $response['process_time'] ."s | time=".$response['process_time']."s \n";
exit($response['status']);
