import { ActivityIndicator, Alert, ScrollView, Text } from 'react-native';
import { Screen } from '@/components/screen';
import { useTheme } from '@/theme/theme-provider';
import { EmpresaForm } from '@/features/empresa/empresa-form';
import { empresaToFormData } from '@/features/empresa/api';
import { useConfiguracoesEmpresa, useUpdateConfiguracoesEmpresa } from '@/features/empresa/hooks';
import type { EmpresaFormData } from '@/features/empresa/schema';

export default function EmpresaScreen() {
  const theme = useTheme();
  const { data: empresa, isLoading, error } = useConfiguracoesEmpresa();
  const updateEmpresa = useUpdateConfiguracoesEmpresa();

  async function handleSubmit(data: EmpresaFormData) {
    try {
      await updateEmpresa.mutateAsync(data);
      Alert.alert('Sucesso', 'Dados da empresa atualizados.');
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar as alterações.');
    }
  }

  if (isLoading) {
    return (
      <Screen>
        <ActivityIndicator color={theme.colors.primary} />
      </Screen>
    );
  }

  if (error || !empresa) {
    return (
      <Screen>
        <Text style={[theme.typography.body, { color: theme.colors.danger }]}>
          Não foi possível carregar os dados da empresa.
        </Text>
      </Screen>
    );
  }

  return (
    <Screen padded={false}>
      <ScrollView>
        <EmpresaForm
          logoUrl={empresa.logo_url}
          defaultValues={empresaToFormData(empresa)}
          onSubmit={handleSubmit}
        />
      </ScrollView>
    </Screen>
  );
}
