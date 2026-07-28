import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/theme/theme-provider';
import { formatCurrencyCompact, formatCurrencyThousands } from '@/utils/format-currency';

const ALTURA_GRAFICO = 160;
const LARGURA_EIXO_Y = 48;

interface BarChartItem {
  label: string;
  value: number;
}

interface BarChartProps {
  data: BarChartItem[];
  formatValue?: (value: number) => string;
  formatAxisValue?: (value: number) => string;
}

/** Arredonda o topo do eixo Y para um valor "redondo" (1/2/5 * 10^n), visando ~5 linhas de grade. */
function calcularEixoY(valorMaximo: number): { max: number; step: number } {
  if (valorMaximo <= 0) return { max: 1000, step: 250 };
  const passoBruto = valorMaximo / 5;
  const magnitude = Math.pow(10, Math.floor(Math.log10(passoBruto)));
  const normalizado = passoBruto / magnitude;
  const step = (normalizado <= 1 ? 1 : normalizado <= 2 ? 2 : normalizado <= 5 ? 5 : 10) * magnitude;
  return { max: Math.ceil(valorMaximo / step) * step, step };
}

export function BarChart({
  data,
  formatValue = formatCurrencyCompact,
  formatAxisValue = formatCurrencyThousands,
}: BarChartProps) {
  const theme = useTheme();
  const valorMaximo = Math.max(...data.map((item) => item.value), 0);
  const { max: eixoMax, step } = calcularEixoY(valorMaximo);
  const valoresEixo = Array.from({ length: eixoMax / step + 1 }, (_, i) => eixoMax - i * step);

  return (
    <View>
      <View style={styles.row}>
        <View style={[styles.eixoY, { height: ALTURA_GRAFICO }]}>
          {valoresEixo.map((valor) => (
            <Text
              key={valor}
              style={[theme.typography.caption, { color: theme.colors.textMuted }]}
              numberOfLines={1}
            >
              {formatAxisValue(valor)}
            </Text>
          ))}
        </View>

        <View style={[styles.plotArea, { height: ALTURA_GRAFICO }]}>
          <View style={styles.grade}>
            {valoresEixo.map((valor) => (
              <View
                key={valor}
                style={[styles.gradeLinha, { borderColor: theme.colors.border }]}
              />
            ))}
          </View>

          <View style={styles.barrasRow}>
            {data.map((item) => {
              const alturaBarra =
                eixoMax > 0 && item.value > 0
                  ? Math.max((item.value / eixoMax) * ALTURA_GRAFICO, 4)
                  : 0;
              return (
                <View key={item.label} style={styles.barraColuna}>
                  <Text
                    style={[theme.typography.caption, { color: theme.colors.text }]}
                    numberOfLines={1}
                  >
                    {formatValue(item.value)}
                  </Text>
                  <View
                    style={[
                      styles.barra,
                      { height: alturaBarra, backgroundColor: theme.colors.success },
                    ]}
                  />
                </View>
              );
            })}
          </View>
        </View>
      </View>

      <View style={styles.mesesRow}>
        <View style={styles.eixoY} />
        <View style={styles.mesesColunas}>
          {data.map((item) => (
            <Text
              key={item.label}
              style={[theme.typography.caption, styles.mesLabel, { color: theme.colors.textMuted }]}
            >
              {item.label}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  eixoY: {
    width: LARGURA_EIXO_Y,
    justifyContent: 'space-between',
  },
  plotArea: {
    flex: 1,
    position: 'relative',
  },
  grade: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
  },
  gradeLinha: {
    borderTopWidth: 1,
    borderStyle: 'dashed',
  },
  barrasRow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  barraColuna: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
  },
  barra: {
    width: '55%',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  mesesRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
  },
  mesesColunas: {
    flex: 1,
    flexDirection: 'row',
  },
  mesLabel: {
    flex: 1,
    textAlign: 'center',
  },
});
