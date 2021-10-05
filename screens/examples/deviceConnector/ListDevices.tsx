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
  View,
  Text,
  FlatList,
  Pressable,
  Button,
  PermissionsAndroid,
  Platform,
  Alert,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { BleManager, Device } from 'react-native-ble-plx';
import { decode, encode } from 'base-64';

export const manager: BleManager = new BleManager();

const DeviceConnector = () => {
  const [list, setList] = useState<Device[] | []>([]);
  const [name, setName] = useState('test');
  const [permissionGranted, setPermissionGranted] = useState(true);
  const navigation = useNavigation();

  const connectToDevice = (device: Device) => {
    setName('');
    manager.stopDeviceScan();

    navigation.navigate('DeviceDetails', {
      manager,
      device,
    });
  };

  const Item = ({ device }: { device: Device }) => (
    <Pressable
      onPress={() => connectToDevice(device)}
      style={({ pressed }) => [
        {
          backgroundColor: pressed ? '#7799FF' : '#66CCFF',
        },
        styles.item,
      ]}
    >
      <Text style={styles.title}>{device.name ? device.name : device.localName}</Text>
      <Text style={styles.title}>{device.rssi}</Text>
      <Text style={styles.title}>{device.id}</Text>
    </Pressable>
  );

  React.useEffect(() => {
    console.log('use effect');
    manager.onStateChange((state) => {
      const subscription = manager.onStateChange((state) => {
        if (state === 'PoweredOn') {
          // this && scanAndConnect();
          subscription.remove();
        }
      }, true);
      return () => subscription.remove();
    });
  }, [manager]);

  const getPermissionOnAndroid = async () => {
    const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
      title: 'You need to allow location services to run this ...',
      message: 'This is mandatory',
      buttonNeutral: 'Ask Me Later',
      buttonNegative: "I don't care",
      buttonPositive: 'Ok',
    });
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Permission granted');
      setPermissionGranted(true);
    } else {
      console.log('permission denied');
      setPermissionGranted(false);
    }
  };

  React.useEffect(() => {
    if (Platform.OS === 'android') {
      (async () => {
        await getPermissionOnAndroid();
      })();
    }
  }, []);

  const clear = () => {
    setList([]);
    manager.stopDeviceScan();
    setName('');
  };

  const scanAndConnect = () => {
    console.log('scanAndConnect');
    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        // Handle error (scanning will be stopped automatically)
        console.error(error);
        return;
      }

      // Check if it is a device you are looking for based on advertisement data
      // or other criteria.
      console.log(device?.name, device?.localName, device?.id);
      const deviceName = device && device.name ? device.name : '';
      const id = device && device.id;
      // const localName = device && device.localName ? device.localName : "";
      const alreadyInList = list.find((data) => data.id === id);
      if (!alreadyInList && device) {
        const newList: Device[] = list;
        newList.push(device);
        setList(newList);
        setName(deviceName);
      }

      /* if (device?.localName === 'LED') {
               setName(name);
               // Stop scanning as it's not necessary if you are scanning for one device.
               manager.stopDeviceScan();

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
                setName('');
                manager.stopDeviceScan();
              }}
              title="Stop scan"
            />
            <Button onPress={() => clear()} title="Clear list" />
          </View>

          <Text>{`Last found device: ${name}`}</Text>

          <FlatList data={list} renderItem={renderItem} keyExtractor={(item) => item.id} extraData={name} />
        </SafeAreaView>
      ) : (
        <Text>
          You need to provide me location permissions. This does not work otherwise. Now you have to reload the app ...
        </Text>
      )}
    </View>
  );
};

const shadowColor = 'black';

const styles = StyleSheet.create({
  container: {
    marginTop: '2%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: '1%',
    justifyContent: 'space-evenly',
    width: '100%',
  },
  item: {
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 10,
    shadowColor,
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.75,
    shadowRadius: 2,
    elevation: 5,
    borderRadius: 5,
    minWidth: '80%',
  },
  title: {
    fontSize: 12,
  },
});

export default DeviceConnector;
