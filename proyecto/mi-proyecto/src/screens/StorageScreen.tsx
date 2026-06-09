import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

// Prefijos para aislar los simuladores de almacenamiento
const DATASTORE_PREFIX = '@DataStore_';
const SHARED_PREFS_PREFIX = '@SharedPrefs_';

export default function StorageScreen() {
  const [compartment, setCompartment] = useState('sharedPrefs');
  const [keyInput, setKeyInput] = useState('');
  const [valueInput, setValueInput] = useState('');
  
  // Acción Guardar
  const handleSave = async () => {
    if (!keyInput.trim() || !valueInput.trim()) {
      Alert.alert('Error', 'Debe ingresar una llave y un valor.');
      return;
    }

    try {
      if (compartment === 'sharedPrefs') {
        // a) SharedPreferences -> Texto plano (AsyncStorage regular)
        await AsyncStorage.setItem(`${SHARED_PREFS_PREFIX}${keyInput}`, valueInput);
      } else if (compartment === 'dataStore') {
        // b) DataStore -> Reactivo/Asíncrono (Simulado en Expo a través de react-native-async-storage)
        await AsyncStorage.setItem(`${DATASTORE_PREFIX}${keyInput}`, valueInput);
      } else if (compartment === 'encrypted') {
        // c) EncryptedSharedPreferences -> Cifrado AES-256 (expo-secure-store)
        await SecureStore.setItemAsync(keyInput, valueInput);
      }
      Alert.alert('Éxito', `Guardado correctamente en ${compartment}.`);
      setValueInput(''); // Limpiamos el valor por seguridad visual
    } catch (error: any) {
      Alert.alert('Error al Guardar', error.message || 'Excepción desconocida.');
    }
  };

  // Acción Recuperar
  const handleRetrieve = async () => {
    if (!keyInput.trim()) {
      Alert.alert('Error', 'Debe especificar la llave a recuperar.');
      return;
    }

    try {
      let result: string | null = null;
      if (compartment === 'sharedPrefs') {
        result = await AsyncStorage.getItem(`${SHARED_PREFS_PREFIX}${keyInput}`);
      } else if (compartment === 'dataStore') {
        result = await AsyncStorage.getItem(`${DATASTORE_PREFIX}${keyInput}`);
      } else if (compartment === 'encrypted') {
        result = await SecureStore.getItemAsync(keyInput);
      }

      if (result !== null) {
        Alert.alert('Secreto Recuperado', `La llave "${keyInput}" contiene el valor:\n\n${result}`);
      } else {
        Alert.alert('No Encontrado', `No existe un valor asociado a la llave "${keyInput}" en el compartimento seleccionado.`);
      }
    } catch (error: any) {
      Alert.alert('Error al Recuperar', error.message || 'Excepción desconocida.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Gestión de Secretos</Text>
      
      <View style={styles.section}>
        <Text style={styles.label}>Compartimento de Almacenamiento:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={compartment}
            onValueChange={(itemValue) => setCompartment(itemValue)}
          >
            <Picker.Item label="SharedPreferences (Texto plano)" value="sharedPrefs" />
            <Picker.Item label="DataStore (AsyncStorage simulado)" value="dataStore" />
            <Picker.Item label="EncryptedSharedPreferences (AES-256)" value="encrypted" />
          </Picker>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Llave (Key):</Text>
        <TextInput
          style={styles.input}
          value={keyInput}
          onChangeText={setKeyInput}
          placeholder="Ej. mi_secreto_id"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Valor (Value) - Solo para Guardar:</Text>
        <TextInput
          style={styles.input}
          value={valueInput}
          onChangeText={setValueInput}
          placeholder="Ej. super_secret_hash_999"
        />
      </View>

      <View style={styles.buttonsContainer}>
        <View style={styles.buttonWrapper}>
          <Button title="Guardar" onPress={handleSave} color="#4CAF50" />
        </View>
        <View style={styles.buttonWrapper}>
          <Button title="Recuperar" onPress={handleRetrieve} color="#2196F3" />
        </View>
      </View>
      
      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>Mecanismos Simulados (Android):</Text>
        <Text style={styles.infoText}>
          - <Text style={styles.bold}>SharedPreferences:</Text> Implementado vía AsyncStorage normal.
        </Text>
        <Text style={styles.infoText}>
          - <Text style={styles.bold}>DataStore:</Text> Simulado usando llaves segmentadas en AsyncStorage (la asincronicidad es nativa).
        </Text>
        <Text style={styles.infoText}>
          - <Text style={styles.bold}>EncryptedPrefs:</Text> Usando expo-secure-store que cifra AES-256 nativamente.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  section: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
    fontWeight: '600',
  },
  pickerContainer: {
    backgroundColor: '#fafafa',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  input: {
    backgroundColor: '#fafafa',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
  },
  buttonWrapper: {
    flex: 0.48,
  },
  infoBox: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#90caf9',
  },
  infoTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
    color: '#1565c0',
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
    lineHeight: 20,
  },
  bold: {
    fontWeight: 'bold',
  }
});