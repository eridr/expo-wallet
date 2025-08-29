export type ExpoWalletModuleEvents = {};

export type AddPassResult = {
  added: number;
  review?: boolean;
};

export type AddPassesOptions = {
  pkpassUris: string[];
} | {
  googleWalletData: string;
};
