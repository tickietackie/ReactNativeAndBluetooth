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

import { BleManager, Device } from "react-native-ble-plx";

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
    <Text style={styles.title}>{device.localName ? device.localName : device.name}</Text>
    <Text style={styles.title}>{device.rssi}</Text>
    <Text style={styles.title}>{device.id}</Text>
  </Pressable>
);

const ScannerPlx = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [list, setList] = useState<Device[] | []>([]);
  const [name, setName] = useState("test");
  const [permissionGranted, setPermissionGranted] = useState(true);

  React.useEffect(() => {
    console.log("use effect");
    manager?.onStateChange((state) => {
      console.log("onStateChange");
      const subscription = manager?.onStateChange((state) => {
        if (state === "PoweredOn") {
          // this && scanAndConnect();
          subscription.remove();
        }
      }, true);
      return () => subscription.remove();
    });
  }, [manager]);

  const getPermissionOnAndroid = async () => {
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
  }, []);

  const clear = () => {
    setList([]);
    manager?.stopDeviceScan();
    setName("");
  };

  const scanAndConnect = () => {
    console.log("scanAndConnect");
    manager?.startDeviceScan(null, null, (error, device) => {
      if (error) {
        // Handle error (scanning will be stopped automatically)
        console.error(error);
        return;
      }

      // Check if it is a device you are looking for based on advertisement data
      // or other criteria.
      console.log(device?.name, device?.id);
      const name = device && device.name ? device.name : "";
      const id = device && device.id;
      // const localName = device && device.localName ? device.localName : "";
      const alreadyInList = list.find((data) => data.id === id);
      if (!alreadyInList && device) {
        const newList: Device[] = list;
        newList.push(device);
        setList(newList);
        setName(name);
      }

      /* if (device?.localName === 'LED') {
          setName(name);
          // Stop scanning as it's not necessary if you are scanning for one device.
          manager?.stopDeviceScan();

          // Proceed with connection.
        } */
    });
  };

  const renderItem = ({ item }: { item: Device }) => <Item device={item} />;

  return (
    <View style={styles.container}>
      {permissionGranted ? (
        <SafeAreaView style={styles.container}>
          <View style={styles.buttonContainer}>
            <Button onPress={() => scanAndConnect()} title="Start scan" />
            <Button
              onPress={() => {
                setName("");
                manager?.stopDeviceScan();
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
      ) : (
        <Text>
          You need to provide me location permissions. This does not work otherwise. Now you have to
          reload ...
        </Text>
      )}
    </View>
  );
};

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
    shadowColor: "#000000",
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

export default ScannerPlx;
