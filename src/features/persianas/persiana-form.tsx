import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { StyleSheet, Text, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { FormField } from '@/components/form-field';
import { Card } from '@/components/card';
import { AppButton } from '@/components/app-button';
import { QuantityStepper } from '@/components/quantity-stepper';
import { useTheme } from '@/theme/theme-provider';
import { useCatalogo } from '@/features/catalogos/hooks';
import { persianaSchema, type PersianaFormData } from './schema';

interface PersianaFormProps {
  defaultValues: PersianaFormData;
  onSubmit: (data: PersianaFormData) => Promise<void> | void;
  onCancel: () => void;
  submitLabel: string;
}

export function PersianaForm({
  defaultValues,
  onSubmit,
  onCancel,
  submitLabel,
}: PersianaFormProps) {
  const theme = useTheme();
  const { data: ambientes } = useCatalogo('ambientes');
  const { data: tipos } = useCatalogo('tipos_persiana');
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<PersianaFormData>({
    resolver: zodResolver(persianaSchema),
    defaultValues,
  });

  const ambienteIdSelecionado = useWatch({ control, name: 'ambienteId' });
  const isOutro = ambientes?.find((item) => item.id === ambienteIdSelecionado)?.nome === 'Outro';

  async function handleFormSubmit(data: PersianaFormData) {
    if (isOutro && !data.ambienteOutroDescricao?.trim()) {
      setError('ambienteOutroDescricao', {
        type: 'manual',
        message: 'Descreva o ambiente',
      });
      return;
    }
    await onSubmit(data);
  }

  return (
    <Card style={styles.container}>
      <View style={styles.field}>
        <Text
          style={[
            theme.typography.caption,
            styles.pickerLabel,
            { color: theme.colors.textMuted },
          ]}
        >
          Ambiente
        </Text>
        <Controller
          control={control}
          name="ambienteId"
          render={({ field: { onChange, value } }) => (
            <View
              style={[
                styles.pickerWrapper,
                {
                  borderColor: theme.colors.border,
                  backgroundColor: theme.colors.surface,
                  borderRadius: theme.radii.md,
                },
              ]}
            >
              <Picker
                selectedValue={value}
                onValueChange={onChange}
                style={{ color: theme.colors.text, backgroundColor: theme.colors.surface }}
                dropdownIconColor={theme.colors.textMuted}
                itemStyle={{ color: theme.colors.text }}
              >
                <Picker.Item label="Selecione" value="" />
                {ambientes?.map((item) => (
                  <Picker.Item key={item.id} label={item.nome} value={item.id} />
                ))}
              </Picker>
            </View>
          )}
        />
        {errors.ambienteId ? (
          <Text style={[theme.typography.caption, { color: theme.colors.danger }]}>
            {errors.ambienteId.message}
          </Text>
        ) : null}
      </View>

      {isOutro ? (
        <FormField
          control={control}
          name="ambienteOutroDescricao"
          label="Descreva o ambiente"
          error={errors.ambienteOutroDescricao?.message}
        />
      ) : null}

      <View style={styles.field}>
        <Text
          style={[
            theme.typography.caption,
            styles.pickerLabel,
            { color: theme.colors.textMuted },
          ]}
        >
          Tipo
        </Text>
        <Controller
          control={control}
          name="tipoId"
          render={({ field: { onChange, value } }) => (
            <View
              style={[
                styles.pickerWrapper,
                {
                  borderColor: theme.colors.border,
                  backgroundColor: theme.colors.surface,
                  borderRadius: theme.radii.md,
                },
              ]}
            >
              <Picker
                selectedValue={value}
                onValueChange={onChange}
                style={{ color: theme.colors.text, backgroundColor: theme.colors.surface }}
                dropdownIconColor={theme.colors.textMuted}
                itemStyle={{ color: theme.colors.text }}
              >
                <Picker.Item label="Selecione" value="" />
                {tipos?.map((item) => (
                  <Picker.Item key={item.id} label={item.nome} value={item.id} />
                ))}
              </Picker>
            </View>
          )}
        />
        {errors.tipoId ? (
          <Text style={[theme.typography.caption, { color: theme.colors.danger }]}>
            {errors.tipoId.message}
          </Text>
        ) : null}
      </View>

      <View style={styles.field}>
        <Text
          style={[
            theme.typography.caption,
            styles.pickerLabel,
            { color: theme.colors.textMuted },
          ]}
        >
          Quantidade
        </Text>
        <Controller
          control={control}
          name="quantidade"
          render={({ field: { onChange, value } }) => (
            <QuantityStepper value={value} onChange={onChange} />
          )}
        />
        {errors.quantidade ? (
          <Text style={[theme.typography.caption, { color: theme.colors.danger }]}>
            {errors.quantidade.message}
          </Text>
        ) : null}
      </View>
      <FormField
        control={control}
        name="observacoes"
        label="Observações"
        error={errors.observacoes?.message}
        multiline
      />

      <View style={styles.actions}>
        <AppButton label="Cancelar" onPress={onCancel} variant="secondary" style={styles.flex} />
        <AppButton
          label={isSubmitting ? 'Salvando...' : submitLabel}
          onPress={handleSubmit(handleFormSubmit)}
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
  field: {
    gap: 6,
  },
  pickerLabel: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  pickerWrapper: {
    borderWidth: 1,
    justifyContent: 'center',
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
