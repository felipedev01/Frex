import React, { useEffect, useState } from 'react';
import { View, Text, Button, ScrollView } from 'react-native';
import axios from 'axios';
import styles from './styles';

export default function DriverDashboard() {
  const [driver, setDriver] = useState({});
  const [currentShipment, setCurrentShipment] = useState(null);
  const [shipmentHistory, setShipmentHistory] = useState([]);

  useEffect(() => {
    fetchDriverData();
    fetchCurrentShipment();
    fetchShipmentHistory();
  }, []);

  const fetchDriverData = async () => {
    const response = await axios.get('https://frex.onrender.com/driver/me');
    setDriver(response.data);
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
    </ScrollView>
  );
}

