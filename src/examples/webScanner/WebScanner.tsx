/**
 * Sample BLE React Native App
 *
 * @format
 * @flow strict-local
 */

import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  FlatList,
  Pressable,
  Button,
  PermissionsAndroid,
  Platform,
  Alert
} from "react-native";

import { decode, encode } from "base-64";

import Loading from "../../../helpers/IsLoading";

type Device = {
  id: String;
  name: String;
  txPower: Number;
  RSSI: Number;
  UUIDs: String[];
};

const WebScanner = () => {
  const [list, setList] = useState<Device[]>([]);
  const [name, setName] = useState("test");
  const [scan, setScan] = useState<any>(null);
  // const navigation = useNavigation();
  // const [isLoading, setIsLoading] = React.useState(false);

  const Item = ({ device }: { device: Device }) => (
    <Pressable
      onPress={() => {}}
      style={({ pressed }) => [
        {
          backgroundColor: pressed ? "#7799FF" : "#66CCFF"
        },
        styles.item
      ]}
    >
      <Text style={styles.title}>{device.name ? device.name : "Unnamed"}</Text>
      <Text style={styles.title}>{device.id}</Text>
    </Pressable>
  );

  const clear = () => {
    setList([]);
    setName("");
  };

  const stopScan = () => {
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

  const scanAndConnect = async () => {
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
          const newDevice: Device = {
            id: event.device.id,
            name: event.device.name,
            txPower: event.txPower,
            RSSI: event.rssi,
            UUIDs: event.uuids
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

      // request specific device

      /* nav.bluetooth
        .requestDevice({
          acceptAllDevices: true
        })
        .then((device: any) => {
          // Human-readable name of the device.
          console.log(device.name);
          console.log(device.);
          alert(`Device name: ${device.name}\rDevice id: ${device.id}`);
          setIsLoading(false);
        })
        .catch((error: any) => {
          console.log(error);
          setIsLoading(false);
        }); */
      // setIsLoading(true);
      /* setTimeout(() => {
         NativeModules.BluetoothManager.getPeripherals((peripherals: any) => {
          console.log("Got peripherals");
          console.log(peripherals);
          setList(peripherals);

          setIsLoading(false);
          NativeModules.BluetoothManager.stop();
        });
      }, 7000); */
    } catch (error: any) {
      console.log(`Failed to execute native scan. ${error.message}`);
    }
  };

  const renderItem = ({ item }: { item: Device }) => <Item device={item} />;

  /* if (isLoading === true) {
    // return loading screen, if data is loading
    return <Loading />;
  } */

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.container}>
        <View style={styles.buttonContainer}>
          <Button onPress={() => scanAndConnect()} title="Start scan" />
          <Button
            onPress={() => {
              setName("");
              stopScan();
            }}
            title="Stop scan"
          />
          <Button onPress={() => clear()} title="Clear list" />
        </View>

        <Text>{`Last found device: ${name}`}</Text>

        <FlatList
          data={list}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          extraData={name}
        />
      </SafeAreaView>
    </View>
  );
};

const shadowColor = "black";

const styles = StyleSheet.create({
  container: {
    marginTop: "2%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  buttonContainer: {
    flexDirection: "row",
    marginBottom: "1%",
    justifyContent: "space-evenly",
    width: "100%"
  },
  item: {
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 10,
    shadowColor,
    shadowOffset: {
      width: 1,
      height: 2
    },
    shadowOpacity: 0.75,
    shadowRadius: 2,
    elevation: 5,
    borderRadius: 5,
    minWidth: "80%"
  },
  title: {
    fontSize: 12
  }
});

export default WebScanner;
