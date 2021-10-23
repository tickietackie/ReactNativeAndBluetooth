import React, { useState, useEffect } from "react";
import CheckBox from "@react-native-community/checkbox";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Button,
  Alert,
  ActivityIndicator,
  NativeModules
} from "react-native";

import { useNavigation, RouteProp } from "@react-navigation/native";
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";

import { Device, BleManager, Service, Characteristic, Descriptor } from "react-native-ble-plx";
import { decode, encode } from "base-64";
import { ScrollView } from "react-native-gesture-handler";
import { uuidToString } from "../../helpers/constants";

const { Torch } = NativeModules;

type DeviceDetailsParamList = {
  DeviceDetails: {
    manager: BleManager;
    device: Device;
    test: string;
  };
};

type Props = StackScreenProps<DeviceDetailsParamList, "DeviceDetails">;

const DeviceDetails = ({ navigation, route }: Props): JSX.Element => {
  const { manager, device } = route.params;
  const [isLoading, setIsLoading] = React.useState(false);
  const [deviceIsConnected, setDeviceIsConnected] = React.useState(false);

  const [services, setServices] = React.useState([]);
  const [characteristics, setCharacteristics] = React.useState([]);

  device.isConnected().then((connected) => {
    setDeviceIsConnected(connected);
  });

  // get services if already connected
  React.useEffect(() => {
    if (deviceIsConnected) {
      getServices(device);
    }
  }, [deviceIsConnected]);

  const getServices = async (connectedDevice: Device) =>
    new Promise(async (resolve) => {
      console.log("Fetch Services");
      connectedDevice
        .services()
        .then(async (services) => {
          console.log(`Fetched ${services.length} service/s`);

          console.log("test1");
          const promises = services.map(
            async (service) =>
              new Promise(async (resolve, reject) => {
                const characteristics = await getCharacteristics(service).catch((error) =>
                  console.log(error)
                );
                console.log("got char promis");
                const uiService = {
                  id: service.id,
                  uuid: service.uuid,
                  isPrimary: service.isPrimary,
                  deviceId: service.deviceID,
                  characteristics
                };
                console.log("then build ui service");
                resolve(uiService);
              })
          );

          console.log("test2");
          const uiServices: any = await Promise.all(promises);
          setServices(uiServices);
          console.log("test3");
        })

        .catch((error) => {
          console.error(error);
          setIsLoading(false);
        });
      setIsLoading(false);
    });

  const getCharacteristics = (service: Service) =>
    new Promise(async (resolve, reject) => {
      // console.log('get chars');
      // resolve('test');

      const uiCharacteristics: any = await service
        .characteristics()
        .then(async (characteristics) => {
          console.log(`Fetched ${characteristics.length} characteristic/s`);

          const promises = characteristics.map(
            async (characteristic) =>
              new Promise(async (resolve, reject) => {
                console.log("await descriptor read");
                const descriptors = await getDescriptors(characteristic).catch((error) =>
                  console.log(error)
                );
                console.log("await value read");

                let value: any = "";
                if (characteristic.isReadable) {
                  value = await readCharValue(characteristic);
                }
                console.log(`push char, value: ${value}`);
                const uiChar = {
                  id: characteristic.id,
                  uuid: characteristic.uuid,
                  value: value ? `${decode(value)} (${value})` : null,
                  isIndicatable: characteristic.isIndicatable,
                  isNotifiable: characteristic.isNotifiable,
                  isNotifying: characteristic.isNotifying,
                  isReadable: characteristic.isReadable,
                  isWritableWithResponse: characteristic.isWritableWithResponse,
                  isWritableWithoutResponse: characteristic.isWritableWithoutResponse,
                  descriptors
                };
                console.log("then build ui char");
                resolve(uiChar);
              })
          );
          const chars = await Promise.all(promises);
          resolve(chars);
        });
      console.log("return chars");
      resolve(uiCharacteristics);
    });

  const readCharValue = async (characteristic: Characteristic) =>
    new Promise(async (resolve, reject) => {
      let value: any = "";
      console.log("get value");
      await characteristic
        .read()
        .then(async (characteristicWithValue) => {
          value = characteristicWithValue.value;
          console.log(`Fetched value ${value} (${encode(value)})`);
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
      console.log("return char value");

      resolve(value);
    });

  const getDescriptors = async (characteristic: Characteristic) =>
    new Promise(async (resolve, reject) => {
      // console.log('get chars');
      // resolve('test');

      const uiCharacteristics: any = await characteristic
        .descriptors()
        .then(async (descriptors) => {
          console.log(`Fetched ${characteristics.length} characteristic/s`);

          const promises = descriptors.map(
            async (descriptor) =>
              new Promise(async (resolve, reject) => {
                console.log(
                  `Fetch descriptor ${descriptor.id} for char with id ${descriptor.characteristicUUID}`
                );
                const value: any = await readDescriptorValue(descriptor);
                const uiDescriptor = {
                  id: descriptor.id,
                  uuid: descriptor.uuid,
                  value: value ? `${decode(value)} (${value})` : null
                };
                console.log("push ui descriptor to descriptors array:");
                console.log(uiDescriptor);
                resolve(uiDescriptor);
              })
          );
          const fetchedDescriptors = await Promise.all(promises);
          resolve(fetchedDescriptors);
        });
      console.log("return chars");
      resolve(uiCharacteristics);
    });

  const readDescriptorValue = async (descriptor: Descriptor) =>
    new Promise(async (resolve, reject) => {
      let value: any = "";
      console.log("get value");
      await descriptor
        .read()
        .then(async (descriptorWithValue) => {
          value = descriptorWithValue.value;
          console.log(`Fetched value ${value} (${encode(value)})`);
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
      console.log("return descriptor value");

      resolve(value);
    });

  const connect = () => {
    console.log("Set is loading true");
    setIsLoading(true);
    console.log("Connect to device");
    device
      .connect()
      .then((device) => {
        console.log("Connected ... exe discoverAllServicesAndCharacteristics");
        return device.discoverAllServicesAndCharacteristics();
      })
      .then((device) => {
        console.log("Connected ... exe get services");
        getServices(device);

        // return device.discoverAllServicesAndCharacteristics()
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  };

  const buildServiceUi = () => {
    const serviceUi: any = [];
    let serviceCounter = 0;
    services.forEach(async (service: any) => {
      serviceUi.push(
        <View
          key={service.id}
          style={{
            alignSelf: "flex-start",
            alignItems: "flex-start",
            justifyContent: "center",
            margin: "1%"
          }}
        >
          <Text style={{ fontSize: 16, paddingHorizontal: "1%" }}>
            {`Service #${serviceCounter}`}
          </Text>
          <View style={{ paddingHorizontal: "2%" }}>
            <Text style={styles.text}>{`Id: ${service.id}`}</Text>
            <Text style={styles.text}>{`UUID: ${service.uuid}`}</Text>
            {service.uuid ? (
              <Text style={styles.text}>{`Name: ${uuidToString(service.uuid)}`}</Text>
            ) : null}
            <View
              style={{
                alignSelf: "flex-start",
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center"
              }}
            >
              <Text style={styles.text}>Is primary:</Text>
              <CheckBox
                disabled={false}
                value={service.isPrimary ? service.isPrimary : false}
                style={{ width: 15, height: 15 }}
              />
            </View>
            <View style={{ marginTop: "2%" }}>
              <Text
                style={{
                  fontSize: 14,
                  paddingVertical: "1%",
                  paddingHorizontal: "1%"
                }}
              >
                Characteristics
              </Text>
              {service.characteristics !== 0 ? (
                buildCharacteristicUi(service.characteristics)
              ) : (
                <Text>Device has no characteristics or loading them failed</Text>
              )}
            </View>
          </View>
        </View>
      );
      serviceCounter += 1;
    });
    return serviceUi;
  };

  const buildCharacteristicUi = (characteristics: any) => {
    const characteristicUi: any = [];
    let characteristicCounter = 0;
    characteristics.forEach((characteristic: any) => {
      console.log(`Build ui for characteristic with id ${characteristic.id} `);

      // promise.then(() => {
      console.log(`Add characteristic with id ${characteristic.id} to serviceCharacteristics`);
      characteristicUi.push(
        <View
          key={characteristic.id}
          style={{
            alignSelf: "flex-start",
            alignItems: "flex-start",
            justifyContent: "center",
            margin: "1%"
          }}
        >
          <Text style={{ fontSize: 13, marginLeft: "1%" }}>
            {`Characteristic #${characteristicCounter}`}
          </Text>
          <View
            style={{
              alignSelf: "flex-start",
              alignItems: "flex-start",
              // justifyContent: "center",
              marginLeft: "1%"
            }}
          >
            <Text style={styles.text}>{`UUID: ${characteristic.uuid}`}</Text>
            {characteristic.uuid ? (
              <Text style={styles.text}>{`Name: ${uuidToString(characteristic.uuid)}`}</Text>
            ) : null}
            <Text style={styles.text}>{`Value: ${characteristic.value}`}</Text>
            <View
              style={{
                alignSelf: "flex-start",
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center"
              }}
            >
              <Text style={styles.text}>Is indicatable:</Text>
              <CheckBox
                disabled={false}
                value={characteristic.isIndicatable ? characteristic.isIndicatable : false}
                style={{ width: 15, height: 15 }}
              />
            </View>
            <View
              style={{
                alignSelf: "flex-start",
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center"
              }}
            >
              <Text style={styles.text}>Is notifiable:</Text>
              <CheckBox
                disabled={false}
                value={characteristic.isNotifiable ? characteristic.isNotifiable : false}
                style={{ width: 15, height: 15 }}
              />
            </View>
            <View
              style={{
                alignSelf: "flex-start",
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center"
              }}
            >
              <Text style={styles.text}>Is notifying:</Text>
              <CheckBox
                disabled={false}
                value={characteristic.isNotifying ? characteristic.isNotifying : false}
                style={{ width: 15, height: 15 }}
              />
            </View>
            <View
              style={{
                alignSelf: "flex-start",
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center"
              }}
            >
              <Text style={styles.text}>Is readable:</Text>
              <CheckBox
                disabled={false}
                value={characteristic.isReadable ? characteristic.isReadable : false}
                style={{ width: 15, height: 15 }}
              />
            </View>
            <View
              style={{
                alignSelf: "flex-start",
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center"
              }}
            >
              <Text style={styles.text}>Is writable with response:</Text>
              <CheckBox
                disabled={false}
                value={
                  characteristic.isWritableWithResponse
                    ? characteristic.isWritableWithResponse
                    : false
                }
                style={{ width: 15, height: 15 }}
              />
            </View>

            <View
              style={{
                alignSelf: "flex-start",
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center"
              }}
            >
              <Text style={styles.text}>Is writable without response:</Text>
              <CheckBox
                disabled={false}
                value={
                  characteristic.isWritableWithoutResponse
                    ? characteristic.isWritableWithoutResponse
                    : false
                }
                style={{ width: 15, height: 15 }}
              />
            </View>
            {characteristic.descriptors && characteristic.descriptors.length !== 0 ? (
              buildDescriptorsUi(characteristic.descriptors)
            ) : (
              <View />
            )}
          </View>
        </View>
      );
      characteristicCounter += 1;
      // })
    });

    return characteristicUi;
  };

  const buildDescriptorsUi = (descriptors: any) => {
    const descriptorUi: any = [];
    let descriptorCounter = 0;
    descriptors.forEach((descriptor: any) => {
      console.log(`Build ui for descriptor with id ${descriptor.id} `);

      // promise.then(() => {
      console.log(`Add descriptor ui with id ${descriptor.id} to array`);
      descriptorUi.push(
        <View
          key={descriptor.id}
          style={{
            alignSelf: "flex-start",
            alignItems: "flex-start",
            justifyContent: "center",
            margin: "2%"
          }}
        >
          <Text style={{ fontSize: 13, marginLeft: "2%" }}>
            {`Descriptors #${descriptorCounter}`}
          </Text>
          <View
            style={{
              alignSelf: "flex-start",
              alignItems: "flex-start",
              marginLeft: "2%"
            }}
          >
            <Text style={styles.text}>{`UUID: ${descriptor.uuid}`}</Text>
            {descriptor.uuid ? (
              <Text style={styles.text}>{`Name: ${uuidToString(descriptor.uuid)}`}</Text>
            ) : null}
            <Text style={styles.text}>{`Value: ${descriptor.value}`}</Text>
          </View>
        </View>
      );
      descriptorCounter += 1;
      // })
    });

    return descriptorUi;
  };

  const ui = buildServiceUi();
  const deviceName = device.name ? device.name : device.localName;

  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: "center",
        flexDirection: "column",
        minWidth: "100%"
      }}
    >
      <ScrollView style={{ flex: 10 }}>
        <View style={{ flex: 1, flexDirection: "column", minWidth: "90%" }}>
          <View style={{ flex: 1, alignItems: "flex-start" }}>
            <Text style={{ fontSize: 30 }}>{deviceName || "Unnamed"}</Text>
            <Text style={{ fontSize: 10 }}>{device.id}</Text>

            <Text style={{ fontSize: 18, paddingTop: "4%", paddingBottom: "1%" }}>
              Device parameters
            </Text>

            <View style={{ paddingHorizontal: "2%", alignItems: "flex-start" }}>
              <View
                style={{
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "center"
                }}
              >
                <Text style={styles.text}>Is connectable:</Text>
                <CheckBox
                  disabled={false}
                  value={device.isConnectable ? device.isConnectable : false}
                  style={{ width: 15, height: 15 }}
                />
              </View>

              <Text style={styles.text}>{`Name: ${device.name}`}</Text>
              <Text style={styles.text}>{`Local name: ${device.localName}`}</Text>
              <Text style={styles.text}>
                {`manufacturer data: ${decode(
                  device.manufacturerData ? device.manufacturerData : ""
                )}`}
              </Text>
              <Text style={styles.text}>{`rssi: ${device.rssi}`}</Text>
              <Text style={styles.text}>{`service data: ${device.serviceData}`}</Text>
              <Text style={styles.text}>
                {`service uuids: [${device?.serviceUUIDs ? device.serviceUUIDs?.join(", ") : ""}]`}
              </Text>
              <Text style={styles.text}>
                {`service uuids: [${
                  device?.serviceUUIDs
                    ? device.serviceUUIDs
                        ?.map((data) => (uuidToString(data) ? uuidToString(data) : data))
                        .join(", ")
                    : ""
                }]`}
              </Text>
              <Text style={styles.text}>{`Tx power level: ${device.txPowerLevel}`}</Text>
              <Text style={styles.text}>{`MTU: ${device.mtu}`}</Text>

              <View
                style={{
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "center"
                }}
              >
                <Text style={styles.text}>Is connected:</Text>
                <CheckBox
                  disabled={false}
                  value={deviceIsConnected}
                  style={{ width: 15, height: 15 }}
                />
              </View>
            </View>

            {deviceIsConnected ? (
              <View style={{ marginTop: "4%" }}>
                <Text style={{ fontSize: 18 }}>Services</Text>
                {ui.length !== 0 ? ui : <Text>Devices has no services or loading them failed</Text>}
              </View>
            ) : (
              <View
                style={{
                  flex: 1,
                  alignSelf: "center",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingVertical: "2%"
                }}
              >
                {isLoading ? (
                  <ActivityIndicator />
                ) : (
                  <Button
                    onPress={() => connect()}
                    disabled={!device.isConnectable}
                    title="Connect to show more data"
                  />
                )}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
      <View
        style={{
          flex: 0.1,
          alignItems: "flex-end",
          flexDirection: "row",
          justifyContent: "flex-end",
          paddingVertical: "2%"
        }}
      >
        <Button onPress={() => navigation.goBack()} title="Dismiss" />
        <Button onPress={() => connect()} title="Reload device data" />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: "2%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  text: {
    fontSize: 12,
    padding: "1%"
  },
  heading: { fontSize: 18, paddingVertical: "4%" }
});

export default DeviceDetails;
