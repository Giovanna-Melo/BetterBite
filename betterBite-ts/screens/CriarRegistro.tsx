import React, { useState } from 'react'; 
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';

import { RegistroDesafio } from '../model/RegistroDesafio';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
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
    <SafeAreaView style={styles.safeArea}>
      {/* Header com botão de voltar */}
      <View style={styles.detailHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        > <Ionicons name="arrow-back" size={28} color="#333" />
          <Text style={styles.backButtonText}> Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Criar Registro</Text>
        <View style={{ width: 70 }} /> {/* espaço para balancear layout */}
      </View>

      <ScrollView
        style={styles.scrollableContentWrapper}
        contentContainerStyle={styles.listContentContainer}
        keyboardShouldPersistTaps="handled"
      >
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

        <TouchableOpacity style={styles.botao} onPress={salvarRegistro}>
          <Text style={styles.botaoTexto}>Salvar Registro</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
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
    <View style={{ marginBottom: 14 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        keyboardType={keyboardType}
        style={[styles.input, style]}
        placeholder={placeholder}
        placeholderTextColor="#999"
        multiline={multiline}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  backButtonText: {
    fontSize: 17,
    color: '#333',
    marginLeft: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  scrollableContentWrapper: {
    flex: 1,
  },
  listContentContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 20,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    width: '100%',
  },
  label: {
    fontSize: 15,
    color: '#555',
    marginBottom: 6,
    fontWeight: '600',
  },
  botao: {
    backgroundColor: '#8BC34A',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 28,
    alignItems: 'center',
  },
  botaoTexto: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 17,
  },
});