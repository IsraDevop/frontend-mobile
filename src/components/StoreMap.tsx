import { StyleSheet, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';

import { Coordinate } from '@/hooks/useLocation';
import { DEFAULT_REGION } from '@/utils/constants';

interface Props {
  coordinate?: Coordinate | null;
  title?: string;
  /** When true, the user can tap/drag to pick the store location. */
  editable?: boolean;
  onChange?: (coordinate: Coordinate) => void;
  height?: number;
}

/** Google Maps view (PROVIDER_GOOGLE) showing the device + a store marker. */
export function StoreMap({
  coordinate,
  title = 'Tienda',
  editable = false,
  onChange,
  height = 240,
}: Props) {
  const region: Region = coordinate
    ? { ...coordinate, latitudeDelta: 0.02, longitudeDelta: 0.02 }
    : DEFAULT_REGION;

  return (
    <View style={[styles.container, { height }]}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        showsUserLocation
        showsMyLocationButton
        initialRegion={region}
        region={coordinate ? region : undefined}
        onPress={
          editable
            ? (e) => onChange?.(e.nativeEvent.coordinate)
            : undefined
        }
      >
        {coordinate ? (
          <Marker
            coordinate={coordinate}
            title={title}
            draggable={editable}
            onDragEnd={
              editable
                ? (e) => onChange?.(e.nativeEvent.coordinate)
                : undefined
            }
          />
        ) : null}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { borderRadius: 12, overflow: 'hidden' },
  map: { flex: 1 },
});
