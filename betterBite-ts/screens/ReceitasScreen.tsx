import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, Button } from 'react-native';
import { Receita } from '../model/Receita';
import { ReceitaController } from '../controllers/ReceitaController';
import ReceitaCard from '../components/ReceitaCard';
import { useNavigation } from '@react-navigation/native';

export default function ReceitasScreen() {
  const navigation = useNavigation();
  const controller = new ReceitaController();
  const [receitas, setReceitas] = useState<Receita[]>([]);
  const [filtro, setFiltro] = useState<string>('');
  const [selecionada, setSelecionada] = useState<Receita | null>(null);

  useEffect(() => {
    const todas = controller.listarTodas();
    setReceitas(todas);
  }, []);

  const receitasFiltradas = receitas.filter((r) =>
    r.nome.toLowerCase().includes(filtro.toLowerCase()) ||
    r.ingredientes.some((ing) => ing.toLowerCase().includes(filtro.toLowerCase()))
  );

  if (selecionada) {
    return (
      <View style={styles.container}>
        <Button title="← Voltar" onPress={() => setSelecionada(null)} />
        <ReceitaCard receita={selecionada} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🍲 Receitas Saudáveis</Text>
      <TextInput
        style={styles.input}
        placeholder="Buscar por nome ou ingrediente..."
        value={filtro}
        onChangeText={setFiltro}
      />
      <FlatList
        data={receitasFiltradas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemBox}>
            <Text style={styles.itemTitle}>{item.nome}</Text>
            <Button title="Ver detalhes" onPress={() => setSelecionada(item)} />
          </View>
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f9f9f9' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
    borderColor: '#ccc',
    borderWidth: 1
  },
  itemBox: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 1
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8
  }
});