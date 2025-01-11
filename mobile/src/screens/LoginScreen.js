import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import styles from '../styles/loginStyles';
import { AuthContext } from '../contexts/AuthContext';
import { Feather } from '@expo/vector-icons';


export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Preencha todos os campos!');
      return;
    }

    setIsLoading(true);

    try {
      await login(email, password);
      Alert.alert('Sucesso', 'Login bem-sucedido!');
    } catch (error) {
      Alert.alert('Erro', error.message || 'Falha no login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header com o logo */}
      <View style={styles.header}>
        <Image
          source={require('../assets/logo_frex.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.subtitle}>Portal do Motorista</Text>
      </View>

      {/* Formulário de login */}
      <View style={styles.form}>
        {/* Campo de email */}
        <Text style={styles.label}>Usuário</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Digite seu usuário"
            placeholderTextColor="#A0AEC0"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!isLoading}
          />
          <Feather name="user" size={20} color="#A0AEC0" style={styles.inputIcon} />
        </View>

        {/* Campo de senha */}
        <Text style={styles.label}>Senha</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Digite sua senha"
            placeholderTextColor="#A0AEC0"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!isLoading}
          />
          <Feather name="lock" size={20} color="#A0AEC0" style={styles.inputIcon} />
        </View>

        {/* Botão de login */}
        <TouchableOpacity
          style={[styles.button, isLoading && { opacity: 0.7 }]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Entrar</Text>
          )}
        </TouchableOpacity>

        {/* Link de suporte */}
        <Text style={styles.supportText}>
          Problemas para acessar?{' '}
          <Text style={styles.supportLink}>Fale com o suporte</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}
