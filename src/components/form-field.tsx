import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';
import { Controller, type Control, type FieldPath, type FieldValues } from 'react-hook-form';
import { useTheme } from '@/theme/theme-provider';

interface FormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  error?: string;
  onFieldBlur?: (value: string) => void;
  keyboardType?: TextInputProps['keyboardType'];
  autoCapitalize?: TextInputProps['autoCapitalize'];
  multiline?: boolean;
  maxLength?: number;
  secureTextEntry?: boolean;
}

export function FormField<T extends FieldValues>({
  control,
  name,
  label,
  error,
  onFieldBlur,
  keyboardType,
  autoCapitalize = 'sentences',
  multiline,
  maxLength,
  secureTextEntry,
}: FormFieldProps<T>) {
  const theme = useTheme();

  return (
    <View style={styles.field}>
      <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>{label}</Text>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            value={typeof value === 'string' ? value : ''}
            onChangeText={onChange}
            onBlur={() => {
              onBlur();
              if (typeof value === 'string') onFieldBlur?.(value);
            }}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            multiline={multiline}
            maxLength={maxLength}
            secureTextEntry={secureTextEntry}
            style={[
              styles.input,
              multiline && styles.inputMultiline,
              { borderColor: error ? theme.colors.danger : theme.colors.border, color: theme.colors.text },
            ]}
          />
        )}
      />
      {error ? (
        <Text style={[theme.typography.caption, { color: theme.colors.danger }]}>{error}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: 4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  inputMultiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
});
