package com.upworkelite.messay

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {

  /**
   * Returns the name of the main component registered from JavaScript.
   *
   * IMPORTANT :
   * - Ce nom doit être STRICTEMENT identique au champ "name" dans app.json
   * - Actuellement, app.json contient : "name": "messay"
   * - On aligne donc ici sur "messay" (tout en minuscule)
   */
  override fun getMainComponentName(): String = "messay"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
