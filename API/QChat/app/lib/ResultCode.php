<?php
namespace App\lib;

/**
 * 錯誤代碼
 * User: Cleo.W.Chan
 */

abstract class ResultCode
{   
    const _1_reponseSuccessful = "1"; //成功
    const _025901_reponseSuccessful = "025901"; //成功
    const _025903_MandatoryFieldLost = "025903"; //必填字段缺失
    const _025905_FieldFormatError = "025905"; //欄位格式錯誤
    const _025907_NoAuthority = "025907"; //權限不足
    const _025908_AccountNotExist = "025908"; //帳號不存在
    const _025915_ContentTypeParameterInvalid = "025915"; //Content-Type錯誤
    const _025916_InputXmlFormatIsInvalid = "025916";  //傳入的xml格式錯誤,Server端無法解析 
    const _025917_InputJsonFormatIsInvalid = "025917";//傳入的json格式錯誤,Server端無法解析
    const _025918_MemberNotRegistered = "025918";//新增聊天室失敗, 成員未註冊
    const _025919_ChatroomMemberInvalid = "025919";//傳入的成員不存在
    const _025920_TheChatroomIdIsInvalid = "025920";//傳入的聊天室編號無法識別
    const _025921_DestinationEmployeeNumberIsInvalid = "025921";//要設定的好友工號不存在
    const _025922_DestinationEmployeeNumberIsProtectUser = "025922";//要設定的好友是保護名單
    const _025923_YouCannotSendTheInvitationToFriends = "025923";//要設定對象已經是好友
    const _025924_DestinationEmployeeAlreadyRegistered = "025924";//要邀請的好友已經註冊過QPlay
    const _025925_CannotModifyBsicInformationOfOtherPeople = "025925";//不得修改他人数据
    const _025926_CannotInviteProtectedUserWhoIsNotFriend = '025926'; //保護名單必須是好友才能聊天
    const _025927_InvitationAlreadySend = '025927'; //已發送過交友邀請
    const _025928_InvitationNotExist = '025928'; //交友邀請不存在
    const _025929_PrivateChatroomCanNotAddMember = '025929'; //私聊聊天室不可新增成員
    const _025930_CallAPIFailedOrErrorOccurs = '025930'; //調用JMessage API出错
    const _025998_NoData = "025998";  //查無資料
    const _025999_UnknownError = "025999";  //其他未知錯誤  
}