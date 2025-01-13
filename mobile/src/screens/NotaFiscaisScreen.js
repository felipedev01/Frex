import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

export default function NotaFiscaisScreen({ route }) {
  const { nfDetails } = route.params; // Dados passados da tela anterior

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.nfNumber}>NF-{item.nfNumber}</Text>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>Baixar NF</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.problemButton]}>
          <Text style={styles.actionText}>Reportar Problema</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notas Fiscais</Text>
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
    marginBottom: 16,
  },
  itemContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  nfNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: '#9333EA',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  problemButton: {
    backgroundColor: '#E11D48',
  },
  actionText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
