# Yala Mobile

App móvil del marketplace **Yala** (coleccionables geek: cartas Pokémon TCG, Funko
Pops, cómics) con subastas y venta directa. Construida con **React Native + Expo
(Expo Router + TypeScript)** y consume el backend REST en `https://yala.dpdns.org/api/v1`.

## Stack

- Expo SDK 56 · Expo Router (file-based) · TypeScript
- React Native Paper (Material Design)
- axios (cliente con interceptores + refresh JWT)
- expo-secure-store (almacenamiento seguro de tokens)
- expo-camera / expo-image-picker (sensor de cámara)
- expo-location + react-native-maps `PROVIDER_GOOGLE` (sensor GPS + mapa)

## Arquitectura

```
src/
  app/          # rutas (Expo Router): auth, tabs, listing/[id], auction/[id], verify-dni
  services/     # capa API (axios): client, tokens, auth, listings, auctions, bids, orders, images, identity
  contexts/     # AuthContext, SnackbarContext
  hooks/        # useFetch, usePaginatedList, useLocation
  components/    # UI presentacional (cards, formularios, mapa, cámara)
  types/        # interfaces de la API
  utils/        # constantes, errores, formato de moneda, validación
  theme/        # tema de React Native Paper
```

## Configuración

1. `npm install`
2. Copia `.env.example` a `.env` y completa:
   - `EXPO_PUBLIC_API_URL` — base del backend (requiere TLS válido en dispositivos).
   - `EXPO_PUBLIC_GOOGLE_MAPS_KEY` — clave de Google Maps (Android + iOS).
   - `EXPO_PUBLIC_DNI_MODE` — `demo` o `backend`.
3. `npx expo start`

### Permisos nativos

Declarados en `app.config.ts` (plugins de Expo):

- **Android**: `CAMERA`, `ACCESS_FINE_LOCATION`, `ACCESS_COARSE_LOCATION`,
  `READ_MEDIA_IMAGES`, y `com.google.android.geo.API_KEY` para Maps.
- **iOS**: `NSCameraUsageDescription`, `NSLocationWhenInUseUsageDescription`,
  `NSPhotoLibraryUsageDescription`, y `googleMapsApiKey`.

> `react-native-maps` con `PROVIDER_GOOGLE` requiere un **dev build** (EAS Build),
> no funciona en Expo Go puro.

## Verificación de DNI (Didit)

La clave de Didit **nunca** vive en la app. En `backend` mode la verificación pasa
por `POST /identity/verify-dni` (el backend inyecta `x-api-key`). En `demo` mode se
simula localmente para presentaciones.

## Despliegue

Workflow `.github/workflows/eas-update.yml` publica un **EAS Update** (OTA) en cada
push a `main`. Requiere el secret `EXPO_TOKEN` en el repositorio.

## Scripts

- `npm start` — inicia Expo
- `npm run android` / `npm run ios` / `npm run web`
- `npx tsc --noEmit` — verificación de tipos
