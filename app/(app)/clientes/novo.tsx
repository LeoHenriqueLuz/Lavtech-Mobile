import { Alert, ScrollView, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@/theme/theme-provider';
import { Screen } from '@/components/screen';
import { ClienteForm } from '@/features/clientes/cliente-form';
import { clienteFormDefaultValues, type ClienteFormData } from '@/features/clientes/schema';
import { useCreateCliente } from '@/features/clientes/hooks';
import { useProposta } from '@/features/propostas/hooks';

export default function NovoClienteScreen() {
  const theme = useTheme();
  const router = useRouter();
  const createCliente = useCreateCliente();
  const { propostaId, nome, whatsapp } = useLocalSearchParams<{
    propostaId?: string;
    nome?: string;
    whatsapp?: string;
  }>();
  const { data: propostaOrigem } = useProposta(propostaId ?? '');

  async function handleSubmit(data: ClienteFormData) {
    try {
      const cliente = await createCliente.mutateAsync(data);
      if (propostaId) {
        router.replace({
          pathname: '/ordens-servico/novo',
          params: { propostaId, clienteId: cliente.id },
        });
        return;
      }
      router.replace(`/clientes/${cliente.id}`);
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar o cliente. Tente novamente.');
    }
  }

  return (
    <Screen padded={false}>
      <ScrollView>
        {propostaOrigem ? (
          <Text
            style={[
              theme.typography.caption,
              { color: theme.colors.textMuted, paddingHorizontal: 20, marginBottom: 8 },
            ]}
          >
            Cadastrando cliente da proposta {propostaOrigem.numero} para gerar a OS em seguida
          </Text>
        ) : null}
        <ClienteForm
          defaultValues={{ ...clienteFormDefaultValues, nome: nome ?? '', whatsapp: whatsapp ?? '' }}
          onSubmit={handleSubmit}
          submitLabel="Salvar"
        />
      </ScrollView>
    </Screen>
  );
}
