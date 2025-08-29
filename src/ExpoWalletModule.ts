import { NativeModule, requireNativeModule } from 'expo';

import { ExpoWalletModuleEvents, AddPassResult } from './ExpoWallet.types';

declare class ExpoWalletModule extends NativeModule<ExpoWalletModuleEvents> {
  hello(): string;
  /**
   * iOS: Adds one or more pkpass files to Apple Wallet.
   * Android: Launches Google Wallet with JWT or save URL.
   * @param data For iOS: Array of file URIs to .pkpass files. For Android: JWT token or Google Wallet save URL.
   * @returns Promise resolving to AddPassResult
   */
  addPasses(data: string[] | string): Promise<AddPassResult>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoWalletModule >('ExpoWallet');
