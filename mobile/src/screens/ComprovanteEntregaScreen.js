import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function ComprovanteEntregaScreen({ route, navigation }) {
  const { nfId, nfNumber } = route.params;
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTakePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Erro', 'Precisamos de permissão para acessar a câmera.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.7,
      });

      if (!result.canceled) {
        setPhoto(result.assets[0]);
      }
    } catch (error) {
      console.error('Erro ao tirar foto:', error);
      Alert.alert('Erro', 'Não foi possível tirar a foto.');
    }
  };

  const handleSaveComprovante = async () => {
    if (!photo) {
      Alert.alert('Erro', 'Tire uma foto antes de salvar o comprovante.');
      return;
    }
  
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        navigation.navigate('Login');
        throw new Error('Token não encontrado');
      }
  
      const formData = new FormData();
      formData.append('proofImage', {
        uri: photo.uri,
        type: 'image/jpeg',
        name: `comprovante_nf_${nfId}.jpg`,
      });
  
      await axios.post(
        `https://frex.onrender.com/drivers/finalize-nf/${nfId}`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
  
      Alert.alert('Sucesso', 'Comprovante enviado com sucesso!', [
        { 
          text: 'OK', 
          onPress: () => navigation.goBack()
        }
      ]);
    } catch (error) {
      console.error('Erro ao salvar comprovante:', error);
      let mensagem = 'Não foi possível salvar o comprovante.';
      
      // Só navega para login se for erro de autenticação
      if (error.response?.status === 401) {
        mensagem = 'Sessão expirada. Por favor, faça login novamente.';
        Alert.alert('Erro', mensagem, [
          { 
            text: 'OK', 
            onPress: () => navigation.navigate('Login')
          }
        ]);
      } else {
        Alert.alert('Erro', mensagem);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Comprovante de Entrega</Text>
      <Text style={styles.subtitle}>NF-{nfNumber}</Text>

      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsTitle}>Instruções para a foto:</Text>
        <Text style={styles.instructionsText}>- Certifique-se que o canhoto está assinado</Text>
        <Text style={styles.instructionsText}>- Toda a área do canhoto deve estar visível</Text>
        <Text style={styles.instructionsText}>- Evite sombras e reflexos</Text>
      </View>

      <View style={styles.cameraContainer}>
        {photo ? (
          <Image 
            source={{ uri: photo.uri }} 
            style={styles.photo}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>Toque no botão abaixo para tirar uma foto</Text>
          </View>
        )}
      </View>

      <TouchableOpacity
        style={styles.captureButton}
        onPress={photo ? () => setPhoto(null) : handleTakePhoto}
      >
        <Text style={styles.buttonText}>
          {photo ? 'Tirar Nova Foto' : 'Tirar Foto'}
        </Text>
      </TouchableOpacity>

      {photo && (
        <TouchableOpacity
          style={[styles.saveButton, loading && styles.buttonDisabled]}
          onPress={handleSaveComprovante}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Salvando...' : 'Salvar Comprovante'}
          </Text>
        </TouchableOpacity>
      )}
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  instructionsContainer: {
    backgroundColor: '#EDE9FE',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6B21A8',
    marginBottom: 8,
  },
  instructionsText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  cameraContainer: {
    height: 300,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: '#F3F4F6',
  },
  photo: {
    flex: 1,
    width: '100%',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  placeholderText: {
    color: '#6B7280',
    textAlign: 'center',
    fontSize: 16,
  },
  captureButton: {
    backgroundColor: '#9333EA',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: '#10B981',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});