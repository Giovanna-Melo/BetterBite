import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Desafio } from '../model/Desafio';
import { DesafioUsuario } from '../model/DesafioUsuario';
import { DesafioController } from '../controllers/DesafioController';

interface Props {
  desafios: Desafio[];
  registros: DesafioUsuario[];
}

type RouteParams = {
  DetalhesDesafio: {
    idDesafio: string;
  };
};

export default function DetalhesDesafio({ desafios, registros }: Props) {
  const route = useRoute<RouteProp<RouteParams, 'DetalhesDesafio'>>();
  const controller = new DesafioController(desafios, registros);
  const desafio = controller.buscarPorId(route.params.idDesafio);

  if (!desafio) {
    return <Text style={styles.title}>Desafio não encontrado</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{desafio.nome}</Text>
      <Text style={styles.desc}>{desafio.descricao}</Text>
      <Text style={styles.progresso}>Progresso: {controller.progressoPorDesafio(desafio.id)}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  desc: { fontSize: 16, marginBottom: 8 },
  progresso: { fontSize: 16, color: '#333' }
});
