import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { Usuario } from "../model/Usuario";

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

    if (!email) {
      setErroEmail("Digite o email.");
      valido = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setErroEmail("Formato de email inválido.");
      valido = false;
    }

    if (!senha) {
      setErroSenha("Digite a senha.");
      valido = false;
    }

    return valido;
  };

  const handleLogin = async () => {
    if (!validarCampos()) return;

    try {
      const usuariosData = await AsyncStorage.getItem("usuariosCadastrados");
      const usuarios: Usuario[] = usuariosData ? JSON.parse(usuariosData) : [];

      const usuario = usuarios.find(
        (u) => u.email === email && u.senhaHash === senha
      );

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
        <Text style={styles.appName}>BetterBite</Text>
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
        placeholderTextColor="#999"
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
        placeholderTextColor="#999"
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
    backgroundColor: "#F0F4F8",
    paddingHorizontal: 30,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderColor: "#eee",
    marginBottom: 30,
  },
  appName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#2C3E50",
    marginBottom: 40,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 15,
    fontSize: 16,
    marginBottom: 5,
    borderColor: "#d1d5db",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
  },
  inputErro: {
    borderColor: "#e74c3c",
  },
  erroTexto: {
    color: "#e74c3c",
    marginBottom: 10,
    marginLeft: 5,
    fontSize: 14,
  },
  erroLogin: {
    color: "#e74c3c",
    textAlign: "center",
    marginBottom: 15,
    fontSize: 15,
  },
  loginButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 14,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#4CAF50",
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 3,
  },
  registerButton: {
    backgroundColor: "#2196F3",
    paddingVertical: 14,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#2196F3",
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
  },
});
