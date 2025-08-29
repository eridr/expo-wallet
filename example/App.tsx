import { Asset } from 'expo-asset';
import { ExpoWallet } from 'expo-wallet';
import { Button, SafeAreaView, ScrollView, Text, View, Platform } from 'react-native';

const handleAddPKPass = async () => {
  try {
    // Load the pkpass asset and get its local URI (iOS)
    const asset = Asset.fromModule(require('./assets/pass.pkpass'));
    await asset.downloadAsync();
    const pkpassUri = asset.localUri;
    if (!pkpassUri) throw new Error('Could not load pkpass asset');
    
    // Use platform-aware wrapper
    const result = await ExpoWallet.addPKPasses([pkpassUri]);
    alert(`Added passes: ${result.added}`);
  } catch (error: unknown) {
    alert(`Error: ${(error as Error)?.message || error}`);
  }
};

const handleAddGoogleWallet = async () => {
  try {
    // Example Google Wallet save URL (Android)
    const googleWalletUrl = "https://pay.google.com/gp/v/save/eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9";
    const result = await ExpoWallet.addToGoogleWallet(googleWalletUrl);
    alert(`Added passes: ${result.added}`);
  } catch (error: unknown) {
    alert(`Error: ${(error as Error)?.message || error}`);
  }
};

export default function App() {

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        <Text style={styles.header}>Module API Example</Text>
        <Group name="Functions">
          <Text>{ExpoWallet.hello()}</Text>
        </Group>
        <Group name="Wallet">
          <Button 
            onPress={handleAddPKPass} 
            title={Platform.OS === 'ios' ? 'Add PKPass (iOS)' : 'Add PKPass (Cross-platform)'}
          />
          <Text style={{margin: 10}}/>
          <Button 
            onPress={handleAddGoogleWallet} 
            title={Platform.OS === 'android' ? 'Add Google Wallet (Android)' : 'Add Google Wallet (Cross-platform)'}
          />
        </Group>
      </ScrollView>
    </SafeAreaView>
  );
}

function Group(props: { name: string; children: React.ReactNode }) {
  return (
    <View style={styles.group}>
      <Text style={styles.groupHeader}>{props.name}</Text>
      {props.children}
    </View>
  );
}

const styles = {
  header: {
    fontSize: 30,
    margin: 20,
  },
  groupHeader: {
    fontSize: 20,
    marginBottom: 20,
  },
  group: {
    margin: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#eee',
  },
  view: {
    flex: 1,
    height: 200,
  },
};
