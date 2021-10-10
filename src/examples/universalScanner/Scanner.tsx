/**
 * Sample BLE React Native App
 *
 * @format
 * @flow strict-local
 */

import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";

import { useNavigation } from "@react-navigation/native";

import { BleManager, Device } from "react-native-ble-plx";
import UiDevice from "../../../types/Bluetooth";

import ListDevices from "./ListDevices";

export default function Scanner(): JSX.Element {
  const [list, setList] = useState<UiDevice[]>([]);
  const [name, setName] = useState("");
  const [scan, setScan] = useState<any>(null);

  const clear = () => {
    scan?.stop();
    setScan(null);
    setList([]);
    setName("");
  };

  const stop = () => {
    try {
      console.log("Stopping scan...");
      scan?.stop();
      setScan(null);
      console.log(`Stopped.  scan.active = ${scan.active}`);
    } catch (error) {
      console.log(error);
    }
    // setIsLoading(false);
  };

  const startScan = async () => {
    try {
      const nav: any = navigator;
      if (!nav.bluetooth) {
        alert("Bluetooth is not supported.");
        return;
      }
      try {
        // console.log(`Requesting Bluetooth Scan with options: ${JSON.stringify(options)}`);
        const awaitedScan = await (navigator as any).bluetooth.requestLEScan({
          acceptAllAdvertisements: true
        });

        setScan(awaitedScan);

        console.log("Scan started with:");
        console.log(` acceptAllAdvertisements: ${awaitedScan.acceptAllAdvertisements}`);
        console.log(` active: ${awaitedScan.active}`);
        console.log(` keepRepeatedDevices: ${awaitedScan.keepRepeatedDevices}`);
        console.log(` filters: ${JSON.stringify(awaitedScan.filters)}`);

        (navigator as any).bluetooth.addEventListener("advertisementreceived", (event: any) => {
          const newDevice: UiDevice = {
            id: event.device.id,
            name: event.device.name ? event.device.name : "Unamed",
            txPowerLevel: event.txPower,
            rssi: event.rssi,
            serviceUUIDs: event.uuids
          };
          const alreadyInList = list.find((data) => data.id === newDevice.id);
          setName(event.device.name ? event.device.name : "Unamed");
          if (!alreadyInList) {
            list.push(newDevice);
            const newList = list;
            console.log("Advertisement received new device not in list.");
            console.log(`  Device Name: ${event.device.name}`);
            console.log(`  Device ID: ${event.device.id}`);
            console.log(`  RSSI: ${event.rssi}`);
            console.log(`  TX Power: ${event.txPower}`);
            console.log(`  UUIDs: ${event.uuids}`);
            event.manufacturerData.forEach((valueDataView: any, key: any) => {
              console.log("Manufacturer", key, valueDataView);
            });
            event.serviceData.forEach((valueDataView: any, key: any) => {
              console.log("Service", key, valueDataView);
            });
            setList(newList);
          }
        });
      } catch (error) {
        console.log(`Argh! ${error}`);
      }
    } catch (error: any) {
      console.log(`Failed to execute native scan. ${error.message}`);
    }
  };

  return (
    <ListDevices
      deviceList={list as unknown[] as UiDevice[]}
      lastFoundDevice={name}
      startScan={startScan}
      stopScan={stop}
      clearList={clear}
      permissionGranted
    />
  );
}
