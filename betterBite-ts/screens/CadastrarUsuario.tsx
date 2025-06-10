import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Image } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Usuario } from "../model/Usuario";

import { AppColors, AppDimensions, HeaderStyles } from '../constants/AppStyles';

type Props = NativeStackScreenProps<RootStackParamList, "CadastrarUsuario"> & {
  setUsuario: (usuario: Usuario) => void;
};

export default function CadastroUsuario({ navigation, setUsuario }: Props) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [genero, setGenero] = useState("");
  const [peso, setPeso] = useState("");
  const [altura, setAltura] = useState("");
  const [restricoes, setRestricoes] = useState("");

  const [erros, setErros] = useState<{ [key: string]: string }>({});

  const validarCampos = () => {
    const novosErros: { [key: string]: string } = {};
    if (!nome.trim()) novosErros.nome = "Informe o nome.";
    if (!email.trim() || !email.includes("@")) novosErros.email = "Email inválido.";
    if (!senha.trim() || senha.length < 6) novosErros.senha = "Senha muito curta.";
    if (!dataNascimento.trim() || isNaN(Date.parse(dataNascimento)))
      novosErros.dataNascimento = "Data inválida (use YYYY-MM-DD).";
    if (!genero) novosErros.genero = "Selecione um gênero.";
    if (!peso.trim() || isNaN(parseFloat(peso))) novosErros.peso = "Peso inválido.";
    if (!altura.trim() || isNaN(parseFloat(altura)))
      novosErros.altura = "Altura inválida.";

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSalvar = async () => {
    if (!validarCampos()) return;

    try {
      const novoUsuario = new Usuario(
        nome.trim(),
        email.trim(),
        senha.trim(),
        new Date(dataNascimento.split("/").reverse().join("-")), 

        genero as "masculino" | "feminino" | "outro",
        parseFloat(peso),
        parseFloat(altura),
        restricoes.trim() ? restricoes.split(",").map((r) => r.trim()) : []
      );

      const usuariosSalvos = await AsyncStorage.getItem("usuariosCadastrados");
      const listaUsuarios: Usuario[] = usuariosSalvos
        ? JSON.parse(usuariosSalvos)
        : [];

      const emailJaExiste = listaUsuarios.some(
        (usuario) => usuario.email === email
      );
      if (emailJaExiste) {
        Alert.alert("Erro", "Já existe um usuário com este email.");
        return;
      }

      listaUsuarios.push(novoUsuario);

      await AsyncStorage.setItem(
        "usuariosCadastrados",
        JSON.stringify(listaUsuarios)
      );

      await AsyncStorage.setItem("usuarioLogado", JSON.stringify(novoUsuario));
      setUsuario(novoUsuario);

      Alert.alert("Sucesso", "Usuário cadastrado!");
      navigation.replace("Home");
    } catch (e) {
      console.error("Erro ao salvar usuário:", e);
      Alert.alert("Erro", "Verifique os dados inseridos.");
    }
  };

  const formatarDataAmericana = (texto: string) => {
    const numeros = texto.replace(/\D/g, "").slice(0, 8);
    let formatado = "";

    if (numeros.length <= 4) {
      formatado = numeros;
    } else if (numeros.length <= 6) {
      formatado = `${numeros.slice(0, 4)}-${numeros.slice(4)}`;
    } else {
      formatado = `${numeros.slice(0, 4)}-${numeros.slice(
        4,
        6
      )}-${numeros.slice(6)}`;
    }

    return formatado;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={HeaderStyles.detailHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={HeaderStyles.backButtonContainer}>
          <Ionicons name="arrow-back" size={AppDimensions.iconSize.large} color={AppColors.textSecondary} />
          <Text style={HeaderStyles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
        <Text style={HeaderStyles.headerTitle}>Cadastro de Usuário</Text>
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
        {erros.nome && <Text style={styles.errorText}>{erros.nome}</Text>}

        <Text style={styles.label}>Email:</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor={AppColors.placeholder}
        />
        {erros.email && <Text style={styles.errorText}>{erros.email}</Text>}

        <Text style={styles.label}>Senha:</Text>
        <TextInput
          style={styles.input}
          placeholder="Senha"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
          placeholderTextColor={AppColors.placeholder}
        />
        {erros.senha && <Text style={styles.errorText}>{erros.senha}</Text>}

        <Text style={styles.label}>Data de Nascimento (YYYY-MM-DD):</Text>
        <TextInput
          style={styles.input}
          placeholder="AAAA-MM-DD"
          keyboardType="numeric"
          maxLength={10}
          value={dataNascimento}
          onChangeText={(texto) =>
            setDataNascimento(formatarDataAmericana(texto))
          }
          placeholderTextColor={AppColors.placeholder}
        />
        {erros.dataNascimento && <Text style={styles.errorText}>{erros.dataNascimento}</Text>}


        <Text style={styles.label}>Gênero:</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={genero}
            onValueChange={(itemValue) => setGenero(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Selecione..." value="" />
            <Picker.Item label="Masculino" value="masculino" />
            <Picker.Item label="Feminino" value="feminino" />
            <Picker.Item label="Outro" value="outro" />
          </Picker>
        </View>
        {erros.genero && <Text style={styles.errorText}>{erros.genero}</Text>}

        <Text style={styles.label}>Peso (kg):</Text>
        <TextInput
          style={styles.input}
          placeholder="Peso (kg)"
          keyboardType="numeric"
          value={peso}
          onChangeText={setPeso}
          placeholderTextColor={AppColors.placeholder}
        />
        {erros.peso && <Text style={styles.errorText}>{erros.peso}</Text>}

        <Text style={styles.label}>Altura (cm):</Text>
        <TextInput
          style={styles.input}
          placeholder="Altura (cm)"
          keyboardType="numeric"
          value={altura}
          onChangeText={setAltura}
          placeholderTextColor={AppColors.placeholder}
        />
        {erros.altura && <Text style={styles.errorText}>{erros.altura}</Text>}

        <Text style={styles.label}>
          Restrições alimentares (separadas por vírgula):
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: glúten, lactose, amendoim"
          value={restricoes}
          onChangeText={setRestricoes}
          placeholderTextColor={AppColors.placeholder}
        />

        <TouchableOpacity style={styles.button} onPress={handleSalvar}>
          <Text style={styles.buttonText}>Salvar Usuário</Text>
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
  },
  label: {
    fontWeight: "600",
    marginBottom: AppDimensions.spacing.small / 2,
    color: AppColors.text,
    fontSize: 16,
  },
  pickerWrapper: {
    backgroundColor: AppColors.inputBackground,
    borderColor: AppColors.border,
    borderWidth: 1,
    borderRadius: AppDimensions.borderRadius.medium,
    marginBottom: AppDimensions.spacing.medium,
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
    color: AppColors.textSecondary, 
  },
  button: {
    backgroundColor: AppColors.primary,
    paddingVertical: AppDimensions.spacing.medium,
    borderRadius: AppDimensions.borderRadius.large,
    alignItems: "center",
    marginTop: AppDimensions.spacing.medium,
  },
  buttonText: {
    color: '#fff',
    fontWeight: "700",
    fontSize: 18,
  },
  errorText: { 
    color: AppColors.error,
    marginBottom: AppDimensions.spacing.small,
    fontSize: 14,
    marginLeft: AppDimensions.spacing.small / 2,
  },
});