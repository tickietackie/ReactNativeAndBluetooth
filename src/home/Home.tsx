/**
 * Sample BLE React Native App
 *
 * @format
 * @flow strict-local
 */

import React from "react";
import { StyleSheet, View, Text, Button, ScrollView, Platform } from "react-native";

import { useNavigation } from "@react-navigation/native";

const Home = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pick a BLE example</Text>
      <ScrollView>
        <View style={styles.buttonContainer}>
          <Button
            title="Toggle Arduino BLE's LED"
            onPress={() => {
              navigation.navigate("ToggleArduinoLed");
            }}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title="Device Scanner - PLX BLE Library"
            onPress={() => {
              navigation.navigate("DeviceScannerPlxLibrary");
            }}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title="Device Scanner - Native"
            onPress={() => {
              navigation.navigate("NativeScanner");
            }}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title="Scanner - Web"
            onPress={() => {
              navigation.navigate("WebScanner");
            }}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title="Device Connector - PLX BLE Library"
            onPress={() => {
              navigation.navigate("BleDeviceConnector");
            }}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title="Universal Scanner (iOS, Android, Web)"
            onPress={() => {
              navigation.navigate("UniversalScanner");
            }}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title="Universal Scanner PLX"
            onPress={() => {
              navigation.navigate("UniversalPlxScanner");
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const buttonMargin = Platform.OS === "ios" ? "0.5%" : "3%";

const styles = StyleSheet.create({
  container: {
    marginTop: "2%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  buttonContainer: {
    marginVertical: buttonMargin
  },
  title: {
    margin: "3%",
    paddingBottom: "1%",
    fontSize: 20
  }
});

export default Home;
