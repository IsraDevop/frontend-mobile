import { useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Button, Text } from 'react-native-paper';

interface Props {
  onCapture: (uri: string) => void;
  onError?: (message: string) => void;
}

/**
 * Camera sensor used to photograph the user's DNI document.
 * Handles the permission lifecycle and capture errors as UI state
 * (CLAUDE.md #16, #19, #22 — never just console.log).
 */
export function DniCamera({ onCapture, onError }: Props) {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  if (!permission) {
    return (
      <View style={styles.center}>
        <Text variant="bodyMedium">Cargando cámara…</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text variant="bodyLarge" style={styles.message}>
          Necesitamos acceso a la cámara para verificar tu DNI.
        </Text>
        <Button mode="contained" icon="camera" onPress={requestPermission}>
          Conceder permiso
        </Button>
      </View>
    );
  }

  const capture = async () => {
    try {
      const photo = await cameraRef.current?.takePictureAsync({ quality: 0.6 });
      if (photo?.uri) {
        onCapture(photo.uri);
      } else {
        onError?.('No se pudo capturar la imagen. Inténtalo de nuevo.');
      }
    } catch {
      onError?.('Error al usar la cámara. Verifica que no esté en uso.');
    }
  };

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing="back" />
      <Button
        mode="contained"
        icon="camera"
        onPress={capture}
        style={styles.button}
      >
        Capturar DNI
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 12 },
  camera: { height: 280, borderRadius: 12, overflow: 'hidden' },
  button: { alignSelf: 'center' },
  center: { alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 },
  message: { textAlign: 'center' },
});
