<?php

define('STATE_OK', 0);
define('STATE_WARNING', 1);
define('STATE_CRITICAL', 2);
define('STATE_UNKNOWN', 3);

$http_query_checkAppVersion_production = array(
  "lang"=>"en-us",
  "package_name"=>"com.qplay.appqplay",
  "device_type"=>"android",
  "version_code"=>"1",
);

$http_query_checkAppVersion_staging = array(
  "lang"=>"en-us",
  "package_name"=>"com.qplay.appqplaytest",
  "device_type"=>"android",
  "version_code"=>"1",
);

$http_query_checkAppVersion_dev = array(
  "lang"=>"en-us",
  "package_name"=>"com.qplay.appqplaydev",
  "device_type"=>"android",
  "version_code"=>"1",
);

$http_query_login_production = array(
	"lang"=>"en-us",
	"uuid"=>"1104a897929f1df900d",
	"device_type"=>"android",
);

$http_query_login_staging = array(
	"lang"=>"en-us",
	"uuid"=>"100d8559094875b15f5",
	"device_type"=>"android",
);

$http_query_login_dev = array(
	"lang"=>"en-us",
  "uuid"=>"18071adc033c0148339",
	"device_type"=>"android",
);

$http_query_production = array(
	"lang"=>"en-us",
	"uuid"=>"1104a897929f1df900d",
);

$http_query_staging = array(
	"lang"=>"en-us",
	"uuid"=>"100d8559094875b15f5",
);

$http_query_dev = array(
	"lang"=>"en-us",
  "uuid"=>"18071adc033c0148339",
);

$envCheckAppVersion_production = array(
  'UrlBase'=>'https://23.99.120.80/qplayApi/public/v101/qplay/',
  'AppKey'=>'appnagios',
  'AppSecretKey'=>'e747c6c9e5e18efbdf9611b4e3f12cb1',
);

$envCheckAppVersion_staging = array(
  'UrlBase'=>'https://13.75.117.225/qplayApi/public/v101/qplay/',
  'AppKey'=>'appqplaytest',
  'AppSecretKey'=>'swexuc453refebraXecujeruBraqAc4e',
);

$envCheckAppVersion_dev = array(
  'UrlBase'=>'https://qplaydev.benq.com/qplayApi/public/v101/qplay/',
  'AppKey'=>'appqplaydev',
  'AppSecretKey'=>'swexuc453refebraXecujeruBraqAc4e',
);

$envLogin_production = array(
  'UrlBase'=>'https://23.99.120.80/qplayApi/public/v101/qplay/',
  'AppKey'=>'appqplay',
  'AppSecretKey'=>'swexuc453refebraXecujeruBraqAc4e',
  'Domain'=>'qgroup',
  'Loginid'=>'Samuel.Hsieh',
  'Password'=>'Springtjpwu0',
  'Redirect_uri'=>'http://BenQ.com.tw',
);

$envLogin_staging = array(
  'UrlBase'=>'https://13.75.117.225/qplayApi/public/v101/qplay/',
  'AppKey'=>'appqplaytest',
  'AppSecretKey'=>'swexuc453refebraXecujeruBraqAc4e',
  'Domain'=>'qgroup',
  'Loginid'=>'Samuel.Hsieh',
  'Password'=>'Springtjpwu0',
  'Redirect_uri'=>'http://BenQ.com.tw',
);

$envLogin_dev = array(
  'UrlBase'=>'https://qplaydev.benq.com/qplayApi/public/v101/qplay/',
  'AppKey'=>'appqplaydev',
  'AppSecretKey'=>'swexuc453refebraXecujeruBraqAc4e',
  'Domain'=>'qgroup',
  'Loginid'=>'Samuel.Hsieh',
  'Password'=>'Springtjpwu0',
  'Redirect_uri'=>'http://BenQ.com.tw',
);

$envQPlay_production = array(
  'UrlBase'=>'https://23.99.120.80/qplayApi/public/v101/qplay/',
  'AppKey'=>'appqplay',
  'AppSecretKey'=>'swexuc453refebraXecujeruBraqAc4e',
);

$envQPlay_staging = array(
  'UrlBase'=>'https://13.75.117.225/qplayApi/public/v101/qplay/',
  'AppKey'=>'appqplaytest',
  'AppSecretKey'=>'swexuc453refebraXecujeruBraqAc4e',
);

$envQPlay_dev = array(
  'UrlBase'=>'https://qplaydev.benq.com/qplayApi/public/v101/qplay/',
  'AppKey'=>'appqplaydev',
  'AppSecretKey'=>'swexuc453refebraXecujeruBraqAc4e',
);

$envYellowPage_production = array(
  'UrlBase'=>'https://23.99.120.80/qplayApi/public/v101/custom/appyellowpage/',
  'AppKey'=>'appyellowpage',
  'AppSecretKey'=>'c103dd9568f8493187e02d4680e1bf2f',
);

$envYellowPage_staging = array(
  'UrlBase'=>'https://13.75.117.225/qplayApi/public/v101/custom/appyellowpagetest/',
  'AppKey'=>'appyellowpagetest',
  'AppSecretKey'=>'c103dd9568f8493187e02d4680e1bf2f',
);

$envYellowPage_dev = array(
  'UrlBase'=>'https://qplaydev.benq.com/qplayApi/public/v101/custom/appyellowpagedev/',
  'AppKey'=>'appyellowpagedev',
  'AppSecretKey'=>'c103dd9568f8493187e02d4680e1bf2f',
);

$envRRS_production = array(
  'UrlBase'=>'https://23.99.120.80/qplayApi/public/v101/custom/apprrs/',
  'AppKey'=>'apprrs',
  'AppSecretKey'=>'2e936812e205445490efb447da16ca13',
);

$envRRS_staging = array(
  'UrlBase'=>'https://13.75.117.225/qplayApi/public/v101/custom/apprrstest/',
  'AppKey'=>'apprrstest',
  'AppSecretKey'=>'2e936812e205445490efb447da16ca13',
);

$envRRS_dev = array(
  'UrlBase'=>'https://qplaydev.benq.com/qplayApi/public/v101/custom/apprrsdev/',
  'AppKey'=>'apprrsdev',
  'AppSecretKey'=>'2e936812e205445490efb447da16ca13',
);
