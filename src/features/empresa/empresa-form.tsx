import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Image, StyleSheet, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { FormField } from '@/components/form-field';
import { Card } from '@/components/card';
import { AppButton } from '@/components/app-button';
import { useTheme } from '@/theme/theme-provider';
import { formatCnpj } from '@/utils/format-cnpj';
import { empresaSchema, type EmpresaFormData } from './schema';
import { useUploadLogo } from './hooks';

interface EmpresaFormProps {
  logoUrl: string | null;
  defaultValues: EmpresaFormData;
  onSubmit: (data: EmpresaFormData) => Promise<void> | void;
}

export function EmpresaForm({ logoUrl, defaultValues, onSubmit }: EmpresaFormProps) {
  const theme = useTheme();
  const uploadLogo = useUploadLogo();
  const [erroLogo, setErroLogo] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EmpresaFormData>({
    resolver: zodResolver(empresaSchema),
    defaultValues,
  });

  const corPrincipal = useWatch({ control, name: 'corPrincipal' });
  const corValida = /^#[0-9A-Fa-f]{6}$/.test(corPrincipal ?? '');

  async function handleEscolherLogo() {
    setErroLogo(null);
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissao.granted) {
      setErroLogo('Permissão de acesso às fotos negada.');
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });
    if (resultado.canceled || !resultado.assets[0]) return;

    try {
      await uploadLogo.mutateAsync(resultado.assets[0].uri);
    } catch {
      setErroLogo('Não foi possível enviar o logo. Tente novamente.');
    }
  }

  return (
    <View style={styles.container}>
      <Card style={styles.section}>
        <Text style={[theme.typography.subtitle, { color: theme.colors.text }]}>Logo</Text>
        <View style={styles.logoRow}>
          {logoUrl ? (
            <Image source={{ uri: logoUrl }} style={styles.logoPreview} resizeMode="contain" />
          ) : (
            <View
              style={[
                styles.logoPlaceholder,
                { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
              ]}
            >
              <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>
                Sem logo
              </Text>
            </View>
          )}
          <AppButton
            label={uploadLogo.isPending ? 'Enviando...' : 'Alterar logo'}
            onPress={handleEscolherLogo}
            variant="secondary"
            disabled={uploadLogo.isPending}
            style={styles.flex}
          />
        </View>
        {erroLogo ? (
          <Text style={[theme.typography.caption, { color: theme.colors.danger }]}>
            {erroLogo}
          </Text>
        ) : null}
      </Card>

      <Card style={styles.section}>
        <Text style={[theme.typography.subtitle, { color: theme.colors.text }]}>
          Dados da Empresa
        </Text>
        <FormField
          control={control}
          name="nomeFantasia"
          label="Nome Fantasia"
          error={errors.nomeFantasia?.message}
        />
        <FormField
          control={control}
          name="razaoSocial"
          label="Razão Social"
          error={errors.razaoSocial?.message}
        />
        <FormField
          control={control}
          name="cnpj"
          label="CNPJ"
          error={errors.cnpj?.message}
          keyboardType="numeric"
          maxLength={18}
          formatValue={formatCnpj}
        />
      </Card>

      <Card style={styles.section}>
        <Text style={[theme.typography.subtitle, { color: theme.colors.text }]}>Contato</Text>
        <FormField
          control={control}
          name="telefone"
          label="Telefone"
          error={errors.telefone?.message}
          keyboardType="phone-pad"
        />
        <FormField
          control={control}
          name="whatsapp"
          label="WhatsApp"
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
      </Card>

      <Card style={styles.section}>
        <Text style={[theme.typography.subtitle, { color: theme.colors.text }]}>
          Endereço e Horário
        </Text>
        <FormField
          control={control}
          name="endereco"
          label="Endereço"
          error={errors.endereco?.message}
          multiline
        />
        <FormField
          control={control}
          name="horarioFuncionamento"
          label="Horário de Funcionamento"
          error={errors.horarioFuncionamento?.message}
        />
      </Card>

      <Card style={styles.section}>
        <Text style={[theme.typography.subtitle, { color: theme.colors.text }]}>PDF</Text>
        <FormField
          control={control}
          name="rodapePdf"
          label="Rodapé do PDF"
          error={errors.rodapePdf?.message}
          multiline
        />
        <View style={styles.corRow}>
          <View style={styles.flex}>
            <FormField
              control={control}
              name="corPrincipal"
              label="Cor Principal"
              error={errors.corPrincipal?.message}
              autoCapitalize="characters"
              maxLength={7}
            />
          </View>
          <View
            style={[
              styles.corSwatch,
              {
                backgroundColor: corValida ? corPrincipal : theme.colors.surface,
                borderColor: theme.colors.border,
                borderRadius: theme.radii.md,
              },
            ]}
          />
        </View>
      </Card>

      <AppButton
        label={isSubmitting ? 'Salvando...' : 'Salvar alterações'}
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 20,
  },
  section: {
    gap: 16,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  logoPreview: {
    width: 64,
    height: 64,
  },
  logoPlaceholder: {
    width: 64,
    height: 64,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex: {
    flex: 1,
  },
  corRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  corSwatch: {
    width: 48,
    height: 48,
    borderWidth: 1,
    marginBottom: 2,
  },
});
