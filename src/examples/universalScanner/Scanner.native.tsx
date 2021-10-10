/**
 * Sample BLE React Native App
 *
 * @format
 * @flow strict-local
 */

import React, { useState, useEffect } from "react";

import { BleManager, Device } from "react-native-ble-plx";
import UiDevice from "../../../types/Bluetooth";

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
  const [list, setList] = useState<Device[]>([]);
  const [name, setName] = useState("test");
  // const [permissionGranted, setPermissionGranted] = useState(true);

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

  /* const getPermissionOnAndroid = async () => {
     const granted = await PermissionsAndroid.request(
       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
       {
         title: "You need to allow location services to run this ...",
         message: "This is mandatory",
         buttonNeutral: "Ask Me Later",
         buttonNegative: "I don't care",
         buttonPositive: "Ok"
       }
     );
     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
       console.log("Permission granted");
       setPermissionGranted(true);
     } else {
       console.log("permission denied");
       setPermissionGranted(false);
     }
   };

   React.useEffect(() => {
     if (Platform.OS === "android") {
       (async () => {
         await getPermissionOnAndroid();
       })();
     }
   }, []); */

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
      permissionGranted
    />
  );
}
