import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FormField } from '@/components/form-field';
import { useTheme } from '@/theme/theme-provider';
import { precoSchema, type PrecoFormData } from './schema';

interface PrecoFormProps {
  defaultValues: PrecoFormData;
  onSubmit: (data: PrecoFormData) => Promise<void> | void;
  onCancel: () => void;
  submitLabel: string;
}

export function PrecoForm({ defaultValues, onSubmit, onCancel, submitLabel }: PrecoFormProps) {
  const theme = useTheme();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PrecoFormData>({
    resolver: zodResolver(precoSchema),
    defaultValues,
  });

  return (
    <View style={[styles.container, { borderColor: theme.colors.border }]}>
      <FormField
        control={control}
        name="valorUnitario"
        label="Valor unitário (R$)"
        error={errors.valorUnitario?.message}
        keyboardType="numeric"
      />
      <FormField
        control={control}
        name="valorManutencao"
        label="Valor de manutenção (R$)"
        error={errors.valorManutencao?.message}
        keyboardType="numeric"
      />

      <View style={styles.actions}>
        <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
          <Text style={[theme.typography.body, { color: theme.colors.textMuted }]}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          style={[
            styles.submitButton,
            { backgroundColor: theme.colors.primary, opacity: isSubmitting ? 0.6 : 1 },
          ]}
        >
          <Text style={styles.submitButtonText}>{isSubmitting ? 'Salvando...' : submitLabel}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    gap: 12,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 4,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  submitButton: {
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
