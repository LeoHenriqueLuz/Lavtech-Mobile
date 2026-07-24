import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { FormField } from '@/components/form-field';
import { useTheme } from '@/theme/theme-provider';
import { fetchAddressByCep } from '@/lib/viacep';
import { clienteSchema, type ClienteFormData } from './schema';
import { ESTADOS_BR } from './estados';

interface ClienteFormProps {
  defaultValues: ClienteFormData;
  onSubmit: (data: ClienteFormData) => Promise<void> | void;
  submitLabel: string;
}

export function ClienteForm({ defaultValues, onSubmit, submitLabel }: ClienteFormProps) {
  const theme = useTheme();
  const [buscandoCep, setBuscandoCep] = useState(false);
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ClienteFormData>({
    resolver: zodResolver(clienteSchema),
    defaultValues,
  });

  async function handleCepBlur(cep: string) {
    if (!cep) return;
    setBuscandoCep(true);
    const endereco = await fetchAddressByCep(cep);
    setBuscandoCep(false);
    if (!endereco) return;
    setValue('logradouro', endereco.logradouro);
    setValue('bairro', endereco.bairro);
    setValue('cidade', endereco.cidade);
    setValue('estado', endereco.estado);
  }

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.container}
    >
      <Text style={[theme.typography.subtitle, { color: theme.colors.text }]}>Dados</Text>
      <FormField control={control} name="nome" label="Nome *" error={errors.nome?.message} />
      <FormField
        control={control}
        name="whatsapp"
        label="WhatsApp *"
        error={errors.whatsapp?.message}
        keyboardType="phone-pad"
      />
      <FormField
        control={control}
        name="email"
        label="E-mail"
        error={errors.email?.message}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <FormField
        control={control}
        name="cpfCnpj"
        label="CPF/CNPJ"
        error={errors.cpfCnpj?.message}
        keyboardType="numeric"
      />

      <Text style={[theme.typography.subtitle, { color: theme.colors.text }]}>Endereço</Text>
      <FormField
        control={control}
        name="cep"
        label={buscandoCep ? 'CEP (buscando...)' : 'CEP'}
        error={errors.cep?.message}
        keyboardType="numeric"
        maxLength={9}
        onFieldBlur={handleCepBlur}
      />
      <FormField
        control={control}
        name="logradouro"
        label="Logradouro"
        error={errors.logradouro?.message}
      />
      <View style={styles.row}>
        <View style={styles.rowItem}>
          <FormField
            control={control}
            name="numero"
            label="Número"
            error={errors.numero?.message}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.rowItemGrow}>
          <FormField
            control={control}
            name="complemento"
            label="Complemento"
            error={errors.complemento?.message}
          />
        </View>
      </View>
      <FormField control={control} name="bairro" label="Bairro" error={errors.bairro?.message} />
      <View style={styles.row}>
        <View style={styles.rowItemGrow}>
          <FormField control={control} name="cidade" label="Cidade" error={errors.cidade?.message} />
        </View>
        <View style={styles.rowItem}>
          <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>Estado</Text>
          <Controller
            control={control}
            name="estado"
            render={({ field: { onChange, value } }) => (
              <View style={[styles.pickerWrapper, { borderColor: theme.colors.border }]}>
                <Picker selectedValue={value} onValueChange={onChange}>
                  <Picker.Item label="UF" value="" />
                  {ESTADOS_BR.map((estado) => (
                    <Picker.Item key={estado.uf} label={estado.uf} value={estado.uf} />
                  ))}
                </Picker>
              </View>
            )}
          />
        </View>
      </View>

      <Text style={[theme.typography.subtitle, { color: theme.colors.text }]}>Observações</Text>
      <FormField
        control={control}
        name="observacoes"
        label="Observações"
        error={errors.observacoes?.message}
        multiline
      />

      <TouchableOpacity
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting}
        style={[
          styles.button,
          { backgroundColor: theme.colors.primary, opacity: isSubmitting ? 0.6 : 1 },
        ]}
      >
        <Text style={styles.buttonText}>{isSubmitting ? 'Salvando...' : submitLabel}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  container: {
    padding: 16,
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  rowItem: {
    width: 100,
    gap: 4,
  },
  rowItemGrow: {
    flex: 1,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: 'center',
  },
  button: {
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
