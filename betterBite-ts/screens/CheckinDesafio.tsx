import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TextInput, TouchableOpacity, Alert } from 'react-native';

export default function CheckinDesafio({ navigation, route, adicionarRegistro, desafios }) {
  const { idDesafio } = route.params;
  const desafio = desafios.find(d => d.id === idDesafio);

  // Inicializa com data e hora atual no formato 'YYYY-MM-DDTHH:mm'
  const [dataHora, setDataHora] = useState(() => {
    const now = new Date();
    const pad = (n) => n.toString().padStart(2, '0');
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
  });

  const [cumpriuMeta, setCumpriuMeta] = useState(false);
  const [observacao, setObservacao] = useState('');

  if (!desafio) {
    return (
      <View style={styles.container}>
        <Text>Desafio não encontrado.</Text>
      </View>
    );
  }

  const salvar = () => {
    const registro = {
      idDesafio,
      data: new Date(dataHora).toISOString(), // Data+hora no formato ISO UTC
      cumpriuMeta,
      observacao: observacao.trim() || undefined,
    };

    adicionarRegistro(registro);
    Alert.alert('Sucesso', 'Check-in registrado com sucesso!');
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Check-in: {desafio.nome}</Text>

      <Text>Selecione data e hora:</Text>
      <input
        type="datetime-local"
        value={dataHora}
        onChange={(e) => setDataHora(e.target.value)}
        style={{
          padding: 10,
          fontSize: 16,
          borderRadius: 6,
          borderColor: '#999',
          borderWidth: 1,
          marginVertical: 12,
        }}
      />

      <View style={styles.switchRow}>
        <Text>Cumpriu a meta?</Text>
        <Switch value={cumpriuMeta} onValueChange={setCumpriuMeta} />
      </View>

      <TextInput
        placeholder="Observações (opcional)"
        multiline
        numberOfLines={4}
        style={styles.textArea}
        value={observacao}
        onChangeText={setObservacao}
      />

      <TouchableOpacity style={styles.button} onPress={salvar}>
        <Text style={styles.buttonText}>Salvar Check-in</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, { backgroundColor: '#bbb' }]} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 8,
    padding: 12,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});
