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
  echo $response['message'] .", login => process time:". $response['process_time'] ."s | time=".$response['process_time']."s \n";
  exit($response['status']);
}

// QueryCompanyData api
$APIQueryCompanyData = new API_Controller($_expire=6);
$APIQueryCompanyData->setToken($Token);
if ($channel == 'production') {
  $APIQueryCompanyData->setEnvironment($envYellowPage_production);
  $response = $APIQueryCompanyData->call($method='GET', $action='QueryCompanyData', $http_query_production);
} elseif ($channel == 'staging') {
  $APIQueryCompanyData->setEnvironment($envYellowPage_staging);
  $response = $APIQueryCompanyData->call($method='GET', $action='QueryCompanyData', $http_query_staging);
} else { // 'dev' or others
  $APIQueryCompanyData->setEnvironment($envYellowPage_dev);
  $response = $APIQueryCompanyData->call($method='GET', $action='QueryCompanyData', $http_query_dev);
}

//print_r($response);
echo $response['message'] .", QueryCompanyData => process time:". $response['process_time'] ."s | time=".$response['process_time']."s \n";
exit($response['status']);
