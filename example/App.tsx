import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  TextInput,
  Switch,
} from 'react-native';

import ReactNativeFloatingBubble, {
  FloatingBubbleConfig,
  FloatingBubblePosition,
} from 'react-native-floating-bubble';

const App = (): JSX.Element => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [position, setPosition] = useState<FloatingBubblePosition | null>(null);
  
  // Configuration state
  const [config, setConfig] = useState<FloatingBubbleConfig>({
    size: 100,
    backgroundColor: '#007AFF',
    borderColor: '#FFFFFF',
    borderWidth: 2,
    x: 50,
    y: 200,
    draggable: true,
    text: '🎈',
    textColor: '#FFFFFF',
    textSize: 30,
  });

  useEffect(() => {
    checkPermission();
    checkVisibility();
  }, []);

  const checkPermission = async () => {
    try {
      const permission = await ReactNativeFloatingBubble.hasOverlayPermission();
      setHasPermission(permission);
    } catch (error) {
      console.error('Error checking permission:', error);
    }
  };

  const checkVisibility = async () => {
    try {
      const visible = await ReactNativeFloatingBubble.isVisible();
      setIsVisible(visible);
      if (visible) {
        const pos = await ReactNativeFloatingBubble.getPosition();
        setPosition(pos);
      }
    } catch (error) {
      console.error('Error checking visibility:', error);
    }
  };

  const requestPermission = async () => {
    try {
      const granted = await ReactNativeFloatingBubble.requestOverlayPermission();
      if (granted) {
        setHasPermission(true);
        Alert.alert('Success', 'Overlay permission granted!');
      } else {
        Alert.alert('Error', 'Overlay permission denied');
      }
    } catch (error) {
      Alert.alert('Error', `Failed to request permission: ${error}`);
    }
  };

  const showBubble = async () => {
    try {
      if (!hasPermission) {
        Alert.alert('Permission Required', 'Please grant overlay permission first');
        return;
      }
      
      const success = await ReactNativeFloatingBubble.show(config);
      if (success) {
        setIsVisible(true);
        Alert.alert('Success', 'Floating bubble shown!');
      } else {
        Alert.alert('Error', 'Failed to show floating bubble');
      }
    } catch (error) {
      Alert.alert('Error', `Failed to show bubble: ${error}`);
    }
  };

  const hideBubble = async () => {
    try {
      const success = await ReactNativeFloatingBubble.hide();
      if (success) {
        setIsVisible(false);
        setPosition(null);
        Alert.alert('Success', 'Floating bubble hidden!');
      } else {
        Alert.alert('Error', 'Failed to hide floating bubble');
      }
    } catch (error) {
      Alert.alert('Error', `Failed to hide bubble: ${error}`);
    }
  };

  const updatePosition = async () => {
    try {
      const newPosition = { x: Math.random() * 200, y: Math.random() * 400 + 100 };
      const success = await ReactNativeFloatingBubble.updatePosition(newPosition);
      if (success) {
        setPosition(newPosition);
        Alert.alert('Success', 'Position updated!');
      } else {
        Alert.alert('Error', 'Failed to update position');
      }
    } catch (error) {
      Alert.alert('Error', `Failed to update position: ${error}`);
    }
  };

  const getPosition = async () => {
    try {
      const pos = await ReactNativeFloatingBubble.getPosition();
      setPosition(pos);
      if (pos) {
        Alert.alert('Position', `X: ${pos.x}, Y: ${pos.y}`);
      } else {
        Alert.alert('Position', 'Bubble is not visible');
      }
    } catch (error) {
      Alert.alert('Error', `Failed to get position: ${error}`);
    }
  };

  const updateConfig = async () => {
    try {
      const success = await ReactNativeFloatingBubble.updateConfig(config);
      if (success) {
        Alert.alert('Success', 'Configuration updated!');
      } else {
        Alert.alert('Error', 'Failed to update configuration');
      }
    } catch (error) {
      Alert.alert('Error', `Failed to update config: ${error}`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Floating Bubble Example</Text>
          <Text style={styles.subtitle}>Test React Native Floating Bubble Library</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Status</Text>
          <Text style={styles.statusText}>Permission: {hasPermission ? '✅ Granted' : '❌ Not Granted'}</Text>
          <Text style={styles.statusText}>Bubble Visible: {isVisible ? '✅ Yes' : '❌ No'}</Text>
          {position && (
            <Text style={styles.statusText}>Position: X: {position.x.toFixed(0)}, Y: {position.y.toFixed(0)}</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actions</Text>
          
          {!hasPermission && (
            <TouchableOpacity style={styles.button} onPress={requestPermission}>
              <Text style={styles.buttonText}>Request Permission</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={[styles.button, isVisible && styles.buttonDisabled]} 
            onPress={showBubble}
            disabled={isVisible}
          >
            <Text style={styles.buttonText}>Show Bubble</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, !isVisible && styles.buttonDisabled]} 
            onPress={hideBubble}
            disabled={!isVisible}
          >
            <Text style={styles.buttonText}>Hide Bubble</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, !isVisible && styles.buttonDisabled]} 
            onPress={updatePosition}
            disabled={!isVisible}
          >
            <Text style={styles.buttonText}>Random Position</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.button} onPress={getPosition}>
            <Text style={styles.buttonText}>Get Position</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, !isVisible && styles.buttonDisabled]} 
            onPress={updateConfig}
            disabled={!isVisible}
          >
            <Text style={styles.buttonText}>Update Config</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configuration</Text>
          
          <View style={styles.configRow}>
            <Text style={styles.configLabel}>Size:</Text>
            <TextInput
              style={styles.configInput}
              value={config.size?.toString()}
              onChangeText={(text) => setConfig({...config, size: parseInt(text) || 100})}
              keyboardType="numeric"
              placeholder="100"
            />
          </View>
          
          <View style={styles.configRow}>
            <Text style={styles.configLabel}>Background Color:</Text>
            <TextInput
              style={styles.configInput}
              value={config.backgroundColor}
              onChangeText={(text) => setConfig({...config, backgroundColor: text})}
              placeholder="#007AFF"
            />
          </View>
          
          <View style={styles.configRow}>
            <Text style={styles.configLabel}>Text:</Text>
            <TextInput
              style={styles.configInput}
              value={config.text}
              onChangeText={(text) => setConfig({...config, text})}
              placeholder="🎈"
            />
          </View>
          
          <View style={styles.configRow}>
            <Text style={styles.configLabel}>Draggable:</Text>
            <Switch
              value={config.draggable}
              onValueChange={(value) => setConfig({...config, draggable: value})}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 15,
  },
  statusText: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  configRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  configLabel: {
    fontSize: 16,
    color: '#333333',
    width: 120,
  },
  configInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
});

export default App;