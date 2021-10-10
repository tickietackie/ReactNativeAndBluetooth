/**
 * Sample BLE React Native App
 *
 * @format
 * @flow strict-local
 */

import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  FlatList,
  Pressable,
  Button,
  ActivityIndicator
} from "react-native";

import Device from "../../../types/Bluetooth";

interface IScannerProps {
  lastFoundDevice: String;
  deviceList: Device[];
  stopScan: Function;
  startScan: Function;
  clearList: Function;
  permissionGranted: Boolean;
}

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
    <Text style={styles.title}>{device.name}</Text>
    <Text style={styles.title}>{device.rssi}</Text>
    <Text style={styles.title}>{device.id}</Text>
  </Pressable>
);

export default function ListDevices({
  lastFoundDevice,
  deviceList,
  stopScan,
  startScan,
  clearList,
  permissionGranted
}: IScannerProps): JSX.Element {
  const [scanning, setScanning] = React.useState(false);

  const renderItem = ({ item }: { item: Device }) => <Item device={item} />;

  return (
    <View style={styles.container}>
      {permissionGranted ? (
        <SafeAreaView style={styles.container}>
          <View style={styles.buttonContainer}>
            <Button
              onPress={() => {
                setScanning(true);
                startScan();
              }}
              title="Start scan"
            />
            <Button
              onPress={() => {
                setScanning(false);
                stopScan();
              }}
              title="Stop scan"
            />
            <Button onPress={() => clearList()} title="Clear list" />
            {scanning === true && <ActivityIndicator color="orange" />}
          </View>

          <Text>{`Last found device: ${lastFoundDevice}`}</Text>

          <FlatList
            data={deviceList}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            // extraData={name}
          />
        </SafeAreaView>
      ) : (
        <Text>
          You need to provide me the needed permissions. This does not work otherwise. Now you have
          to reload the app ...
        </Text>
      )}
    </View>
  );
}

const shadowColor = "black";

const styles = StyleSheet.create({
  container: {
    marginTop: "2%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 320
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
