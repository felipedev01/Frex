import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

export default function NotaFiscaisScreen({ route, navigation }) {
  const { nfDetails } = route.params; // Dados passados da tela anterior

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.nfInfo}>
        <Text style={styles.nfNumber}>NF-{item.nfNumber}</Text>
        <Text style={styles.status}>{item.status || 'Pendente'}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.downloadButton}
          onPress={() =>
            navigation.navigate('ComprovanteEntrega', {
              nfNumber: item.nfNumber,
              nfId: item.id,
            })
          }
        >
          <Text style={styles.downloadButtonText}>Baixar NF</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.reportButton}>
          <Text style={styles.reportButtonText}>Reportar Problema</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notas Fiscais</Text>
      <Text style={styles.subtitle}>{nfDetails.length} notas no total</Text>
      <FlatList
        data={nfDetails}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  downloadButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  reportButtonText: {
    color: '#9333EA',
    fontWeight: 'bold',
    fontSize: 12,
  },
});
