package expo.modules.wallet

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.net.URL

class ExpoWalletModule : Module() {
  // Each module class must implement the definition function. The definition consists of components
  // that describes the module's functionality and behavior.
  // See https://docs.expo.dev/modules/module-api for more details about available components.
  override fun definition() = ModuleDefinition {
    // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
    // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
    // The module will be accessible from `requireNativeModule('ExpoWallet')` in JavaScript.
    Name("ExpoWallet")

    // Defines a JavaScript synchronous function that runs the native code on the JavaScript thread.
    Function("hello") {
      "Hello world! 👋"
    }
    
      // Function to add passes to Google Wallet using a JWT or save URL
      // Accepts either a single string (JWT/URL) or array of strings for cross-platform compatibility
      AsyncFunction("addPasses") { data: Any ->
        val context = appContext.reactContext
        if (context == null) {
          throw Exception("No React context available")
        }

        val googleWalletData = when (data) {
          is String -> data
          is List<*> -> {
            // If array is passed (iOS-style), take first element as Google Wallet data
            if (data.isEmpty()) {
              throw Exception("Empty pass data provided")
            }
            data[0] as? String ?: throw Exception("Invalid pass data format")
          }
          else -> throw Exception("Invalid data type. Expected String or Array<String>")
        }
      
        // Google Wallet Save Passes intent
        // See: https://developers.google.com/wallet/retail/implement-save-passes
        val intent = android.content.Intent(android.content.Intent.ACTION_VIEW)
        intent.data = android.net.Uri.parse(googleWalletData)
        intent.setPackage("com.google.android.gms")
      
        // Start the intent
        context.startActivity(intent)
        mapOf("added" to 1)
      }

  }
}
