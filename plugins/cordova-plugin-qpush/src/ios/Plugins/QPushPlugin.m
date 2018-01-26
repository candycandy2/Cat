//
//  QPushPlugin.m
//  HelloCordova
//
//  Created by qisda on 16/7/26.
//
//

#import "QPushPlugin.h"
#import "JPUSHService.h"
#import <UIKit/UIKit.h>
#import <AdSupport/AdSupport.h>

static NSString *const JP_APP_KEY = @"APP_KEY";
static NSString *const JP_APP_CHANNEL = @"CHANNEL";
static NSString *const JP_APP_ISPRODUCTION = @"IsProduction";
static NSString *const JP_APP_ISIDFA = @"IsIDFA";
static NSString *const JPushConfigFileName = @"PushConfig";
static NSDictionary *_launchOptions = nil;
static NSString* registrationID = @"";
static NSInteger registrationIDFailcode = 0;

@implementation QPushPlugin
+(void)registerForRemoteNotification{
    
    NSString *advertisingId = [[[ASIdentifierManager sharedManager] advertisingIdentifier] UUIDString];
    
    //2.1.9版本新增获取registration id block接口。
    [JPUSHService registrationIDCompletionHandler:^(int resCode, NSString *registrationIDReturn) {
        if(resCode == 0){
            NSLog(@"registrationID获取成功：%@",registrationIDReturn);
            registrationID = registrationIDReturn;
        }
        else{
            NSLog(@"registrationID获取失败，code：%d",resCode);
            registrationIDFailcode = resCode;
        }
    }];
    
    // 3.0.0及以后版本注册可以这样写，也可以继续用旧的注册方式
    JPUSHRegisterEntity * entity = [[JPUSHRegisterEntity alloc] init];
    entity.types = JPAuthorizationOptionAlert|JPAuthorizationOptionBadge|JPAuthorizationOptionSound;
    if ([[UIDevice currentDevice].systemVersion floatValue] >= 8.0) {
        //可以添加自定义categories
        //    if ([[UIDevice currentDevice].systemVersion floatValue] >= 10.0) {
        //      NSSet<UNNotificationCategory *> *categories;
        //      entity.categories = categories;
        //    }
        //    else {
        //      NSSet<UIUserNotificationCategory *> *categories;
        //      entity.categories = categories;
        //    }
    }
    [JPUSHService registerForRemoteNotificationConfig:entity delegate:self];
    NSLog(@"registerForRemoteNotificationConfig");
    
    //如不需要使用IDFA，advertisingIdentifier 可为nil
    //    [JPUSHService setupWithOption:launchOptions appKey:appKey
    //                          channel:channel
    //                 apsForProduction:isProduction
    //            advertisingIdentifier:advertisingId];
}

-(void)initial:(CDVInvokedUrlCommand*)command{
    //do nithng,because Cordova plugin use lazy load mode.
}


#ifdef __CORDOVA_4_0_0

- (void)pluginInitialize {
    NSLog(@"### pluginInitialize ");
    [self initNotifications];
}

#else

- (CDVPlugin*)initWithWebView:(UIWebView*)theWebView{
    NSLog(@"### initWithWebView ");
    if (self=[super initWithWebView:theWebView]) {
        [self initNotifications];
    }
    return self;
}


#endif

-(void)initNotifications {
    NSNotificationCenter *defaultCenter = [NSNotificationCenter defaultCenter];
    [defaultCenter addObserver:self
                      selector:@selector(networkDidReceiveMessage:)
                          name:kJPFNetworkDidReceiveMessageNotification
                        object:nil];
    
    [defaultCenter addObserver:self
                      selector:@selector(networkDidReceiveNotification:)
                          name:kJPushPluginReceiveNotification
                        object:nil];
    
    if (_launchOptions) {
        NSDictionary *userInfo = [_launchOptions
                                  valueForKey:UIApplicationLaunchOptionsRemoteNotificationKey];
        if ([userInfo count] >0) {
            NSError  *error;
            NSData   *jsonData   = [NSJSONSerialization dataWithJSONObject:userInfo options:0 error:&error];
            NSString *jsonString = [[NSString alloc]initWithData:jsonData encoding:NSUTF8StringEncoding];
            if (!error) {
                dispatch_async(dispatch_get_main_queue(), ^{
                    [self.commandDelegate evalJs:[NSString stringWithFormat:@"cordova.fireDocumentEvent('jpush.openNotification',%@)",jsonString]];
                });
                
            }
        }
        
    }
}

#pragma mark- 获得RegistrationID
-(void)getRegistrationID:(CDVInvokedUrlCommand*)command{
    //NSString* registrationID = [JPUSHService registrationID];
    //NSLog(@"### getRegistrationID %@",registrationID);
    [self handleResultWithValue:registrationID command:command];
}

#pragma mark- 设置图标
-(void)setApplicationIconBadgeNumber:(CDVInvokedUrlCommand *)command{
    NSArray *argument = command.arguments;
    if ([argument count] < 1) {
        NSLog(@"setBadge argument error!");
        return;
    }
    NSNumber *badge = [argument objectAtIndex:0];
    [UIApplication sharedApplication].applicationIconBadgeNumber = [badge intValue];
}

-(void)getApplicationIconBadgeNumber:(CDVInvokedUrlCommand *)command {
    NSInteger num = [UIApplication sharedApplication].applicationIconBadgeNumber;
    NSNumber *number = [NSNumber numberWithInteger:num];
    [self handleResultWithValue:number command:command];
}

#pragma mark- 内部方法
+(void)setLaunchOptions:(NSDictionary *)theLaunchOptions{
    _launchOptions = theLaunchOptions;
    
    //Fix #13335
    //[JPUSHService setDebugMode];
    
    [QPushPlugin registerForRemoteNotification];
    
    //read appkey and channel from PushConfig.plist
    NSString *plistPath = [[NSBundle mainBundle] pathForResource:JPushConfigFileName ofType:@"plist"];
    if (plistPath == nil) {
        NSLog(@"error: PushConfig.plist not found");
        assert(0);
    }
    
    NSMutableDictionary *plistData = [[NSMutableDictionary alloc] initWithContentsOfFile:plistPath];
    NSString * appkey       = [plistData valueForKey:JP_APP_KEY];
    NSString * channel      = [plistData valueForKey:JP_APP_CHANNEL];
    NSNumber * isProduction = [plistData valueForKey:JP_APP_ISPRODUCTION];
    NSNumber *isIDFA        = [plistData valueForKey:JP_APP_ISIDFA];
    
    if (!appkey || appkey.length == 0) {
        NSLog(@"error: app key not found in PushConfig.plist ");
        assert(0);
    }
    
    NSString *advertisingId = nil;
    if(isIDFA){
        advertisingId = [[[ASIdentifierManager sharedManager] advertisingIdentifier] UUIDString];
    }
    [JPUSHService setupWithOption:_launchOptions
                           appKey:appkey
                          channel:channel
                 apsForProduction:[isProduction boolValue]
            advertisingIdentifier:advertisingId];
    
}

#pragma mark 将参数返回给js
-(void)handleResultWithValue:(id)value command:(CDVInvokedUrlCommand*)command{
    CDVPluginResult *result = nil;
    CDVCommandStatus status = CDVCommandStatus_OK;
    
    if ([value isKindOfClass:[NSString class]]) {
        value = [value stringByAddingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
    } else if ([value isKindOfClass:[NSNull class]]) {
        value = nil;
    }
    
    if ([value isKindOfClass:[NSObject class]]) {
        result = [CDVPluginResult resultWithStatus:status messageAsString:value];//NSObject 类型都可以
    } else {
        NSLog(@"Cordova callback block returned unrecognized type: %@", NSStringFromClass([value class]));
        result = nil;
    }
    
    if (!result) {
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR];
    }
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

#pragma mark 接收JPush自定义通知
- (void)networkDidReceiveMessage:(NSNotification *)notification {
    if (notification) {
        NSDictionary *userInfo = [notification userInfo];
        //NSLog(@"%@",userInfo);
        
        NSError  *error;
        NSData   *jsonData   = [NSJSONSerialization dataWithJSONObject:userInfo options:0 error:&error];
        NSString *jsonString = [[NSString alloc]initWithData:jsonData encoding:NSUTF8StringEncoding];
        
        //NSLog(@"%@",jsonString);
        
        dispatch_async(dispatch_get_main_queue(), ^{
            
            [self.commandDelegate evalJs:[NSString stringWithFormat:@"cordova.fireDocumentEvent('qpush.receiveMessage',%@)",jsonString]];
        });
    }
}

#pragma mark 接收到APNS通知
-(void)networkDidReceiveNotification:(id)notification{
    
    NSError  *error;
    NSDictionary *userInfo = [notification object];
    
    NSData   *jsonData   = [NSJSONSerialization dataWithJSONObject:userInfo options:0 error:&error];
    NSString *jsonString = [[NSString alloc]initWithData:jsonData encoding:NSUTF8StringEncoding];
    switch ([UIApplication sharedApplication].applicationState) {
        case UIApplicationStateActive:{
            //前台收到
            dispatch_async(dispatch_get_main_queue(), ^{
                [self.commandDelegate evalJs:[NSString stringWithFormat:@"cordova.fireDocumentEvent('qpush.receiveNotification',%@)",jsonString]];
            });
            break;
        }
        case UIApplicationStateInactive:{
            //后台点击
            dispatch_async(dispatch_get_main_queue(), ^{
                [self.commandDelegate evalJs:[NSString stringWithFormat:@"cordova.fireDocumentEvent('qpush.openNotification',%@)",jsonString]];
            });
            break;
        }
        case UIApplicationStateBackground:{
            //后台收到
            dispatch_async(dispatch_get_main_queue(), ^{
                [self.commandDelegate evalJs:[NSString stringWithFormat:@"cordova.fireDocumentEvent('qpush.backgoundNotification',%@)",jsonString]];
            });
            break;
        }
        default:
            //do nothing
            break;
    }
}
@end

