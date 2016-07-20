//
//  QLoginPlugin.m
//  HelloCordova
//
//  Created by qisda on 16/7/6.
//
//

#import "QLoginPlugin.h"

@implementation QLoginXMLParser

- (void)parser:(NSXMLParser*)parser didStartElement:(NSString*)elementName namespaceURI:(NSString*)namespaceURI qualifiedName:(NSString*)qualifiedName attributes:(NSDictionary*)attributeDict
{
    if ([elementName isEqualToString:@"serverUrl"]) {
        self.ConfigedUrl = attributeDict[@"href"];
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

@implementation QLoginPlugin

- (void) openCertificationPage:(CDVInvokedUrlCommand *)command
{
    //解析XML，获得Url
    NSString* path = @"config.xml";
    path = [[NSBundle mainBundle] pathForResource:path ofType:nil];
    NSURL* fileUrl = [NSURL fileURLWithPath:path];
    QLoginXMLParser *qp = [[QLoginXMLParser alloc] init];
    NSXMLParser* ps = [[NSXMLParser alloc] initWithContentsOfURL:fileUrl];
    ps.delegate = qp;
    [ps parse];
    
    self.CertificationPageUrl = qp.ConfigedUrl;
    if (self.CertificationPageUrl) {
        //获得屏幕的尺寸
        CGRect screenBounds = [[UIScreen mainScreen] bounds];
        screenBounds.origin.y = screenBounds.origin.y;
    
        if(!_wkView){
            WKWebViewConfiguration *wvConfig = [[WKWebViewConfiguration alloc] init];
            [wvConfig.userContentController addScriptMessageHandler:self name:@"saveLoginResult"];
            [wvConfig.userContentController addScriptMessageHandler:self name:@"hideCertificateContainer"];
            _wkView = [[WKWebView alloc] initWithFrame:screenBounds configuration:wvConfig];
            _wkView.tag = 999;
        }
        NSURL *url = [NSURL URLWithString:self.CertificationPageUrl];
        NSURLRequest *request = [[NSURLRequest alloc] initWithURL:url];
        [_wkView loadRequest:request];
        [self.webView.superview addSubview:_wkView];
    }
}

//WKUIWebview 处理注册js调用
- (void)userContentController:(WKUserContentController *)userContentController didReceiveScriptMessage:(WKScriptMessage *)message
{
    NSLog(@"JS Method:%@，args:%@",message.name,message.body);
    if ([message.name  isEqual: @"saveLoginResult"]) {
        [self saveLoginResult:message];
    }
    if ([message.name  isEqual: @"hideCertificateContainer"]) {
        [self hideCertificateContainer:message];
    }
}

//保存登录结果
- (void) saveLoginResult:(WKScriptMessage *)message
{
    if (message.body) {
        NSDictionary *data = message.body;
        self.CertificationResult = data.description;
    }
}

//隐藏WKUIWebview
-(void) hideCertificateContainer:(WKScriptMessage *)message
{
    if (_wkView) {
        for (UIView *uv in self.webView.superview.subviews) {
            if (uv.tag == 999) {
                [uv removeFromSuperview];
                break;
            }
        }
    }
}

//调用打开认证页方法
- (void)handleOpenURL:(NSNotification*)notification{
    NSLog(@"%@",notification.object);
    [self openCertificationPage:nil];
}
@end


