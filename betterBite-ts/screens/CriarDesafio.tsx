import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  TextInput,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { Desafio } from '../model/Desafio';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
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
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        {/* Header com botão de voltar */}
              <View style={styles.detailHeader}>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => navigation.goBack()}
                >
                  <Ionicons name="arrow-back" size={28} color="#333" />
                  <Text style={styles.backButtonText}> Voltar</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Criar Desafio</Text>
                <View style={{ width: 70 }} /> {/* espaço para balancear layout */}
              </View>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <Input label="Nome" value={nome} onChange={setNome} />
          <Input label="Descrição" value={descricao} onChange={setDescricao} />
          <Input label="Categoria" value={categoria} onChange={setCategoria} />
          <DropdownCustom label="Tipo de Meta" value={tipoMeta} onPress={() => openDropdown('tipoMeta')} displayValue={getLabelByValue(tipoMetaOptions, tipoMeta)} />
          <DropdownCustom label="Unidade" value={unidade} onPress={() => openDropdown('unidade')} displayValue={getLabelByValue(unidadeOptions, unidade)} />
          <Input label="Valor da Meta" value={valorMeta} onChange={setValorMeta} keyboardType="numeric" />
          <DropdownCustom label="Frequência" value={frequencia} onPress={() => openDropdown('frequencia')} displayValue={getLabelByValue(frequenciaOptions, frequencia)} />
          <Input label="Duração (dias)" value={duracao} onChange={setDuracao} keyboardType="numeric" />
          <SwitchRow label="Personalizável?" value={ehPersonalizavel} onValueChange={setEhPersonalizavel} />
          <SwitchRow label="Ativo?" value={ativo} onValueChange={setAtivo} />

          <TouchableOpacity style={styles.botao} onPress={addDesafio}>
            <Text style={styles.botaoTexto}>Salvar Desafio</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

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
    </SafeAreaView>
  );
}

function Input({ label, value, onChange, keyboardType = 'default' }: { label: string; value: string; onChange: (text: string) => void; keyboardType?: 'default' | 'numeric' }) {
  return (
    <View style={styles.inputGroup}>
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
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity style={styles.dropdownCustom} onPress={onPress}>
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

const PRIMARY = '#4CAF50';

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
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollContent: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 6,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#FFF',
  },
  dropdownCustom: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#FFF',
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  button: {
    backgroundColor: PRIMARY,
    paddingVertical: 16,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 17,
    color: '#FFF',
    fontWeight: 'bold',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    maxHeight: 280,
  },
  option: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
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
