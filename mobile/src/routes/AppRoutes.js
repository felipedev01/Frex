import React, { useContext, useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../contexts/AuthContext';

import LoginScreen from '../screens/LoginScreen';
import DriverDashboard from '../screens/DriverDashboard';
import NotaFiscaisScreen from '../screens/NotaFiscaisScreen';
import ComprovanteEntregaScreen from '../screens/ComprovanteEntregaScreen';
import ReportarProblemaScreen from '../screens/ReportarProblemaScreen'; // Nova importação

const Stack = createStackNavigator();

export default function AppRoutes() {
  const { token, setToken } = useContext(AuthContext);
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

      const response = await axios.get('https://frex.onrender.com/auth/validate-token', { 
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      if (response.data.valid) {
        setToken(storedToken);
      } else {
        throw new Error('Token expirado ou inválido.');
      }
    } catch (error) {
      Alert.alert('Sessão expirada', 'Faça login novamente.');
      await AsyncStorage.removeItem('token');
      setToken(null);
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
              options={{ 
                headerShown: false // Mudado para false pois agora temos header próprio
              }}
            />
            <Stack.Screen
              name="ComprovanteEntrega"
              component={ComprovanteEntregaScreen}
              options={{ 
                headerShown: false // Consistência com outras telas
              }}
            />
            <Stack.Screen
              name="ReportarProblema"
              component={ReportarProblemaScreen}
              options={{ 
                headerShown: false // Header próprio na tela
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}