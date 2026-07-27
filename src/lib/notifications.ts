import Constants, { ExecutionEnvironment } from 'expo-constants';
import { Platform } from 'react-native';

/** No Expo Go (Android), o SDK 53+ removeu a API de notificações — o próprio import do módulo lança erro, então ele só pode ser carregado em development build. */
export const suportaNotificacoes =
  Platform.OS !== 'web' && Constants.executionEnvironment !== ExecutionEnvironment.StoreClient;

export function carregarNotifications(): typeof import('expo-notifications') {
  return require('expo-notifications');
}

if (suportaNotificacoes) {
  carregarNotifications().setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
}

/** Cria o canal padrão no Android e pede permissão de notificações, se ainda não decidido. */
export async function configurarNotificacoes(): Promise<void> {
  if (!suportaNotificacoes) return;

  const Notifications = carregarNotifications();

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Lembretes',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  const { status } = await Notifications.getPermissionsAsync();
  if (status !== 'granted') {
    await Notifications.requestPermissionsAsync();
  }
}

export async function notificacoesPermitidas(): Promise<boolean> {
  if (!suportaNotificacoes) return false;

  const { status } = await carregarNotifications().getPermissionsAsync();
  return status === 'granted';
}
