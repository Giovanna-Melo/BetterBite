import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, Alert,
} from 'react-native';

import { RegistroDesafio } from '../model/RegistroDesafio';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../App';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'CriarRegistroDesafio'>;
  route: RouteProp<RootStackParamList, 'CriarRegistroDesafio'>;
  registrosDesafio: RegistroDesafio[];
  setRegistrosDesafio: React.Dispatch<React.SetStateAction<RegistroDesafio[]>>;
};

export default function CriarRegistro({ navigation, route, registrosDesafio, setRegistrosDesafio }: Props) {
  const { idDesafio } = route.params;

  const [data, setData] = useState('');
  const [consumo, setConsumo] = useState('');
  const [observacao, setObservacao] = useState('');

  const validarData = (dateStr: string) => /^\d{4}-\d{2}-\d{2}$/.test(dateStr);

  const salvarRegistro = () => {
    if (!data.trim() || !consumo.trim()) {
      Alert.alert('Erro', 'Preencha os campos obrigatórios.');
      return;
    }

    if (!validarData(data.trim())) {
      Alert.alert('Erro', 'Data inválida. Use o formato YYYY-MM-DD.');
      return;
    }

    const valor = parseFloat(consumo);
    if (isNaN(valor) || valor < 0) {
      Alert.alert('Erro', 'Consumo deve ser um número positivo.');
      return;
    }

    const novaData = new Date(data.trim());

    const novoRegistro = new RegistroDesafio(
      idDesafio,
      novaData,
      valor,
      observacao.trim() || undefined
    );

    setRegistrosDesafio([...registrosDesafio, novoRegistro]);

    setData('');
    setConsumo('');
    setObservacao('');

    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>📋 Criar Registro</Text>

      <ScrollView style={styles.form} keyboardShouldPersistTaps="handled">
        <Input
          label="Data (YYYY-MM-DD)"
          value={data}
          onChange={setData}
          placeholder="Ex: 2025-06-07"
          keyboardType="numeric"
        />

        <Input
          label="Valor Consumido"
          value={consumo}
          onChange={setConsumo}
          placeholder="Ex: 1.5"
          keyboardType="decimal-pad"
        />

        <Input
          label="Observação (opcional)"
          value={observacao}
          onChange={setObservacao}
          multiline
          numberOfLines={4}
          placeholder="Digite uma observação"
          style={{ height: 100, textAlignVertical: 'top' }}
        />

        <TouchableOpacity style={styles.button} onPress={salvarRegistro}>
          <Text style={styles.buttonText}>Salvar Registro</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function Input({
  label,
  value,
  onChange,
  keyboardType = 'default',
  multiline = false,
  style = {},
  placeholder = '',
}: {
  label: string;
  value: string;
  onChange: (text: string) => void;
  keyboardType?: any;
  multiline?: boolean;
  style?: any;
  placeholder?: string;
}) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        keyboardType={keyboardType}
        style={[styles.input, style]}
        placeholder={placeholder}
        placeholderTextColor="#aaa"
        multiline={multiline}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 45,
    paddingHorizontal: 20,
    backgroundColor: '#fdfdfd',
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
    marginBottom: 20,
  },
  form: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    elevation: 3,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    color: '#000',
  },
  label: {
    fontWeight: '500',
    marginBottom: 6,
    color: '#333',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 14,
    borderRadius: 10,
    marginTop: 24,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
