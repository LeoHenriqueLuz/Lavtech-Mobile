import { useEffect } from 'react';
import { LogBox, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider } from '@tanstack/react-query';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import { queryClient } from '@/lib/query-client';
import { ThemeProvider } from '@/theme/theme-provider';
import { defaultColors } from '@/theme/tokens';
import { SessionProvider, useSession } from '@/hooks/use-session';

SplashScreen.preventAutoHideAsync();

/** A lib moti re-exporta o SafeAreaView deprecado do react-native mesmo sem usarmos esse componente; nosso código já usa react-native-safe-area-context. */
LogBox.ignoreLogs(['SafeAreaView has been deprecated']);

/** Só esconde a splash quando fontes e sessão inicial já estiverem prontas, evitando um flash de tela em branco. */
function SplashGate({ fontsLoaded }: { fontsLoaded: boolean }) {
  const { isLoading: sessionLoading } = useSession();

  useEffect(() => {
    if (fontsLoaded && !sessionLoading) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, sessionLoading]);

  return null;
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: defaultColors.background }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <SessionProvider>
            <ThemeProvider>
              <SplashGate fontsLoaded={fontsLoaded} />
              <View style={{ flex: 1, backgroundColor: defaultColors.background }}>
                <Slot />
              </View>
              <StatusBar style="light" />
            </ThemeProvider>
          </SessionProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
