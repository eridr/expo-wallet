import { Platform } from 'expo-modules-core';
import ExpoWalletModule from './ExpoWalletModule';
import { AddPassResult, AddPassesOptions } from './ExpoWallet.types';

export class ExpoWallet {
  /**
   * Adds passes to the user's wallet.
   * - iOS: Adds PKPass files to Apple Wallet
   * - Android: Launches Google Wallet with JWT or save URL
   */
  static async addPasses(options: AddPassesOptions): Promise<AddPassResult> {
    try {
      if (Platform.OS === 'ios') {
        // iOS expects array of pkpass URIs
        if ('pkpassUris' in options) {
          if (!Array.isArray(options.pkpassUris)) {
            throw new Error('pkpassUris must be an array');
          }
          if (options.pkpassUris.length === 0) {
            throw new Error('pkpassUris array cannot be empty');
          }
          // Validate URIs
          for (const uri of options.pkpassUris) {
            if (typeof uri !== 'string' || uri.trim() === '') {
              throw new Error('All pkpass URIs must be non-empty strings');
            }
          }
          return await ExpoWalletModule.addPasses(options.pkpassUris);
        } else {
          throw new Error('iOS requires pkpassUris array');
        }
      } else if (Platform.OS === 'android') {
        // Android expects Google Wallet JWT or save URL
        if ('googleWalletData' in options) {
          if (typeof options.googleWalletData !== 'string' || options.googleWalletData.trim() === '') {
            throw new Error('googleWalletData must be a non-empty string');
          }
          return await ExpoWalletModule.addPasses(options.googleWalletData);
        } else if ('pkpassUris' in options) {
          // For cross-platform compatibility, accept pkpass array and use first element
          if (!Array.isArray(options.pkpassUris)) {
            throw new Error('pkpassUris must be an array');
          }
          if (options.pkpassUris.length === 0) {
            throw new Error('Empty pkpass array provided');
          }
          if (typeof options.pkpassUris[0] !== 'string' || options.pkpassUris[0].trim() === '') {
            throw new Error('First pkpass URI must be a non-empty string');
          }
          return await ExpoWalletModule.addPasses(options.pkpassUris);
        } else {
          throw new Error('Android requires googleWalletData string or pkpassUris array');
        }
      } else {
        throw new Error(`Platform ${Platform.OS} is not supported. Only iOS and Android are supported.`);
      }
    } catch (error) {
      // Enhance error messages with platform context
      if (error instanceof Error) {
        throw new Error(`[${Platform.OS}] ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Convenience method for iOS PKPass files
   */
  static async addPKPasses(pkpassUris: string[]): Promise<AddPassResult> {
    if (!Array.isArray(pkpassUris)) {
      throw new Error('pkpassUris must be an array');
    }
    return this.addPasses({ pkpassUris });
  }

  /**
   * Convenience method for Google Wallet
   */
  static async addToGoogleWallet(jwtOrSaveUrl: string): Promise<AddPassResult> {
    if (typeof jwtOrSaveUrl !== 'string') {
      throw new Error('jwtOrSaveUrl must be a string');
    }
    return this.addPasses({ googleWalletData: jwtOrSaveUrl });
  }

  static hello(): string {
    return ExpoWalletModule.hello();
  }
}