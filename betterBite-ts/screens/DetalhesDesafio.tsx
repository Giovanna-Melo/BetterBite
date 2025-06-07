import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

type RegistroDesafio = {
  idDesafio: string;
  data: string;
  cumpriuMeta: boolean;
  observacao?: string;
};

type Props = {
  route: { params: { idDesafio: string } };
  navigation: any;
  desafios: { id: string; nome: string }[];
  registros: RegistroDesafio[];
};

export default function DetalhesDesafio({ route, navigation, desafios, registros }: Props) {
  const { idDesafio } = route.params;

  const desafio = desafios.find((d) => d.id === idDesafio);
  const checkins = registros.filter((r) => r.idDesafio === idDesafio);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📊 Check-ins do desafio</Text>
      <Text style={styles.subtitle}>{desafio?.nome || 'Desafio sem nome'}</Text>

      <FlatList
        data={checkins}
        keyExtractor={(_, index) => index.toString()}
        ListEmptyComponent={<Text style={styles.empty}>Nenhum check-in ainda.</Text>}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>📅 {item.data}</Text>
            <Text>{item.cumpriuMeta ? '✅ Cumpriu a meta' : '❌ Não cumpriu'}</Text>
            {item.observacao ? <Text>📝 {item.observacao}</Text> : null}
          </View>
        )}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('CheckinDesafio', { idDesafio })}
      >
        <Text style={styles.buttonText}>+ Fazer Check-in</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#4CAF50' },
  subtitle: { fontSize: 18, marginBottom: 20 },
  item: { padding: 10, marginBottom: 10, backgroundColor: '#e8f5e9', borderRadius: 8 },
  empty: { textAlign: 'center', marginVertical: 20, color: '#777' },
  button: {
    backgroundColor: '#4CAF50',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});
