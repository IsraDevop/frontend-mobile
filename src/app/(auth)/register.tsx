import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { Link } from 'expo-router';
import { Button, SegmentedButtons, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FormField } from '@/components/FormField';
import { useAuth } from '@/contexts/AuthContext';
import { useSnackbar } from '@/contexts/SnackbarContext';
import { UserRole } from '@/types/api';
import { getErrorMessage } from '@/utils/errors';
import { isNonEmpty, isValidEmail, isValidPassword } from '@/utils/validation';

interface FieldErrors {
  name?: string;
  email?: string;
  password?: string;
}

export default function RegisterScreen() {
  const { signUp } = useAuth();
  const { showError, showSuccess } = useSnackbar();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('USER');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    const next: FieldErrors = {};
    if (!isNonEmpty(name)) next.name = 'Ingresa tu nombre.';
    if (!isValidEmail(email)) next.email = 'Ingresa un correo válido.';
    if (!isValidPassword(password)) next.password = 'Mínimo 8 caracteres.';
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    try {
      await signUp({ name: name.trim(), email: email.trim(), password, role });
      showSuccess('¡Cuenta creada! Bienvenido a Yala.');
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
          <Text variant="headlineMedium" style={styles.title}>
            Crear cuenta
          </Text>

          <FormField
            label="Nombre"
            value={name}
            onChangeText={setName}
            errorText={errors.name}
          />
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

          <View style={styles.roleBlock}>
            <Text variant="bodyMedium" style={styles.roleLabel}>
              Tipo de cuenta
            </Text>
            <SegmentedButtons
              value={role}
              onValueChange={(v) => setRole(v as UserRole)}
              buttons={[
                { value: 'USER', label: 'Comprador', icon: 'account' },
                { value: 'SELLER', label: 'Vendedor', icon: 'store' },
              ]}
            />
          </View>

          <Button
            mode="contained"
            onPress={submit}
            loading={submitting}
            disabled={submitting}
            style={styles.button}
          >
            Registrarme
          </Button>

          <Text style={styles.footer}>
            ¿Ya tienes cuenta?{' '}
            <Link href="/(auth)/login" style={styles.link}>
              Inicia sesión
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
  title: { textAlign: 'center', marginBottom: 8, fontWeight: '700' },
  roleBlock: { gap: 8, marginTop: 4 },
  roleLabel: { opacity: 0.7 },
  button: { marginTop: 8 },
  footer: { textAlign: 'center', marginTop: 16 },
  link: { color: '#208AEF', fontWeight: '700' },
});
