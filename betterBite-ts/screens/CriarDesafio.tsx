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
  Image,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import Ionicons from '@expo/vector-icons/Ionicons';

import { Desafio } from '../model/Desafio';
import { DesafioUsuario } from '../model/DesafioUsuario';
import { Usuario } from '../model/Usuario';

import { AppColors, AppDimensions, HeaderStyles } from '../constants/AppStyles';

type Props = NativeStackScreenProps<RootStackParamList, 'CriarDesafio'> & {
  desafios: Desafio[];
  setDesafios: React.Dispatch<React.SetStateAction<Desafio[]>>;
  usuario: Usuario;
  setDesafiosDoUsuarioState: React.Dispatch<React.SetStateAction<DesafioUsuario[]>>;
};

export default function CriarDesafio({ navigation, desafios, setDesafios, usuario, setDesafiosDoUsuarioState }: Props) {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [categoria, setCategoria] = useState('');
  const [tipoMeta, setTipoMeta] = useState('');
  const [unidade, setUnidade] = useState('');
  const [valorMeta, setValorMeta] = useState('');
  const [frequencia, setFrequencia] = useState('');
  const [duracao, setDuracao] = useState('');
  const [ativo, setAtivo] = useState(true);

  const criarDesafio = () => {
    if (!nome.trim() || !descricao.trim() || !categoria.trim() || !tipoMeta.trim() || !unidade.trim() || !valorMeta.trim() || !frequencia.trim() || !duracao.trim()) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios.');
      return;
    }

    const valorMetaNum = parseFloat(valorMeta);
    const duracaoNum = parseInt(duracao, 10);

    if (isNaN(valorMetaNum) || valorMetaNum <= 0 || isNaN(duracaoNum) || duracaoNum <= 0) {
      Alert.alert('Erro', 'Valor da Meta e Duração devem ser números positivos.');
      return;
    }

    const novoDesafio = new Desafio(
      nome.trim(),
      descricao.trim(),
      categoria,
      tipoMeta,
      unidade.trim(),
      valorMetaNum,
      frequencia,
      duracaoNum,
      true,
      ativo
    );

    setDesafios((prev) => [...prev, novoDesafio]);

    const novoDesafioUsuario = new DesafioUsuario(
      usuario.id,
      novoDesafio.id,
      new Date(),
      new Date(Date.now() + duracaoNum * 24 * 60 * 60 * 1000),
      'ativo',
      0
    );
    setDesafiosDoUsuarioState((prev) => [...prev, novoDesafioUsuario]);

    Alert.alert('Sucesso', 'Desafio criado e você já está participando!');
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={HeaderStyles.detailHeader}>
        <TouchableOpacity
          style={HeaderStyles.backButtonContainer}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={AppDimensions.iconSize.large} color={AppColors.textSecondary} />
          <Text style={HeaderStyles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
        <Text style={HeaderStyles.headerTitle}>Criar Desafio</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={HeaderStyles.appLogoHeaderContainer}>
          <Image
            source={require('../assets/better-bite-logo.png')}
            style={HeaderStyles.appLogoHeader}
            accessibilityLabel="BetterBite Logo"
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.formContainer}>
        <Text style={styles.label}>Nome do Desafio:</Text>
        <TextInput
          style={styles.input}
          value={nome}
          onChangeText={setNome}
          placeholder="Ex: Desafio da Água"
          placeholderTextColor={AppColors.placeholder}
        />

        <Text style={styles.label}>Descrição:</Text>
        <TextInput
          style={styles.input}
          value={descricao}
          onChangeText={setDescricao}
          placeholder="Ex: Beber 8 copos de água por dia."
          multiline
          numberOfLines={3}
          placeholderTextColor={AppColors.placeholder}
        />

        <Text style={styles.label}>Categoria:</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={categoria}
            onValueChange={setCategoria}
            style={styles.picker}
            itemStyle={{ color: AppColors.textSecondary }}
          >
            <Picker.Item label="Selecione..." value="" />
            <Picker.Item label="Introdução alimentar" value="introdução alimentar" />
            <Picker.Item label="Refeições" value="refeições" />
            <Picker.Item label="Bem-estar" value="bem-estar" />
            <Picker.Item label="Restrição" value="restrição" />
          </Picker>
        </View>

        <Text style={styles.label}>Tipo de Meta:</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={tipoMeta}
            onValueChange={setTipoMeta}
            style={styles.picker}
            itemStyle={{ color: AppColors.textSecondary }}
          >
            <Picker.Item label="Selecione..." value="" />
            <Picker.Item label="Quantidade" value="quantidade" />
            <Picker.Item label="Tempo" value="tempo" />
          </Picker>
        </View>

        <Text style={styles.label}>Unidade da Meta:</Text>
        <TextInput
          style={styles.input}
          value={unidade}
          onChangeText={setUnidade}
          placeholder="Ex: copos, minutos, porções, vezes"
          placeholderTextColor={AppColors.placeholder}
        />

        <Text style={styles.label}>Valor da Meta:</Text>
        <TextInput
          style={styles.input}
          value={valorMeta}
          onChangeText={setValorMeta}
          keyboardType="numeric"
          placeholder="Ex: 8 (para 8 copos)"
          placeholderTextColor={AppColors.placeholder}
        />

        <Text style={styles.label}>Frequência:</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={frequencia}
            onValueChange={setFrequencia}
            style={styles.picker}
            itemStyle={{ color: AppColors.textSecondary }}
          >
            <Picker.Item label="Selecione..." value="" />
            <Picker.Item label="Diário" value="diario" />
            <Picker.Item label="Semanal" value="semanal" />
            <Picker.Item label="Mensal" value="mensal" />
          </Picker>
        </View>

        <Text style={styles.label}>Duração (em dias):</Text>
        <TextInput
          style={styles.input}
          value={duracao}
          onChangeText={setDuracao}
          keyboardType="numeric"
          placeholder="Ex: 7 (para 7 dias)"
          placeholderTextColor={AppColors.placeholder}
        />

        <TouchableOpacity style={styles.botao} onPress={criarDesafio}>
          <Text style={styles.botaoTexto}>Criar Desafio</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  formContainer: {
    paddingHorizontal: AppDimensions.spacing.medium,
    paddingTop: AppDimensions.spacing.large,
    paddingBottom: AppDimensions.spacing.xLarge,
  },
  label: {
    fontSize: 16,
    color: AppColors.textSecondary,
    marginBottom: AppDimensions.spacing.small,
    fontWeight: '600',
  },
  input: {
    backgroundColor: AppColors.inputBackground,
    borderRadius: AppDimensions.borderRadius.medium,
    paddingHorizontal: AppDimensions.spacing.medium,
    paddingVertical: AppDimensions.spacing.small + 2,
    fontSize: 16,
    borderColor: AppColors.border,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    marginBottom: AppDimensions.spacing.medium,
    color: AppColors.text,
  },
  pickerWrapper: {
    backgroundColor: AppColors.inputBackground,
    borderRadius: AppDimensions.borderRadius.medium,
    borderColor: AppColors.border,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    marginBottom: AppDimensions.spacing.medium,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
    color: AppColors.textSecondary,
  },
  botao: {
    backgroundColor: AppColors.primary,
    paddingVertical: AppDimensions.spacing.medium + 4,
    borderRadius: AppDimensions.borderRadius.large,
    marginTop: AppDimensions.spacing.xLarge,
    alignItems: 'center',
  },
  botaoTexto: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 17,
  },
});