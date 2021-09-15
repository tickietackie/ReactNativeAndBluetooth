//
//  BluetoothManager.swift
//  bllibrary
//
//  Created by Kai Kuklok on 31.08.21.
//


import Foundation
import CoreBluetooth

@objc(BluetoothManager) class BluetoothManager: NSObject, ObservableObject, CBPeripheralDelegate, CBCentralManagerDelegate {
  
  //required to tell if the modules need the main thread
  @objc static func requiresMainQueueSetup() -> Bool {return true}
  
    // Properties
    private var manager: CBCentralManager!
    private var peripheral: CBPeripheral!
  
  struct JsPeripheral {
    var name: String;
    var id: String;
  }
    
  @Published var peripherals: [Dictionary<String, String>] = []

  @objc
    func start() {
        print("Create central manager")
        clear()
        manager = CBCentralManager(delegate: self, queue: nil)
    }
    
  @objc
    func clear() {
        print("Clear list")
      peripherals = [];
    }
  
  @objc
    func stop() {
        print("Stop scanning")
        manager.stopScan()
    }
  
  @objc
    func getPeripherals(_ callback: RCTResponseSenderBlock) {
      callback([peripherals])
    }
  
    func connect(_ peripheral: CBPeripheral) {
        manager.stopScan()
        peripheral.delegate = self
        manager.connect(peripheral)
    }
    
    func centralManagerDidUpdateState(_ central: CBCentralManager) {
        print("Central state update")
        if central.state != .poweredOn {
            print("Central is not powered on")
        } else {
            print("Central starts scanning for devices");
            manager.scanForPeripherals(withServices: nil, options: nil)
            /*centralManager.scanForPeripherals(withServices: [ParticlePeripheral.particleLEDServiceUUID],
                                              options: [CBCentralManagerScanOptionAllowDuplicatesKey : true])*/
        }
    }
    
    func centralManager(_ central: CBCentralManager, didDiscover peripheral: CBPeripheral, advertisementData: [String : Any], rssi RSSI: NSNumber) {
        //let jsPeripheral = JsPeripheral(name: peripheral.name ?? "", id: peripheral.identifier.uuidString)
        let jsPeripheral = ["name": peripheral.name ?? "", "id": peripheral.identifier.uuidString]
        print("Name: \(peripheral.name ?? nil)")
      let result = peripherals.first{ $0["id"] == jsPeripheral["id"]  }
        if (result == nil) {
            print("Add \(peripheral.name ?? nil) to array as identifier \(peripheral.identifier ?? nil) is not in array")
            peripherals.append(jsPeripheral);
        }
        else {
            print("Peripheral with name \(peripheral.name ?? nil) and identifier \(peripheral.identifier ?? nil) already in array")
        }
    }
    
    static func getStateAsString(cbPeripheralState: CBPeripheralState) -> String {
        switch cbPeripheralState {
            case .connected:
                    return "Connected"
            case .connecting:
                return "Connecting"
            case .disconnected:
                return "disconnected"
            case .disconnecting:
                return "disconnecting"
            @unknown default:
                return "unknown"
        }
            
    }
    
    func peripheral(_ peripheral: CBPeripheral,
                 didReadRSSI RSSI: NSNumber,
                 error: Error?) {
        print(RSSI)
    }
    
    func peripheral(_ peripheral: CBPeripheral, didDiscoverServices error: Error?) {
        
        if let servicePeripherals = peripheral.services as [CBService]?
        {
            for service in servicePeripherals {
                peripheral.discoverCharacteristics(nil, for: service)
            }
        }
    }
    
    func peripheral(_ peripheral: CBPeripheral, didDiscoverCharacteristicsFor service: CBService, error: Error?) {

        if let characteristics = service.characteristics as [CBCharacteristic]? {
            for cc in characteristics {
                print(cc.value)
            }
        }
    }
    
    func peripheral(_ peripheral: CBPeripheral, didUpdateValueFor characteristic: CBCharacteristic, error: Error?) {
        //test
    }
 
 
    
    // Handles the result of the scan
    /*func centralManager(_ central: CBCentralManager, didDiscover peripheral: CBPeripheral, advertisementData: [String : Any], rssi RSSI: NSNumber) {

        // We've found it so stop scan
        self.centralManager.stopScan()

        // Copy the peripheral instance
        self.peripheral = peripheral
        self.peripheral.delegate = self

        // Connect!
        self.centralManager.connect(self.peripheral, options: nil)

    }
    
    // The handler if we do connect succesfully
    func centralManager(_ central: CBCentralManager, didConnect peripheral: CBPeripheral) {
        if peripheral == self.peripheral {
            print("Connected to your Particle Board")
            peripheral.discoverServices([ParticlePeripheral.particleLEDServiceUUID])
        }
    }
    
    
    // Handles discovery event
    func peripheral(_ peripheral: CBPeripheral, didDiscoverServices error: Error?) {
        if let services = peripheral.services {
            for service in services {
                if service.uuid == ParticlePeripheral.particleLEDServiceUUID {
                    print("LED service found")
                    //Now kick off discovery of characteristics
                    peripheral.discoverCharacteristics([ParticlePeripheral.redLEDCharacteristicUUID,
                                                             ParticlePeripheral.greenLEDCharacteristicUUID,
                                                             ParticlePeripheral.blueLEDCharacteristicUUID], for: service)
                    return
                }
            }
        }
    }
    
    
    // Handling discovery of characteristics
    func peripheral(_ peripheral: CBPeripheral, didDiscoverCharacteristicsFor service: CBService, error: Error?) {
        if let characteristics = service.characteristics {
            for characteristic in characteristics {
                if characteristic.uuid == ParticlePeripheral.redLEDCharacteristicUUID {
                    print("Red LED characteristic found")
                } else if characteristic.uuid == ParticlePeripheral.greenLEDCharacteristicUUID {
                    print("Green LED characteristic found")
                } else if characteristic.uuid == ParticlePeripheral.blueLEDCharacteristicUUID {
                    print("Blue LED characteristic found");
                }
            }
        }
    }*/
}

