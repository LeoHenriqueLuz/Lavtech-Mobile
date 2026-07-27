export const STATUS_OS = ['Retirada Agendada', 'Agendado', 'Finalizado', 'Cancelado'] as const;

export type StatusOS = (typeof STATUS_OS)[number];

export const PROXIMO_STATUS: Partial<Record<StatusOS, StatusOS>> = {
  'Retirada Agendada': 'Agendado',
  Agendado: 'Finalizado',
};

export function isStatusAberto(status: StatusOS): boolean {
  return status !== 'Finalizado' && status !== 'Cancelado';
}
