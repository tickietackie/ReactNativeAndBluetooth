/**
 * BluetoothPermission.android.tsx
 * Handle Bluetooth permission on Android
 * For the web and iOS this is already handled by the platform APIs
 *
 */

import { PermissionsAndroid } from "react-native";

interface IBluetoothPermission {
  setPermissionGranted: Function;
}

export default function BluetoothPermission({ setPermissionGranted }: IBluetoothPermission) {
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

  getPermissionOnAndroid();
}
