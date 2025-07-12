import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Image } from "react-native";
import { Usuario } from "../model/Usuario";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { dbService } from "../database/DatabaseService";

import { AppColors, AppDimensions, HeaderStyles } from '../constants/AppStyles';

type Props = NativeStackScreenProps<RootStackParamList, "EditarUsuario"> & {
  usuario: Usuario;
  setUsuario: (usuario: Usuario) => void;
};

export default function EditarUsuarioScreen({ navigation, usuario, setUsuario }: Props) {
  const [nome, setNome] = useState(usuario.nome);
  const [peso, setPeso] = useState(String(usuario.peso));
  const [altura, setAltura] = useState(String(usuario.altura));
  const [restricoes, setRestricoes] = useState(
    usuario.restricoesAlimentares.join(", ")
  );

  if (!usuario) {
      return null;
  }

  const salvarAlteracoes = async () => {
    try {
      const usuarioAtualizado: Usuario = {
        ...usuario,
        nome: nome.trim(),
        peso: parseFloat(peso),
        altura: parseFloat(altura),
        restricoesAlimentares: restricoes.trim() ? restricoes.split(",").map((r) => r.trim()) : [],
      };

      // Atualiza no banco de dados
      await dbService.updateUsuario(usuarioAtualizado);

      // Atualiza no AsyncStorage para manter o estado de login
      await AsyncStorage.setItem("usuarioLogado", JSON.stringify(usuarioAtualizado));
      
      // Atualiza o estado no App.tsx
      setUsuario(usuarioAtualizado);

      Alert.alert("Sucesso", "Dados atualizados!");
      navigation.goBack();
    } catch (error) {
      console.error("Erro ao salvar alterações:", error);
      Alert.alert("Erro", "Não foi possível salvar os dados.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Cabeçalho Responsivo */}
      <View style={HeaderStyles.detailHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={HeaderStyles.backButtonContainer}>
          <Ionicons name="arrow-back" size={AppDimensions.iconSize.large} color={AppColors.textSecondary} />
          <Text style={HeaderStyles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
        <Text style={HeaderStyles.headerTitle}>Editar Perfil</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={HeaderStyles.appLogoHeaderContainer}>
          <Image
            source={require('../assets/better-bite-logo.png')}
            style={HeaderStyles.appLogoHeader}
            accessibilityLabel="BetterBite Logo"
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>Nome:</Text>
        <TextInput
          style={styles.input}
          placeholder="Nome"
          value={nome}
          onChangeText={setNome}
          placeholderTextColor={AppColors.placeholder}
        />
        <Text style={styles.label}>Email:</Text>
        <TextInput
          style={[styles.input, styles.inputDisabled]}
          placeholder="Email"
          value={usuario.email}
          editable={false}
          placeholderTextColor={AppColors.placeholder}
        />
        <Text style={styles.label}>Peso:</Text>
        <TextInput
          style={styles.input}
          placeholder="Peso (kg)"
          keyboardType="numeric"
          value={peso}
          onChangeText={setPeso}
          placeholderTextColor={AppColors.placeholder}
        />
        <Text style={styles.label}>Altura:</Text>
        <TextInput
          style={styles.input}
          placeholder="Altura (cm)"
          keyboardType="numeric"
          value={altura}
          onChangeText={setAltura}
          placeholderTextColor={AppColors.placeholder}
        />
        <Text style={styles.label}>
          Restrições alimentares(separadas por vírgula):
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Restrições alimentares (separadas por vírgula)"
          value={restricoes}
          onChangeText={setRestricoes}
          placeholderTextColor={AppColors.placeholder}
        />

        <TouchableOpacity style={styles.button} onPress={salvarAlteracoes}>
          <Text style={styles.buttonText}>Salvar Alterações</Text>
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
  container: { 
    padding: AppDimensions.spacing.medium,
    flexGrow: 1, 
    backgroundColor: AppColors.background,
  },
  input: {
    backgroundColor: AppColors.inputBackground,
    paddingHorizontal: AppDimensions.spacing.medium,
    paddingVertical: AppDimensions.spacing.small + 2,
    borderRadius: AppDimensions.borderRadius.medium,
    fontSize: 16,
    marginBottom: AppDimensions.spacing.medium,
    borderColor: AppColors.border,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
  },
  inputDisabled: {
    backgroundColor: AppColors.extraLightGray, 
    color: AppColors.darkGray,
  },
  button: {
    backgroundColor: AppColors.primary,
    paddingVertical: AppDimensions.spacing.medium,
    borderRadius: AppDimensions.borderRadius.large,
    alignItems: "center",
    marginTop: AppDimensions.spacing.medium,
    shadowColor: AppColors.primary,
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontWeight: "700",
    fontSize: 18,
  },
  label: { 
    fontSize: 16,
    fontWeight: "600",
    marginBottom: AppDimensions.spacing.small / 2,
    color: AppColors.text,
  },
});