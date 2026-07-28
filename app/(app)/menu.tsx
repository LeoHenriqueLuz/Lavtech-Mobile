import { View } from 'react-native';

/** Rota exigida pelo Tabs.Screen "menu" — o tabPress é sempre interceptado antes de navegar até aqui. */
export default function MenuTabPlaceholder() {
  return <View />;
}
