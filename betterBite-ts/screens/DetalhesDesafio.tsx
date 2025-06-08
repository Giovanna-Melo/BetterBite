import React from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Desafio } from '../model/Desafio';
import { DesafioUsuario } from '../model/DesafioUsuario';
import { RegistroDesafio } from '../model/RegistroDesafio';
import { DesafioController } from '../controllers/DesafioController';
import { RootStackParamList } from '../App';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  desafios: Desafio[];
  registros: DesafioUsuario[];
  registrosDesafio: RegistroDesafio[];
}

type RouteParams = {
  DetalhesDesafio: {
    idDesafio: string;
  };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'DetalhesDesafio'>;

export default function DetalhesDesafio({ desafios, registros, registrosDesafio }: Props) {
  const route = useRoute<RouteProp<RouteParams, 'DetalhesDesafio'>>();
  const navigation = useNavigation<NavigationProp>();

  const controller = new DesafioController(desafios, registros, registrosDesafio);
  const desafio = controller.buscarPorId(route.params.idDesafio);

  if (!desafio) {
    return <Text style={styles.title}>Desafio não encontrado</Text>;
  }

  const progresso = controller.progressoPorDesafio(desafio.id);
  const registrosLista = controller.registrosDoDesafio(desafio.id);

  function irParaCriarRegistro() {
    navigation.navigate('CriarRegistroDesafio', { idDesafio: desafio.id });
  }

  // Agrupar registros por data e somar consumo
  const registrosPorData = Array.from(
    registrosLista.reduce((acc, reg) => {
      const dataStr = reg.data.toISOString().split('T')[0]; // formato yyyy-mm-dd
      const total = acc.get(dataStr) ?? 0;
      acc.set(dataStr, total + reg.consumo);
      return acc;
    }, new Map<string, number>())
  ).sort((a, b) => (a[0] < b[0] ? 1 : -1)); // ordena por data desc

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{desafio.nome}</Text>
      <Text style={styles.desc}>{desafio.descricao}</Text>
      <Text style={styles.progresso}>Progresso: {progresso}%</Text>

      <Text style={styles.subtitle}>Registros por dia:</Text>
      {registrosPorData.length === 0 ? (
        <Text style={styles.semRegistro}>Nenhum registro ainda.</Text>
      ) : (
        registrosPorData.map(([dataStr, totalConsumo]) => (
          <Text key={dataStr} style={styles.registroItem}>
            {new Date(dataStr).toLocaleDateString()} - {totalConsumo} {desafio.unidade} →{' '}
            {totalConsumo >= desafio.valorMeta ? '✅ Cumprido' : '❌ Não cumprido'}
          </Text>
        ))
      )}

      <TouchableOpacity style={styles.fab} onPress={irParaCriarRegistro}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  desc: { fontSize: 16, marginBottom: 8 },
  progresso: { fontSize: 16, color: '#333', marginBottom: 8 },
  subtitle: { fontSize: 18, fontWeight: 'bold', marginTop: 16, marginBottom: 4 },
  semRegistro: { fontSize: 14, color: '#888' },
  registroItem: { fontSize: 16, marginBottom: 4 },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#007AFF',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});
