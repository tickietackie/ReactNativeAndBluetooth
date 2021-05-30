# ReactNativeAndBluetooth
Shows different ideas how bluetooth can potentially used with React Native


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

```
# If you don't have expo-cli yet, get it
npm i -g expo-cli
Expo init # choose typescript, we will use it and pick a name

cd your_project

#adding react navigation as I will use this 
yarn add @react-navigation/native
yarn add react-native-reanimated react-native-gesture-handler react-native-screens react-native-safe-area-context @react-native-community/masked-view

#install the react native doctor to check if everything is ok with your environment
npm install -g @react-native-community/cli doctor
#run the tool 
npx @react-native-community/cli doctor

# install bluetooth library
yarn add react-native-ble-plx
```

### IOS

To use the library on iOS we need to do the following steps:
1. Open Xcode and open the workspace folder which you can find in your_project/ios/your_project.workspace
2. Create a single Swift file and name it however you want
3. When you're getting asked about creating a bridging file --> hit yes (if you missed that, delete the Swift file and create a new one)
4. If you want to use ble in the background of your app --> Click on your project --> signing & capabilities --> add cap --> background -> tick ble
5. If your using an M1 Mac go to "Build settings" --> choose all in the top left --> go to architectures --> exclude from ios simulator arm64 (this is needed to let the build succeed) more on this here: https://github.com/facebook/react-native/issues/29984
