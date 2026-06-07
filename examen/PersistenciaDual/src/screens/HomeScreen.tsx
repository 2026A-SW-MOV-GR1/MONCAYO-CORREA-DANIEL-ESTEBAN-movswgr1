import React, { useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { StorageChip } from '../components/StorageChip';
import { NoteForm } from '../components/NoteForm';
import { NoteList } from '../components/NoteList';
import { useStorage } from '../context/StorageContext';
import { Note } from '../repositories/IStorageRepository';

export default function HomeScreen() {
  const { engine, toggleEngine, notes, loading, createNote, updateNote, deleteNote } =
    useStorage();

  const [formVisible, setFormVisible] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  const openCreate = () => {
    setEditingNote(null);
    setFormVisible(true);
  };

  const openEdit = (note: Note) => {
    setEditingNote(note);
    setFormVisible(true);
  };

  const handleSave = async (titulo: string, contenido: string) => {
    if (editingNote) {
      await updateNote(editingNote.id, titulo, contenido);
    } else {
      await createNote(titulo, contenido);
    }
    setFormVisible(false);
    setEditingNote(null);
  };

  const handleCancel = () => {
    setFormVisible(false);
    setEditingNote(null);
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* ─── Header / AppBar ─── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Mis Notas</Text>
          <Text style={styles.headerSub}>
            {notes.length} nota{notes.length !== 1 ? 's' : ''}
          </Text>
        </View>

        {/* Switch + Chip de motor activo */}
        <View style={styles.engineControl}>
          <StorageChip engine={engine} />
          <Switch
            value={engine === 'nosql'}
            onValueChange={toggleEngine}
            trackColor={{ false: '#4ade80', true: '#fb923c' }}
            thumbColor="#ffffff"
            ios_backgroundColor="#1e293b"
          />
        </View>
      </View>

      {/* ─── Indicador de motor activo (etiqueta visual) ─── */}
      <View
        style={[
          styles.engineBanner,
          engine === 'sqlite' ? styles.bannerSql : styles.bannerNosql,
        ]}
      >
        <Text style={styles.bannerText}>
          {engine === 'sqlite'
            ? '🗄  Leyendo desde SQLite (Relacional)'
            : '📦  Leyendo desde AsyncStorage (NoSQL)'}
        </Text>
      </View>

      {/* ─── Contenido ─── */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#f97316" />
          <Text style={styles.loadingText}>
            Iniciando motor {engine === 'sqlite' ? 'SQLite' : 'NoSQL'}…
          </Text>
        </View>
      ) : (
        <NoteList notes={notes} onEdit={openEdit} onDelete={deleteNote} />
      )}

      {/* ─── FAB ─── */}
      <TouchableOpacity style={styles.fab} onPress={openCreate} activeOpacity={0.8}>
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>

      {/* ─── Modal de formulario ─── */}
      <NoteForm
        visible={formVisible}
        initialNote={editingNote}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </SafeAreaView>
  );
}

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 0;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0d1117',
    paddingTop: STATUSBAR_HEIGHT,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  headerTitle: {
    color: '#f1f5f9',
    fontSize: 26,
    fontWeight: '800',
  },
  headerSub: {
    color: '#6b7280',
    fontSize: 13,
    marginTop: 2,
  },
  engineControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  engineBanner: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerSql: {
    backgroundColor: 'rgba(74,222,128,0.07)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(74,222,128,0.15)',
  },
  bannerNosql: {
    backgroundColor: 'rgba(251,146,60,0.07)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(251,146,60,0.15)',
  },
  bannerText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '500',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 14,
  },
  loadingText: {
    color: '#9ca3af',
    fontSize: 14,
  },
  fab: {
    position: 'absolute',
    bottom: 36,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f97316',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#f97316',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
  },
  fabText: {
    color: '#fff',
    fontSize: 28,
    lineHeight: 32,
    fontWeight: '300',
  },
});
