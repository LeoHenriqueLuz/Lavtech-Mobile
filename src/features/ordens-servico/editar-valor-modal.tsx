import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FormField } from '@/components/form-field';
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
        <View style={[styles.card, { backgroundColor: theme.colors.background }]}>
          <Text style={[theme.typography.subtitle, { color: theme.colors.text }]}>Editar valor</Text>

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
            <TouchableOpacity onPress={onCancelar} style={styles.cancelButton}>
              <Text style={[theme.typography.body, { color: theme.colors.textMuted }]}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSubmit(onSalvar)}
              disabled={isSubmitting}
              style={[
                styles.submitButton,
                { backgroundColor: theme.colors.primary, opacity: isSubmitting ? 0.6 : 1 },
              ]}
            >
              <Text style={styles.submitButtonText}>{isSubmitting ? 'Salvando...' : 'Salvar'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    borderRadius: 12,
    padding: 20,
    gap: 12,
  },
  field: {
    gap: 4,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 8,
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
