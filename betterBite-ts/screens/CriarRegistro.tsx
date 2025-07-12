import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Image } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../App';
import { RegistroDesafio } from '../model/RegistroDesafio';
import { dbService } from '../database/DatabaseService';
import { DesafioController } from '../controllers/DesafioController';

import { AppColors, AppDimensions, HeaderStyles } from '../constants/AppStyles';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, keyof RootStackParamList>;
  route: RouteProp<RootStackParamList, 'CriarRegistroDesafio'>;
};

export default function CriarRegistro({ navigation, route }: Props) {
  const { idDesafioUsuario, idDesafio } = route.params;

  const [data, setData] = useState(new Date().toISOString().split('T')[0]); // Formato YYYY-MM-DD
  const [consumo, setConsumo] = useState('');
  const [observacao, setObservacao] = useState('');

  const validarData = (dateStr: string) => /^\d{4}-\d{2}-\d{2}$/.test(dateStr);

  const salvarRegistro = async () => {
    if (!data.trim() || !consumo.trim()) {
      Alert.alert('Erro', 'Preencha os campos Data e Valor Consumido.');
      return;
    }

    if (!validarData(data.trim())) {
      Alert.alert('Erro', 'Data inválida. Use o formato YYYY-MM-DD.');
      return;
    }

    const valor = parseFloat(consumo);
    if (isNaN(valor) || valor < 0) {
      Alert.alert('Erro', 'Consumo deve ser um número não-negativo.');
      return;
    }
    
    // Adiciona a hora atual para não ter problemas de fuso horário
    const novaData = new Date(`${data.trim()}T12:00:00.000Z`);

    const novoRegistro = new RegistroDesafio(
      idDesafioUsuario,
      novaData,
      valor,
      observacao.trim() || undefined
    );

    try {
      await dbService.addRegistroDesafio(novoRegistro);
      
      // Recalcula o progresso após adicionar um novo registro
      const controller = new DesafioController();
      await controller.calcularEAtualizarProgresso(idDesafioUsuario);

      Alert.alert('Sucesso', 'Registro salvo com sucesso!');
      navigation.goBack();
    } catch (error) {
      console.error("Erro ao salvar registro:", error);
      Alert.alert("Erro", "Não foi possível salvar o registro.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={HeaderStyles.detailHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={HeaderStyles.backButtonContainer}>
          <Ionicons name="arrow-back" size={AppDimensions.iconSize.large} color={AppColors.textSecondary} />
          <Text style={HeaderStyles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
        <Text style={HeaderStyles.headerTitle}>Criar Registro</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={HeaderStyles.appLogoHeaderContainer}>
          <Image
            source={require('../assets/better-bite-logo.png')}
            style={HeaderStyles.appLogoHeader}
            accessibilityLabel="BetterBite Logo"
          />
        </TouchableOpacity>
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
          keyboardType="default"
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
  numberOfLines,
}: {
  label: string;
  value: string;
  onChange: (text: string) => void;
  keyboardType?: any;
  multiline?: boolean;
  style?: any;
  placeholder?: string;
  numberOfLines?: number;
}) {
  return (
    <View style={{ marginBottom: AppDimensions.spacing.medium }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        keyboardType={keyboardType}
        style={[styles.input, style]}
        placeholder={placeholder}
        placeholderTextColor={AppColors.placeholder}
        multiline={multiline}
        numberOfLines={numberOfLines}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  scrollableContentWrapper: {
    flex: 1,
  },
  listContentContainer: {
    paddingHorizontal: AppDimensions.spacing.medium,
    paddingTop: AppDimensions.spacing.small,
    paddingBottom: AppDimensions.spacing.medium,
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
    width: '100%',
    marginBottom: AppDimensions.spacing.small, 
  },
  label: {
    fontSize: 15,
    color: AppColors.textSecondary,
    marginBottom: AppDimensions.spacing.small / 2,
    fontWeight: '600',
  },
  botao: {
    backgroundColor: AppColors.primary,
    paddingVertical: AppDimensions.spacing.medium + 4,
    borderRadius: AppDimensions.borderRadius.medium,
    marginTop: AppDimensions.spacing.xLarge,
    alignItems: 'center',
  },
  botaoTexto: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 17,
  },
});