//
//  AppDelegate+QPush.m
//  HelloCordova
//
//  Created by qisda on 16/7/26.
//
//

#import "AppDelegate+QPush.h"
#import "QPushPlugin.h"
#import "JPUSHService.h"
#import <objc/runtime.h>

@implementation AppDelegate (QPush)
+(void)load{
    
    Method origin;
    Method swizzle;
    
    origin=class_getInstanceMethod([self class],@selector(init));
    swizzle=class_getInstanceMethod([self class], @selector(init_plus));
    method_exchangeImplementations(origin, swizzle);
}

-(instancetype)init_plus{
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(applicationDidLaunch:) name:@"UIApplicationDidFinishLaunchingNotification" object:nil];
    return [self init_plus];
}

-(void)applicationDidLaunch:(NSNotification *)notification{
    if (notification) {
        [QPushPlugin setLaunchOptions:notification.userInfo];
    }
}

- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
    [JPUSHService registerDeviceToken:deviceToken];//user allow => try to register push token
}

-(void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo{
    [JPUSHService handleRemoteNotification:userInfo];
    [[NSNotificationCenter defaultCenter] postNotificationName:kJPushPluginReceiveNotification object:userInfo];
}

-(void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler{
    [JPUSHService handleRemoteNotification:userInfo];
    [[NSNotificationCenter defaultCenter] postNotificationName:kJPushPluginReceiveNotification object:userInfo];
    completionHandler(UIBackgroundFetchResultNewData);
}

- (void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification {
    [JPUSHService showLocalNotificationAtFront:notification identifierKey:nil];
}

- (void)applicationWillEnterForeground:(UIApplication *)application {
    //  [application setApplicationIconBadgeNumber:0];
    //  [application cancelAllLocalNotifications];
}

- (void)applicationDidEnterBackground:(UIApplication *)application {
    //  [[UIApplication sharedApplication] setApplicationIconBadgeNumber:0];
}

@end
