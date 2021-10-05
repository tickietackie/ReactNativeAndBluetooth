package com.bllibrary.bleManager

import android.app.Activity
import android.content.Intent
import android.net.Uri
import com.facebook.react.bridge.*

class ImagePickerModule internal constructor(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {
    private var mPickerPromise: Promise? = null
    private val mActivityEventListener: ActivityEventListener =
        object : BaseActivityEventListener() {
            override fun onActivityResult(
                activity: Activity?,
                requestCode: Int,
                resultCode: Int,
                intent: Intent
            ) {
                if (requestCode == IMAGE_PICKER_REQUEST) {
                    if (mPickerPromise != null) {
                        if (resultCode == Activity.RESULT_CANCELED) {
                            mPickerPromise!!.reject(E_PICKER_CANCELLED, "Image picker was cancelled")
                        } else if (resultCode == Activity.RESULT_OK) {
                            val uri: Uri? = intent.data
                            if (uri == null) {
                                mPickerPromise!!.reject(E_NO_IMAGE_DATA_FOUND, "No image data found")
                            } else {
                                mPickerPromise!!.resolve(uri.toString())
                            }
                        }
                        mPickerPromise = null
                    }
                }
            }
        }


    @ReactMethod
    fun pickImage(promise: Promise) {
        val currentActivity: Activity? = currentActivity
        if (currentActivity == null) {
            promise.reject(E_ACTIVITY_DOES_NOT_EXIST, "Activity doesn't exist")
            return
        }

        // Store the promise to resolve/reject when picker returns data
        mPickerPromise = promise
        try {
            val galleryIntent = Intent(Intent.ACTION_PICK)
            galleryIntent.type = "image/*"
            val chooserIntent = Intent.createChooser(galleryIntent, "Pick an image")
            currentActivity.startActivityForResult(chooserIntent, IMAGE_PICKER_REQUEST)
        } catch (e: Exception) {
            mPickerPromise!!.reject(E_FAILED_TO_SHOW_PICKER, e)
            mPickerPromise = null
        }
    }

    companion object {
        private const val IMAGE_PICKER_REQUEST = 1
        private const val E_ACTIVITY_DOES_NOT_EXIST = "E_ACTIVITY_DOES_NOT_EXIST"
        private const val E_PICKER_CANCELLED = "E_PICKER_CANCELLED"
        private const val E_FAILED_TO_SHOW_PICKER = "E_FAILED_TO_SHOW_PICKER"
        private const val E_NO_IMAGE_DATA_FOUND = "E_NO_IMAGE_DATA_FOUND"
    }

    init {

        // Add the listener for `onActivityResult`
        reactContext.addActivityEventListener(mActivityEventListener)
    }

    override fun getName(): String {
        return "hi"
    }
}