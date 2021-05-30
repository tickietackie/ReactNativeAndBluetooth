/**
 * Sample BLE React Native App
 *
 * @format
 * @flow strict-local
 */

import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  NativeModules,
  NativeEventEmitter,
  Button,
  Platform,
  PermissionsAndroid,
  FlatList,
  Pressable,

} from 'react-native';

type bluetoothDevice = {
  name?: string;
  id: number;
  rssi?: number;
  localName?: number;
}

import { BleManager } from 'react-native-ble-plx';

export const manager = new BleManager();


const connectToDevice = () => {

}

const Item = ({ name, rssi, id }: bluetoothDevice) => (
  <Pressable onPress={() => connectToDevice()} style={({ pressed }) => [
    {
      backgroundColor: pressed
        ? "#c79bcc"
        : "#f9c2ff"
    },
    styles.item
  ]}>
    <Text style={styles.title}>{name}</Text>
    <Text style={styles.title}>{rssi}</Text>
    <Text style={styles.title}>{id}</Text>
  </Pressable>
);

const BluetoothTest = () => {
  const [isScanning, setIsScanning] = useState(false);
  const peripherals = new Map();
  const [list, setList] = useState<bluetoothDevice[] | []>([]);
  const [name, setName] = useState("test");

  React.useEffect(() => {
    manager.onStateChange((state) => {
      const subscription = manager.onStateChange((state) => {
        if (state === 'PoweredOn') {
          this && this.scanAndConnect();
          subscription.remove();
        }
      }, true);
      return () => subscription.remove();
    });
  }, [manager]);



  React.useEffect(() => {
    const scanAndConnect = () => {
      manager.startDeviceScan(null, null, (error, device) => {
        if (error) {
          // Handle error (scanning will be stopped automatically)
          return
        }

        // Check if it is a device you are looking for based on advertisement data
        // or other criteria.
        console.log(device?.name)
        const name = device && device.name ? device.name : "";
        const localName = device && device.localName ? device.localName : "";
        const alreadyInList = list.find((data) => data.name == name);
        if (!alreadyInList) {
          const bluetoothDevice: bluetoothDevice = {
            name: name,
            id: device?.id,
            rssi: device?.rssi,
            localName: device?.localName
          };
          const newList: bluetoothDevice[] = list;
          newList.push(bluetoothDevice);
          setList(newList);
          setName(name);
        }


        /*if (device?.localName === 'LED') {
          setName(name);
          // Stop scanning as it's not necessary if you are scanning for one device.
          manager.stopDeviceScan();

          // Proceed with connection.
        }*/
      });
    }

    scanAndConnect();
  }, [])



  const renderItem = ({ item }: bluetoothDevice) => (
    <Item name={item.name} rssi={item.rssi} id={item.id} />
  );

  return (
    <View style={styles.container}>
      <Text>name</Text>
      <Text>{name}</Text>
      <SafeAreaView style={styles.container}>
        <FlatList
          data={list}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          extraData={name}
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 10,
    shadowColor: "#000000",
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.75,
    shadowRadius: 2,
    elevation: 5,
    borderRadius: 5
  },
  title: {
    fontSize: 12,
  },
});

export default BluetoothTest;
