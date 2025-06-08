import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { Usuario } from "../model/Usuario";
import { CommonActions } from "@react-navigation/native";

type Props = NativeStackScreenProps<RootStackParamList, "Home"> & {
  usuario: Usuario | null;
  setUsuario: React.Dispatch<React.SetStateAction<Usuario | null>>;
};

export default function HomeScreen({ navigation, usuario, setUsuario }: Props) {
  // Confirmação e logout + reset da navegação para Login
  const handleLogout = () => {
    setUsuario(null);
    console.log("Logout: setUsuario(null) chamado");
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/better-bite-logo.png")}
        style={styles.logo}
        accessibilityLabel="Logo BetterBite"
      />

      <View style={styles.header}>
        <Text style={styles.title}>BetterBite</Text>
        <Text style={styles.subtitle}>Um dia de cada vez 🥗</Text>
      </View>

      <View style={styles.content}>
        {usuario ? (
          <>
            <Text style={styles.welcome}>Olá, {usuario.nome} 👋</Text>

            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate("ListaDesafios")}
              activeOpacity={0.7}
            >
              <Image
                source={require("../assets/desafios-logo.png")}
                style={styles.buttonIcon}
              />
              <Text style={styles.buttonText}>Meus Desafios</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate("Receitas")}
              activeOpacity={0.7}
            >
              <Image
                source={require("../assets/receitas-logo.png")}
                style={styles.buttonIcon}
              />
              <Text style={styles.buttonText}>Explorar Receitas</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate("EditarUsuario")}
              activeOpacity={0.7}
            >
              <Text style={styles.buttonText}>Editar Usuario</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.logoutButton]}
              onPress={handleLogout}
              activeOpacity={0.7}
            >
              <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate("Login")}
              activeOpacity={0.7}
            >
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate("CadastrarUsuario")}
              activeOpacity={0.7}
            >
              <Text style={styles.buttonText}>Cadastrar Usuário</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <Text style={styles.footerText}>© 2025 - em desenvolvimento</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: "#f8f8f8",
  },
  logo: { width: 150, height: 150, resizeMode: "contain", alignSelf: "center" },
  header: {
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
    position: "relative",
    width: "100%",
  },
  title: { fontSize: 28, fontWeight: "bold", color: "#4CAF50" },
  subtitle: { fontSize: 14, color: "#666", marginTop: 4 },
  userButton: { position: "absolute", right: 0, top: 10 },
  content: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    width: "100%",
  },
  welcome: { fontSize: 18, marginBottom: 20, color: "#333" },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 15,
    marginVertical: 10,
    width: "80%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logoutButton: { backgroundColor: "#E53935" },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  buttonIcon: { width: 30, height: 30, tintColor: "#fff" },
  footerText: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    paddingBottom: 10,
  },
});
