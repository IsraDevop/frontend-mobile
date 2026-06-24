import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';

import { FormField } from '@/components/FormField';
import { formatCurrency } from '@/utils/currency';
import { isPositiveNumber } from '@/utils/validation';

interface Props {
  currentPrice: number;
  submitting: boolean;
  onSubmit: (amount: number) => void;
}

/** Validates that the bid is strictly greater than the current price. */
export function BidForm({ currentPrice, submitting, onSubmit }: Props) {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!isPositiveNumber(amount)) {
      setError('Ingresa un monto válido.');
      return;
    }
    const value = Number(amount);
    if (value <= currentPrice) {
      setError(`Tu puja debe ser mayor a ${formatCurrency(currentPrice)}.`);
      return;
    }
    setError(null);
    onSubmit(value);
    setAmount('');
  };

  return (
    <View style={styles.container}>
      <FormField
        label="Tu puja (S/)"
        keyboardType="decimal-pad"
        value={amount}
        onChangeText={setAmount}
        errorText={error}
        left={undefined}
      />
      <Button
        mode="contained"
        icon="gavel"
        onPress={handleSubmit}
        loading={submitting}
        disabled={submitting}
      >
        Pujar
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 8 },
});
