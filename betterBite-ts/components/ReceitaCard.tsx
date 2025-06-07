import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Receita } from '../model/Receita';

type Props = {
  receita: Receita;
};

export default function ReceitaCard({ receita }: Props) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: receita.imagemUrl }} style={styles.image} />
      <View style={styles.infoBox}>
        <Text style={styles.nome}>{receita.nome}</Text>
        <Text style={styles.desc}>{receita.descricao}</Text>
        <Text style={styles.info}>🍽️ {receita.caloriasPorPorcao} kcal · {receita.porcoes} porções</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2
  },
  image: {
    height: 180,
    width: '100%'
  },
  infoBox: {
    padding: 12
  },
  nome: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  desc: {
    fontSize: 14,
    color: '#555',
    marginVertical: 4
  },
  info: {
    fontSize: 12,
    color: '#777'
  }
});