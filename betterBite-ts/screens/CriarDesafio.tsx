import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Switch, TextInput, Modal, FlatList, Platform} from 'react-native';
import { Desafio } from '../model/Desafio';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'CriarDesafio'>;
  desafios: Desafio[];
  setDesafios: React.Dispatch<React.SetStateAction<Desafio[]>>;
};

export default function CriarDesafio({ navigation, desafios, setDesafios }: Props) {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [categoria, setCategoria] = useState('');
  const [tipoMeta, setTipoMeta] = useState('');
  const [unidade, setUnidade] = useState('');
  const [valorMeta, setValorMeta] = useState('');
  const [frequencia, setFrequencia] = useState('');
  const [duracao, setDuracao] = useState('');
  const [ehPersonalizavel, setEhPersonalizavel] = useState(true);
  const [ativo, setAtivo] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentDropdown, setCurrentDropdown] = useState<string | null>(null);

  const tipoMetaOptions = [
    { label: 'Mínimo', value: 'mínimo' },
    { label: 'Máximo', value: 'máximo' },
  ];

  const unidadeOptions = [
    { label: 'Gramas (g)', value: 'g' },
    { label: 'Litros (l)', value: 'l' },
    { label: 'Unidades', value: 'unidade' },
    { label: 'Porções', value: 'porção' },
  ];

  const frequenciaOptions = [
    { label: 'Diária', value: 'diária' },
    { label: 'Semanal', value: 'semanal' },
    { label: 'Mensal', value: 'mensal' },
  ];

  const openDropdown = (field: string) => {
    setCurrentDropdown(field);
    setModalVisible(true);
  };

  const selectOption = (value: string) => {
    if (currentDropdown === 'tipoMeta') setTipoMeta(value);
    else if (currentDropdown === 'unidade') setUnidade(value);
    else if (currentDropdown === 'frequencia') setFrequencia(value);
    setModalVisible(false);
    setCurrentDropdown(null);
  };

  const getOptions = () => {
    if (currentDropdown === 'tipoMeta') return tipoMetaOptions;
    if (currentDropdown === 'unidade') return unidadeOptions;
    if (currentDropdown === 'frequencia') return frequenciaOptions;
    return [];
  };

  const getLabelByValue = (options: { label: string; value: string }[], value: string) => {
    const opt = options.find((o) => o.value === value);
    return opt ? opt.label : 'Selecione...';
  };

  const addDesafio = () => {
    if (!nome || !descricao || !categoria || !tipoMeta || !unidade || !frequencia || !valorMeta || !duracao) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    const hoje = new Date();
    const fim = new Date();
    fim.setDate(hoje.getDate() + parseInt(duracao));

    const novo = new Desafio(
      nome,
      descricao,
      categoria,
      tipoMeta,
      unidade,
      parseFloat(valorMeta),
      frequencia,
      parseInt(duracao),
      ehPersonalizavel,
      ativo
    );


    setDesafios([...desafios, novo]);
    setNome(''); setDescricao(''); setCategoria(''); setTipoMeta('');
    setUnidade(''); setValorMeta(''); setFrequencia(''); setDuracao('');
    setEhPersonalizavel(true); setAtivo(true);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>🎯 BetterBite</Text>
      <Text style={styles.subtitulo}>Criar novo desafio</Text>

      <ScrollView style={styles.form} keyboardShouldPersistTaps="handled">
        <Input label="Nome" value={nome} onChange={setNome} />
        <Input label="Descrição" value={descricao} onChange={setDescricao} />
        <Input label="Categoria" value={categoria} onChange={setCategoria} />
        <DropdownCustom label="Tipo de Meta" value={tipoMeta} onPress={() => openDropdown('tipoMeta')} displayValue={getLabelByValue(tipoMetaOptions, tipoMeta)} />
        <DropdownCustom label="Unidade" value={unidade} onPress={() => openDropdown('unidade')} displayValue={getLabelByValue(unidadeOptions, unidade)} />
        <Input label="Valor da Meta" value={valorMeta} onChange={setValorMeta} keyboardType='numeric' />
        <DropdownCustom label="Frequência" value={frequencia} onPress={() => openDropdown('frequencia')} displayValue={getLabelByValue(frequenciaOptions, frequencia)} />
        <Input label="Duração (dias)" value={duracao} onChange={setDuracao} keyboardType='numeric' />
        <SwitchRow label="Personalizável?" value={ehPersonalizavel} onValueChange={setEhPersonalizavel} />
        <SwitchRow label="Ativo?" value={ativo} onValueChange={setAtivo} />
        <TouchableOpacity style={styles.button} onPress={addDesafio}>
          <Text style={styles.buttonText}>Salvar Desafio</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal transparent visible={modalVisible} animationType="fade">
        <TouchableOpacity style={styles.modalBackground} activeOpacity={1} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <FlatList
              data={getOptions()}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.option} onPress={() => selectOption(item.value)}>
                  <Text style={styles.optionText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

function Input({ label, value, onChange, keyboardType = 'default' }: { label: string; value: string; onChange: (text: string) => void; keyboardType?: 'default' | 'numeric' }) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        keyboardType={keyboardType}
        style={styles.input}
        placeholder={label}
        placeholderTextColor="#aaa"
      />
    </View>
  );
}

function DropdownCustom({ label, value, onPress, displayValue }: { label: string; value: string; onPress: () => void; displayValue: string }) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity style={styles.dropdownCustom} onPress={onPress} activeOpacity={0.7}>
        <Text style={[styles.dropdownText, !value && { color: '#aaa' }]}>{displayValue}</Text>
      </TouchableOpacity>
    </View>
  );
}

function SwitchRow({ label, value, onValueChange }: { label: string; value: boolean; onValueChange: (val: boolean) => void }) {
  return (
    <View style={styles.switchRow}>
      <Text style={styles.label}>{label}</Text>
      <Switch value={value} onValueChange={onValueChange} />
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
    marginBottom: 4,
  },
  subtitulo: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginVertical: 10,
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
  dropdownCustom: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  dropdownText: {
    fontSize: 16,
    color: '#000',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 14,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    maxHeight: 250,
  },
  option: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
});
