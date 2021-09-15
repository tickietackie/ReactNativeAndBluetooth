//
//  BluetoothManager.m
//  bllibrary
//
//  Created by Kai Kuklok on 31.08.21.
//


#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
@interface RCT_EXTERN_MODULE(BluetoothManager,NSObject)
RCT_EXTERN_METHOD(start)
RCT_EXTERN_METHOD(stop)
RCT_EXTERN_METHOD(clear)
RCT_EXTERN_METHOD(getPeripherals: (RCTResponseSenderBlock)callback)
@end
