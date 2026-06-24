import { StyleSheet, View } from 'react-native';
import { HelperText, TextInput } from 'react-native-paper';
import { ComponentProps } from 'react';

type TextInputProps = ComponentProps<typeof TextInput>;

interface Props extends TextInputProps {
  errorText?: string | null;
}

/** Paper TextInput + inline validation message in one presentational unit. */
export function FormField({ errorText, style, ...inputProps }: Props) {
  const hasError = Boolean(errorText);
  return (
    <View style={[styles.container, style]}>
      <TextInput mode="outlined" error={hasError} {...inputProps} />
      {hasError ? (
        <HelperText type="error" visible>
          {errorText}
        </HelperText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%' },
});
