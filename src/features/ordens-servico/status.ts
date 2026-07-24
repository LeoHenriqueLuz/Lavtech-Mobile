export const STATUS_OS = [
  'Retirada Agendada',
  'Reinstalação Agendada',
  'Finalizado',
  'Cancelado',
] as const;

export type StatusOS = (typeof STATUS_OS)[number];

export const PROXIMO_STATUS: Partial<Record<StatusOS, StatusOS>> = {
  'Retirada Agendada': 'Reinstalação Agendada',
  'Reinstalação Agendada': 'Finalizado',
};

export function isStatusAberto(status: StatusOS): boolean {
  return status !== 'Finalizado' && status !== 'Cancelado';
}
