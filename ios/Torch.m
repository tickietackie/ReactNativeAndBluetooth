//
//  Torch.m
//  bllibrary
//
//  Created by Kai Kuklok on 27.06.21.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
@interface RCT_EXTERN_MODULE(Torch,NSObject)
RCT_EXTERN_METHOD(turnOn)
RCT_EXTERN_METHOD(turnOff)
RCT_EXTERN_METHOD(getTorchStatus: (RCTResponseSenderBlock)callback)
@end
