import { useCallback, useEffect, useState } from 'react';
import * as Location from 'expo-location';

export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface LocationState {
  coordinate: Coordinate | null;
  loading: boolean;
  error: string | null;
  permissionGranted: boolean;
  request: () => Promise<void>;
}

/**
 * Foreground GPS access with explicit permission handling and try/catch.
 * Errors are exposed as UI state, never just logged (CLAUDE.md #16, #21, #22).
 */
export function useLocation(auto = true): LocationState {
  const [coordinate, setCoordinate] = useState<Coordinate | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionGranted, setPermissionGranted] = useState(false);

  const request = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setPermissionGranted(false);
        setError(
          'Permiso de ubicación denegado. Actívalo en Configuración para usar el mapa.',
        );
        return;
      }
      setPermissionGranted(true);
      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setCoordinate({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    } catch {
      setError('No se pudo obtener la ubicación. Verifica que el GPS esté activo.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (auto) request();
  }, [auto, request]);

  return { coordinate, loading, error, permissionGranted, request };
}
