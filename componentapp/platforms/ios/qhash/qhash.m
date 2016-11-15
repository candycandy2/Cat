//
//  qhash.m
//  qhash
//
//  Created by alan on 15/11/2016.
//
//
//ex: 2016/5/31 14:49:24 換算為 unix time 為
//1464677364
//1946157056

#import "qhash.h"

@implementation qhash

+ (NSString*)timeHash:(NSString*)appkey {
    NSLog(@"timeHash");
    
    NSDateComponents *comps = [[NSDateComponents alloc] init];
    [comps setDay:31];
    [comps setMonth:5];
    [comps setYear:2016];
    [comps setHour:14];
    [comps setMinute:49];
    [comps setSecond:24];
    NSDate *currentDate = [[NSCalendar currentCalendar] dateFromComponents:comps];
    double secsUtc1970 = [currentDate timeIntervalSince1970];
    
    NSLog(@"timeHash %d", secsUtc1970);
    
    NSDate* date1 = [NSDate dateWithTimeIntervalSince1970:1464677364];
    secsUtc1970 = [date1 timeIntervalSince1970];
    
    NSLog(@"timeHash date1 %d", secsUtc1970);
    
    double unixTimeStamp =50331648;
    NSTimeInterval timeInterval=unixTimeStamp/1000;
    NSDate *date = [NSDate dateWithTimeIntervalSince1970:timeInterval];
    NSDateFormatter *dateformatter=[[NSDateFormatter alloc]init];
    [dateformatter setLocale:[NSLocale currentLocale]];
    [dateformatter setDateFormat:@"dd-MM-yyyy"];
    NSString *dateString=[dateformatter stringFromDate:date];
    NSLog(@"timeHash %@", dateString);
    
    
    NSTimeZone *timeZone = [NSTimeZone defaultTimeZone];
    // or Timezone with specific name like
    // [NSTimeZone timeZoneWithName:@"Europe/Riga"] (see link below)
    NSDateFormatter *dateFormatter = [[NSDateFormatter alloc] init];
    [dateFormatter setTimeZone:timeZone];
    [dateFormatter setDateFormat:@"yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"];
    NSString *localDateString = [dateFormatter stringFromDate:currentDate];
    
    return appkey;
}

@end
