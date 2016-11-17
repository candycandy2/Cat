//
//  qhash.m
//  qhash
//
//  Created by alan on 15/11/2016.
//
//
//ex: 2016/5/31 14:49:24 換算為 unix time 為1464677364
//Base64( HMAC-SHA256( SignatureTime , YourAppSecretKey ) )
//
//Javascript sample:
//var QPlaySecretKey = "swexuc453refebraXecujeruBraqAc4e";
//var signatureTime = Math.round(new Date().getTime()/1000);
//var hash = CryptoJS.HmacSHA256(signatureTime.toString(), QPlaySecretKey);
//var signatureInBase64 = CryptoJS.enc.Base64.stringify(hash);

#import "qhash.h"
#import <CommonCrypto/CommonHMAC.h>

@implementation qhash

+ (NSString*)base64forData:(NSData*)theData {
    const uint8_t* input = (const uint8_t*)[theData bytes];
    NSInteger length = [theData length];
    
    static char table[] = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    
    NSMutableData* data = [NSMutableData dataWithLength:((length + 2) / 3) * 4];
    uint8_t* output = (uint8_t*)data.mutableBytes;
    
    NSInteger i;
    for (i=0; i < length; i += 3) {
        NSInteger value = 0;
        NSInteger j;
        for (j = i; j < (i + 3); j++) {
            value <<= 8;
            
            if (j < length) {  value |= (0xFF & input[j]);  }  }  NSInteger theIndex = (i / 3) * 4;  output[theIndex + 0] = table[(value >> 18) & 0x3F];
        output[theIndex + 1] = table[(value >> 12) & 0x3F];
        output[theIndex + 2] = (i + 1) < length ? table[(value >> 6) & 0x3F] : '=';
        output[theIndex + 3] = (i + 2) < length ? table[(value >> 0) & 0x3F] : '=';
    }
    
    return [[NSString alloc] initWithData:data encoding:NSASCIIStringEncoding];
}

+ (NSString*)timeHash:(NSString*)key {
    NSLog(@"timeHash");
    
//    NSDateComponents *comps = [[NSDateComponents alloc] init];
//    [comps setDay:31];
//    [comps setMonth:5];
//    [comps setYear:2016];
//    [comps setHour:14];
//    [comps setMinute:49];
//    [comps setSecond:24];
//    NSDate *currentDate = [[NSCalendar currentCalendar] dateFromComponents:comps];
    NSDate *now = [NSDate date];
    double secsUtc1970 = [now timeIntervalSince1970];
    NSLog(@"%0.0f", secsUtc1970);//2016-11-16 11:36:53.212197 HelloCordova[5738:1236056] timeHash 1464677364.000000
    NSString *data = [NSString stringWithFormat:@"%f", secsUtc1970];
    
    const char *cKey = [key cStringUsingEncoding:NSASCIIStringEncoding];
    const char *cData = [data cStringUsingEncoding:NSASCIIStringEncoding];
    unsigned char cHMAC[CC_SHA256_DIGEST_LENGTH];
    CCHmac(kCCHmacAlgSHA256, cKey, strlen(cKey), cData, strlen(cData), cHMAC);
    NSData *hash = [[NSData alloc] initWithBytes:cHMAC length:sizeof(cHMAC)];
    
    NSLog(@"%@", hash);
    
    NSString* s = [qhash base64forData:hash];
    NSLog(@"%@", s);
    
    return s;
}

@end
