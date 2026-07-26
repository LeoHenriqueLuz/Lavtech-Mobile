import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  parse,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useTheme } from '@/theme/theme-provider';

const DATA_BR_REGEX = /^\d{2}\/\d{2}\/\d{4}$/;
const DIAS_SEMANA = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

interface CalendarPickerModalProps {
  visible: boolean;
  /** Data selecionada no formato dd/MM/yyyy, se houver. */
  value?: string;
  onSelect: (dataBr: string) => void;
  onClear?: () => void;
  onClose: () => void;
}

function parseDataBr(value: string | undefined): Date | null {
  if (!value || !DATA_BR_REGEX.test(value)) return null;
  const data = parse(value, 'dd/MM/yyyy', new Date());
  return Number.isNaN(data.getTime()) ? null : data;
}

export function CalendarPickerModal({
  visible,
  value,
  onSelect,
  onClear,
  onClose,
}: CalendarPickerModalProps) {
  const theme = useTheme();
  const selecionada = parseDataBr(value);
  const [mesAtual, setMesAtual] = useState(selecionada ?? new Date());

  const inicioGrade = startOfWeek(startOfMonth(mesAtual));
  const fimGrade = endOfWeek(endOfMonth(mesAtual));
  const dias = eachDayOfInterval({ start: inicioGrade, end: fimGrade });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      onShow={() => setMesAtual(selecionada ?? new Date())}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.surfaceElevated,
              borderColor: theme.colors.border,
              borderRadius: theme.radii.lg,
            },
          ]}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.header}>
            <Pressable hitSlop={8} onPress={() => setMesAtual((mes) => subMonths(mes, 1))}>
              <ChevronLeft color={theme.colors.text} size={20} />
            </Pressable>
            <Text style={[theme.typography.subtitle, { color: theme.colors.text }]}>
              {format(mesAtual, 'MMMM yyyy', { locale: ptBR }).replace(/^\w/, (c) =>
                c.toUpperCase(),
              )}
            </Text>
            <Pressable hitSlop={8} onPress={() => setMesAtual((mes) => addMonths(mes, 1))}>
              <ChevronRight color={theme.colors.text} size={20} />
            </Pressable>
          </View>

          <View style={styles.semanaRow}>
            {DIAS_SEMANA.map((dia, index) => (
              <Text
                key={index}
                style={[theme.typography.caption, styles.diaSemana, { color: theme.colors.textMuted }]}
              >
                {dia}
              </Text>
            ))}
          </View>

          <View style={styles.grade}>
            {dias.map((dia) => {
              const doMesAtual = isSameMonth(dia, mesAtual);
              const selecionado = selecionada ? isSameDay(dia, selecionada) : false;
              const hoje = isToday(dia);
              return (
                <Pressable
                  key={dia.toISOString()}
                  style={[
                    styles.dia,
                    {
                      borderRadius: theme.radii.sm,
                      backgroundColor: selecionado ? theme.colors.primary : 'transparent',
                      borderColor: hoje && !selecionado ? theme.colors.primary : 'transparent',
                      borderWidth: hoje && !selecionado ? 1 : 0,
                    },
                  ]}
                  onPress={() => onSelect(format(dia, 'dd/MM/yyyy'))}
                >
                  <Text
                    style={[
                      theme.typography.body,
                      {
                        color: selecionado
                          ? '#FFFFFF'
                          : doMesAtual
                            ? theme.colors.text
                            : theme.colors.textMuted,
                      },
                    ]}
                  >
                    {format(dia, 'd')}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.footer}>
            {onClear ? (
              <Pressable onPress={onClear}>
                <Text style={[theme.typography.body, { color: theme.colors.danger }]}>Limpar</Text>
              </Pressable>
            ) : (
              <View />
            )}
            <Pressable onPress={onClose}>
              <Text style={[theme.typography.body, { color: theme.colors.primary }]}>Fechar</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
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
    padding: 16,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  semanaRow: {
    flexDirection: 'row',
  },
  diaSemana: {
    width: `${100 / 7}%`,
    textAlign: 'center',
  },
  grade: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dia: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
});
