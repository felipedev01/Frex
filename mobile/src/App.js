import 'react-native-gesture-handler'; // Import obrigatório
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler'; // Envolver o aplicativo
import { AuthProvider } from './contexts/AuthContext';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
