//
//  QSecurityPlugin.h
//  HelloCordova
//
//  Created by 庄臣 on 6/27/16.
//
//

#import <Cordova/CDV.h>
//暂定三个等级1，2，3；
//目前根据android端的设定，1为最高等级
int Level;

@interface QSecurityPlugin : CDVPlugin <NSXMLParserDelegate>
//设定WhiteList
- (void)setWhiteList:(CDVInvokedUrlCommand *)command;
//改变Level
- (void)changeLevel:(CDVInvokedUrlCommand *)command;
//重新获取Level
- (void)resumeCheckLevel:(CDVInvokedUrlCommand *)command;
@end