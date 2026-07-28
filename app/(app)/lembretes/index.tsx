import { useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/theme/theme-provider';
import { useEnviarLembrete, useLembretes } from '@/features/lembretes/hooks';
import type { ClienteParaLembrete } from '@/features/lembretes/api';
import { formatDate, formatTempoDecorrido } from '@/utils/format-date';
import { Screen } from '@/components/screen';
import { Card } from '@/components/card';
import { AppButton } from '@/components/app-button';

export default function LembretesScreen() {
  const theme = useTheme();
  const { data: lembretes, isLoading, error } = useLembretes();
  const enviarLembrete = useEnviarLembrete();
  const [enviandoId, setEnviandoId] = useState<string | null>(null);

  async function handleEnviarLembrete(item: ClienteParaLembrete) {
    setEnviandoId(item.ordemServicoId);
    try {
      await enviarLembrete.mutateAsync(item);
    } catch (err) {
      console.error('Falha ao enviar lembrete:', err);
      Alert.alert('Erro', 'Não foi possível abrir o WhatsApp para enviar o lembrete.');
    } finally {
      setEnviandoId(null);
    }
  }

  return (
    <Screen>
      {error ? (
        <Text style={[theme.typography.body, styles.empty, { color: theme.colors.danger }]}>
          Não foi possível carregar os lembretes.
        </Text>
      ) : isLoading ? (
        <ActivityIndicator style={styles.loading} color={theme.colors.primary} />
      ) : (
        <FlatList
          data={lembretes}
          keyExtractor={(item) => item.ordemServicoId}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <View style={styles.info}>
                <Text style={[theme.typography.body, { color: theme.colors.text }]}>
                  {item.clienteNome}
                </Text>
                <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>
                  {item.clienteWhatsapp}
                </Text>
                <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>
                  Última lavagem: {formatDate(item.dataFinalizacao)}
                </Text>
                <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>
                  Tempo desde a lavagem: {formatTempoDecorrido(item.dataFinalizacao)}
                </Text>
              </View>
              <AppButton
                label={enviandoId === item.ordemServicoId ? 'Enviando...' : 'Enviar lembrete'}
                disabled={enviandoId === item.ordemServicoId}
                onPress={() => handleEnviarLembrete(item)}
              />
            </Card>
          )}
          ListEmptyComponent={
            <Text style={[theme.typography.body, styles.empty, { color: theme.colors.textMuted }]}>
              Nenhum lembrete pendente.
            </Text>
          }
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  listContent: {
    gap: 12,
    paddingBottom: 24,
  },
  card: {
    gap: 12,
  },
  info: {
    gap: 2,
  },
  loading: {
    marginTop: 32,
  },
  empty: {
    textAlign: 'center',
    marginTop: 32,
  },
});
