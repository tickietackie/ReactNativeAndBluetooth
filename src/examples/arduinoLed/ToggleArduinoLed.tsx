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
import { decode, encode } from "base-64";
import Loading from "../../helpers/IsLoading";

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
// const manager? = new BleManager();

const connectToDevice = (device: Device) => {
  manager?.stopDeviceScan(); // stop scanning
  device
    .connect()
    .then((conntectedDevice) => {
      console.log("connected");
      return conntectedDevice.discoverAllServicesAndCharacteristics();
    })
    .then((conntectedDevice) => {
      console.log("return services");
      return conntectedDevice.services();
    })
    .then((services) => {
      // console.log(services);
      console.log("return characteristics");
      return services[0].characteristics();
    })
    .then((characteristics) => ({
      readChar: characteristics[0].read(),
      chars: characteristics
    }))
    .then((characteristicList) => {
      console.log("read value");
      console.log(characteristicList.chars[0].value);
      console.log(
        decode(characteristicList.chars[0].value ? characteristicList.chars[0].value : "")
      );
      console.log("write value");
      if (
        !characteristicList.chars[0].value ||
        parseInt(decode(characteristicList.chars[0].value), 10) === 0
      ) {
        console.log("write 1");
        characteristicList.chars[0].writeWithResponse(encode("1"));
      } else {
        console.log("write 0");
        characteristicList.chars[0].writeWithResponse(encode("0"));
      }
    })
    .catch((error) => {
      console.error(error);
      Alert.alert("Fehler", error.message);
    });
};

const ToggleArduinoLed = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [list, setList] = useState<Device[] | []>([]);
  const [name, setName] = useState("test");
  const [arduinoFound, setArduinoFound] = useState<Device | null>(null);
  const [permissionGranted, setPermissionGranted] = useState(true);

  // console.log("counter:")
  // console.log(NativeModules.Counter)
  // console.log(Torch)
  // NativeModules.Counter.increment()

  React.useEffect(() => {
    console.log("use effect");
    manager?.onStateChange((state: any) => {
      console.log("onStateChange");
      const subscription = manager?.onStateChange((state: any) => {
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

  const scanAndConnect = () => {
    if (isScanning) {
      manager?.stopDeviceScan();
      setName("");
      setList([]);
      setIsScanning(false);
      setArduinoFound(null);
    } else {
      manager?.startDeviceScan(null, null, (error, device) => {
        setIsScanning(true);
        if (error) {
          // Handle error (scanning will be stopped automatically)
          console.error(error);
          return;
        }

        // Check if it is a device you are looking for based on advertisement data
        // or other criteria.
        console.log(device?.name, device?.localName, device?.id);
        let deviceName = device && device.name ? device.name : "Unnamed";
        const localName = device && device.localName ? device.localName : "Unnamed";
        deviceName = deviceName === "Unnamed" ? localName : deviceName;
        const id = device && device.id;
        const alreadyInList = list.find((data) => data.id === id);
        if (!alreadyInList && device) {
          const newList: Device[] = list;
          newList.push(device);
          setList(newList);
          setName(deviceName);
        }

        if (device?.localName === "LED" || device?.name === "LED") {
          setArduinoFound(device);
          setIsScanning(false);
          console.log("found device");
          // Stop scanning as it's not necessary if you are scanning for one device.
          manager?.stopDeviceScan();
          // Proceed with connection.
        }
      });
    }
  };

  const title = !isScanning ? "Search for Arduino" : "Stop search";

  return (
    <View style={styles.container}>
      {permissionGranted ? (
        <SafeAreaView style={styles.safeAreaContainer}>
          <View style={styles.buttonContainer}>
            <Button onPress={() => scanAndConnect()} title={title} />
          </View>
          <Text>{`Last found device: ${name}`}</Text>

          {isScanning ? (
            <Loading />
          ) : arduinoFound ? (
            <View>
              <Button
                title="Toggle LED"
                onPress={() => {
                  connectToDevice(arduinoFound);
                }}
              />
            </View>
          ) : (
            <View style={(styles.safeAreaContainer, styles.foundContainer)}>
              <Text>Arduino not found yet</Text>
            </View>
          )}
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
    alignItems: "center"
  },
  safeAreaContainer: {
    justifyContent: "center",
    alignItems: "center"
  },
  foundContainer: {
    alignSelf: "center",
    justifyContent: "center",
    minHeight: "50%"
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

export default ToggleArduinoLed;
