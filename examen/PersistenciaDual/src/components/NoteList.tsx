import React from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Note } from '../repositories/IStorageRepository';

interface Props {
  notes: Note[];
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString('es-EC', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function NoteList({ notes, onEdit, onDelete }: Props) {
  const confirmDelete = (id: string, titulo: string) => {
    Alert.alert(
      'Eliminar nota',
      `¿Seguro que deseas eliminar "${titulo}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => onDelete(id) },
      ]
    );
  };

  if (notes.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>📭</Text>
        <Text style={styles.emptyTitle}>Sin notas en este motor</Text>
        <Text style={styles.emptySubtitle}>
          Toca{' '}
          <Text style={styles.emptyHighlight}>+</Text>
          {' '}para agregar una nueva nota
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={notes}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <View style={styles.cardBody}>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {item.titulo}
            </Text>
            {item.contenido.length > 0 && (
              <Text style={styles.cardContent} numberOfLines={3}>
                {item.contenido}
              </Text>
            )}
            <Text style={styles.cardDate}>{formatDate(item.createdAt)}</Text>
          </View>
          <View style={styles.cardActions}>
            <TouchableOpacity
              style={styles.editBtn}
              onPress={() => onEdit(item)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.editText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => confirmDelete(item.id, item.titulo)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.deleteText}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 16,
    gap: 12,
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  emptyTitle: {
    color: '#9ca3af',
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
  },
  emptySubtitle: {
    color: '#6b7280',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  emptyHighlight: {
    color: '#f97316',
    fontWeight: '800',
  },
  card: {
    backgroundColor: '#161b27',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  cardBody: {
    gap: 6,
    marginBottom: 14,
  },
  cardTitle: {
    color: '#f1f5f9',
    fontSize: 16,
    fontWeight: '700',
  },
  cardContent: {
    color: '#9ca3af',
    fontSize: 14,
    lineHeight: 20,
  },
  cardDate: {
    color: '#4b5563',
    fontSize: 11,
    marginTop: 2,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    paddingTop: 12,
  },
  editBtn: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: 'rgba(249,115,22,0.12)',
  },
  deleteBtn: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: 'rgba(239,68,68,0.1)',
  },
  editText: {
    color: '#f97316',
    fontSize: 13,
    fontWeight: '700',
  },
  deleteText: {
    color: '#ef4444',
    fontSize: 13,
    fontWeight: '700',
  },
});
