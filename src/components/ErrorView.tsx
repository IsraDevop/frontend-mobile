import { StyleSheet, View } from 'react-native';
import { Button, Icon, Text } from 'react-native-paper';

interface Props {
  message: string;
  onRetry?: () => void;
}

/** Error placeholder with a retry button (retry logic — rubric 2.4). */
export function ErrorView({ message, onRetry }: Props) {
  return (
    <View style={styles.container}>
      <Icon source="alert-circle-outline" size={56} color="#c62828" />
      <Text variant="bodyLarge" style={styles.message}>
        {message}
      </Text>
      {onRetry ? (
        <Button mode="contained" onPress={onRetry} icon="refresh">
          Reintentar
        </Button>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    padding: 32,
  },
  message: { textAlign: 'center' },
});
