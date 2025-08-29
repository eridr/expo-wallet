import { NativeModule, requireNativeModule } from 'expo';

import { ExpoWalletModuleEvents } from './ExpoWallet.types';

declare class ExpoWalletModule extends NativeModule<ExpoWalletModuleEvents> {
  hello(): string;
  /**
   * Adds one or more pkpass files to Apple Wallet.
   * @param pkpassUris Array of file URIs to .pkpass files
   * @returns Promise resolving to { added: number }
   */
  addPasses(pkpassUris: string[]): Promise<{ added: number }>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoWalletModule >('ExpoWallet');
