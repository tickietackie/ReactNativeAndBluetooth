package com.bllibrary.bleManager

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager
import java.util.*

/*
Once a native module is written, it needs to be registered with React Native.
In order to do so, you need to add your native module to a ReactPackage and register the ReactPackage with React Native.
During initialization, React Native will loop over all packages, and for each ReactPackage, register each native module within.

React Native invokes the method createNativeModules() on a ReactPackage in order to get the list of native modules to register.
For Android, if a module is not instantiated and returned in createNativeModules it will not be available from JavaScript.

 */
class BleManagerPackage : ReactPackage {
    override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
        val modules = ArrayList<NativeModule>()
        modules.add(BleManagerBridge(reactContext))
        return modules
    }

    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
        return Collections.emptyList<ViewManager<*, *>>()
    }

}