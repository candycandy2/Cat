/*
 Licensed to the Apache Software Foundation (ASF) under one
 or more contributor license agreements.  See the NOTICE file
 distributed with this work for additional information
 regarding copyright ownership.  The ASF licenses this file
 to you under the Apache License, Version 2.0 (the
 "License"); you may not use this file except in compliance
 with the License.  You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an
 "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, either express or implied.  See the License for the
 specific language governing permissions and limitations
 under the License.
 */

//
//  AppDelegate.m
//  HelloCordova
//
//  Created by ___FULLUSERNAME___ on ___DATE___.
//  Copyright ___ORGANIZATIONNAME___ ___YEAR___. All rights reserved.
//

#import "AppDelegate.h"
#import "MainViewController.h"

@interface AppDelegate ()
@property (nonatomic, strong) NSURL *launchedURL;
@end

@implementation AppDelegate

- (BOOL)application:(UIApplication*)application didFinishLaunchingWithOptions:(NSDictionary*)launchOptions
{
    self.launchedURL = [launchOptions objectForKey:UIApplicationLaunchOptionsURLKey];

    self.viewController = [[MainViewController alloc] init];
    return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (void)applicationDidBecomeActive:(UIApplication *)application
{
    if (self.launchedURL) {
        [self openLink:self.launchedURL];
        self.launchedURL = nil;
    }
}

- (BOOL)  application:(UIApplication *)application
                openURL:(NSURL *)url
                sourceApplication:(NSString *)sourceApplication//@"io.cordova.hellocordova"
                annotation:(id)annotation
{
    //NSString *bundleIdentifier = [[NSBundle mainBundle] bundleIdentifier];
    //if([bundleIdentifier isEqualToString:sourceApplication] == 1)
    //    return false;
    
    NSLog(@"url recieved: %@", url);//qplay://isLogin?scheme=benqfacebook
    NSLog(@"query string: %@", [url query]);//scheme=benqfacebook
    NSLog(@"host: %@", [url host]);//host: isLogin
    NSLog(@"url path: %@", [url path]);//url path:
    NSDictionary *dict = [self parseQueryString:[url query]];
    NSLog(@"query dict: %@", dict);

    //NSString *appscheme = self.viewController.appURLScheme;//qplay:
    NSString *session = self.viewController.session;
    if ([[url host] isEqualToString:@"isLogin"] == 1 && session != nil) {
        NSString *urlString = [NSString stringWithFormat: @"%@://session=%@", dict[@"scheme"],session];
        NSURL *callbackUrl = [NSURL URLWithString:[urlString stringByAddingPercentEscapesUsingEncoding:NSUTF8StringEncoding]];
        //check has session
        return [self openLink:callbackUrl];
    }
    return false;
}

- (BOOL)openLink:(NSURL *)urlLink
{
    return [[UIApplication sharedApplication] openURL:urlLink];
}

- (NSDictionary *)parseQueryString:(NSString *)query {
    NSMutableDictionary *dict = [[NSMutableDictionary alloc] initWithCapacity:6] ;
    NSArray *pairs = [query componentsSeparatedByString:@"&"];

    for (NSString *pair in pairs) {
        NSArray *elements = [pair componentsSeparatedByString:@"="];
        NSString *key = [[elements objectAtIndex:0] stringByReplacingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
        NSString *val = [[elements objectAtIndex:1] stringByReplacingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
        NSLog(@"elements: %@", elements);
        NSLog(@"%@ & %@", key, val);

        [dict setObject:val forKey:key];
    }
    return dict;
}

- (IBAction)getTest:(id)sender {
    //for test only...scheme://host/path?query
    [[UIApplication sharedApplication] openURL:[NSURL URLWithString:@"qplay://isLogin?scheme=qplaytest"]];
    //qplay://isLogin?scheme=qplaytest
    //qplaytest://session=qplaytestsession
}

@end
