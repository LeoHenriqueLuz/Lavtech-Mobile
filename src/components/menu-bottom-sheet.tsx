import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FileText, Settings, Tag, Users, Bell, type LucideIcon } from 'lucide-react-native';
import { useTheme } from '@/theme/theme-provider';

interface MenuItem {
  label: string;
  href: string;
  Icon: LucideIcon;
}

const MENU_ITEMS: MenuItem[] = [
  { label: 'Clientes', href: '/clientes', Icon: Users },
  { label: 'Propostas', href: '/propostas', Icon: FileText },
  { label: 'Lembretes', href: '/lembretes', Icon: Bell },
  { label: 'Tabela de Preços', href: '/tabela-precos', Icon: Tag },
  { label: 'Configurações', href: '/configuracoes', Icon: Settings },
];

interface MenuBottomSheetProps {
  visible: boolean;
  onClose: () => void;
}

export function MenuBottomSheet({ visible, onClose }: MenuBottomSheetProps) {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  function handleNavigate(href: string) {
    onClose();
    router.push(href);
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={[
            styles.sheet,
            {
              backgroundColor: theme.colors.surfaceElevated,
              borderColor: theme.colors.border,
              borderTopLeftRadius: theme.radii.lg,
              borderTopRightRadius: theme.radii.lg,
              paddingBottom: insets.bottom + theme.spacing.sm,
            },
          ]}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={[styles.grabber, { backgroundColor: theme.colors.border }]} />

          {MENU_ITEMS.map(({ label, href, Icon }) => (
            <Pressable key={href} style={styles.item} onPress={() => handleNavigate(href)}>
              <Icon color={theme.colors.textMuted} size={20} />
              <Text style={[theme.typography.body, { color: theme.colors.text }]}>{label}</Text>
            </Pressable>
          ))}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderWidth: 1,
    borderBottomWidth: 0,
    paddingTop: 12,
    paddingHorizontal: 8,
  },
  grabber: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: 2,
    marginBottom: 12,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
});
