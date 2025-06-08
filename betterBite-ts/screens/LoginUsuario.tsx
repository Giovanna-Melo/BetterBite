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

  const handleLogin = async () => {
    try {
      const usuariosData = await AsyncStorage.getItem("usuariosCadastrados");

      if (!usuariosData) {
        Alert.alert("Erro", "Nenhum usuário cadastrado.");
        return;
      }

      const usuarios: Usuario[] = JSON.parse(usuariosData);

      const usuario = usuarios.find(
        (u) => u.email === email && u.senhaHash === senha
      );

      if (usuario) {
        await AsyncStorage.setItem("usuarioLogado", JSON.stringify(usuario));
        setUsuario(usuario);
        Alert.alert("Bem-vindo", `Olá, ${usuario.nome}!`);
        navigation.replace("Home");
      } else {
        Alert.alert("Erro", "Email ou senha incorretos.");
      }
    } catch (e) {
      console.error("Erro no login:", e);
      Alert.alert("Erro", "Algo deu errado.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Header simples com nome do app */}
      <View style={styles.header}>
        <Text style={styles.appName}>BetterBite</Text>
      </View>

      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#999"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
        placeholderTextColor="#999"
      />

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
    marginBottom: 15,
    borderColor: "#d1d5db",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
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
