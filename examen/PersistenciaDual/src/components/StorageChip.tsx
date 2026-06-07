import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StorageEngine } from '../repositories/RepositoryFactory';

interface Props {
  engine: StorageEngine;
}

export function StorageChip({ engine }: Props) {
  const isSQLite = engine === 'sqlite';
  return (
    <View style={[styles.chip, isSQLite ? styles.sqlChip : styles.nosqlChip]}>
      <Text style={styles.dot}>{isSQLite ? '●' : '◆'}</Text>
      <Text style={styles.label}>{isSQLite ? 'SQLite' : 'NoSQL'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  sqlChip: {
    backgroundColor: 'rgba(74, 222, 128, 0.15)',
    borderWidth: 1,
    borderColor: '#4ade80',
  },
  nosqlChip: {
    backgroundColor: 'rgba(251, 146, 60, 0.15)',
    borderWidth: 1,
    borderColor: '#fb923c',
  },
  dot: {
    fontSize: 8,
    color: '#fff',
  },
  label: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
