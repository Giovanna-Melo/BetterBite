import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

export default function ListaDesafios({ navigation, desafios, setDesafios, registros }) {
  const delDesafio = (nome) => {
    setDesafios(desafios.filter(d => d.nome !== nome));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>🎯 BetterBite</Text>
      <Text style={styles.subtitulo}>📋 Meus Desafios</Text>

      <ScrollView style={styles.list}>
        {desafios.length === 0 && (
          <Text style={{textAlign: 'center', marginVertical: 20, color: '#777'}}>Nenhum desafio criado.</Text>
        )}

        {desafios.map((d, i) => (
          <View key={i} style={styles.card}>
            <Text style={styles.cardTitle}>{d.nome}</Text>
            <Text style={styles.cardText}>{d.descricao}</Text>
            <Text style={styles.cardText}>Categoria: {d.categoria}</Text>
            <Text style={styles.cardText}>Meta: {d.tipoMeta} de {d.valorMeta} {d.unidade}</Text>
            <Text style={styles.cardText}>Frequência: {d.frequencia}</Text>
            <Text style={styles.cardText}>Duração: {d.duracao} dias</Text>
            <Text style={styles.cardText}>Personalizável: {d.ehPersonalizavel ? 'Sim' : 'Não'}</Text>
            <Text style={styles.cardText}>Ativo: {d.ativo ? 'Sim' : 'Não'}</Text>

            <TouchableOpacity style={styles.deleteButton} onPress={() => delDesafio(d.nome)}>
              <Text style={styles.deleteButtonText}>Excluir</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.verCheckinsButton}
              onPress={() => navigation.navigate('DetalhesDesafio', { idDesafio: d.id })}
            >
              <Text style={styles.verCheckinsButtonText}>📊 Ver Check-ins</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('CriarDesafio')}
      >
        <Text style={styles.buttonText}>+ Novo Desafio</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 45, paddingHorizontal: 20, backgroundColor: '#fdfdfd' },
  titulo: { fontSize: 28, fontWeight: 'bold', color: '#4CAF50', textAlign: 'center', marginBottom: 4 },
  subtitulo: { fontSize: 20, fontWeight: '600', color: '#333', marginVertical: 10 },
  list: { marginBottom: 20 },
  card: { backgroundColor: '#e8f5e9', padding: 15, borderRadius: 12, marginBottom: 12 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#2e7d32', marginBottom: 4 },
  cardText: { color: '#333', marginBottom: 2 },
  deleteButton: {
    marginTop: 8, backgroundColor: '#e53935', padding: 10, borderRadius: 8, alignItems: 'center',
  },
  deleteButtonText: { color: '#fff', fontWeight: 'bold' },
  button: {
    backgroundColor: '#4CAF50', padding: 14, borderRadius: 10, marginBottom: 20, alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  verCheckinsButton: {
    marginTop: 6, backgroundColor: '#2196F3', padding: 10, borderRadius: 8, alignItems: 'center',
  },
  verCheckinsButtonText: { color: '#fff', fontWeight: 'bold' },
});
