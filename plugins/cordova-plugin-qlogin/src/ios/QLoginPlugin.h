
#import <Cordova/CDV.h>
#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import <WebKit/WebKit.h>


#define QLOGIN_CONFIG_ERROR @"Certification page url is missing !"

//---------------XML解析------------------
@interface QLoginXMLParser : NSObject<NSXMLParserDelegate>

@property (nonatomic, weak) NSString* ConfigedUrl;//配置的认证页面地址

@end

//---------------QLogin Plugin------------------
@interface QLoginPlugin:CDVPlugin<WKScriptMessageHandler>

@property (nonatomic, copy) NSString* CertificationPageUrl;//认证页地址
@property (nonatomic,copy) NSString* CertificationResult;//认证结果
@property (nonatomic, strong) WKWebView* wkView;//认证页容器
@property (nonatomic, copy) NSString* SourceAPP;//跳转来源APP
@property (nonatomic,copy) NSString* CallBackJSOnSuccess;//认证完成后回调UIWebView方法

- (void) openCertificationPage:(CDVInvokedUrlCommand *)command;//打开认证页
- (void) saveLoginResult:(WKScriptMessage *)message;//保存登录认证结果->关闭认证页->跳转回原APP
- (void) getLoginData:(CDVInvokedUrlCommand *)command;//获得认证结果

@end