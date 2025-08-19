import { NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  `The package 'react-native-floating-bubble' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'cd ios && pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const FloatingBubble = NativeModules.FloatingBubble
  ? NativeModules.FloatingBubble
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export interface FloatingBubbleConfig {
  /** Bubble size in pixels */
  size?: number;
  /** Bubble background color */
  backgroundColor?: string;
  /** Bubble border color */
  borderColor?: string;
  /** Bubble border width */
  borderWidth?: number;
  /** Initial X position */
  x?: number;
  /** Initial Y position */
  y?: number;
  /** Whether bubble can be dragged */
  draggable?: boolean;
  /** Bubble icon (base64 string or local image name) */
  icon?: string;
  /** Bubble text content */
  text?: string;
  /** Text color */
  textColor?: string;
  /** Text size */
  textSize?: number;
}

export interface FloatingBubblePosition {
  x: number;
  y: number;
}

export class ReactNativeFloatingBubble {
  /**
   * Show floating bubble with specified configuration
   * @param config Bubble configuration
   * @returns Promise<boolean> Success status
   */
  static async show(config: FloatingBubbleConfig = {}): Promise<boolean> {
    try {
      return await FloatingBubble.show(config);
    } catch (error) {
      console.error('FloatingBubble.show error:', error);
      return false;
    }
  }

  /**
   * Hide the floating bubble
   * @returns Promise<boolean> Success status
   */
  static async hide(): Promise<boolean> {
    try {
      return await FloatingBubble.hide();
    } catch (error) {
      console.error('FloatingBubble.hide error:', error);
      return false;
    }
  }

  /**
   * Check if floating bubble is currently visible
   * @returns Promise<boolean> Visibility status
   */
  static async isVisible(): Promise<boolean> {
    try {
      return await FloatingBubble.isVisible();
    } catch (error) {
      console.error('FloatingBubble.isVisible error:', error);
      return false;
    }
  }

  /**
   * Update bubble position
   * @param position New position
   * @returns Promise<boolean> Success status
   */
  static async updatePosition(position: FloatingBubblePosition): Promise<boolean> {
    try {
      return await FloatingBubble.updatePosition(position);
    } catch (error) {
      console.error('FloatingBubble.updatePosition error:', error);
      return false;
    }
  }

  /**
   * Get current bubble position
   * @returns Promise<FloatingBubblePosition | null> Current position or null if not visible
   */
  static async getPosition(): Promise<FloatingBubblePosition | null> {
    try {
      return await FloatingBubble.getPosition();
    } catch (error) {
      console.error('FloatingBubble.getPosition error:', error);
      return null;
    }
  }

  /**
   * Update bubble configuration
   * @param config New configuration
   * @returns Promise<boolean> Success status
   */
  static async updateConfig(config: FloatingBubbleConfig): Promise<boolean> {
    try {
      return await FloatingBubble.updateConfig(config);
    } catch (error) {
      console.error('FloatingBubble.updateConfig error:', error);
      return false;
    }
  }

  /**
   * Request overlay permission (Android only)
   * @returns Promise<boolean> Permission granted status
   */
  static async requestOverlayPermission(): Promise<boolean> {
    try {
      if (Platform.OS === 'android') {
        return await FloatingBubble.requestOverlayPermission();
      }
      return true; // iOS doesn't need overlay permission
    } catch (error) {
      console.error('FloatingBubble.requestOverlayPermission error:', error);
      return false;
    }
  }

  /**
   * Check if overlay permission is granted (Android only)
   * @returns Promise<boolean> Permission status
   */
  static async hasOverlayPermission(): Promise<boolean> {
    try {
      if (Platform.OS === 'android') {
        return await FloatingBubble.hasOverlayPermission();
      }
      return true; // iOS doesn't need overlay permission
    } catch (error) {
      console.error('FloatingBubble.hasOverlayPermission error:', error);
      return false;
    }
  }
}

export default ReactNativeFloatingBubble;