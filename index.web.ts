/* import { AppRegistry } from 'react-native';
//import { name as appName } from './app.json';
import App from './AppNavigator';

 AppRegistry.registerComponent("App", () => App);

AppRegistry.runApplication(appName, {
  initialProps: {},
  rootTag: document.getElementById('app-root'),
}); */

import "react-native-gesture-handler";
import { AppRegistry } from "react-native";
import App from "./AppNavigator";
// import App from "./src/App";

AppRegistry.registerComponent("App", () => App);

AppRegistry.runApplication("App", {
  rootTag: document.getElementById("root")
});

/* AppRegistry.registerComponent('root', () => App);
AppRegistry.runApplication("bllibrary", {
  initialProps: {},
  rootTag: document.getElementById('app-root'),
}) */
