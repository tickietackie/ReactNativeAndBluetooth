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

import { useNavigation } from "@react-navigation/native";

import { decode, encode } from "base-64";
import Loading from "../../../helpers/IsLoading";

type Device = {
  id: String;
  name: String;
};

const NativeScanner = () => {
  const [list, setList] = useState<Device[] | []>([]);
  const [name, setName] = useState("test");
  const [permissionGranted, setPermissionGranted] = useState(true);
  // const navigation = useNavigation();
  const [isLoading, setIsLoading] = React.useState(false);

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

  useEffect(() => {
    if (Platform.OS === "android") {
      (async () => {
        await getPermissionOnAndroid();
      })();
    }
  }, []);

  const clear = () => {
    setList([]);
    // NativeModules.BluetoothManager.clear();
    setName("");
  };

  const scanAndConnect = () => {
    try {
      const nav: any = navigator;
      if (!nav.bluetooth) {
        alert("Bluetooth is not supported.");
        return;
      }
      nav.bluetooth
        .requestDevice({
          acceptAllDevices: true
        })
        .then((device: any) => {
          // Human-readable name of the device.
          console.log(device.name);
          console.log(device.id);
          alert(`Device name: ${device.name}\rDevice id: ${device.id}`);
          setIsLoading(false);
        })
        .catch((error: any) => {
          console.log(error);
          setIsLoading(false);
        });
      setIsLoading(true);
      setTimeout(() => {
        /* NativeModules.BluetoothManager.getPeripherals((peripherals: any) => {
          console.log("Got peripherals");
          console.log(peripherals);
          setList(peripherals);

          setIsLoading(false);
          NativeModules.BluetoothManager.stop();
        }); */
      }, 7000);
    } catch (error: any) {
      console.log(`Failed to execute native scan. ${error.message}`);
    }
  };

  const renderItem = ({ item }: { item: Device }) => <Item device={item} />;

  if (isLoading === true) {
    // return loading screen, if data is loading
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      {permissionGranted ? (
        <SafeAreaView style={styles.container}>
          <View style={styles.buttonContainer}>
            <Button onPress={() => scanAndConnect()} title="Start scan" />
            <Button
              onPress={() => {
                setName("");
                // NativeModules.BluetoothManager.stop();
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
          You need to provide me location permissions. This does not work
          otherwise. Now you have to reload ...
        </Text>
      )}
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

export default NativeScanner;
