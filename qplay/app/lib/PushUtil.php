<?php
namespace App\lib;

/**
 * Created by PhpStorm.
 * User: Moses.Zhu
 * Date: 17-01-10
 * Time: 下午1:25
 */

use JPush\Exceptions\APIConnectionException;
use JPush\Exceptions\APIRequestException;
use JPush\Exceptions\JPushException;
use JPush\Client as JPush;
use Config;

class PushUtil
{
    public static function doPost($url, $data){//file_get_content
        $postdata = http_build_query($data);

        $opts = array('http' =>
            array(
                'method'  => 'POST',
                'header'  => 'Content-type: application/x-www-form-urlencoded',
                'content' => $postdata
            )
        );
        $context = stream_context_create($opts);
        $result = file_get_contents($url, false, $context);
        return $result;
    }

    public static function PushMessageWithMessageCenter($message, $to, $parameter = '') {
        $jpush_app_id = "33938c8b001b601c1e647cbd";//"1dd3ebb8bb12f1895b4a5e25";  //TODO
        $id = strtoupper(md5(uniqid(rand(),true)));
        $args = array('Id' => $id,
            'TenantId' => '00000000-0000-0000-0000-000000000000',
            'AppId' => $jpush_app_id,
            'To' => $to,
            'Message' => $message,
            'Sound' => 'default',
            'Badge' => '0',
            'Timing' => '1900-01-01 00:00:00.000',
            'Expire' => '2099-12-31 00:00:00.000',
            'Status' => 'W',
            'To_Type' => 'NONE',
            'Parameter' => $parameter,
            'CreatedDate' => date('Y-m-d H:i:s',time()));
        $url = "http://58.210.86.182/MessageCenterWebService/MessageService.asmx/SendPNS"; //TODO http://aic0-s2.qgroup.corp.com/War/MessageCenter/MessageService.asmx
        $data["pns"] = json_encode($args);
        $response = self::doPost($url, $data);

        $result = array();
        if(str_contains($response, "true")) {
            $result["result"] = true;
            $result["info"] = $data["pns"];
        } else {
            $result["result"] = false;
            $result["info"] = $data["pns"];
        }

        return $result;
    }

    public static function PushMessageWithJPushWebAPI($message, $to, $parameter = '', $send_by_tag = false) {
        $result = array();
        $result["result"] = true;
        $result["info"] = "success";
        $response = null;
        $client = new JPush(Config::get('app.App_id'), Config::get('app.Secret_key'));
        try {
            $platform = array('ios', 'android');
            $alert = $message;
            $ios_notification = array(
                'sound' => 'default',
                'badge' => '0',
                'extras' => array(
                    'Parameter'=> $parameter
                ),
            );
            $android_notification = array(
                'extras' => array(
                    'Parameter'=> $parameter
                ),
            );
            $content = $message;
            $message = array(
                'title' => $message,
                'content_type' => 'text',
                'extras' => array(
                    'Parameter'=> $parameter
                ),
            );
            $time2live =  Config::get('app.time_to_live',864000);
            $apnsFlag = Config::get('app.apns_flag',true);
            $options = array(
                'time_to_live'=>$time2live,
                'apns_production'=>$apnsFlag
            );
            if($send_by_tag) {
                $response = $client->push()->setPlatform($platform)
                    ->addTag($to)
                    ->iosNotification($alert, $ios_notification)
                    ->androidNotification($alert, $android_notification)
                    ->message($content, $message)
                    ->options($options)
                    ->send();
            } else {
                $response = $client->push()->setPlatform($platform)
                    ->addRegistrationId($to)
                    ->iosNotification($alert, $ios_notification)
                    ->androidNotification($alert, $android_notification)
                    ->message($content, $message)
                    ->options($options)
                    ->send();
            }
        } catch (APIConnectionException $e) {
            $result["result"] = false;
            $result["info"] = "APIConnection Exception occurred";
        }catch (APIRequestException $e) {
            $result["result"] = false;
            $result["info"] = "APIRequest Exception occurred";
        }catch (JPushException $e) {
            $result["result"] = false;
            $result["info"] = "JPush Exception occurred";
        }catch (\ErrorException $e) {
            $result["result"] = false;
            $result["info"] = "Error Exception occurred";
        }catch (\Exception $e){
            $result["result"] = false;
            $result["info"] = "Exception occurred";
        }
        return $result;
    }

    public static function PushScheduleMessageWithJPushWebAPI($schedule_name, $schedule_datetime, $message, $to, $parameter = '', $send_by_tag = false) {
        $result = array();
        $result["result"] = true;
        $result["info"] = "success";
        $response = null;
        $client = new JPush(Config::get('app.App_id'), Config::get('app.Secret_key'));
        try {
            $platform = array('ios', 'android');
            $alert = $message;
            $ios_notification = array(
                'sound' => 'default',
                'badge' => '0',
                'extras' => array(
                    'Parameter'=> $parameter
                ),
            );
            $android_notification = array(
                'extras' => array(
                    'Parameter'=> $parameter
                ),
            );
            $content = $message;
            $scheduleName = $schedule_name; //time();//$message;
            $message = array(
                'title' => $message,
                'content_type' => 'text',
                'extras' => array(
                    'Parameter'=> $parameter
                ),
            );
            $time2live =  Config::get('app.time_to_live',864000);
            $apnsFlag = Config::get('app.apns_flag',true);
            $options = array(
                'time_to_live'=>$time2live,
                'apns_production'=>$apnsFlag
            );
            if($send_by_tag) {
                $payload = $client->push()
                    ->setPlatform($platform)
                    ->iosNotification($alert, $ios_notification)
                    ->androidNotification($alert, $android_notification)
                    ->message($content, $message)
                    ->options($options)
                    ->addTag($to) //以Tag发送
                    ->build();
            } else {
                $payload = $client->push()
                    ->setPlatform($platform)
                    ->iosNotification($alert, $ios_notification)
                    ->androidNotification($alert, $android_notification)
                    ->message($content, $message)
                    ->options($options)
                    ->addRegistrationId($to)  //以注册ID发送
                    ->build();
            }

            $schedule = $client->schedule();
            if(intval($schedule_datetime) >= 1000000000000) { //毫秒转秒
                $schedule_datetime = intval($schedule_datetime) / 1000;
            }

            //TODO 暂时加8小时
            $schedule_datetime += 8 * 60 * 60;

            $trigger = array("time"=>date("Y-m-d H:i:s",$schedule_datetime));
            $result["content"] = $schedule->createSingleSchedule($scheduleName, $payload, $trigger);
        } catch (APIConnectionException $e) {
            $result["result"] = false;
            $result["info"] = "APIConnection Exception occurred:".$e->getMessage();
        }catch (APIRequestException $e) {
            $result["result"] = false;
            $result["info"] = "APIRequest Exception occurred:".$e->getMessage();
        }catch (JPushException $e) {
            $result["result"] = false;
            $result["info"] = "JPush Exception occurred:".$e->getMessage();
        }catch (\ErrorException $e) {
            $result["result"] = false;
            $result["info"] = "Error Exception occurred:".$e->getMessage();
        }catch (\Exception $e){
            $result["result"] = false;
            $result["info"] = "Exception occurred:".$e->getMessage();
        }
        return $result;
    }

    public static function GetTagByUserInfo($userInfo) {
        $userCompany = strtoupper($userInfo->company);

        //check if [blank] appear in string, replace with [underscore]
        $company = preg_replace("/\s+/", "_", $userCompany);

        $firstLetter = strtoupper(substr($userInfo->login_id, 0, 1));
        switch ($firstLetter) {
            case 'A':
            case 'B':
            case 'C':
            case 'D':
                return $company.'1';
            case 'E':
            case 'F':
            case 'G':
            case 'H':
                return $company.'2';
            case 'I':
            case 'J':
            case 'K':
            case 'L':
                return $company.'3';
            case 'M':
            case 'N':
            case 'O':
            case 'P':
                return $company.'4';
            case 'Q':
            case 'R':
            case 'S':
            case 'T':
                return $company.'5';
            default:
                return $company.'6';
        }
    }

    public static function AddTagsWithJPushWebAPI($registrationId, $tag) {
        $result = array();
        $result["result"] = true;
        $response = null;
        $client = new JPush(Config::get('app.App_id'), Config::get('app.Secret_key'));
        try {
            $device = $client->device();
            $result["info"] = $device->addDevicesToTag($tag, $registrationId);
        } catch (APIConnectionException $e) {
            $result["result"] = false;
            $result["info"] = "APIConnection Exception occurred".$e->getMessage();
        }catch (APIRequestException $e) {
            $result["result"] = false;
            $result["info"] = "APIRequest Exception occurred".$e->getMessage();
        }catch (JPushException $e) {
            $result["result"] = false;
            $result["info"] = "JPush Exception occurred".$e->getMessage();
        }catch (\ErrorException $e) {
            $result["result"] = false;
            $result["info"] = "Error Exception occurred".$e->getMessage();
        }catch (\Exception $e){
            $result["result"] = false;
            $result["info"] = "Exception occurred".$e->getMessage();
        }
        return $result;
    }

    public static function RemoveTagsWithJPushWebAPI($registrationId, $tag) {
        $result = array();
        $result["result"] = true;
        $response = null;
        $client = new JPush(Config::get('app.App_id'), Config::get('app.Secret_key'));
        try {
            $device = $client->device();
            $result["info"] = $device->removeDevicesFromTag($tag, $registrationId);
        } catch (APIConnectionException $e) {
            $result["result"] = false;
            $result["info"] = "APIConnection Exception occurred".$e->getMessage();
        }catch (APIRequestException $e) {
            $result["result"] = false;
            $result["info"] = "APIRequest Exception occurred".$e->getMessage();
        }catch (JPushException $e) {
            $result["result"] = false;
            $result["info"] = "JPush Exception occurred".$e->getMessage();
        }catch (\ErrorException $e) {
            $result["result"] = false;
            $result["info"] = "Error Exception occurred".$e->getMessage();
        }catch (\Exception $e){
            $result["result"] = false;
            $result["info"] = "Exception occurred".$e->getMessage();
        }
        return $result;
    }
    //JPush API Proxy
    public static function GetDevices($registrationId) {
        $result = array();
        $result["result_code"] = ResultCode::_1_reponseSuccessful;
        $result["content"] = "";
        $response = null;
        $client = new JPush(Config::get('app.App_id'), Config::get('app.Secret_key'));
        try {
            $device = $client->device();
            $result["content"] = $device->getDevices($registrationId);
        } catch (APIConnectionException $e) {
            $result["result_code"] = ResultCode::_999999_unknownError;
            $result["content"] = "APIConnection Exception occurred".$e->getMessage();
        }catch (APIRequestException $e) {
            $result["result_code"] = ResultCode::_999999_unknownError;
            $result["content"] = "APIRequest Exception occurred".$e->getMessage();
        }catch (JPushException $e) {
            $result["result_code"] = ResultCode::_999999_unknownError;
            $result["content"] = "JPush Exception occurred".$e->getMessage();
        }catch (\ErrorException $e) {
            $result["result_code"] = ResultCode::_999999_unknownError;
            $result["content"] = "Error Exception occurred".$e->getMessage();
        }catch (\Exception $e){
            $result["result_code"] = ResultCode::_999999_unknownError;
            $result["content"] = "Exception occurred".$e->getMessage();
        }
        return $result;
    }

    public static function GetTags() {
        $result = array();
        $result["result_code"] = ResultCode::_1_reponseSuccessful;
        $result["content"] = "";
        $response = null;
        $client = new JPush(Config::get('app.App_id'), Config::get('app.Secret_key'));
        try {
            $device = $client->device();
            $result["content"] = $device->getTags();
        } catch (APIConnectionException $e) {
            $result["result_code"] = ResultCode::_999999_unknownError;
            $result["content"] = "APIConnection Exception occurred".$e->getMessage();
        }catch (APIRequestException $e) {
            $result["result_code"] = ResultCode::_999999_unknownError;
            $result["content"] = "APIRequest Exception occurred".$e->getMessage();
        }catch (JPushException $e) {
            $result["result_code"] = ResultCode::_999999_unknownError;
            $result["content"] = "JPush Exception occurred".$e->getMessage();
        }catch (\ErrorException $e) {
            $result["result_code"] = ResultCode::_999999_unknownError;
            $result["content"] = "Error Exception occurred".$e->getMessage();
        }catch (\Exception $e){
            $result["result_code"] = ResultCode::_999999_unknownError;
            $result["content"] = "Exception occurred".$e->getMessage();
        }
        return $result;
    }

    public static function IsDeviceInTag($registrationId, $tag) {
        $result = array();
        $result["result_code"] = ResultCode::_1_reponseSuccessful;
        $result["content"] = "";
        $response = null;
        $client = new JPush(Config::get('app.App_id'), Config::get('app.Secret_key'));
        try {
            $device = $client->device();
            $result["content"] = $device->isDeviceInTag($registrationId, $tag);
        } catch (APIConnectionException $e) {
            $result["result_code"] = ResultCode::_999999_unknownError;
            $result["content"] = "APIConnection Exception occurred".$e->getMessage();
        }catch (APIRequestException $e) {
            $result["result_code"] = ResultCode::_999999_unknownError;
            $result["content"] = "APIRequest Exception occurred".$e->getMessage();
        }catch (JPushException $e) {
            $result["result_code"] = ResultCode::_999999_unknownError;
            $result["content"] = "JPush Exception occurred".$e->getMessage();
        }catch (\ErrorException $e) {
            $result["result_code"] = ResultCode::_999999_unknownError;
            $result["content"] = "Error Exception occurred".$e->getMessage();
        }catch (\Exception $e){
            $result["result_code"] = ResultCode::_999999_unknownError;
            $result["content"] = "Exception occurred".$e->getMessage();
        }
        return $result;
    }

    public static function AddDevicesToTag($registrationId, $tag) {
        $result = array();
        $result["result_code"] = ResultCode::_1_reponseSuccessful;
        $result["content"] = "";
        $response = null;
        $client = new JPush(Config::get('app.App_id'), Config::get('app.Secret_key'));
        try {
            $device = $client->device();
            $result["content"] = $device->addDevicesToTag($tag, $registrationId);
        } catch (APIConnectionException $e) {
            $result["result_code"] = ResultCode::_999999_unknownError;
            $result["content"] = "APIConnection Exception occurred".$e->getMessage();
        }catch (APIRequestException $e) {
            $result["result_code"] = ResultCode::_999999_unknownError;
            $result["content"] = "APIRequest Exception occurred".$e->getMessage();
        }catch (JPushException $e) {
            $result["result_code"] = ResultCode::_999999_unknownError;
            $result["content"] = "JPush Exception occurred".$e->getMessage();
        }catch (\ErrorException $e) {
            $result["result_code"] = ResultCode::_999999_unknownError;
            $result["content"] = "Error Exception occurred".$e->getMessage();
        }catch (\Exception $e){
            $result["result_code"] = ResultCode::_999999_unknownError;
            $result["content"] = "Exception occurred".$e->getMessage();
        }
        return $result;
    }

    public static function CreateSingleSchedule($scheduleName, $scheduleTime, $message, $to, $parameter = '') {
        $result = array();
        $result["result_code"] = ResultCode::_1_reponseSuccessful;
        $result["content"] = "";
        $response = null;
        $client = new JPush(Config::get('app.App_id'), Config::get('app.Secret_key'));
        try {
            $platform = array('ios', 'android');
            $alert = $message;
            $ios_notification = array(
                'sound' => 'default',
                'badge' => '0',
                'extras' => array(
                    'Parameter'=> $parameter
                ),
            );
            $android_notification = array(
                'extras' => array(
                    'Parameter'=> $parameter
                ),
            );
            $content = $message;
            $message = array(
                'title' => $message,
                'content_type' => 'text',
                'extras' => array(
                    'Parameter'=> $parameter
                ),
            );
            $time2live =  Config::get('app.time_to_live',864000);
            $apnsFlag = Config::get('app.apns_flag',true);
            $options = array(
                'time_to_live'=>$time2live,
                'apns_production'=>$apnsFlag
            );

            $payload = $client->push()
                ->setPlatform($platform)
                ->iosNotification($alert, $ios_notification)
                ->androidNotification($alert, $android_notification)
                ->message($content, $message)
                ->options($options)
                ->addRegistrationId($to)  //以注册ID发送
                ->build();

            $schedule = $client->schedule();
            $trigger = array("time"=>date("Y-m-d H:i:s",$scheduleTime / 1000));
            $result["content"] = $schedule->createSingleSchedule($scheduleName, $payload, $trigger);
        } catch (APIConnectionException $e) {
            $result["result_code"] = ResultCode::_999999_unknownError;
            $result["content"] = "APIConnection Exception occurred".$e->getMessage();
        }catch (APIRequestException $e) {
            $result["result_code"] = ResultCode::_999999_unknownError;
            $result["content"] = "APIRequest Exception occurred".$e->getMessage();
        }catch (JPushException $e) {
            $result["result_code"] = ResultCode::_999999_unknownError;
            $result["content"] = "JPush Exception occurred".$e->getMessage();
        }catch (\ErrorException $e) {
            $result["result_code"] = ResultCode::_999999_unknownError;
            $result["content"] = "Error Exception occurred".$e->getMessage();
        }catch (\Exception $e){
            $result["result_code"] = ResultCode::_999999_unknownError;
            $result["content"] = "Exception occurred".$e->getMessage();
        }
        return $result;
    }

    public static function GetSchedules($page = 1) {
        $result = array();
        $result["result_code"] = ResultCode::_1_reponseSuccessful;
        $result["content"] = "";
        $response = null;
        $client = new JPush(Config::get('app.App_id'), Config::get('app.Secret_key'));
        try {
            $schedule = $client->schedule();
            $result["content"] = $schedule->getSchedules($page);
        } catch (APIConnectionException $e) {
            $result["result_code"] = ResultCode::_999999_unknownError;
            $result["content"] = "APIConnection Exception occurred".$e->getMessage();
        }catch (APIRequestException $e) {
            $result["result_code"] = ResultCode::_999999_unknownError;
            $result["content"] = "APIRequest Exception occurred".$e->getMessage();
        }catch (JPushException $e) {
            $result["result_code"] = ResultCode::_999999_unknownError;
            $result["content"] = "JPush Exception occurred".$e->getMessage();
        }catch (\ErrorException $e) {
            $result["result_code"] = ResultCode::_999999_unknownError;
            $result["content"] = "Error Exception occurred".$e->getMessage();
        }catch (\Exception $e){
            $result["result_code"] = ResultCode::_999999_unknownError;
            $result["content"] = "Exception occurred".$e->getMessage();
        }
        return $result;
    }
}