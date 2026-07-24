import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal, StyleSheet, Text, View } from 'react-native';
import { FormField } from '@/components/form-field';
import { AppButton } from '@/components/app-button';
import { useTheme } from '@/theme/theme-provider';
import { formatCurrency } from '@/utils/format-currency';
import { ajusteValorSchema, type AjusteValorFormData } from './schema';

interface EditarValorModalProps {
  visible: boolean;
  valorTabela: number;
  valorAtual: number;
  motivoAtual: string | null;
  onSalvar: (data: AjusteValorFormData) => Promise<void> | void;
  onCancelar: () => void;
}

export function EditarValorModal({
  visible,
  valorTabela,
  valorAtual,
  motivoAtual,
  onSalvar,
  onCancelar,
}: EditarValorModalProps) {
  const theme = useTheme();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AjusteValorFormData>({
    resolver: zodResolver(ajusteValorSchema),
    defaultValues: { novoValor: String(valorAtual), motivo: motivoAtual ?? '' },
  });

  useEffect(() => {
    if (visible) {
      reset({ novoValor: String(valorAtual), motivo: motivoAtual ?? '' });
    }
  }, [visible, valorAtual, motivoAtual, reset]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancelar}>
      <View style={styles.overlay}>
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.surfaceElevated,
              borderColor: theme.colors.border,
              borderRadius: theme.radii.lg,
            },
          ]}
        >
          <Text style={[theme.typography.subtitle, { color: theme.colors.text }]}>
            Editar valor
          </Text>

          <View style={styles.field}>
            <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>
              Valor padrão (tabela de preços)
            </Text>
            <Text style={[theme.typography.body, { color: theme.colors.textMuted }]}>
              {formatCurrency(valorTabela)}
            </Text>
          </View>

          <FormField
            control={control}
            name="novoValor"
            label="Novo valor (R$)"
            error={errors.novoValor?.message}
            keyboardType="numeric"
          />
          <FormField
            control={control}
            name="motivo"
            label="Motivo do ajuste"
            error={errors.motivo?.message}
            multiline
          />

          <View style={styles.actions}>
            <AppButton
              label="Cancelar"
              onPress={onCancelar}
              variant="secondary"
              style={styles.flex}
            />
            <AppButton
              label={isSubmitting ? 'Salvando...' : 'Salvar'}
              onPress={handleSubmit(onSalvar)}
              disabled={isSubmitting}
              style={styles.flex}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    borderWidth: 1,
    padding: 20,
    gap: 12,
  },
  field: {
    gap: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  flex: {
    flex: 1,
  },
});
