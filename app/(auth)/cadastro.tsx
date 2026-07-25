import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useTheme } from '@/theme/theme-provider';
import { FormField } from '@/components/form-field';
import { Card } from '@/components/card';
import { AppButton } from '@/components/app-button';
import { cadastrarUsuario } from '@/features/cadastro/api';
import {
  cadastroFormDefaultValues,
  cadastroSchema,
  type CadastroFormData,
} from '@/features/cadastro/schema';

export default function CadastroScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [erro, setErro] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CadastroFormData>({
    resolver: zodResolver(cadastroSchema),
    defaultValues: cadastroFormDefaultValues,
  });

  async function onSubmit(data: CadastroFormData) {
    setErro(null);
    try {
      await cadastrarUsuario(data);
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.senha,
      });
      // Se o login automático falhar por algum motivo, a conta já foi criada —
      // manda pro login pra tentar entrar manualmente.
      if (error) {
        router.replace('/(auth)/login');
      }
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Não foi possível concluir o cadastro.');
    }
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[theme.typography.title, { color: theme.colors.text }]}>Criar conta</Text>
        </View>

        <Card style={styles.form}>
          <FormField control={control} name="nome" label="Nome" error={errors.nome?.message} />
          <FormField
            control={control}
            name="email"
            label="E-mail"
            error={errors.email?.message}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <FormField
            control={control}
            name="senha"
            label="Senha"
            error={errors.senha?.message}
            secureTextEntry
            autoCapitalize="none"
            keyboardType="number-pad"
            maxLength={6}
          />
          <FormField
            control={control}
            name="codigoAcesso"
            label="Código de acesso"
            error={errors.codigoAcesso?.message}
            autoCapitalize="characters"
          />

          {erro ? (
            <Text style={[theme.typography.caption, { color: theme.colors.danger }]}>{erro}</Text>
          ) : null}

          <AppButton
            label={isSubmitting ? 'Criando conta...' : 'Criar conta'}
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
          />
        </Card>

        <AppButton
          label="Já tenho conta"
          onPress={() => router.replace('/(auth)/login')}
          variant="secondary"
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 24,
  },
  header: {
    gap: 4,
    alignItems: 'center',
  },
  form: {
    gap: 16,
  },
});
