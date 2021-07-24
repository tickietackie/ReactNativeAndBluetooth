//
//  Counter.m
//  bllibrary
//
//  Created by Kai Kuklok on 27.06.21.
//

// Counter.m
#import "React/RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(Counter, NSObject)
RCT_EXTERN_METHOD(increment)
RCT_EXTERN_METHOD(getCount: (RCTResponseSenderBlock)callback)
@end
