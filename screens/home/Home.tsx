/**
 * Sample BLE React Native App
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  StyleSheet, View, Text, Button, ScrollView,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';

const Home = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pick a BLE example</Text>
      <ScrollView>
        <Button
          title="Toggle Arduino BLE's LED"
          onPress={() => {
            navigation.navigate('ToggleArduinoLed');
          }}
        />
        <Button
          title="Device Scanner - PLX BLE Library"
          onPress={() => {
            navigation.navigate('DeviceScannerPlxLibrary');
          }}
        />
        <Button
          title="Device Scanner - Native"
          onPress={() => {
            navigation.navigate('NativeScanner');
          }}
        />
        <Button
          title="Device Connector - PLX BLE Library"
          onPress={() => {
            navigation.navigate('BleDeviceConnector');
          }}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: '2%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    margin: '3%',
    paddingBottom: '1%',
    fontSize: 20,
  },
});

export default Home;
