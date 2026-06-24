import { ExpoConfig } from 'expo/config';

// Client-restricted Google Maps key (safe to embed in the binary; restricted by
// package signature / bundle id). Provided at build time via env / EAS secrets.
const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_KEY ?? '';

const config: ExpoConfig = {
  name: 'Yala',
  slug: 'yala-mobile',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'yalamobile',
  userInterfaceStyle: 'automatic',
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.yala.mobile',
    infoPlist: {
      NSCameraUsageDescription:
        'Yala usa la cámara para verificar tu DNI y publicar fotos de tus productos.',
      NSLocationWhenInUseUsageDescription:
        'Yala usa tu ubicación para mostrar la tienda en el mapa y ubicar productos cercanos.',
      NSPhotoLibraryUsageDescription:
        'Yala accede a tu galería para que publiques fotos de tus productos.',
    },
    config: {
      googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    },
  },
  android: {
    package: 'com.yala.mobile',
    adaptiveIcon: {
      backgroundColor: '#E6F4FE',
      foregroundImage: './assets/images/android-icon-foreground.png',
      backgroundImage: './assets/images/android-icon-background.png',
      monochromeImage: './assets/images/android-icon-monochrome.png',
    },
    permissions: [
      'android.permission.CAMERA',
      'android.permission.ACCESS_FINE_LOCATION',
      'android.permission.ACCESS_COARSE_LOCATION',
      'android.permission.READ_MEDIA_IMAGES',
    ],
    config: {
      googleMaps: {
        apiKey: GOOGLE_MAPS_API_KEY,
      },
    },
  },
  web: {
    output: 'static',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    'expo-secure-store',
    [
      'expo-splash-screen',
      {
        backgroundColor: '#208AEF',
        image: './assets/images/splash-icon.png',
        imageWidth: 120,
      },
    ],
    [
      'expo-camera',
      {
        cameraPermission:
          'Yala usa la cámara para verificar tu DNI y publicar fotos de tus productos.',
      },
    ],
    [
      'expo-image-picker',
      {
        photosPermission:
          'Yala accede a tu galería para que publiques fotos de tus productos.',
      },
    ],
    [
      'expo-location',
      {
        locationWhenInUsePermission:
          'Yala usa tu ubicación para mostrar la tienda en el mapa.',
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    apiUrl: process.env.EXPO_PUBLIC_API_URL ?? 'https://yala.dpdns.org/api/v1',
    // 'demo' = simulación local sin exponer la API key de Didit;
    // 'backend' = el backend expone POST /identity/verify-dni como proxy seguro.
    dniVerificationMode: process.env.EXPO_PUBLIC_DNI_MODE ?? 'demo',
    eas: {
      projectId: process.env.EAS_PROJECT_ID ?? '',
    },
  },
};

export default config;
