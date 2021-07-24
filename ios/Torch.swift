//
//  Torch.swift
//  bllibrary
//
//  Created by Kai Kuklok on 27.06.21.
//


//#import "React/RCTBridgeModule.h"
import Foundation

@objc(Torch) class Torch: NSObject {
  @objc static func requiresMainQueueSetup() -> Bool {return true}
  
  @objc static var isOn = false
  
  @objc func turnOn() {
    Torch.isOn = true
  }
  @objc func turnOff() {
    Torch.isOn = false
  }
  @objc func getTorchStatus(_ callback: RCTResponseSenderBlock) {
    callback([NSNull(), Torch.isOn])
  }
}
