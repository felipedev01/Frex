import React, { useContext, useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../contexts/AuthContext';

import LoginScreen from '../screens/LoginScreen';
import DriverDashboard from '../screens/DriverDashboard';
import NotaFiscaisScreen from '../screens/NotaFiscaisScreen'; // Importe o novo componente

const Stack = createStackNavigator();

export default function AppRoutes() {
  const { token, setToken } = useContext(AuthContext); // Adicione setToken para atualizar o token
  const [loading, setLoading] = useState(true);

  useEffect(() => {

   AsyncStorage.removeItem('token');
    
    /* validateToken(); */
  }, []);

  const validateToken = async () => {
    setLoading(true);
    try {
      const storedToken = await AsyncStorage.getItem('token');

      if (!storedToken) {
        throw new Error('Token não encontrado.');
      }

      // Faz uma requisição ao backend para validar o token
      const response = await axios.get('https://frex.onrender.com/auth/validate-token', { 

        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      if (response.data.valid) {
        setToken(storedToken); // Atualiza o contexto com o token válido
      
      } else {
        throw new Error('Token expirado ou inválido.');
      }
    } catch (error) {
      Alert.alert('Sessão expirada', 'Faça login novamente.');
      await AsyncStorage.removeItem('token'); // Remove o token inválido do armazenamento
      setToken(null); // Define o token no contexto como nulo
    } finally {
      setLoading(false);
    }
  };

  /* if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#A855F7" />
        <Text>Verificando sessão...</Text>
      </View>
    );
  } */

  
    return (
      <NavigationContainer>
        <Stack.Navigator>
          {!token ? (
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
          ) : (
            <>
              <Stack.Screen
                name="DriverDashboard"
                component={DriverDashboard}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="NotasFiscais"
                component={NotaFiscaisScreen}
                options={{ title: 'Notas Fiscais', headerShown: true }}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    );
}
