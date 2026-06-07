import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Note } from '../repositories/IStorageRepository';

interface Props {
  visible: boolean;
  initialNote?: Note | null;
  onSave: (titulo: string, contenido: string) => void;
  onCancel: () => void;
}

export function NoteForm({ visible, initialNote, onSave, onCancel }: Props) {
  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');

  useEffect(() => {
    if (visible) {
      setTitulo(initialNote?.titulo ?? '');
      setContenido(initialNote?.contenido ?? '');
    }
  }, [visible, initialNote]);

  const canSave = titulo.trim().length > 0;

  return (
    <Modal visible={visible} animationType="slide" transparent statusBarTranslucent>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <View style={styles.card}>
          <Text style={styles.title}>
            {initialNote ? 'Editar Nota' : 'Nueva Nota'}
          </Text>

          <Text style={styles.fieldLabel}>Título *</Text>
          <TextInput
            style={styles.input}
            placeholder="Escribe el título..."
            placeholderTextColor="#4b5563"
            value={titulo}
            onChangeText={setTitulo}
            autoFocus
          />

          <Text style={styles.fieldLabel}>Contenido</Text>
          <TextInput
            style={[styles.input, styles.multiline]}
            placeholder="Escribe el contenido..."
            placeholderTextColor="#4b5563"
            value={contenido}
            onChangeText={setContenido}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />

          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveBtn, !canSave && styles.disabledBtn]}
              onPress={() => canSave && onSave(titulo.trim(), contenido.trim())}
              disabled={!canSave}
            >
              <Text style={styles.saveText}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  card: {
    backgroundColor: '#161b27',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    gap: 8,
  },
  title: {
    color: '#f1f5f9',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 12,
  },
  fieldLabel: {
    color: '#6b7280',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: 4,
  },
  input: {
    backgroundColor: '#0d1117',
    color: '#f1f5f9',
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#1e293b',
    marginBottom: 4,
  },
  multiline: {
    minHeight: 110,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  cancelBtn: {
    flex: 1,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#1e293b',
  },
  saveBtn: {
    flex: 1,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#f97316',
  },
  disabledBtn: {
    opacity: 0.4,
  },
  cancelText: {
    color: '#94a3b8',
    fontWeight: '700',
    fontSize: 15,
  },
  saveText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 15,
  },
});
