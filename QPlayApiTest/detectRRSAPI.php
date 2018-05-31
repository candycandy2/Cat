#!/usr/bin/php
<?php
$shortopts = "";
$options = getopt($shortopts, array("env:"));
$channel = (!empty($options['env'])) ? $options['env'] : 'staging';  // 'staging' or 'production' or 'dev'
require_once('API_Controller.php');

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

if($response['status']==STATE_OK){
  $Token = $response['login_token'];
} else {
  echo $channel. " login => ". $response['message'] .", process time:". $response['process_time'] ."s | time=".$response['process_time']."s \n";
  exit($response['status']);
}

// ListAllMeetingRoom api
$APIListAllMeetingRoom = new API_Controller($_expire=6);
$APIListAllMeetingRoom->setToken($Token);
if ($channel == 'production') {
  $APIListAllMeetingRoom->setEnvironment($envRRS_production);
  $response = $APIListAllMeetingRoom->call($method='GET', $action='ListAllMeetingRoom', $http_query_production);
} elseif ($channel == 'staging') {
  $APIListAllMeetingRoom->setEnvironment($envRRS_staging);
  $response = $APIListAllMeetingRoom->call($method='GET', $action='ListAllMeetingRoom', $http_query_staging);
} else { // 'dev' or others
  $APIListAllMeetingRoom->setEnvironment($envRRS_dev);
  $response = $APIListAllMeetingRoom->call($method='GET', $action='ListAllMeetingRoom', $http_query_dev);
}

//print_r($response);
echo $channel. " ListAllMeetingRoom => ". $response['message'] .", process time:". $response['process_time'] ."s | time=".$response['process_time']."s \n";
exit($response['status']);
