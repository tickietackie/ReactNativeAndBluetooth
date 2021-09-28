package com.bllibrary.bleManager

//import androidx.core.content.ContextCompat.getSystemService

import android.util.Log
import android.view.*
import com.facebook.react.bridge.*
import java.util.*


class BleManagerBridge (reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext)   {
    override fun getName(): String {
        return ("BluetoothManager")
    }

    private var bleManager: BleManager? = BleManager(reactContext)

    @ReactMethod
    fun start() {
        Log.d("ReactNative", "startScan bridge()")
        bleManager?.scanLeDevice()
    }

    @ReactMethod
    fun stop() {
        Log.d("ReactNative", "stop scan bridge()")
        bleManager?.stopBleScan()
    }

    @ReactMethod
    fun clear() {
        Log.d("ReactNative", "clear bridge")
        bleManager?.clear()
    }

    @ReactMethod
    open fun getPeripherals(callBack: Callback?) {
        Log.d("ReactNative", "Got peripherals bridge")
        //callback.invoke( bleManager?.getDeviceList())
        //var name : String? = bleManager?.getDeviceList()?.first()?.device?.address
        //Log.d("ReactNative", bleManager?.getDeviceList()?.size.toString())
        //Log.d("ReactNative", name ?: "Unnamed")
        val devices = Arguments.createArray()

        bleManager?.getDeviceList()?.forEach {
            val device = Arguments.createMap()
            device.putString("id", it.device.address)
            device.putString("name", it.device.name)
            device.putString("rssi", it.rssi.toString())
            devices.pushMap(device);
        }

        callBack?.invoke(devices)
    }

}