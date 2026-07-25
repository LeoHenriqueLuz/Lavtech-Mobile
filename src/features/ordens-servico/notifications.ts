import * as Notifications from 'expo-notifications';
import { isAfter, parseISO, setHours, setMinutes, subDays } from 'date-fns';
import { notificacoesPermitidas } from '@/lib/notifications';
import type { OrdemServicoComCliente } from './api';

/** Horário local em que o lembrete de reinstalação é disparado. */
const HORA_LEMBRETE = 9;

interface OrdemServicoParaLembrete {
  id: string;
  numero: string;
  clienteNome: string;
  dataPrevisaoEntrega: string | null;
}

function identificadorLembrete(ordemServicoId: string): string {
  return `reinstalacao-${ordemServicoId}`;
}

function calcularDataLembrete(dataPrevisaoEntrega: string): Date {
  const umDiaAntes = subDays(parseISO(dataPrevisaoEntrega), 1);
  return setMinutes(setHours(umDiaAntes, HORA_LEMBRETE), 0);
}

/** Agenda (ou reagenda) o lembrete de reinstalação para 1 dia antes da previsão de entrega. */
export async function agendarLembreteReinstalacao(os: OrdemServicoParaLembrete): Promise<void> {
  await cancelarLembreteReinstalacao(os.id);

  if (!os.dataPrevisaoEntrega) return;
  if (!(await notificacoesPermitidas())) return;

  const dataLembrete = calcularDataLembrete(os.dataPrevisaoEntrega);
  if (!isAfter(dataLembrete, new Date())) return;

  await Notifications.scheduleNotificationAsync({
    identifier: identificadorLembrete(os.id),
    content: {
      title: 'Reinstalação agendada para amanhã',
      body: `${os.numero} — ${os.clienteNome}`,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: dataLembrete,
    },
  });
}

export async function cancelarLembreteReinstalacao(ordemServicoId: string): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(identificadorLembrete(ordemServicoId));
  } catch {
    // Sem lembrete agendado para essa OS — nada a fazer.
  }
}

/** Garante que toda OS com status "Reinstalação Agendada" tenha um lembrete agendado neste dispositivo. */
export async function sincronizarLembretesReinstalacao(
  ordens: OrdemServicoComCliente[],
): Promise<void> {
  const emReinstalacao = ordens.filter((os) => os.status === 'Reinstalação Agendada');
  for (const os of emReinstalacao) {
    await agendarLembreteReinstalacao({
      id: os.id,
      numero: os.numero,
      clienteNome: os.cliente?.nome ?? 'Cliente',
      dataPrevisaoEntrega: os.data_previsao_entrega,
    });
  }
}
