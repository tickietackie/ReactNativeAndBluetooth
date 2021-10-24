/**
 * Scanner.tsx
 * Scan devices in the web
 *
 */

import React, { useState } from "react";

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
      console.log(`Stopped. scan.active = ${scan.active}`);
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
          filter: [],
          acceptAllAdvertisements: true
        });

        setScan(awaitedScan);

        (navigator as any).bluetooth.addEventListener("advertisementreceived", (event: any) => {
          const newDevice: UiDevice = {
            id: event.device.id,
            name: event.device.name ? event.device.name : "Unamed",
            txPowerLevel: event.txPower,
            rssi: event.rssi,
            serviceUUIDs: event.uuids,
            appearance: event.appearance
          };
          const alreadyInList = list.find((data) => data.id === newDevice.id);
          setName(event.device.name ? event.device.name : "Unamed");
          if (!alreadyInList) {
            list.push(newDevice);
            const newList = list;

            setList(newList);
          }
        });
      } catch (error) {
        console.log(`Error: ${error}`);
      }
    } catch (error: any) {
      console.log(`Failed to execute web scan. ${error.message}`);
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
