import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import api from '../services/api';

const DriverDashboard = ({ navigation }) => {
  const [driverData, setDriverData] = useState({});
  const [shipments, setShipments] = useState([]);

  useEffect(() => {
    const fetchDriverData = async () => {
      const driverResponse = await api.get('/drivers/me');
      setDriverData(driverResponse.data);

      const shipmentResponse = await api.get('/shipments/assigned');
      setShipments(shipmentResponse.data);
    };
    fetchDriverData();
  }, []);

  return (
    <View>
      <Text>Bem-vindo, {driverData.name}</Text>
      <Text>Placa: {driverData.licensePlate}</Text>
      <Text>Transportadora: {driverData.transportCompany}</Text>
      <Text>Fretes Atribuídos:</Text>
      {shipments.map((shipment) => (
        <View key={shipment.id}>
          <Text>Carga: {shipment.name}</Text>
          <Text>Descrição: {shipment.description}</Text>
        </View>
      ))}
      <Button title="Sair" onPress={() => navigation.navigate('Login')} />
    </View>
  );
};

export default DriverDashboard;
