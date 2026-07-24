import { Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ClienteForm } from '@/features/clientes/cliente-form';
import { clienteFormDefaultValues, type ClienteFormData } from '@/features/clientes/schema';
import { useCreateCliente } from '@/features/clientes/hooks';

export default function NovoClienteScreen() {
  const router = useRouter();
  const createCliente = useCreateCliente();

  async function handleSubmit(data: ClienteFormData) {
    try {
      const cliente = await createCliente.mutateAsync(data);
      router.replace(`/clientes/${cliente.id}`);
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar o cliente. Tente novamente.');
    }
  }

  return (
    <ScrollView>
      <ClienteForm
        defaultValues={clienteFormDefaultValues}
        onSubmit={handleSubmit}
        submitLabel="Salvar"
      />
    </ScrollView>
  );
}
