import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function NotasFiscaisScreen({ navigation }) {
  const [notasFiscais, setNotasFiscais] = useState([]);
  const [loading, setLoading] = useState(true);

  // Função para buscar notas fiscais atualizadas
  const fetchNotasFiscais = React.useCallback(async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('Token não encontrado');

      const response = await axios.get(
        'https://frex.onrender.com/drivers/current-shipment',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Filtra apenas as notas pendentes
      const notasPendentes = response.data.nfDetails.filter(
        nf => nf.status === 'PENDENTE'
      );
      setNotasFiscais(notasPendentes);
    } catch (error) {
      console.error('Erro ao buscar notas fiscais:', error);
      let mensagem = 'Não foi possível carregar as notas fiscais.';
      
      if (error.response?.status === 401) {
        mensagem = 'Sessão expirada. Por favor, faça login novamente.';
        navigation.navigate('Login');
      }
      
      Alert.alert('Erro', mensagem);
    } finally {
      setLoading(false);
    }
  }, [navigation]);

  // Atualiza a lista quando a tela recebe foco
  useFocusEffect(
    React.useCallback(() => {
      fetchNotasFiscais();
    }, [fetchNotasFiscais])
  );

  const handleNFPress = (nf) => {
    navigation.navigate('ComprovanteEntrega', {
      nfId: nf.id,
      nfNumber: nf.nfNumber,
      onFinalizacao: async (nfId) => {
        // Atualiza a lista localmente primeiro para feedback imediato
        setNotasFiscais(current => 
          current.filter(nota => nota.id !== nfId)
        );
        
        // Recarrega os dados do servidor para garantir sincronização
        await fetchNotasFiscais();
      }
    });
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.nfInfo}>
        <Text style={styles.nfNumber}>NF-{item.nfNumber}</Text>
        <Text style={styles.status}>Pendente</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.downloadButton}
          onPress={() => handleNFPress(item)}
        >
          <Text style={styles.downloadButtonText}>Baixar NF</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.reportButton}
          onPress={() => navigation.navigate('ReportarProblema', { 
            nfId: item.id,
            nfNumber:item.nfNumber,
            onProblemaReportado: fetchNotasFiscais
          })}
        >
          <Text style={styles.reportButtonText}>Reportar Problema</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const ListaVazia = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        {loading ? 'Carregando...' : 'Não há notas fiscais pendentes'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notas Fiscais</Text>
      <Text style={styles.subtitle}>
        {notasFiscais.length} {notasFiscais.length === 1 ? 'nota pendente' : 'notas pendentes'}
      </Text>
      
      <FlatList
        data={notasFiscais}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={ListaVazia}
        refreshing={loading}
        onRefresh={fetchNotasFiscais}
        contentContainerStyle={notasFiscais.length === 0 && styles.emptyList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF5FF',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#9333EA',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  itemContainer: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  nfInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  nfNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#374151',
  },
  status: {
    fontSize: 12,
    color: '#9333EA',
    fontWeight: 'bold',
    textAlign: 'right',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  downloadButton: {
    backgroundColor: '#9333EA',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    flex: 1,
    marginRight: 8,
  },
  downloadButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
  },
  reportButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#9333EA',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    flex: 1,
    marginLeft: 8,
  },
  reportButtonText: {
    color: '#9333EA',
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});