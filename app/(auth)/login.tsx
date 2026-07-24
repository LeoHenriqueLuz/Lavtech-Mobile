import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { supabase } from '@/lib/supabase';
import { useTheme } from '@/theme/theme-provider';

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

      <View style={styles.field}>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="E-mail"
              autoCapitalize="none"
              keyboardType="email-address"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text }]}
              placeholderTextColor={theme.colors.textMuted}
            />
          )}
        />
        {errors.email ? (
          <Text style={[theme.typography.caption, { color: theme.colors.danger }]}>
            {errors.email.message}
          </Text>
        ) : null}
      </View>

      <View style={styles.field}>
        <Controller
          control={control}
          name="senha"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Senha"
              secureTextEntry
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text }]}
              placeholderTextColor={theme.colors.textMuted}
            />
          )}
        />
        {errors.senha ? (
          <Text style={[theme.typography.caption, { color: theme.colors.danger }]}>
            {errors.senha.message}
          </Text>
        ) : null}
      </View>

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
  field: {
    gap: 4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
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
