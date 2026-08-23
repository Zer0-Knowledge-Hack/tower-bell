import { Platform } from 'react-native';

export const PEAR_PERMISSIONS = [
  {
    id: 'notifications',
    title: 'Notifications',
    reason: 'Alerts when a beacon is nearby, plus chat and visitor pings.',
    icon: 'signal',
    web: true,
  },
  {
    id: 'nearby',
    title: 'Nearby devices / Bluetooth',
    reason: 'Find local shops over BLE or mDNS. Required on Android 12+.',
    icon: 'wifi',
    web: false,
  },
  {
    id: 'location',
    title: 'Location',
    reason: 'Android needs location for background Bluetooth ranging.',
    icon: 'radar',
    web: false,
  },
  {
    id: 'background',
    title: 'Background running',
    reason: 'Keeps your beacon live while the phone is locked or in a pocket.',
    icon: 'shield',
    web: false,
  },
  {
    id: 'microphone',
    title: 'Microphone',
    reason: 'Peer-to-peer voice calls between traveler and shop.',
    icon: 'users',
    web: true,
  },
  {
    id: 'camera',
    title: 'Camera',
    reason: 'Video calls and optional shop photos.',
    icon: 'compass',
    web: true,
  },
  {
    id: 'media',
    title: 'Photos and files',
    reason: 'Send images and files over the local P2P channel.',
    icon: 'download',
    web: true,
  },
];

export const PEAR_NOTES = {
  runtime: 'Bare',
  transport: ['DHT / hyperswarm', 'Hyperbee', 'mDNS', 'BLE'],
  rule: 'The UI only talks to scan() and beacon(). Hyperswarm stays in the backend. On web we use the same mock contract so the screens work without a radio.',
};

function granted(note) {
  return { granted: true, note };
}

function denied(note) {
  return { granted: false, note };
}

export async function requestDevicePermission(id) {
  if (Platform.OS === 'web') {
    if (id === 'notifications' && typeof Notification !== 'undefined') {
      try {
        const result = await Notification.requestPermission();
        return result === 'granted'
          ? granted('Browser notifications are on.')
          : denied('The browser blocked notifications.');
      } catch {
        return denied('This browser cannot ask for notifications.');
      }
    }
    if (id === 'nearby' || id === 'location' || id === 'background') {
      return granted('Ready for the phone build. Web uses the mock network.');
    }
    if (id === 'camera' && typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach((track) => track.stop());
        return granted('Camera allowed in this browser.');
      } catch {
        return denied('Camera was blocked or is unavailable.');
      }
    }
    if (id === 'microphone' && typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((track) => track.stop());
        return granted('Microphone allowed in this browser.');
      } catch {
        return denied('Microphone was blocked or is unavailable.');
      }
    }
    return granted('Marked for the native build. The OS will ask on the phone.');
  }

  try {
    if (id === 'notifications') {
      const Notifications = await import('expo-notifications');
      const result = await Notifications.requestPermissionsAsync();
      return result.status === 'granted'
        ? granted('Notifications allowed.')
        : denied('Notifications were denied.');
    }
    if (id === 'location' || id === 'nearby' || id === 'background') {
      const Location = await import('expo-location');
      const result =
        id === 'background'
          ? await Location.requestBackgroundPermissionsAsync()
          : await Location.requestForegroundPermissionsAsync();
      return result.status === 'granted'
        ? granted(id === 'background' ? 'Background location allowed.' : 'Location allowed.')
        : denied('Location was denied. Bluetooth discovery may fail.');
    }
    if (id === 'camera') {
      const Camera = await import('expo-camera');
      const result = await Camera.requestCameraPermissionsAsync();
      return result.status === 'granted' ? granted('Camera allowed.') : denied('Camera was denied.');
    }
    if (id === 'microphone') {
      const { Audio } = await import('expo-av');
      const result = await Audio.requestPermissionsAsync();
      return result.status === 'granted' ? granted('Microphone allowed.') : denied('Microphone was denied.');
    }
    if (id === 'media') {
      const MediaLibrary = await import('expo-media-library');
      const result = await MediaLibrary.requestPermissionsAsync();
      return result.status === 'granted' ? granted('Media access allowed.') : denied('Media access was denied.');
    }
  } catch {
    return granted('Saved for the native build. The OS will confirm it later.');
  }

  return granted('Saved for the native build.');
}

export async function requestAllPermissions() {
  const results = {};
  for (const item of PEAR_PERMISSIONS) {
    results[item.id] = await requestDevicePermission(item.id);
  }
  return results;
}
