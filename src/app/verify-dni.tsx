import { useState } from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Banner, Button, Card, Text } from 'react-native-paper';

import { DniCamera } from '@/components/DniCamera';
import { FormField } from '@/components/FormField';
import { useAuth } from '@/contexts/AuthContext';
import { useSnackbar } from '@/contexts/SnackbarContext';
import { verifyDni } from '@/services/identity';
import { DniVerificationResult } from '@/types/api';
import { DNI_VERIFICATION_MODE } from '@/utils/constants';
import { getErrorMessage } from '@/utils/errors';
import { isValidDni } from '@/utils/validation';

export default function VerifyDniScreen() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const { showSuccess, showError } = useSnackbar();

  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [dni, setDni] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dniError, setDniError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState<DniVerificationResult | null>(null);

  const retake = () => {
    setPhotoUri(null);
    setResult(null);
  };

  const submit = async () => {
    if (!isValidDni(dni)) {
      setDniError('El DNI debe tener 8 dígitos.');
      return;
    }
    setDniError(null);
    setVerifying(true);
    try {
      const res = await verifyDni({
        personalNumber: dni.trim(),
        firstName: firstName.trim() || undefined,
        lastName: lastName.trim() || undefined,
      });
      setResult(res);
      if (res.status === 'Approved') {
        showSuccess(res.message ?? 'DNI verificado correctamente.');
        await refreshUser();
      } else {
        showError(res.message ?? 'No pudimos verificar tu DNI.');
      }
    } catch (e) {
      showError(getErrorMessage(e));
    } finally {
      setVerifying(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.content}>
      {DNI_VERIFICATION_MODE === 'demo' ? (
        <Banner visible icon="information">
          Modo demo: la validación se simula localmente sin exponer claves de la
          API. Configura el backend (POST /identity/verify-dni) para validar con
          Didit en producción.
        </Banner>
      ) : null}

      <Text variant="bodyMedium" style={styles.intro}>
        Captura una foto de tu DNI y confirma el número para verificar tu
        identidad.
      </Text>

      {photoUri ? (
        <Card mode="outlined">
          <Card.Content style={styles.previewContent}>
            <Image source={{ uri: photoUri }} style={styles.preview} />
            <Button icon="camera-retake" onPress={retake}>
              Volver a capturar
            </Button>
          </Card.Content>
        </Card>
      ) : (
        <DniCamera onCapture={setPhotoUri} onError={showError} />
      )}

      {photoUri ? (
        <View style={styles.form}>
          <FormField
            label="Número de DNI"
            keyboardType="number-pad"
            maxLength={8}
            value={dni}
            onChangeText={setDni}
            errorText={dniError}
          />
          <FormField
            label="Nombres (opcional)"
            value={firstName}
            onChangeText={setFirstName}
          />
          <FormField
            label="Apellidos (opcional)"
            value={lastName}
            onChangeText={setLastName}
          />

          {result ? (
            <Card
              mode="contained"
              style={[
                styles.result,
                {
                  backgroundColor:
                    result.status === 'Approved' ? '#c8e6c9' : '#ffcdd2',
                },
              ]}
            >
              <Card.Content>
                <Text variant="titleMedium">
                  {result.status === 'Approved'
                    ? '✅ Identidad verificada'
                    : '❌ Verificación rechazada'}
                </Text>
                {result.message ? (
                  <Text variant="bodyMedium">{result.message}</Text>
                ) : null}
              </Card.Content>
            </Card>
          ) : null}

          <Button
            mode="contained"
            icon="shield-check"
            onPress={submit}
            loading={verifying}
            disabled={verifying}
          >
            Verificar DNI
          </Button>

          {result?.status === 'Approved' ? (
            <Button mode="text" onPress={() => router.back()}>
              Listo
            </Button>
          ) : null}
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 12 },
  intro: { opacity: 0.8 },
  previewContent: { gap: 12, alignItems: 'center' },
  preview: { width: '100%', height: 200, borderRadius: 8 },
  form: { gap: 8 },
  result: { marginVertical: 8 },
});
