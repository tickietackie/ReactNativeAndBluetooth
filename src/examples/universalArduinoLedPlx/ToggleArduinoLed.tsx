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

// connects to the device right after it was found to get the status of the LED
const connectToDevice = (
  device: Device,
  setLedStatus: Dispatch<SetStateAction<boolean>>,
  setArduinoFound: Dispatch<SetStateAction<Device | null>>,
  setLoadingLedStatus: Dispatch<SetStateAction<boolean>>,
  setToggleEnabled: Dispatch<SetStateAction<boolean>>
) => {
  manager?.stopDeviceScan(); // stop scanning
  device
    .connect()
    .then((connected) => {
      console.log(`connected?: ${connected}`);
      if (!connected) {
        return device.connect();
      }
      return device;
    })
    .then((connectedDevice) => {
      console.log("connected to device to get the status");
      return connectedDevice.discoverAllServicesAndCharacteristics();
    })
    .then((connectedDevice) => {
      // set found device after establishing a connection on web,
      // so the connected status is preserved
      // this is only relevant for web, as the device does not have to be requested again and
      // the request window has not to be shown twice to the user in a a second attempt reconnecting
      // this breaks functionality on native, so this can only be done for web
      if (Platform.OS === "web") {
        setArduinoFound(device);
      }
      return connectedDevice.services();
    })
    .then((services) => {
      // console.log(services);
      console.log("return characteristics");
      return services[0].characteristics();
    })
    .then((characteristics) => characteristics[0].read())
    .then((characteristic) => {
      console.log("read value");
      console.log(characteristic.value);
      console.log(decode(characteristic.value ? characteristic.value : ""));
      if (!characteristic.value || parseInt(decode(characteristic.value), 10) === 0) {
        setLedStatus(false);
      } else {
        setLedStatus(true);
      }
      setLoadingLedStatus(false);
      setToggleEnabled(true);
    })
    .catch((error) => {
      Alert.alert(`Fehler: ${error.message}`);
      console.error(error);
    });
};

// lets the user toggle the LED by writing the opposite value of the status to the characteristic
const toggle = (device: Device, setLedStatus: Dispatch<SetStateAction<boolean>>) => {
  manager?.stopDeviceScan(); // stop scanning
  device
    .isConnected()
    .then((connected) => {
      console.log(`connected?: ${connected}`);
      if (!connected) {
        return device.connect();
      }
      return device;
    })
    .then((connectedDevice) => {
      console.log("connected ... return discover and chars");
      return connectedDevice.discoverAllServicesAndCharacteristics();
    })
    .then((connectedDevice) => {
      console.log("return services");
      return connectedDevice.services();
    })
    .then((services) => {
      console.log("return characteristics");
      return services[0].characteristics();
    })
    .then((characteristics) => {
      console.log("reaturn read");
      return characteristics[0].read();
    })
    .then((characteristic) => {
      console.log(`Read value: ${characteristic.value}`);
      console.log(`Decoded value: ${decode(characteristic.value ? characteristic.value : "")}`);
      console.log("write value");
      if (!characteristic.value || parseInt(decode(characteristic.value), 10) === 0) {
        console.log("LED is off: write 1 to characteristic");
        characteristic.writeWithResponse(encode("1")).then(() => setLedStatus(true));
      } else {
        console.log("LED is on: write 0 to characteristic");
        characteristic.writeWithResponse(encode("0")).then(() => setLedStatus(false));
      }
    })
    .catch((error) => {
      Alert.alert(`Fehler: ${error.message}`);
      console.error(error);
    });
};

const ToggleArduinoLed = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [ledStatus, setLedStatus] = useState(false);
  const [loadingLedStatus, setLoadingLedStatus] = useState(false);
  const [toggleEnabled, setToggleEnabled] = useState(false);
  const [list, setList] = useState<Device[] | []>([]);
  const [name, setName] = useState("test");
  const [arduinoFound, setArduinoFound] = useState<Device | null>(null);
  const [permissionGranted, setPermissionGranted] = useState(true);

  // disconnect from the device when leaving the screen
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

  // disconnect from the device and reset react native state
  const disconnect = () => {
    arduinoFound
      ?.cancelConnection()
      .then(() => {
        setList([]);
        setName("");
        setArduinoFound(null);
        setLedStatus(false);
        setToggleEnabled(false);
      })
      .catch(() => {
        alert("Failed to disconnect! Maybe already disconnected.");
        setArduinoFound(null);
        setLedStatus(false);
      });
  };

  // React to changes on the bluetooth state itself
  // not yet implemented in web
  React.useEffect(() => {
    manager?.onStateChange((state: any) => {
      console.log("onStateChange");
      const subscription = manager?.onStateChange((state: any) => {
        if (state === "PoweredOn") {
          subscription.remove();
        }
      }, true);
      return () => subscription.remove();
    });
  }, [manager]);

  // Get permission for Android
  // in iOS and the Web permissions are handled by the browser or operating system, respectively
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

  // Get permission for Android on when navigating to this page the first time
  React.useEffect(() => {
    if (Platform.OS === "android") {
      (async () => {
        await getPermissionOnAndroid();
      })();
    }
  }, []);

  // Scan for the arduino by name and call the connect function if it was found
  const scanAndConnect = () => {
    if (isScanning) {
      manager?.stopDeviceScan();
      setName("");
      setList([]);
      setIsScanning(false);
      setArduinoFound(null);
    } else {
      try {
        manager?.startDeviceScan(null, null, (error, device) => {
          setIsScanning(true);
          if (error) {
            // Handle error (scanning will be stopped automatically)
            console.error(error);
            alert(error.message);
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

          // to show last found device, gather all devices not yet found
          // and update the name of to newest one
          if (!alreadyInList && device) {
            const newList: Device[] = list;
            newList.push(device);
            setList(newList);
            setName(deviceName);
          }

          if (device?.localName === "LED" || device?.name === "LED" || device?.name === "Arduino") {
            console.log("Found device");
            setArduinoFound(device);
            setIsScanning(false);
            setLoadingLedStatus(true);
            // Stop scanning as it's not necessary if you are scanning for one device.
            manager?.stopDeviceScan();
            connectToDevice(
              device,
              setLedStatus,
              setArduinoFound,
              setLoadingLedStatus,
              setToggleEnabled
            );
          }
        });
      } catch (error: any) {
        alert(error.message);
        console.error(error);
      }
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

          {isScanning && <Text>{`Last found device: ${name}`}</Text>}

          {isScanning ? (
            <Loading />
          ) : (
            arduinoFound && (
              <View style={styles.foundContainer}>
                <View>
                  <Button
                    title="Toggle LED"
                    disabled={!toggleEnabled}
                    onPress={() => {
                      toggle(arduinoFound, setLedStatus);
                    }}
                  />
                </View>
                <View
                  style={[
                    styles.circle,
                    { backgroundColor: ledStatus ? "green" : "white" },
                    { opacity: loadingLedStatus ? 0.5 : 1 }
                  ]}
                >
                  {loadingLedStatus ? (
                    <Loading />
                  ) : (
                    <Text style={{ color: ledStatus ? "white" : "grey" }}>
                      {ledStatus ? "Turned on" : "Turned off"}
                    </Text>
                  )}
                </View>
              </View>
            )
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
  circle: {
    marginTop: 20,
    width: 100,
    height: 100,
    borderRadius: 100 / 2,
    justifyContent: "center",
    alignItems: "center"
  }
});

export default ToggleArduinoLed;
