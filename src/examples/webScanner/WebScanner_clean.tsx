import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  FlatList,
  Pressable,
  Button,
  Platform
} from "react-native";

import Device from "../../../types/Bluetooth";

const WebScanner = () => {
  const [list, setList] = useState<Device[]>([]);
  const [name, setName] = useState("test");
  const [scan, setScan] = useState<any>(null);

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
      scan?.stop();
      setScan(null);
    } catch (error) {
      console.log(error);
    }
  };

  const scanAndConnect = async () => {
    try {
      const nav: any = navigator;
      if (!nav.bluetooth) {
        alert("Bluetooth is not supported.");
        return;
      }
      try {
        const awaitedScan = await (navigator as any).bluetooth.requestLEScan({
          acceptAllAdvertisements: true
        });

        setScan(awaitedScan);

        (navigator as any).bluetooth.addEventListener("advertisementreceived", (event: any) => {
          const newDevice: Device = {
            id: event.device.id,
            name: event.device.name,
            txPowerLevel: event.txPower,
            rssi: event.rssi,
            serviceUUIDs: event.uuids
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
      console.log(`Failed to execute device scan on web. ${error.message}`);
    }
  };

  const renderItem = ({ item }: { item: Device }) => <Item device={item} />;

  // check if running in the web
  if (Platform.OS !== "web") {
    return (
      <View style={styles.container}>
        <Text>This only works in the web</Text>
      </View>
    );
  }

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
