import React, { useState } from 'react';
import { 
  View, Text, TextInput, Button, StyleSheet, ActivityIndicator, Alert, ScrollView 
} from 'react-native';

export default function RestScreen() {
  const [postId, setPostId] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // MÓDULO 1: CONECTIVIDAD REST (GET)
  const fetchPost = async () => {
    if (!postId.trim() || isNaN(Number(postId))) {
      Alert.alert('Error', 'Por favor ingresa un ID numérico válido');
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`);
      if (!response.ok) {
        throw new Error('Post no encontrado con ese ID');
      }
      const data = await response.json();
      setTitle(data.title);
      setBody(data.body);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al obtener datos\n(Verifica la red o un ID válido de 1 a 100)');
      setTitle('');
      setBody('');
    } finally {
      setIsLoading(false);
    }
  };

  // MÓDULO 1: CONECTIVIDAD REST (PUT)
  const updatePost = async () => {
    if (!postId || !title || !body) {
      Alert.alert('Error', 'Faltan datos para actualizar (Consulte primero un Post)');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`, {
        method: 'PUT',
        body: JSON.stringify({
          id: Number(postId),
          title: title,
          body: body,
          userId: 1, // hardcodeamos el userId de prueba
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Mostrar confirmación visual requerida
        Alert.alert('Éxito (200 OK)', `Post actualizado correctamente en el servidor.\n\nNuevo Título:\n${data.title}`);
      } else {
        throw new Error('El servidor no respondió con éxito (Status: ' + response.status + ')');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al actualizar');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Consulta REST - JSONPlaceholder</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>ID del Post (1 - 100):</Text>
        <TextInput
          style={styles.input}
          value={postId}
          onChangeText={setPostId}
          keyboardType="numeric"
          editable={!isLoading}
          placeholder="Ej. 1"
        />
      </View>

      <Button title="Consultar (GET)" onPress={fetchPost} disabled={isLoading} />

      {/* Manejo de Estados de Carga (Loading States) */}
      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Procesando petición...</Text>
        </View>
      ) : (
        <View style={styles.formContainer}>
          <Text style={styles.label}>Título (Title):</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            value={title}
            onChangeText={setTitle}
            editable={!isLoading}
            multiline
          />

          <Text style={styles.label}>Cuerpo (Body):</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            value={body}
            onChangeText={setBody}
            editable={!isLoading}
            multiline
          />

          <View style={styles.updateButtonContainer}>
            <Button title="Actualizar (PUT)" onPress={updatePost} disabled={isLoading || title === ''} color="green" />
          </View>
        </View>
      )}
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
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginTop: 5,
    borderRadius: 5,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  formContainer: {
    marginTop: 20,
    gap: 15, // spacing available in newer react-native versions
  },
  updateButtonContainer: {
    marginTop: 10,
  },
  loaderContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  }
});