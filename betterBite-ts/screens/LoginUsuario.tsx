import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { Usuario } from "../model/Usuario";
import { usuariosMock } from "../mocks/usuarioMock";

import { AppColors, AppDimensions } from '../constants/AppStyles';

type Props = NativeStackScreenProps<RootStackParamList, "Login"> & {
  setUsuario: (usuario: Usuario) => void;
};

export default function Login({ navigation, setUsuario }: Props) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erroEmail, setErroEmail] = useState("");
  const [erroSenha, setErroSenha] = useState("");
  const [erroLogin, setErroLogin] = useState("");

  const validarCampos = () => {
    let valido = true;
    setErroEmail("");
    setErroSenha("");
    setErroLogin("");

    if (!email.trim()) {
      setErroEmail("Digite o email.");
      valido = false;
    } else if (!/\S+@\S+\.\S+/.test(email.trim())) {
      setErroEmail("Formato de email inválido.");
      valido = false;
    }

    if (!senha.trim()) {
      setErroSenha("Digite a senha.");
      valido = false;
    }

    return valido;
  };

  const handleLogin = async () => {
    if (!validarCampos()) return;

    try {
      const usuariosData = await AsyncStorage.getItem("usuariosCadastrados");
      const usuariosAsync: Usuario[] = usuariosData
        ? JSON.parse(usuariosData)
        : [];

      let usuario = usuariosAsync.find(
        (u) => u.email === email && u.senhaHash === senha
      );

      if (!usuario) {
        usuario = usuariosMock.find(
          (u) => u.email === email && u.senhaHash === senha
        );
      }

      if (usuario) {
        await AsyncStorage.setItem("usuarioLogado", JSON.stringify(usuario));
        setUsuario(usuario);
        Alert.alert("Bem-vindo", `Olá, ${usuario.nome}!`);
        navigation.replace("Home");
      } else {
        setErroLogin("Email ou senha incorretos.");
      }
    } catch (e) {
      console.error("Erro no login:", e);
      Alert.alert("Erro", "Algo deu errado.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../assets/better-bite-logo.png')}
          style={styles.logoLogin}
          accessibilityLabel="BetterBite Logo"
        />
      </View>

      <Text style={styles.title}>Login</Text>

      <TextInput
        style={[styles.input, erroEmail ? styles.inputErro : null]}
        placeholder="Email"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setErroEmail("");
          setErroLogin("");
        }}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor={AppColors.placeholder}
      />
      {erroEmail ? <Text style={styles.erroTexto}>{erroEmail}</Text> : null}

      <TextInput
        style={[styles.input, erroSenha ? styles.inputErro : null]}
        placeholder="Senha"
        secureTextEntry
        value={senha}
        onChangeText={(text) => {
          setSenha(text);
          setErroSenha("");
          setErroLogin("");
        }}
        placeholderTextColor={AppColors.placeholder}
      />
      {erroSenha ? <Text style={styles.erroTexto}>{erroSenha}</Text> : null}

      {erroLogin ? <Text style={styles.erroLogin}>{erroLogin}</Text> : null}

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.registerButton}
        onPress={() => navigation.navigate("CadastrarUsuario")}
      >
        <Text style={styles.buttonText}>Cadastrar novo usuário</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
    paddingHorizontal: AppDimensions.spacing.large,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    paddingVertical: AppDimensions.spacing.medium,
    marginBottom: AppDimensions.spacing.large,
  },
  logoLogin: {
    width: AppDimensions.logo.login.width,
    height: AppDimensions.logo.login.height,
    resizeMode: 'contain',
    marginBottom: AppDimensions.spacing.large,
  },
  appName: {
    fontSize: 28,
    fontWeight: "bold",
    color: AppColors.primary,
    display: 'none',
  },
  title: {
    fontSize: AppDimensions.iconSize.large,
    fontWeight: "700",
    color: AppColors.text,
    marginBottom: AppDimensions.spacing.xLarge,
    textAlign: "center",
  },
  input: {
    backgroundColor: AppColors.inputBackground,
    paddingHorizontal: AppDimensions.spacing.medium,
    paddingVertical: AppDimensions.spacing.small + 4,
    borderRadius: AppDimensions.borderRadius.large,
    fontSize: 16,
    marginBottom: AppDimensions.spacing.small,
    borderColor: AppColors.border,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
  },
  inputErro: {
    borderColor: AppColors.error,
  },
  erroTexto: {
    color: AppColors.error,
    marginBottom: AppDimensions.spacing.small + 2,
    marginLeft: 5,
    fontSize: 14,
  },
  erroLogin: {
    color: AppColors.error,
    textAlign: "center",
    marginBottom: AppDimensions.spacing.medium,
    fontSize: 15,
  },
  loginButton: {
    backgroundColor: AppColors.primary,
    paddingVertical: AppDimensions.spacing.medium,
    borderRadius: AppDimensions.borderRadius.large,
    alignItems: "center",
    marginTop: AppDimensions.spacing.small,
    shadowColor: AppColors.primary,
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 3,
  },
  registerButton: {
    backgroundColor: AppColors.accentBlue,
    paddingVertical: AppDimensions.spacing.medium,
    borderRadius: AppDimensions.borderRadius.large,
    alignItems: "center",
    marginTop: AppDimensions.spacing.small,
    shadowColor: AppColors.accentBlue,
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontWeight: "700",
    fontSize: 18,
  },
});