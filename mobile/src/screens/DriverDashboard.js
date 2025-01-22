import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, Image, SafeAreaView,StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

export default function DriverDashboard({ navigation }) {
  const [driver, setDriver] = useState({});
  const [currentShipment, setCurrentShipment] = useState(null);
  const [loading, setLoading] = useState(false);

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

      const shipmentResponse = await axios.get('https://frex.onrender.com/drivers/current-shipment', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const pendingShipment = shipmentResponse.data;
      setCurrentShipment(pendingShipment || null);

    } catch (error) {
      
      if (error.response?.status === 404) {
              // Quando o backend retorna que não há mais cargas pendentes
              if (error.response.data?.error === 'Nenhuma carga pendente encontrada') {
                setCurrentShipment(null)
              }
              
            } 
      if (error.response?.status === 401) {
        navigation.navigate('Login');
        Alert.alert('Erro', 'Sessão expirada. Por favor, faça login novamente.');
      } 
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchDriverData();
    }, [])
  );

  const handleFinishShipment = async () => {
    if (!currentShipment) return;
  
    // Verifica se ainda existem notas pendentes
    const pendingNotes = currentShipment.nfDetails.filter(nf => nf.status === 'PENDENTE').length;
    
    if (pendingNotes > 0) {
      Alert.alert(
        'Atenção',
        'É preciso baixar todas as notas antes de finalizar o frete.',
        [{ text: 'OK' }]
      );
      return;
    }
  
    // Resto do código original para finalizar o frete...
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.post(
        'https://frex.onrender.com/drivers/finish-shipment',
        { shipmentId: currentShipment.id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      Alert.alert('Sucesso', 'Frete finalizado com sucesso!');
      setCurrentShipment(null);
      await fetchDriverData();
    } catch (error) {
      console.error('Erro ao finalizar frete:', error.message);
      Alert.alert('Erro', 'Não foi possível finalizar o frete.');
    } finally {
      setLoading(false);
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
          <View style={styles.locationCard}>
            <View style={styles.section}>
              <Ionicons name="location-outline" size={20} color="#9333EA" />
              <View style={styles.textGroup}>
                <Text style={styles.label}>Origem</Text>
                <Text style={styles.value}>{currentShipment.origin || "Não especificado"}</Text>
              </View>
            </View>
            <View style={styles.section}>
              <Ionicons name="location-outline" size={20} color="#9333EA" />
              <View style={styles.textGroup}>
                <Text style={styles.label}>Destino</Text>
                <Text style={styles.value}>{currentShipment.destination || "Não especificado"}</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <MaterialIcons name="inventory" size={20} color="#9333EA" />
            <View style={styles.textGroup}>
              <Text style={styles.label}>Carga</Text>
              <Text style={styles.value}>{currentShipment.name || "Não especificado"}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <MaterialIcons name="person" size={20} color="#9333EA" />
            <View style={styles.textGroup}>
              <Text style={styles.label}>Motorista</Text>
              <Text style={styles.value}>
                {driver.name || "Desconhecido"} • {driver.licensePlate || "Não especificado"}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.notesButton}
            onPress={() => navigation.navigate('NotasFiscais')}
          >
            <View>
              <Text style={styles.notesText}>Notas Fiscais</Text>
              <Text style={styles.notesSubText}>
                {currentShipment?.nfDetails?.filter(nf => nf.status === 'PENDENTE').length || 0} pendentes
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#9333EA" style={{ opacity: 0.6 }} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.finishButton}
            onPress={handleFinishShipment}
            disabled={loading}
          >
            <Text style={styles.finishButtonText}>
              {loading ? 'Finalizando...' : 'Finalizar Frete'}
            </Text>
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

const styles = StyleSheet.create({
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
    textAlign: 'center',
  },
  card: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  locationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  section: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
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
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
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
    fontWeight: '600',
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
});