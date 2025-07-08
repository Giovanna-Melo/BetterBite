import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { Usuario } from "../model/Usuario";
import { usuariosMock } from "../mocks/usuarioMock";

type Props = NativeStackScreenProps<RootStackParamList, "Login"> & {
  setUsuario: (usuario: Usuario) => void;
};

export default function Login({ navigation, setUsuario }: Props) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erroEmail, setErroEmail] = useState("");
  const [erroSenha, setErroSenha] = useState("");
  const [erroLogin, setErroLogin] = useState("");

  const senhaRef = useRef<TextInput>(null); // 👈 referência para o campo de senha

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
          source={require("../assets/better-bite-logo2.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.appName}>BetterBite</Text>
      </View>

      <View style={styles.content}>
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
          placeholderTextColor="#666"
          returnKeyType="next"
          onSubmitEditing={() => senhaRef.current?.focus()}
          blurOnSubmit={false}
        />
        {erroEmail ? <Text style={styles.erroTexto}>{erroEmail}</Text> : null}

        <TextInput
          ref={senhaRef}
          style={[styles.input, erroSenha ? styles.inputErro : null]}
          placeholder="Senha"
          secureTextEntry
          value={senha}
          onChangeText={(text) => {
            setSenha(text);
            setErroSenha("");
            setErroLogin("");
          }}
          placeholderTextColor="#666"
          returnKeyType="done"
          onSubmitEditing={handleLogin}
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

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Beatriz Costa • Giovanna Kailany • Eloisa Santos • 2025
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6FFF6",
  },
  header: {
    backgroundColor: "#fff",
    alignItems: "center",
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  appName: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#2E7D32",
  },
  content: {
    flex: 1,
    backgroundColor: "#A5D6A7",
    paddingHorizontal: 30,
    paddingVertical: 30,
    justifyContent: "center",
    marginHorizontal: 20,
    borderRadius: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1B5E20",
    marginBottom: 20,
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
    backgroundColor: "#2E7D32",
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
    backgroundColor: "#1E88E5",
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
  footer: {
    backgroundColor: "#fff",
    alignItems: "center",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  footerText: {
    fontSize: 14,
    color: "#999",
    fontFamily: "Poppins_300Light",
  },
});
