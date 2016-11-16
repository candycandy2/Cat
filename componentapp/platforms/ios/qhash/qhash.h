//
//  qhash.h
//  qhash
//
//  Created by alan on 15/11/2016.
//
//
//Sample
//NSLog(@"timeHash %@",[qhash timeHash:@"swexuc453refebraXecujeruBraqAc4e"]);

#import <Foundation/Foundation.h>

@interface qhash : NSObject

+ (NSString*)timeHash:(NSString*)key;

@end
