/** Aplica a máscara 00.000.000/0000-00 progressivamente enquanto o usuário digita. */
export function formatCnpj(value: string): string {
  const digitos = value.replace(/\D/g, '').slice(0, 14);

  if (digitos.length > 12) {
    return `${digitos.slice(0, 2)}.${digitos.slice(2, 5)}.${digitos.slice(5, 8)}/${digitos.slice(8, 12)}-${digitos.slice(12)}`;
  }
  if (digitos.length > 8) {
    return `${digitos.slice(0, 2)}.${digitos.slice(2, 5)}.${digitos.slice(5, 8)}/${digitos.slice(8)}`;
  }
  if (digitos.length > 5) {
    return `${digitos.slice(0, 2)}.${digitos.slice(2, 5)}.${digitos.slice(5)}`;
  }
  if (digitos.length > 2) {
    return `${digitos.slice(0, 2)}.${digitos.slice(2)}`;
  }
  return digitos;
}
