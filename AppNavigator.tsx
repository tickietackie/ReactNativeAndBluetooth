import * as React from 'react';
import { View, Text, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './screens/home/Home';

import NativeScanner from './screens/examples/nativeScanner/NativeScanner';
import ToggleArduinoLed from './screens/examples/arduinoLed/ToggleArduinoLed';
import ScannerPlx from './screens/examples/plxLibraryScanner/plxScanner';
import DeviceConnector from './screens/examples/deviceConnector/ListDevices';
import DeviceDetails from './screens/examples/deviceConnector/DeviceDetails';

const MainStack = createStackNavigator();
const RootStack = createStackNavigator();

function MainStackScreen() {
  return (
    <MainStack.Navigator>
      <MainStack.Screen name="Home" component={Home} options={{ title: 'React Native and BLE' }} />
      <MainStack.Screen name="ToggleArduinoLed" component={ToggleArduinoLed} />
      <MainStack.Screen name="DeviceScannerPlxLibrary" component={ScannerPlx} />
      <MainStack.Screen name="NativeScanner" component={NativeScanner} />
      <MainStack.Screen name="BleDeviceConnector" component={DeviceConnector} />
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
