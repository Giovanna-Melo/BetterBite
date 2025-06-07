import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Desafio } from '../model/Desafio';

interface Props {
  desafios: Desafio[];
}

export default function CheckinDesafio({ desafios }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>📅 Check-in de Desafio</Text>
      <Text style={styles.text}>Selecione um desafio e registre seu progresso.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  text: { fontSize: 16, color: '#555' }
});