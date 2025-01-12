import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, Image, SafeAreaView } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

export default function DriverDashboard({ navigation }) {
  const [driver, setDriver] = useState({});
  const [currentShipment, setCurrentShipment] = useState(null);

  useEffect(() => {
    fetchDriverData();
  }, []);

  const fetchDriverData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('Token não encontrado. Faça login novamente.');
      }

      const response = await axios.get('https://frex.onrender.com/drivers/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const driverData = response.data;
      setDriver(driverData);

      const pendingShipment = driverData.shipments.find(
        (shipment) => shipment.status === 'PENDENTE'
      );
      setCurrentShipment(pendingShipment || null);
    } catch (error) {
      console.error('Erro ao buscar dados do motorista:', error.message);
      Alert.alert('Erro', 'Não foi possível carregar os dados do motorista.');
    }
  };

  const handleFinishShipment = async () => {
    try {
      await axios.post(
        'https://frex.onrender.com/driver/finish-shipment',
        { shipmentId: currentShipment.id },
        {
          headers: {
            Authorization: `Bearer ${await AsyncStorage.getItem('token')}`,
          },
        }
      );
      Alert.alert('Sucesso', 'Frete finalizado com sucesso!');
      setCurrentShipment(null);
      fetchDriverData();
    } catch (error) {
      console.error('Erro ao finalizar frete:', error.message);
      Alert.alert('Erro', 'Não foi possível finalizar o frete.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Image 
          source={require('../assets/logo_frex.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.subHeader}>Frete Atual</Text>
      </View>

      {currentShipment ? (
        <View style={styles.card}>
          {/* Location Card */}
          <View style={styles.locationCard}>
            <View style={styles.section}>
              <Ionicons name="location-outline" size={20} color="#9333EA" />
              <View style={styles.textGroup}>
                <Text style={styles.label}>Origem</Text>
                <Text style={styles.value}>{currentShipment.origin || "São Paulo, SP"}</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Ionicons name="location-outline" size={20} color="#9333EA" />
              <View style={styles.textGroup}>
                <Text style={styles.label}>Destino</Text>
                <Text style={styles.value}>{currentShipment.destination || "Campinas, SP"}</Text>
              </View>
            </View>
          </View>

          {/* Cargo */}
          <View style={styles.section}>
            <MaterialIcons name="inventory" size={20} color="#9333EA" />
            <View style={styles.textGroup}>
              <Text style={styles.label}>Carga</Text>
              <Text style={styles.value}>{currentShipment.description || "Eletrônicos"}</Text>
            </View>
          </View>

          {/* Driver */}
          <View style={styles.section}>
            <MaterialIcons name="person" size={20} color="#9333EA" />
            <View style={styles.textGroup}>
              <Text style={styles.label}>Motorista</Text>
              <Text style={styles.value}>
                {driver.name || "João Silva"} • {driver.licensePlate || "ABC-1234"}
              </Text>
            </View>
          </View>

          {/* Invoices Button */}
          <TouchableOpacity
            style={styles.notesButton}
            onPress={() => navigation.navigate('NotasFiscais', { shipmentId: currentShipment.id })}
          >
            <View>
              <Text style={styles.notesText}>Notas Fiscais</Text>
              <Text style={styles.notesSubText}>20 notas para baixar</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#9333EA" style={{ opacity: 0.6 }} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.finishButton} onPress={handleFinishShipment}>
            <Text style={styles.finishButtonText}>Finalizar Frete</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Nenhum frete no momento</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#FAF5FF',
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  logo: {
    height: 40,
    width: 120,
    marginBottom: 8,
  },
  subHeader: {
    fontSize: 16,
    color: '#B088F9',
    marginBottom: 24,
  },
  card: {
    flex: 1,
    paddingHorizontal: 20,
  },
  locationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  section: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  textGroup: {
    marginLeft: 12,
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#374151',
  },
  notesButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  notesText: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 4,
  },
  notesSubText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  finishButton: {
    backgroundColor: '#9333EA',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 32,
  },
  finishButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
  },
};