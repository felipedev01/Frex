import React, { useEffect, useState } from 'react';
import { View, Text, Button, ScrollView, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles/driverDashboardStyles';

export default function DriverDashboard({ navigation }) {
  const [driver, setDriver] = useState({});
  const [currentShipment, setCurrentShipment] = useState(null);
  const [shipmentHistory, setShipmentHistory] = useState([]);

  useEffect(() => {
    fetchDriverData();
    fetchCurrentShipment();
    fetchShipmentHistory();
  }, []);

  const fetchDriverData = async () => {
    try {
      const token = await AsyncStorage.getItem('token'); // Obtém o token do armazenamento local
      
      if (!token) {
        throw new Error('Token não encontrado. Faça login novamente.');
      }
  
      const response = await axios.get('https://frex.onrender.com/drivers/me', {
        headers: {
          Authorization: `Bearer ${token}`, // Adiciona o token no cabeçalho
        },
      });
  
      setDriver(response.data);
    } catch (error) {
      console.error('Erro ao buscar dados do motorista:', error.response?.data || error.message);
    }
  };

  const fetchCurrentShipment = async () => {
    const response = await axios.get('https://frex.onrender.com/driver/current-shipment');
    setCurrentShipment(response.data);
  };

  const fetchShipmentHistory = async () => {
    const response = await axios.get('https://frex.onrender.com/driver/shipment-history');
    setShipmentHistory(response.data);
  };

  const handleFinishShipment = async () => {
    await axios.post('https://frex.onrender.com/driver/finish-shipment', {
      shipmentId: currentShipment.id,
    });
    setCurrentShipment(null);
    fetchShipmentHistory();
  };

  const handleLogout = async () => {
    try {
      // Limpa o token do AsyncStorage
      await AsyncStorage.removeItem('token');
      Alert.alert('Logout realizado', 'Você foi desconectado com sucesso.');
      
      // Redireciona para a tela de login
      navigation.reset({
        index: 0,
        routes: [{ name: 'LoginScreen' }], // Nome da tela de login no seu navegador
      });
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível realizar o logout.');
      console.error('Erro ao fazer logout:', error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Dashboard do Motorista</Text>
      <View style={styles.section}>
        <Text>Nome: {driver.name}</Text>
        <Text>Email: {driver.email}</Text>
        <Text>Status: {currentShipment ? 'Carga Pendente' : 'Nenhuma carga pendente'}</Text>
      </View>

      {currentShipment && (
        <View style={styles.section}>
          <Text>Carga Atual:</Text>
          <Text>ID: {currentShipment.id}</Text>
          <Text>Descrição: {currentShipment.description}</Text>
          <Text>Destino: {currentShipment.destination}</Text>
          <Button title="Finalizar Carga" onPress={handleFinishShipment} />
        </View>
      )}

      <View style={styles.section}>
        <Text>Histórico de Cargas:</Text>
        {shipmentHistory.map((shipment) => (
          <View key={shipment.id}>
            <Text>ID: {shipment.id}</Text>
            <Text>Descrição: {shipment.description}</Text>
            <Text>Destino: {shipment.destination}</Text>
            <Text>Data de Conclusão: {shipment.endDate}</Text>
          </View>
        ))}
      </View>

      {/* Botão de Logout */}
      <View style={styles.section}>
        <Button title="Logout" onPress={handleLogout} color="#A855F7" />
      </View>
    </ScrollView>
  );
}
