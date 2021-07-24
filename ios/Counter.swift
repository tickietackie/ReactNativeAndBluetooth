//
//  Counter.swift
//  bllibrary
//
//  Created by Kai Kuklok on 27.06.21.
//

#import "React/RCTBridgeModule.h"

import Foundation


@objc(Counter)
class Counter: NSObject {
  
  @objc
    func constantsToExport() -> [AnyHashable : Any]! {
      return ["initialCount": 0]
    }
  
  private var count = 0
    @objc
    func increment() {
      count += 1
      print("count is \(count)")
    }
  
  @objc
    func getCount(_ callback: RCTResponseSenderBlock) {
      callback([count])
    }
}
