# ReactNativeAndBluetooth

Shows different ideas how bluetooth can potentially be used with React Native

## Using react-native-ble-plx from Polidea

The first attempt to use bluetooth with react native is the library:
https://github.com/Polidea/react-native-ble-plx

It is open source and can easily be setup to get started with bluetooth and React Native.
I assume you were like me new to ejecting from expo and will thefore guide you through the steps necessary to get everything up and running.

Firstly ejecting is necessary as the react-native-ble-plx library currently does not have expo support.
Furthermore you will get some nice advantages from ejecting, e.g. InAppPurchases support.

To get some starting information please read through the expo docs where you find detailed information about the bare workflow:
https://docs.expo.io/bare/exploring-bare-workflow/

We will create a completely new project:

```javascript
# If you don't have expo-cli yet, get it
npm i -g expo-cli
Expo init # choose typescript, we will use it and pick a name

cd your_project

# adding react navigation as I will use this to navigate between screens
yarn add @react-navigation/native
yarn add react-native-reanimated react-native-gesture-handler react-native-screens react-native-safe-area-context @react-native-community/masked-view
yarn add @react-navigation/stack

#install the react native doctor to check if everything is ok with your environment
npm install -g @react-native-community/cli doctor
#run the tool
npx @react-native-community/cli doctor

# install bluetooth library
yarn add react-native-ble-plx

# used for showing bool values in ui
yarn add @react-native-community/checkbox

cd ios && pod install
#cd ios && arch -x86_64 pod install  #for macs with M1
```

### IOS

To use the library on iOS we need to do the following steps:

1. Open Xcode and open the workspace folder which you can find in your_project/ios/your_project.workspace
2. Create a single Swift file and name it however you want
3. When you're getting asked about creating a bridging file --> hit yes (if you missed that, delete the Swift file and create a new one)
4. If you want to use ble in the background of your app --> Click on your project --> signing & capabilities --> add cap --> background -> tick ble
5. If your using an M1 Mac go to "Build settings" --> choose all in the top left --> go to architectures --> exclude from ios simulator arm64 (this is needed to let the build succeed) more on this here: https://github.com/facebook/react-native/issues/29984

## Working simple example

The following code scans for bluetooth devices nearby and displays them in a list with its name, device id and rssi

```javascript
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
   Alert
 } from 'react-native';

 import { BleManager, Device } from 'react-native-ble-plx';

 export const manager = new BleManager();

 const Item = ({ device }: { device: Device }) => (
   <Pressable onPress={() => {return}} style={({ pressed }) => [
     {
       backgroundColor: pressed
         ? "#7799FF"
         : "#66CCFF"
     },
     styles.item
   ]}>
     <Text style={styles.title}>{device.localName ? device.localName : device.name}</Text>
     <Text style={styles.title}>{device.rssi}</Text>
     <Text style={styles.title}>{device.id}</Text>
   </Pressable>
 );


 const BluetoothTest = () => {
   const [isScanning, setIsScanning] = useState(false);
   const peripherals = new Map();
   const [list, setList] = useState<Device[] | []>([]);
   const [name, setName] = useState("test");
   const [permissionGranted, setPermissionGranted] = useState(true);

   React.useEffect(() => {
    console.log("use effect")
     manager.onStateChange((state) => {
      console.log("onStateChange")
       const subscription = manager.onStateChange((state) => {
         if (state === 'PoweredOn') {
           //this && scanAndConnect();
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
        message:
          "This is mandatory",
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
   }

   React.useEffect(() =>{
      if (Platform.OS === "android") {
        (async () => {
          await getPermissionOnAndroid();
      })();
    }
   },[])

   const clear = () => {
     setList([]);
     manager.stopDeviceScan();
     setName("");
   }

   const scanAndConnect = () => {
    console.log("scanAndConnect")
     manager.startDeviceScan(null, null, (error, device) => {
       if (error) {
         // Handle error (scanning will be stopped automatically)
         console.error  (error)
         return
       }

       // Check if it is a device you are looking for based on advertisement data
       // or other criteria.
       console.log(device?.name, device?.id)
       const name = device && device.name ? device.name : "";
       const id = device && device.id;
       //const localName = device && device.localName ? device.localName : "";
       const alreadyInList = list.find((data) => data.id == id);
       if (!alreadyInList && device) {
         const newList: Device[] = list;
         newList.push(device);
         setList(newList);
         setName(name);
       }


       /*if (device?.localName === 'LED') {
         setName(name);
         // Stop scanning as it's not necessary if you are scanning for one device.
         manager.stopDeviceScan();

         // Proceed with connection.
       }*/
     });
   }

   const renderItem = ({ item }: Device) => (
     <Item device={item} />
   );

   return (
     <View style={styles.container}>
       {permissionGranted ? (
       <SafeAreaView style={styles.container}>
       <View style={styles.buttonContainer}>
         <Button onPress={() => scanAndConnect()} title="Start scan"></Button>
         <Button onPress={() => { setName(""); manager.stopDeviceScan(); }} title="Stop scan"></Button>
         <Button onPress={() => clear()} title="Clear list"></Button>
       </View>

       <Text>{"Last found device: " + name}</Text>

       <FlatList
         data={list}
         renderItem={renderItem}
         keyExtractor={item => item.id}

         extraData={name}
       />
     </SafeAreaView>
       ) : (
         <Text>You need to provide me location permissions. This does not work otherwise. Now you have to reload ...</Text>
       )}

     </View>
   );
 };

 const styles = StyleSheet.create({
   container: {
     marginTop: "2%",
     flex: 1,
     justifyContent: "center",
     alignItems: "center",
   },
   buttonContainer: {
     flexDirection: 'row',
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
       height: 2,
     },
     shadowOpacity: 0.75,
     shadowRadius: 2,
     elevation: 5,
     borderRadius: 5,
     minWidth: "80%"
   },
   title: {
     fontSize: 12,
   },
 });

 export default BluetoothTest;

```
