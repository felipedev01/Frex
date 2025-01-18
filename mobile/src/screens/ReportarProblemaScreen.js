import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  Alert,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const issueTypes = [
  'Cliente recusou recebimento',
  'Não havia responsável para receber',
  'Endereço incorreto',
  'Mercadoria danificada',
  'Divergência na quantidade',
  'Fora do horário de recebimento',
  'Outro motivo'
];

export default function ReportarProblemaScreen({ route, navigation }) {
  const { nfId, nfNumber } = route.params;
  const [selectedType, setSelectedType] = useState('');
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!selectedType) {
      Alert.alert('Erro', 'Selecione o tipo do problema');
      return;
    }

    if (!details.trim()) {
      Alert.alert('Erro', 'Descreva o problema encontrado');
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.post(
        `https://frex.onrender.com/drivers/report-nf-issue/${nfId}`,
        {
          issueType: selectedType,
          issueDetails: details
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      Alert.alert('Sucesso', 'Problema reportado com sucesso!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error('Erro ao reportar problema:', error);
      Alert.alert(
        'Erro',
        error.response?.status === 401
          ? 'Sessão expirada. Por favor, faça login novamente.'
          : 'Não foi possível reportar o problema'
      );

      if (error.response?.status === 401) {
        navigation.navigate('Login');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <MaterialIcons name="arrow-back" size={24} color="#9333EA" />
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>Reportar Problema</Text>
          <Text style={styles.subtitle}>NF-{nfNumber}</Text>
        </View>
      </View>

      <View style={styles.warningContainer}>
        <MaterialIcons name="warning" size={24} color="#92400E" />
        <Text style={styles.warningText}>
          Descreva em detalhes o problema encontrado na entrega desta nota fiscal.
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Tipo do Problema</Text>
      {issueTypes.map((type) => (
        <TouchableOpacity
          key={type}
          style={[
            styles.typeButton,
            selectedType === type && styles.typeButtonSelected
          ]}
          onPress={() => setSelectedType(type)}
        >
          <Text style={[
            styles.typeButtonText,
            selectedType === type && styles.typeButtonTextSelected
          ]}>
            {type}
          </Text>
        </TouchableOpacity>
      ))}

      <Text style={styles.sectionTitle}>Detalhes do Problema</Text>
      <TextInput
        style={styles.input}
        multiline
        numberOfLines={4}
        placeholder="Descreva o problema encontrado..."
        value={details}
        onChangeText={setDetails}
      />

      <TouchableOpacity
        style={[styles.submitButton, loading && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.submitButtonText}>Enviar Reporte</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF5FF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#9333EA',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    padding: 16,
    margin: 16,
    borderRadius: 8,
  },
  warningText: {
    flex: 1,
    marginLeft: 12,
    color: '#92400E',
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  typeButton: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  typeButtonSelected: {
    backgroundColor: '#9333EA',
    borderColor: '#9333EA',
  },
  typeButtonText: {
    color: '#374151',
    fontSize: 14,
  },
  typeButtonTextSelected: {
    color: '#FFFFFF',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    margin: 16,
    height: 100,
    textAlignVertical: 'top',
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: '#9333EA',
    padding: 16,
    borderRadius: 8,
    margin: 16,
    alignItems: 'center',
    marginBottom: 32,
  },
  buttonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});