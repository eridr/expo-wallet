import { registerWebModule, NativeModule } from 'expo';

import { ExpoWalletModuleEvents } from './ExpoWallet.types';

class ExpoWalletModule extends NativeModule<ExpoWalletModuleEvents> {
  hello() {
    return 'Hello world! 👋';
  }
}

export default registerWebModule(ExpoWalletModule, 'ExpoWalletModule');
