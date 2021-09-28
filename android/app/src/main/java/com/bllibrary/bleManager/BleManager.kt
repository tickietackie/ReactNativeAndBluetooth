package com.bllibrary.bleManager

//import androidx.core.content.ContextCompat.getSystemService
import android.bluetooth.BluetoothAdapter
import android.bluetooth.BluetoothManager
import android.bluetooth.le.ScanCallback
import android.bluetooth.le.ScanResult
import android.bluetooth.le.ScanSettings
import android.content.ContentProvider
import android.content.Context
import android.util.Log
import android.view.*
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import java.security.AccessController.getContext
import java.util.*
import android.Manifest
import android.bluetooth.le.BluetoothLeScanner
import android.content.Intent
import android.content.pm.PackageManager
import android.database.DatabaseUtils
import android.os.Build
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.os.Handler
import androidx.core.app.ActivityCompat
import androidx.core.content.ContentProviderCompat.requireContext
import androidx.core.content.ContextCompat
import androidx.drawerlayout.widget.DrawerLayout
import java.util.*
import android.app.Activity
import android.bluetooth.BluetoothDevice
import android.companion.AssociationRequest
import android.companion.BluetoothLeDeviceFilter
import android.companion.CompanionDeviceManager
import android.content.IntentSender
import android.os.Looper
import android.view.*
import androidx.core.content.ContextCompat.getSystemService
import androidx.core.content.PermissionChecker
import androidx.fragment.app.Fragment
import android.view.*
import com.facebook.react.bridge.Callback
import java.util.*


class BleManager (mContext: Context)   {
    //private var isScanning = false

    //private val scanResults = mutableListOf<ScanResult>()
    //private var mBluetoothAdapter: BluetoothAdapter? = null

    // From the previous section:
    /*private val bluetoothAdapter: BluetoothAdapter by lazy {
        /*val bluetoothManager = getSystemService(Context.BLUETOOTH_SERVICE) as BluetoothManager
        bluetoothManager.adapter*/
        val bluetoothManager = getSystemService(Context.BLUETOOTH_SERVICE) as BluetoothManager
        bluetoothManager.adapter
    }*/

    /*private val bluetoothLeScanner: BluetoothLeScanner
        get() {
            val bluetoothManager = requireContext().getSystemService(Context.BLUETOOTH_SERVICE) as BluetoothManager
            val bluetoothAdapter = bluetoothManager.adapter
            return bluetoothAdapter.bluetoothLeScanner
        }*/

    /*
    // Device scan callback.
    private val leScanCallback = object : ScanCallback() {
        override fun onScanResult(callbackType: Int, result: ScanResult) {
            super.onScanResult(callbackType, result)
            //TODO TEST TEST TEST
            Log.d("ScanDeviceActivity", "leScanCallback >>")
            Log.d("ScanDeviceActivity", "onScanResult(): ${result?.device?.address} - ${result?.device?.name}")
        }
        override fun onBatchScanResults(results: MutableList<ScanResult>?) {
            super.onBatchScanResults(results)
            Log.d("DeviceListActivity","onBatchScanResults:${results.toString()}")
        }

        override fun onScanFailed(errorCode: Int) {
            super.onScanFailed(errorCode)
            Log.d("DeviceListActivity", "onScanFailed: $errorCode")
        }
    }
    private var scanning = false
    private val handler = Handler()
    // Stops scanning after 10 seconds.
    private val SCAN_PERIOD: Long = 5000


    private fun scanBleDevice() {
               val bluetoothManager = context?.getSystemService(Context.BLUETOOTH_SERVICE) as BluetoothManager
               val bluetoothAdapter = bluetoothManager.adapter
              val bluetoothLeScanner = bluetoothAdapter.bluetoothLeScanner
        if (!scanning) { // Stops scanning after a pre-defined scan period.
            handler.postDelayed({
                scanning = false
                bluetoothLeScanner.stopScan(scanCallback)
            }, SCAN_PERIOD)
            scanning = true
            Log.d("ReactNative", "start scan nvm")
            bluetoothLeScanner.startScan(leScanCallback)
            //PERMISSION COARSE LOCATION

            when (PermissionChecker.checkSelfPermission(requireContext(), Manifest.permission.ACCESS_COARSE_LOCATION)) {
                PackageManager.PERMISSION_GRANTED -> {
                    Log.d("ReactNative", "permission granted --> start scan")
                    bluetoothLeScanner.startScan(scanCallback)
                }
                else -> {
                    Log.d("ReactNative", "failed to start scan()")
                    requestPermissions(arrayOf(Manifest.permission.ACCESS_COARSE_LOCATION), 1)
                }
            }
        } else {
            Log.d("ReactNative", "Stop Scan")
            scanning = false
            bluetoothLeScanner.stopScan(scanCallback)
        }
    }

    private val scanSettings = ScanSettings.Builder()
        .setScanMode(ScanSettings.SCAN_MODE_LOW_LATENCY)
        .build()

    fun start() {
        scanResults.clear()
        //scanResultAdapter.notifyDataSetChanged()
        //bleScanner.startScan(null, scanSettings, scanCallback)
        Log.d("ReactNative", "start Scan function")
        scanBleDevice()
    }


    private val scanCallback = object : ScanCallback() {
        override fun onScanResult(callbackType: Int, result: ScanResult) {
            Log.d("React Native", "scan call back")
            val indexQuery = scanResults.indexOfFirst { it.device.address == result.device.address }
            if (indexQuery != -1) { // A scan result already exists with the same address
                scanResults[indexQuery] = result
                //scanResultAdapter.notifyItemChanged(indexQuery)
            } else {
                with(result.device) {
                    Log.d("ScanCallback", "Found BLE device! Name: ${name ?: "Unnamed"}, address: $address")
                }
                Log.d("ScanCallback", "test")
                scanResults.add(result)
                //scanResultAdapter.notifyItemInserted(scanResults.size - 1)
            }
        }

        override fun onScanFailed(errorCode: Int) {
            Log.i("ScanCallback", "onScanFailed: code $errorCode")
        }
    }

    fun clear() {
        scanResults.clear()
    }

    fun stop() {
        scanning = false
        //bluetoothLeScanner.stopScan(scanCallback)
    }

    fun getDeviceList(): MutableList<ScanResult> {
        Log.d("ReactNative", scanResults.toString())
        return scanResults;
    }*/


    // TODO: Rename parameter arguments, choose names that match
// the fragment initialization parameters, e.g. ARG_ITEM_NUMBER


        private val scanResults = mutableListOf<ScanResult>()

        //private var handler: Handler? = null

        private val bluetoothAdapter: BluetoothAdapter by lazy {
            val bluetoothManager = mContext.getSystemService(Context.BLUETOOTH_SERVICE) as BluetoothManager
            bluetoothManager.adapter
        }

        private val bleScanner by lazy {
            bluetoothAdapter.bluetoothLeScanner
        }

        // Device scan callback.
        private val leScanCallback = object : ScanCallback() {
            override fun onScanResult(callbackType: Int, result: ScanResult) {
                super.onScanResult(callbackType, result)
                val indexQuery = scanResults.indexOfFirst { it.device.address == result.device.address }
                if (indexQuery != -1) { // A scan result already exists with the same address
                    scanResults[indexQuery] = result
                } else {
                    with(result.device) {
                        Log.d("ScanActivity","Found BLE device! Name: ${name ?: "Unnamed"}, address: $address")
                    }
                    scanResults.add(result)
                }
            }
            override fun onBatchScanResults(results: MutableList<ScanResult>?) {
                super.onBatchScanResults(results)
                Log.d("DeviceListActivity","onBatchScanResults:${results.toString()}")
            }

            override fun onScanFailed(errorCode: Int) {
                super.onScanFailed(errorCode)
                Log.d("DeviceListActivity", "onScanFailed: $errorCode")
            }
        }

        private var scanning = false
        // Stops scanning after 10 seconds.
        private val SCAN_PERIOD: Long = 6500

        var handler = Handler(Looper.getMainLooper())

        fun scanLeDevice() {
            if (!scanning) { // Stops scanning after a pre-defined scan period.
                scanResults.clear()
                handler?.postDelayed({
                    scanning = false
                    Log.d("ScanActicity", "stopped scan after ${SCAN_PERIOD} msecs")
                    bleScanner?.stopScan(leScanCallback)
                }, SCAN_PERIOD)
                scanning = true
                Log.d("ScanActicity", "start scan")
                bleScanner?.startScan(leScanCallback)
            } else {
                scanning = false
                Log.d("ScanActicity", "stop scan")
                bleScanner?.stopScan(leScanCallback)
            }

            /*scanResults.clear()
            //scanResultAdapter.notifyDataSetChanged()
            bleScanner.startScan(leScanCallback)
            //isScanning = true
            */


        }

        fun stopBleScan() {
            bleScanner.stopScan(leScanCallback)
            //isScanning = false
        }

        fun clear() {
            scanResults.clear()
        }

        fun getDeviceList(): MutableList<ScanResult> {
            Log.d("ReactNative", "Returning ${scanResults.count().toString()} scanned devices")
            return scanResults;
        }

        companion object {
            val LOCATION_PERMISSIONS = arrayOf(
                Manifest.permission.ACCESS_FINE_LOCATION,
                Manifest.permission.ACCESS_COARSE_LOCATION
            )
        }
}