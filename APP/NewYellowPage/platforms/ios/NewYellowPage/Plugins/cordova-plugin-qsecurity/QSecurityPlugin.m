//
//  QSecurityPlugin.m
//  HelloCordova
//
//  Created by John on 6/27/16.
//
//

#import <Foundation/Foundation.h>
#import "QSecurityPlugin.h"

#import <Cordova/CDV.h>

@interface CDVWhitelistConfigParser : NSObject <NSXMLParserDelegate> {}

@property (nonatomic, strong) NSMutableArray* whitelistHosts;

@end

@implementation CDVWhitelistConfigParser

@synthesize whitelistHosts;


- (id)init
{
    self = [super init];
    if (self != nil) {
        self.whitelistHosts = [[NSMutableArray alloc] initWithCapacity:30];
        [self.whitelistHosts addObject:@"file:///*"];
        [self.whitelistHosts addObject:@"content:///*"];
        [self.whitelistHosts addObject:@"data:///*"];
        [self.whitelistHosts addObject:@"itms-services:///*"];
    }
    return self;
}

- (void)parser:(NSXMLParser*)parser didStartElement:(NSString*)elementName namespaceURI:(NSString*)namespaceURI qualifiedName:(NSString*)qualifiedName attributes:(NSDictionary*)attributeDict
{
    if ([elementName isEqualToString:@"access"]) {
        [whitelistHosts addObject:attributeDict[@"origin"]];
    }
}

- (void)parser:(NSXMLParser*)parser didEndElement:(NSString*)elementName namespaceURI:(NSString*)namespaceURI qualifiedName:(NSString*)qualifiedName
{
}

- (void)parser:(NSXMLParser*)parser parseErrorOccurred:(NSError*)parseError
{
    NSAssert(NO, @"config.xml parse error line %ld col %ld", (long)[parser lineNumber], (long)[parser columnNumber]);
}


@end

@interface QSecurityPlugin ()

@property (nonatomic, readwrite) NSMutableArray* allowIntents;
@property (nonatomic, readwrite) NSMutableArray* allowNavigations;
@property (nonatomic, readwrite) CDVWhitelist* allowIntentsWhitelist;
@property (nonatomic, readwrite) CDVWhitelist* allowNavigationsWhitelist;

@end

@implementation QSecurityPlugin

#pragma mark NSXMLParserDelegate

- (void)parser:(NSXMLParser*)parser didStartElement:(NSString*)elementName namespaceURI:(NSString*)namespaceURI qualifiedName:(NSString*)qualifiedName attributes:(NSDictionary*)attributeDict
{
    if ([elementName isEqualToString:@"allow-navigation"]) {
        [self.allowNavigations addObject:attributeDict[@"href"]];
    }
    if ([elementName isEqualToString:@"allow-intent"]) {
        [self.allowIntents addObject:attributeDict[@"href"]];
    }
}

- (void)parserDidStartDocument:(NSXMLParser*)parser
{
    // file: url <allow-navigations> are added by default
    self.allowNavigations = [[NSMutableArray alloc] initWithArray:@[ @"file://" ]];
    // no intents are added by default
    self.allowIntents = [[NSMutableArray alloc] init];
}

- (void)parserDidEndDocument:(NSXMLParser*)parser
{
    self.allowIntentsWhitelist = [[CDVWhitelist alloc] initWithArray:self.allowIntents];
    self.allowNavigationsWhitelist = [[CDVWhitelist alloc] initWithArray:self.allowNavigations];
}

- (void)parser:(NSXMLParser*)parser parseErrorOccurred:(NSError*)parseError
{
    NSAssert(NO, @"config.xml parse error line %ld col %ld", (long)[parser lineNumber], (long)[parser columnNumber]);
}

#pragma mark CDVPlugin

- (void)pluginInitialize
{
    if ([self.viewController isKindOfClass:[CDVViewController class]]) {
        [(CDVViewController*)self.viewController parseSettingsWithParser:self];
    }
    //初始化Level
    Level = 1;
}

- (BOOL)shouldOverrideLoadWithRequest:(NSURLRequest*)request navigationType:(UIWebViewNavigationType)navigationType
{
    NSString* allowIntents_whitelistRejectionFormatString = @"ERROR External navigation rejected - <allow-intent> not set for url='%@'";
    NSString* allowNavigations_whitelistRejectionFormatString = @"ERROR Internal navigation rejected - <allow-navigation> not set for url='%@'";
    
    NSURL* url = [request URL];
    BOOL allowNavigationsPass = NO;
    NSMutableArray* errorLogs = [NSMutableArray array];
    
    switch (navigationType) {
        case UIWebViewNavigationTypeOther:
        case UIWebViewNavigationTypeLinkClicked:
            // Note that the rejection strings will *only* print if
            // it's a link click (and url is not whitelisted by <allow-*>)
            if ([self.allowIntentsWhitelist URLIsAllowed:url logFailure:NO]) {
                // the url *is* in a <allow-intent> tag, push to the system
                [[UIApplication sharedApplication] openURL:url];
                return NO;
            } else {
                [errorLogs addObject:[NSString stringWithFormat:allowIntents_whitelistRejectionFormatString, [url absoluteString]]];
            }
            // fall through, to check whether you can load this in the webview
        default:
            // check whether we can internally navigate to this url
            allowNavigationsPass = [self.allowNavigationsWhitelist URLIsAllowed:url logFailure:NO];
            // log all failures only when this last filter fails
            if (!allowNavigationsPass){
                [errorLogs addObject:[NSString stringWithFormat:allowNavigations_whitelistRejectionFormatString, [url absoluteString]]];
                
                // this is the last filter and it failed, now print out all previous error logs
                for (NSString* errorLog in errorLogs) {
                    NSLog(@"%@", errorLog);
                }
            }
            
            return allowNavigationsPass;
    }
}

//设置WhiteList和Level
- (void)setWhiteList:(CDVInvokedUrlCommand *)command
{
    CDVPluginResult* pluginResult = nil;
    if (command.arguments.count > 0) {
        //(1)解析JSON，分解出level和 （intent|navigation|request）
        NSDictionary *dic = command.arguments[0];
        NSLog(@"%@", dic);
        
        //(2)保存level
        NSString *level = [dic objectForKey:@"level"];
        [self setLevel:level];
        
        //(3)保存navigation
        NSMutableArray *navigationsArray = [dic objectForKey:@"Navigations"];
        [self setNavigationsWhitelist:navigationsArray];
        
        //(4)保存intent
        NSMutableArray *intentArray = [dic objectForKey:@"Intents"];
        [self setIntentWhitelist:intentArray];
        
        //(5)保存request
        NSMutableArray *requestsArray = [dic objectForKey:@"Requests"];
        [self setWebReuestWhitelist:requestsArray];
    }
    
    //返回值
    pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

//设置level
-(void)setLevel:(NSString*) currentLevel
{
    int value = [currentLevel intValue];
    switch (value) {
        case 1:
            break;
        case 2:
            break;
        case 3:
            break;
        default:
            value=1;
            break;
    }
    Level = value;
}

//设置Navigation
- (void)setNavigationsWhitelist:(NSArray*)allowNavigationsWhitelist
{
    self.allowNavigations = [[NSMutableArray alloc] init];
    NSMutableArray *navList = [[NSMutableArray alloc] initWithCapacity:(allowNavigationsWhitelist.count+1)];
    for (NSString* nav in allowNavigationsWhitelist) {
        [navList addObject:nav];
    }
    self.allowNavigationsWhitelist = [[CDVWhitelist alloc] initWithArray:navList];
}

//设置Intent
- (void)setIntentWhitelist:(NSArray*)allowNavigationsWhitelist
{
    self.allowIntents = [[NSMutableArray alloc] init];
    NSMutableArray *intentList = [[NSMutableArray alloc] initWithCapacity:(allowNavigationsWhitelist.count+1)];
    for (NSString* intent in allowNavigationsWhitelist) {
        [intentList addObject:intent];
    }
    self.allowIntentsWhitelist = [[CDVWhitelist alloc] initWithArray:intentList];
}

//设置Reuest
- (void)setWebReuestWhitelist:(NSArray*)allowRequestWhitelist
{
    //读取plist
    NSString *plistPath = [[NSBundle mainBundle] pathForResource:@"Info" ofType:@"plist"];
    NSMutableDictionary *data = [[NSMutableDictionary alloc] initWithContentsOfFile:plistPath];
    
    //重置"NSAppTransportSecurity”节点
    if ([data objectForKey:@"NSAppTransportSecurity"]) {
        [data removeObjectForKey:@"NSAppTransportSecurity"];
    }
    
    //允许的策略
    NSMutableDictionary *dicSetting = [[NSMutableDictionary alloc] initWithCapacity:5];
    [dicSetting setValue:@YES forKey:@"NSExceptionAllowsInsecureHTTPLoads"];
    [dicSetting setValue:@YES forKey:@"NSThirdPartyExceptionAllowsInsecureHTTPLoads"];
    
    [dicSetting setValue:@"TLSv1.0" forKey:@"NSExceptionMinimumTLSVersion"];
    [dicSetting setValue:@"1.0" forKey:@"NSThirdPartyExceptionMinimumTLSVersion"];
    
    [dicSetting setValue:@NO forKey:@"NSExceptionRequiresForwardSecrecy"];
    [dicSetting setValue:@NO forKey:@"NSThirdPartyExceptionRequiresForwardSecrecy"];
    
    
    [dicSetting setValue:@YES forKey:@"NSIncludesSubdomains"];
    
    //Exception Domains
    NSMutableDictionary *dicExpDomains = [[NSMutableDictionary alloc] init];
    
    //Exception Domain
    NSMutableDictionary *dicDomain = [[NSMutableDictionary alloc] init];
    for (NSString* request in allowRequestWhitelist) {
        [dicDomain setValue: dicSetting forKey:request];
    }
    [dicExpDomains setValue:dicDomain forKey:@"NSExceptionDomains"];
    
    //暂时开放HTTP
    [dicExpDomains setValue:@YES forKey:@"NSAllowsArbitraryLoads"];
    
    //添加到plist－dic
    [data setObject:dicExpDomains forKey:@"NSAppTransportSecurity"];
    
    //写入plist
    [data writeToFile:plistPath atomically:YES];
    
    //log
    NSMutableDictionary *data1 = [[NSMutableDictionary alloc] initWithContentsOfFile:plistPath];
    NSLog(@"%@", data1);
}

//改变level
- (void)changeLevel:(CDVInvokedUrlCommand *)command
{
    CDVPluginResult* pluginResult = nil;
    if (command.arguments.count > 0) {
        int value = [command.arguments[0] intValue];
        switch (value) {
            case 1:
                break;
            case 2:
                break;
            case 3:
                break;
            default:
                value=1;
                break;
        }
        Level = value;
    }
    pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

//向Web端发送level
- (void)resumeCheckLevel:(CDVInvokedUrlCommand *)command
{
    int value = Level;
    switch (value) {
        case 1:
            break;
        case 2:
            break;
        case 3:
            break;
        default:
            value=1;
            break;
    }
    Level = value;
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsNSInteger:Level];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}
@end