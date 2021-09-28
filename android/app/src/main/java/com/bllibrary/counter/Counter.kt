package com.bllibrary.counter

import android.util.Log
import com.facebook.react.bridge.Callback
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod


public class Counter(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext)   {

    /*CalendarModule(ReactApplicationContext context) {
        super(context);
    }*/
    /*fun constantsToExport() -> [AnyHashable : Any]! {
        return ["initialCount": 0]
    }*/

    private var count = 0

    @ReactMethod
    fun reset() {
        count = 0
        Log.d("Counter", "Reset counter");
    }

    @ReactMethod
    fun increment() {
        count += 1
        Log.d("Counter", "Incremented counter to: $count");
    }

    override fun getName(): String {
        return "Counter"
    }

    /*fun getCount(_ callback: RCTResponseSenderBlock) {
        callback([count])
    }*/

    @ReactMethod
    open fun getCount(callBack: Callback?) {
        callBack?.invoke(count)
    }
}