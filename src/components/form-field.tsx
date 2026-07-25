import { useState } from 'react';
import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';
import { Controller, type Control, type FieldPath, type FieldValues } from 'react-hook-form';
import { useTheme } from '@/theme/theme-provider';

interface FormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  error?: string;
  onFieldBlur?: (value: string) => void;
  /** Transforma o texto digitado antes de salvar no form (ex: aplicar máscara). */
  formatValue?: (text: string) => string;
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
  formatValue,
  keyboardType,
  autoCapitalize = 'sentences',
  multiline,
  maxLength,
  secureTextEntry,
}: FormFieldProps<T>) {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);

  const borderColor = error
    ? theme.colors.danger
    : focused
      ? theme.colors.primary
      : theme.colors.border;

  return (
    <View style={styles.field}>
      <Text
        style={[
          theme.typography.caption,
          styles.label,
          { color: theme.colors.textMuted },
        ]}
      >
        {label}
      </Text>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            value={typeof value === 'string' ? value : ''}
            onChangeText={(text) => onChange(formatValue ? formatValue(text) : text)}
            onFocus={() => setFocused(true)}
            onBlur={() => {
              setFocused(false);
              onBlur();
              if (typeof value === 'string') onFieldBlur?.(value);
            }}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            multiline={multiline}
            maxLength={maxLength}
            secureTextEntry={secureTextEntry}
            placeholderTextColor={theme.colors.textMuted}
            style={[
              theme.typography.body,
              styles.input,
              multiline && styles.inputMultiline,
              {
                borderColor,
                borderRadius: theme.radii.md,
                backgroundColor: theme.colors.surface,
                color: theme.colors.text,
              },
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
    gap: 6,
  },
  label: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  inputMultiline: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
});
