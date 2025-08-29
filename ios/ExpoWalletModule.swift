import ExpoModulesCore
import PassKit


public class ExpoWalletModule: Module {
  // Each module class must implement the definition function. The definition consists of components
  // that describes the module's functionality and behavior.
  // See https://docs.expo.dev/modules/module-api for more details about available components.
  public func definition() -> ModuleDefinition {
    // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
    // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
    // The module will be accessible from `requireNativeModule('ExpoWallet')` in JavaScript.
    Name("ExpoWallet")

    // Defines a JavaScript synchronous function that runs the native code on the JavaScript thread.
    Function("hello") {
      return "Hello world! 👋"
    }
      

    // Expose addPasses method to JS, accepts pkpass file URI
    // Accepts an array of pkpass URIs
    AsyncFunction("addPasses") { (pkpassUris: [String], promise: Promise) in
      var passes: [PKPass] = []
      for uri in pkpassUris {
        guard let url = URL(string: uri), url.isFileURL else {
          promise.reject("ERR_INVALID_URI", "Invalid pkpass URI: \(uri)")
          return
        }
        do {
          let passData = try Data(contentsOf: url)
          let pass = try PKPass(data: passData)
          passes.append(pass)
        } catch {
          promise.reject("ERR_PASS_LOAD", "Failed to load pass: \(uri), \(error.localizedDescription)")
          return
        }
      }
      let passLibrary = PKPassLibrary()
      passLibrary.addPasses(passes) { status in
        switch status {
        case .didAddPasses:
          promise.resolve(["added": passes.count])
        case .shouldReviewPasses:
          promise.resolve(["review": true, "added": passes.count])
        case .didCancelAddPasses:
          promise.reject("ERR_ADD_PASS_CANCELLED", "User cancelled adding passes.")
        @unknown default:
          promise.reject("ERR_ADD_PASS_UNKNOWN", "Unknown status.")
        }
      }
    }

  }
}
