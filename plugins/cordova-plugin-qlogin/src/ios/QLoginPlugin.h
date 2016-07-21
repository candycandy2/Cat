
#import <Cordova/CDV.h>
#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import <WebKit/WebKit.h>

//---------------XML解析------------------
@interface QLoginXMLParser : NSObject<NSXMLParserDelegate>

@property (nonatomic, weak) NSString* ConfigedUrl;//配置的认证页面地址

@end

//---------------QLogin Plugin------------------
@interface QLoginPlugin:CDVPlugin<WKScriptMessageHandler>

@property (nonatomic, weak) NSString* CertificationPageUrl;//认证页地址
@property (nonatomic, weak) NSString* CertificationResult;//认证结果
@property (atomic, strong) WKWebView* wkView;//认证页容器
@property (nonatomic, weak) NSString* SourceAPP;//跳转来源APP

- (void) openCertificationPage:(CDVInvokedUrlCommand *)command;//打开认证页
- (void) saveLoginResult:(WKScriptMessage *)message;//保存登录认证结果->关闭认证页->跳转回原APP

@end