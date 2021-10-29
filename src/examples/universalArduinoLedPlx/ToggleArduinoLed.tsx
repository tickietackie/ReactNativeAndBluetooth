/**
 * Sample BLE React Native App
 *
 * @format
 * @flow strict-local
 */

import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Button,
  PermissionsAndroid,
  Platform,
  Alert
} from "react-native";

import { BleManager, Device } from "react-native-ble-plx";
import { decode, encode } from "base-64";
import { useFocusEffect } from "@react-navigation/native";
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

const connectToDevice = (device: Device, setLedStatus: Dispatch<SetStateAction<boolean>>) => {
  manager?.stopDeviceScan(); // stop scanning
  device
    .connect()
    .then((connectedDevice) => {
      console.log("connected");
      return connectedDevice.discoverAllServicesAndCharacteristics();
    })
    .then((connectedDevice) => {
      console.log("return services");
      return connectedDevice.services();
    })
    .then((services) => {
      // console.log(services);
      console.log("return characteristics");
      return services[0].characteristics();
    })
    .then((characteristics) => {
      console.log("tst");
      return characteristics[0].read();
    })
    .then((characteristic) => {
      console.log("read value");
      console.log(characteristic.value);
      console.log(decode(characteristic.value ? characteristic.value : ""));
      console.log("write value");
      if (!characteristic.value || parseInt(decode(characteristic.value), 10) === 0) {
        setLedStatus(false);
      } else {
        setLedStatus(true);
      }
    })
    .catch((error) => {
      console.error(error);
      Alert.alert("Fehler", error.message);
    });
};

const toggle = (device: Device, setLedStatus: Dispatch<SetStateAction<boolean>>) => {
  manager?.stopDeviceScan(); // stop scanning
  device
    .connect()
    .then((connectedDevice) => {
      console.log("connected");
      return connectedDevice.discoverAllServicesAndCharacteristics();
    })
    .then((connectedDevice) => {
      console.log("return services");
      return connectedDevice.services();
    })
    .then((services) => {
      // console.log(services);
      console.log("return characteristics");
      return services[0].characteristics();
    })
    .then((characteristics) => {
      console.log("tst");
      return characteristics[0].read();
    })
    .then((characteristic) => {
      console.log("read value");
      console.log(characteristic.value);
      console.log(decode(characteristic.value ? characteristic.value : ""));
      console.log("write value");
      if (!characteristic.value || parseInt(decode(characteristic.value), 10) === 0) {
        console.log("write 1");
        characteristic.writeWithResponse(encode("1"));
        setLedStatus(true);
      } else {
        console.log("write 0");
        characteristic.writeWithResponse(encode("0"));
        setLedStatus(false);
      }
    })
    .catch((error) => {
      console.error(error);
      Alert.alert("Fehler", error.message);
    });
};

const ToggleArduinoLed = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [ledStatus, setLedStatus] = useState(false);
  const [list, setList] = useState<Device[] | []>([]);
  const [name, setName] = useState("test");
  const [arduinoFound, setArduinoFound] = useState<Device | null>(null);
  const [permissionGranted, setPermissionGranted] = useState(true);

  useFocusEffect(
    React.useCallback(
      () =>
        // Do something when the screen is focused
        () => {
          // Do something when the screen is unfocused
          console.log("cancel connection with device");
          arduinoFound?.cancelConnection();
        },
      []
    )
  );

  const disconnect = () => {
    arduinoFound
      ?.cancelConnection()
      .then(() => {
        setArduinoFound(null);
      })
      .catch(() => alert("Failed to disconnect!"));
  };

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

        if (device?.localName === "LED" || device?.name === "LED" || device?.name === "Arduino") {
          setArduinoFound(device);
          setIsScanning(false);
          connectToDevice(device, setLedStatus);
          console.log("found device");
          // Stop scanning as it's not necessary if you are scanning for one device.
          manager?.stopDeviceScan();
          // Proceed with connection.
        }
      });
    }
  };

  const title = isScanning ? "Stop search" : arduinoFound ? "Disconnect" : "Search for Arduino";

  return (
    <View style={styles.container}>
      {permissionGranted ? (
        <SafeAreaView style={styles.safeAreaContainer}>
          <View style={styles.buttonContainer}>
            <Button
              onPress={() => (arduinoFound ? disconnect() : scanAndConnect())}
              title={title}
            />
          </View>
          <Text>{`Last found device: ${name}`}</Text>

          {isScanning ? (
            <Loading />
          ) : arduinoFound ? (
            <View style={styles.foundContainer}>
              <View>
                <Button
                  title="Toggle LED"
                  onPress={() => {
                    toggle(arduinoFound, setLedStatus);
                  }}
                />
              </View>
              <View style={[styles.circle, { backgroundColor: ledStatus ? "green" : "white" }]} />
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
    marginTop: "20%",
    alignSelf: "center",
    justifyContent: "center"
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
  },
  circle: {
    marginTop: 20,
    width: 100,
    height: 100,
    borderRadius: 100 / 2
  }
});

export default ToggleArduinoLed;
