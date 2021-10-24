import React, { useState, useEffect } from "react";
import { Platform } from "react-native";

import { BleManager, Device } from "react-native-ble-plx";
import UiDevice from "../../../types/Bluetooth";
import BluetoothPermission from "./BluetoothPermission.android";

import ListDevices from "./ListDevices";

const getBleManager = () => {
  try {
    const manager = new BleManager();
    return manager;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const manager = getBleManager();

export default function Scanner(): JSX.Element {
  const [permissionGranted, setPermissionGranted] = useState(false);

  const [list, setList] = useState<Device[]>([]);
  const [name, setName] = useState("");

  useEffect(() => {
    console.log("use effect");
    manager?.onStateChange((state) => {
      const subscription = manager?.onStateChange((state) => {
        if (state === "PoweredOn") {
          // this && scanAndConnect();
          subscription.remove();
        }
      }, true);
      return () => subscription.remove();
    });
  }, [manager]);

  useEffect(() => {
    if (Platform.OS === "android") {
      BluetoothPermission({ setPermissionGranted });
    } else if (Platform.OS === "ios") {
      setPermissionGranted(true);
      console.log("granted ios");
    } else if (Platform.OS === "web") {
      setPermissionGranted(true);
      console.log("Permissions for web will be granted on click by the user itself.");
    }
  }, []);

  const clear = () => {
    setList([]);
    manager?.stopDeviceScan();
    setName("");
  };

  const stop = () => {
    manager?.stopDeviceScan();
  };

  const startScan = () => {
    console.log("scanAndConnect");
    manager?.startDeviceScan(null, null, (error, device) => {
      if (error) {
        // Handle error (scanning will be stopped automatically)
        console.error(error);
        return;
      }

      // Check if it is a device you are looking for based on advertisement data
      // or other criteria.
      console.log(device?.name, device?.localName, device?.id);
      const deviceName = device && device.name ? device.name : "";
      const id = device && device.id;
      // const localName = device && device.localName ? device.localName : "";
      const alreadyInList = list.find((data) => data.id === id);
      if (!alreadyInList && device) {
        const newList: Device[] = list;
        newList.push(device);
        setList(newList);
        setName(deviceName);
      }

      /* if (device?.localName === 'LED') {
                 setName(name);
                 // Stop scanning as it's not necessary if you are scanning for one device.
                 manager?.stopDeviceScan();

                 // Proceed with connection.
               } */
    });
  };

  return (
    <ListDevices
      deviceList={list as UiDevice[]}
      lastFoundDevice={name}
      startScan={startScan}
      stopScan={stop}
      clearList={clear}
      permissionGranted={permissionGranted}
    />
  );
}
