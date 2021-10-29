import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "./src/home/Home";

import NativeScanner from "./src/examples/nativeScanner/NativeScanner";
import ToggleArduinoLed from "./src/examples/arduinoLed/ToggleArduinoLed";
import ScannerPlx from "./src/examples/plxLibraryScanner/plxScanner";
import DeviceConnector from "./src/examples/deviceConnector/ListDevices";
import DeviceDetails from "./src/examples/deviceConnector/DeviceDetails";

import WebScanner from "./src/examples/webScanner/WebScanner";
import UniversalScanner from "./src/examples/universalScanner/Scanner";
import UniversalPlxScanner from "./src/examples/universalPlxScanner/Scanner";
import UniversalToggleArduinoLed from "./src/examples/universalArduinoLedPlx/ToggleArduinoLed";

const MainStack = createStackNavigator();
const RootStack = createStackNavigator();

function MainStackScreen() {
  return (
    <MainStack.Navigator>
      <MainStack.Screen name="Home" component={Home} options={{ title: "React Native and BLE" }} />
      <MainStack.Screen name="ToggleArduinoLed" component={ToggleArduinoLed} />
      <MainStack.Screen name="DeviceScannerPlxLibrary" component={ScannerPlx} />
      <MainStack.Screen name="NativeScanner" component={NativeScanner} />
      <MainStack.Screen name="BleDeviceConnector" component={DeviceConnector} />
      <MainStack.Screen name="WebScanner" component={WebScanner} />
      <MainStack.Screen name="UniversalScanner" component={UniversalScanner} />
      <MainStack.Screen name="UniversalPlxScanner" component={UniversalPlxScanner} />
      <MainStack.Screen name="UniversalToggleArduinoLedPlx" component={UniversalToggleArduinoLed} />
    </MainStack.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <RootStack.Navigator mode="modal" headerMode="none">
        <RootStack.Screen name="Main" component={MainStackScreen} />
        <RootStack.Screen name="DeviceDetails" component={DeviceDetails} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

export default App;
