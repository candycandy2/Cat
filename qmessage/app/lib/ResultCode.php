<?php
namespace App\lib;
/**
 * Created by PhpStorm.
 * User: John.ZC.Zhuang
 * Date: 2017/1/11
 * Time: 9:31
 */
abstract class ResultCode
{
    const _1_reponseSuccessful = 1; //成功

    //QMessage
    const _998001_usernameEmptyOrInvalid = '998001'; //用户名为空或不合法
    const _998002_callAPIFailedOrErrorOccurs = '998002'; //调用JMessage API出错
    const _998003_groupOwnerEmptyOrInvalid = '998003'; //Group Owner为空或不合法
    const _998004_groupMembersEmptyOrInvalid = '998004'; //Group Members为空或不合法
    const _998005_groupIDEmptyOrInvalid = '998005'; //Group ID 为空或不合法
    const _998006_downloadFileFailed = '998006'; //下载文件失败（图片）
    const _998007_cursorEmptyOrInvalid = '998007'; //cursor(msgid)为空或不存在
    const _998008_targetIdEmptyOrInvalid = '998008'; //target_id为空或非array
}