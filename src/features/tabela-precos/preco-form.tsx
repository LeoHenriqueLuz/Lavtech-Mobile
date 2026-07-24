import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { StyleSheet, View } from 'react-native';
import { FormField } from '@/components/form-field';
import { Card } from '@/components/card';
import { AppButton } from '@/components/app-button';
import { precoSchema, type PrecoFormData } from './schema';

interface PrecoFormProps {
  defaultValues: PrecoFormData;
  onSubmit: (data: PrecoFormData) => Promise<void> | void;
  onCancel: () => void;
  submitLabel: string;
}

export function PrecoForm({ defaultValues, onSubmit, onCancel, submitLabel }: PrecoFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PrecoFormData>({
    resolver: zodResolver(precoSchema),
    defaultValues,
  });

  return (
    <Card style={styles.container}>
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
        <AppButton label="Cancelar" onPress={onCancel} variant="secondary" style={styles.flex} />
        <AppButton
          label={isSubmitting ? 'Salvando...' : submitLabel}
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          style={styles.flex}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  flex: {
    flex: 1,
  },
});
