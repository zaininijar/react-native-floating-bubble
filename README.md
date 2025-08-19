# @zaininijar/react-native-floating-bubble

[![npm version](https://badge.fury.io/js/@zaininijar%2Freact-native-floating-bubble.svg)](https://badge.fury.io/js/@zaininijar%2Freact-native-floating-bubble)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Platform](https://img.shields.io/badge/platform-android%20%7C%20ios-lightgrey.svg)](https://github.com/zaininijar/react-native-floating-bubble)

Library React Native untuk membuat floating bubbles yang dapat berjalan di atas aplikasi lain pada Android dan iOS.

## ✨ Features

- 🎈 **Floating bubbles** yang dapat muncul di atas aplikasi lain (Android)
- 🎯 **Draggable interface** dengan position tracking real-time
- 🎨 **Customizable appearance** (ukuran, warna, teks, border, icon)
- 🔐 **Permission handling** otomatis untuk Android overlay
- 📱 **Cross-platform support** (Android & iOS)
- 💪 **TypeScript support** penuh dengan type definitions
- ⚡ **Node.js 18+ compatibility**
- 🔄 **Event handling** untuk perubahan posisi
- 📦 **Auto-linking** support untuk React Native 0.60+

## 📦 Installation

```bash
npm install @zaininijar/react-native-floating-bubble
```

### Setup untuk iOS

```bash
cd ios && pod install
```

### Setup untuk Android

Tidak perlu setup tambahan untuk Android. Library menggunakan auto-linking dan menangani permissions secara otomatis.

## 🚀 Quick Start

```typescript
import React from 'react';
import { View, Button, Alert } from 'react-native';
import ReactNativeFloatingBubble, {
  FloatingBubbleConfig,
} from '@zaininijar/react-native-floating-bubble';

const App = () => {
  const showBubble = async () => {
    try {
      // Konfigurasi bubble
      const config: FloatingBubbleConfig = {
        size: 100,
        backgroundColor: '#007AFF',
        text: '🎈',
        x: 50,
        y: 200,
        draggable: true,
      };
      
      // Request permission untuk Android
      const hasPermission = await ReactNativeFloatingBubble.hasOverlayPermission();
      if (!hasPermission) {
        const granted = await ReactNativeFloatingBubble.requestOverlayPermission();
        if (!granted) {
          Alert.alert('Error', 'Overlay permission diperlukan');
          return;
        }
      }
      
      // Tampilkan bubble
      const success = await ReactNativeFloatingBubble.show(config);
      if (success) {
        Alert.alert('Success', 'Floating bubble ditampilkan!');
      }
    } catch (error) {
      Alert.alert('Error', `Gagal menampilkan bubble: ${error}`);
    }
  };

  const hideBubble = async () => {
    await ReactNativeFloatingBubble.hide();
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Button title="Show Floating Bubble" onPress={showBubble} />
      <Button title="Hide Floating Bubble" onPress={hideBubble} />
    </View>
  );
};

export default App;
```

## 📚 API Reference

### Methods

#### `show(config: FloatingBubbleConfig): Promise<boolean>`

Menampilkan floating bubble dengan konfigurasi yang ditentukan.

**Parameters:**
- `config`: Objek konfigurasi bubble (lihat [FloatingBubbleConfig](#floatingbubbleconfig))

**Returns:** `Promise<boolean>` - Status keberhasilan

#### `hide(): Promise<boolean>`

Menyembunyikan floating bubble yang sedang ditampilkan.

**Returns:** `Promise<boolean>` - Status keberhasilan

#### `isVisible(): Promise<boolean>`

Memeriksa apakah floating bubble sedang ditampilkan.

**Returns:** `Promise<boolean>` - Status visibility

#### `updatePosition(position: FloatingBubblePosition): Promise<boolean>`

Mengupdate posisi floating bubble.

**Parameters:**
- `position`: Objek posisi baru `{x: number, y: number}`

**Returns:** `Promise<boolean>` - Status keberhasilan

#### `getPosition(): Promise<FloatingBubblePosition | null>`

Mendapatkan posisi saat ini dari floating bubble.

**Returns:** `Promise<FloatingBubblePosition | null>` - Posisi saat ini atau null jika tidak visible

#### `updateConfig(config: FloatingBubbleConfig): Promise<boolean>`

Mengupdate konfigurasi floating bubble.

**Parameters:**
- `config`: Konfigurasi baru untuk bubble

**Returns:** `Promise<boolean>` - Status keberhasilan

#### `requestOverlayPermission(): Promise<boolean>` (Android only)

Meminta permission overlay dari user.

**Returns:** `Promise<boolean>` - Status permission yang diberikan

#### `hasOverlayPermission(): Promise<boolean>` (Android only)

Memeriksa apakah overlay permission sudah diberikan.

**Returns:** `Promise<boolean>` - Status permission

### Types

#### FloatingBubbleConfig

```typescript
interface FloatingBubbleConfig {
  size?: number;              // Ukuran bubble dalam pixels (default: 100)
  backgroundColor?: string;   // Warna background (default: system blue)
  borderColor?: string;       // Warna border
  borderWidth?: number;       // Lebar border
  x?: number;                // Posisi X awal (default: 0)
  y?: number;                // Posisi Y awal (default: 100)
  draggable?: boolean;       // Apakah bubble bisa di-drag (default: true)
  icon?: string;             // Icon bubble (base64 atau nama gambar lokal)
  text?: string;             // Konten teks
  textColor?: string;        // Warna teks (default: white)
  textSize?: number;         // Ukuran teks (default: 16)
}
```

#### FloatingBubblePosition

```typescript
interface FloatingBubblePosition {
  x: number;  // Koordinat X
  y: number;  // Koordinat Y
}
```

## 🎨 Customization Examples

### Bubble dengan Custom Style

```typescript
const customBubble = {
  size: 120,
  backgroundColor: '#FF6B6B',
  borderColor: '#FFFFFF',
  borderWidth: 3,
  text: '💬',
  textColor: '#FFFFFF',
  textSize: 24,
  x: 100,
  y: 300,
  draggable: true,
};

await ReactNativeFloatingBubble.show(customBubble);
```

### Bubble dengan Icon

```typescript
const iconBubble = {
  size: 80,
  backgroundColor: '#4ECDC4',
  icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
  draggable: false,
};

await ReactNativeFloatingBubble.show(iconBubble);
```

### Position Tracking

```typescript
// Mendapatkan posisi saat ini
const position = await ReactNativeFloatingBubble.getPosition();
if (position) {
  console.log(`Bubble position: X=${position.x}, Y=${position.y}`);
}

// Mengupdate posisi
const newPosition = { x: 200, y: 400 };
await ReactNativeFloatingBubble.updatePosition(newPosition);
```

## 📱 Platform Differences

### Android
- ✅ Memerlukan `SYSTEM_ALERT_WINDOW` permission
- ✅ Otomatis request overlay permission saat diperlukan
- ✅ Support floating di atas aplikasi lain
- ✅ Menggunakan `WindowManager` untuk overlay functionality
- ✅ Gesture detection untuk drag & drop

### iOS
- ✅ Tidak memerlukan permission khusus
- ✅ Menggunakan `UIWindow` dengan high window level
- ⚠️ Terbatas pada floating dalam konteks aplikasi (iOS restrictions)
- ✅ Smooth drag interaction dengan pan gesture
- ⚠️ Tidak dapat float di atas aplikasi lain karena pembatasan iOS

## 🔧 Troubleshooting

### Android Issues

#### Permission Denied
```typescript
// Pastikan untuk request permission terlebih dahulu
const hasPermission = await ReactNativeFloatingBubble.hasOverlayPermission();
if (!hasPermission) {
  await ReactNativeFloatingBubble.requestOverlayPermission();
}
```

#### Bubble Tidak Muncul
- Pastikan overlay permission sudah diberikan
- Cek apakah ada aplikasi lain yang menggunakan overlay
- Restart aplikasi setelah memberikan permission

### iOS Issues

#### Bubble Tidak Terlihat
- Pastikan posisi bubble berada dalam bounds layar
- Cek apakah ada view lain yang menutupi bubble
- Pastikan `windowLevel` tidak konflik dengan UI lain

### General Issues

#### TypeScript Errors
```bash
# Install type definitions jika diperlukan
npm install --save-dev @types/react-native
```

#### Build Errors
```bash
# Clean dan rebuild project
cd android && ./gradlew clean && cd ..
cd ios && rm -rf build && cd ..
npx react-native run-android
# atau
npx react-native run-ios
```

## 📋 Requirements

- React Native >= 0.60
- Node.js >= 18
- iOS >= 11.0
- Android API >= 21
- TypeScript >= 4.5 (opsional)

## 🎯 Example App

Library ini dilengkapi dengan example app yang mendemonstrasikan semua fitur:

```bash
# Clone repository
git clone https://github.com/zaininijar/react-native-floating-bubble.git
cd react-native-floating-bubble/example

# Install dependencies
npm install

# Run example
npm run android  # atau npm run ios
```

## 🤝 Contributing

Kontribusi sangat diterima! Silakan buat Pull Request atau buka Issue untuk bug reports dan feature requests.

### Development Setup

```bash
# Clone repository
git clone https://github.com/zaininijar/react-native-floating-bubble.git
cd react-native-floating-bubble

# Install dependencies
npm install

# Build library
npm run prepack

# Run example app
cd example
npm install
npm run android
```

## 📄 License

MIT License - lihat file [LICENSE](LICENSE) untuk detail.

## 🙏 Acknowledgments

- Terinspirasi oleh kebutuhan floating UI elements di mobile apps
- Menggunakan React Native's native module architecture
- Built dengan TypeScript untuk better developer experience

## 📞 Support

Jika Anda menemukan library ini berguna, silakan berikan ⭐ di GitHub!

Untuk pertanyaan atau dukungan:
- 📧 Email: [your-email@example.com]
- 🐛 Issues: [GitHub Issues](https://github.com/zaininijar/react-native-floating-bubble/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/zaininijar/react-native-floating-bubble/discussions)

---

**Made with ❤️ for React Native Community**