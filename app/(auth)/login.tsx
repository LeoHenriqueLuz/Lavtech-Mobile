import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useTheme } from '@/theme/theme-provider';
import { FormField } from '@/components/form-field';

const loginSchema = z.object({
  email: z.string().min(1, 'Informe o e-mail').email('E-mail inválido'),
  senha: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const theme = useTheme();
  const [erroLogin, setErroLogin] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', senha: '' },
  });

  async function onSubmit(data: LoginFormData) {
    setErroLogin(null);
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.senha,
    });
    if (error) {
      setErroLogin('E-mail ou senha inválidos.');
    }
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={[theme.typography.title, { color: theme.colors.text }]}>LavTech</Text>

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
      />

      {erroLogin ? (
        <Text style={[theme.typography.body, { color: theme.colors.danger }]}>{erroLogin}</Text>
      ) : null}

      <TouchableOpacity
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting}
        style={[styles.button, { backgroundColor: theme.colors.primary, opacity: isSubmitting ? 0.6 : 1 }]}
      >
        <Text style={styles.buttonText}>{isSubmitting ? 'Entrando...' : 'Entrar'}</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 16,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
