import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { FormField } from '@/components/form-field';
import { useTheme } from '@/theme/theme-provider';
import { useCatalogo } from '@/features/catalogos/hooks';
import { persianaSchema, type PersianaFormData } from './schema';

interface PersianaFormProps {
  defaultValues: PersianaFormData;
  onSubmit: (data: PersianaFormData) => Promise<void> | void;
  onCancel: () => void;
  submitLabel: string;
}

export function PersianaForm({ defaultValues, onSubmit, onCancel, submitLabel }: PersianaFormProps) {
  const theme = useTheme();
  const { data: ambientes } = useCatalogo('ambientes');
  const { data: tipos } = useCatalogo('tipos_persiana');
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PersianaFormData>({
    resolver: zodResolver(persianaSchema),
    defaultValues,
  });

  return (
    <View style={[styles.container, { borderColor: theme.colors.border }]}>
      <View style={styles.field}>
        <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>Ambiente</Text>
        <Controller
          control={control}
          name="ambienteId"
          render={({ field: { onChange, value } }) => (
            <View style={[styles.pickerWrapper, { borderColor: theme.colors.border }]}>
              <Picker selectedValue={value} onValueChange={onChange}>
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

      <View style={styles.field}>
        <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>Tipo</Text>
        <Controller
          control={control}
          name="tipoId"
          render={({ field: { onChange, value } }) => (
            <View style={[styles.pickerWrapper, { borderColor: theme.colors.border }]}>
              <Picker selectedValue={value} onValueChange={onChange}>
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

      <FormField
        control={control}
        name="quantidade"
        label="Quantidade"
        error={errors.quantidade?.message}
        keyboardType="numeric"
      />
      <FormField
        control={control}
        name="observacoes"
        label="Observações"
        error={errors.observacoes?.message}
        multiline
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
  field: {
    gap: 4,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: 'center',
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
