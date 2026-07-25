import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

/** Cria o canal padrão no Android e pede permissão de notificações, se ainda não decidido. Notificações locais não são suportadas no web. */
export async function configurarNotificacoes(): Promise<void> {
  if (Platform.OS === 'web') return;

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
  if (Platform.OS === 'web') return false;

  const { status } = await Notifications.getPermissionsAsync();
  return status === 'granted';
}
