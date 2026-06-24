import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Link } from 'expo-router';
import { Button, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FormField } from '@/components/FormField';
import { useAuth } from '@/contexts/AuthContext';
import { useSnackbar } from '@/contexts/SnackbarContext';
import { getErrorMessage } from '@/utils/errors';
import { isValidEmail, isValidPassword } from '@/utils/validation';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const { showError } = useSnackbar();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    const next: typeof errors = {};
    if (!isValidEmail(email)) next.email = 'Ingresa un correo válido.';
    if (!isValidPassword(password)) next.password = 'Mínimo 8 caracteres.';
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    try {
      await signIn({ email: email.trim(), password });
    } catch (error) {
      showError(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <Text variant="displaySmall" style={styles.brand}>
            Yala
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Coleccionables geek, subastas y venta directa.
          </Text>

          <FormField
            label="Correo"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            value={email}
            onChangeText={setEmail}
            errorText={errors.email}
          />
          <FormField
            label="Contraseña"
            secureTextEntry
            autoCapitalize="none"
            value={password}
            onChangeText={setPassword}
            errorText={errors.password}
          />

          <Button
            mode="contained"
            onPress={submit}
            loading={submitting}
            disabled={submitting}
            style={styles.button}
          >
            Iniciar sesión
          </Button>

          <Text style={styles.footer}>
            ¿No tienes cuenta?{' '}
            <Link href="/(auth)/register" style={styles.link}>
              Regístrate
            </Link>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  content: { padding: 24, gap: 12, flexGrow: 1, justifyContent: 'center' },
  brand: { textAlign: 'center', fontWeight: '800', color: '#208AEF' },
  subtitle: { textAlign: 'center', opacity: 0.7, marginBottom: 16 },
  button: { marginTop: 8 },
  footer: { textAlign: 'center', marginTop: 16 },
  link: { color: '#208AEF', fontWeight: '700' },
});
