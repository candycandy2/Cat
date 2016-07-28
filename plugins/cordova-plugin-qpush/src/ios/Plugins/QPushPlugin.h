//
//  QPushPlugin.h
//  HelloCordova
//
//  Created by qisda on 16/7/26.
//
//

#import <Cordova/CDV.h>

#define kJPushPluginReceiveNotification @"QPushPluginReceiveNofication"

@interface QPushPlugin :  CDVPlugin{
    
}

+(void)setLaunchOptions:(NSDictionary *)theLaunchOptions;

//获取 RegistrationID
-(void)getRegistrationID:(CDVInvokedUrlCommand*)command;

//应用本地的角标值设置/获取
-(void)setApplicationIconBadgeNumber:(CDVInvokedUrlCommand*)command;
-(void)getApplicationIconBadgeNumber:(CDVInvokedUrlCommand*)command;

/*
 *  以下为js中可监听到的事件
 *  jpush.openNotification      点击推送消息启动或唤醒app
 *  jpush.receiveMessage        收到自定义消息
 *  jpush.receiveNotification   前台收到推送
 *  jpush.backgoundNotification 后台收到推送
 */

@end


