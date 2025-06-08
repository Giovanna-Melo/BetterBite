import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Desafio } from '../model/Desafio';

type Props = {
  desafio: Desafio;
};

export default function DesafioCard({ desafio }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{desafio.nome}</Text>
      <Text style={styles.description}>{desafio.descricao}</Text>
      <Text style={styles.detail}>Categoria: {desafio.categoria}</Text>
      <Text style={styles.detail}>
        Meta: {desafio.valorMeta} {desafio.unidade} ({desafio.tipoMeta})
      </Text>
      <Text style={styles.detail}>Frequência: {desafio.frequencia}</Text>
      <Text style={styles.detail}>Duração: {desafio.duracao} dias</Text>
      <Text style={styles.detail}>
        Personalizável: {desafio.ehPersonalizavel ? 'Sim' : 'Não'}
      </Text>
      <Text style={[styles.detail, { color: desafio.ativo ? 'green' : 'red' }]}>
        {desafio.ativo ? 'Ativo' : 'Inativo'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginVertical: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  detail: {
    fontSize: 15,
    color: '#444',
    marginBottom: 6,
  },
});
