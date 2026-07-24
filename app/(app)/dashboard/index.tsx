import { StyleSheet, Text, View } from 'react-native';
import { Screen } from '@/components/screen';
import { Card } from '@/components/card';
import { useTheme } from '@/theme/theme-provider';

function saudacao(): string {
  const hora = new Date().getHours();
  if (hora < 12) return 'Bom dia';
  if (hora < 18) return 'Boa tarde';
  return 'Boa noite';
}

export default function DashboardScreen() {
  const theme = useTheme();

  return (
    <Screen>
      <View style={styles.container}>
        <Text style={[theme.typography.title, { color: theme.colors.text }]}>{saudacao()}</Text>
        <Card style={styles.card}>
          <Text style={[theme.typography.subtitle, { color: theme.colors.text }]}>
            Painel em construção
          </Text>
          <Text
            style={[theme.typography.body, styles.cardBody, { color: theme.colors.textMuted }]}
          >
            Métricas de Ordens de Serviço, faturamento do dia e atalhos rápidos chegam em breve.
          </Text>
        </Card>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
  card: {
    gap: 8,
  },
  cardBody: {
    lineHeight: 20,
  },
});
