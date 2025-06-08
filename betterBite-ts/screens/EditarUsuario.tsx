import React, { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { Usuario } from "../model/Usuario";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { usuariosMock } from "../mocks/usuarioMock";

type Props = NativeStackScreenProps<RootStackParamList, "EditarUsuario"> & {
  usuario: Usuario;
  setUsuario: (usuario: Usuario) => void;
};

export default function EditarUsuarioScreen({
  navigation,
  usuario,
  setUsuario,
}: Props) {
  const [nome, setNome] = useState(usuario.nome);
  const [peso, setPeso] = useState(String(usuario.peso));
  const [altura, setAltura] = useState(String(usuario.altura));
  const [restricoes, setRestricoes] = useState(
    usuario.restricoesAlimentares.join(", ")
  );
  const salvarAlteracoes = async () => {
    try {
      const usuarioAtualizado = new Usuario(
        nome,
        usuario.email,
        usuario.senhaHash,
        usuario.dataNascimento,
        usuario.genero,
        parseFloat(peso),
        parseFloat(altura),
        restricoes.split(",").map((r) => r.trim())
      );

      // Atualiza AsyncStorage
      const usuariosData = await AsyncStorage.getItem("usuariosCadastrados");
      let usuarios: Usuario[] = usuariosData ? JSON.parse(usuariosData) : [];

      usuarios = usuarios.map((u) =>
        u.email === usuario.email ? usuarioAtualizado : u
      );

      await AsyncStorage.setItem(
        "usuariosCadastrados",
        JSON.stringify(usuarios)
      );
      await AsyncStorage.setItem(
        "usuarioLogado",
        JSON.stringify(usuarioAtualizado)
      );
      setUsuario(usuarioAtualizado);

      // Atualiza o mock em memória
      const indexMock = usuariosMock.findIndex(
        (u) => u.email === usuario.email
      );
      if (indexMock !== -1) {
        usuariosMock[indexMock] = usuarioAtualizado;
      }

      Alert.alert("Sucesso", "Dados atualizados!");
      navigation.goBack();
    } catch (error) {
      console.error("Erro ao salvar alterações:", error);
      Alert.alert("Erro", "Não foi possível salvar os dados.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Editar Perfil</Text>
        <Text style={styles.label}>Nome:</Text>
        <TextInput
          style={styles.input}
          placeholder="Nome"
          value={nome}
          onChangeText={setNome}
        />
        <Text style={styles.label}>Email:</Text>
        <TextInput
          style={[styles.input, styles.inputDisabled]}
          placeholder="Email"
          value={usuario.email}
          editable={false}
        />
        <Text style={styles.label}>Peso:</Text>
        <TextInput
          style={styles.input}
          placeholder="Peso (kg)"
          keyboardType="numeric"
          value={peso}
          onChangeText={setPeso}
        />
        <Text style={styles.label}>Altura:</Text>
        <TextInput
          style={styles.input}
          placeholder="Altura (cm)"
          keyboardType="numeric"
          value={altura}
          onChangeText={setAltura}
        />
        <Text style={styles.label}>
          Restrições alimentares(separadas por vírgula):
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Restrições alimentares (separadas por vírgula)"
          value={restricoes}
          onChangeText={setRestricoes}
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
    backgroundColor: "#fff",
  },
  container: {
    backgroundColor: "#F0F4F8",
    padding: 20,
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2C3E50",
    marginBottom: 25,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 15,
    borderColor: "#d1d5db",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
  },
  inputDisabled: {
    backgroundColor: "#e5e7eb",
    color: "#6b7280",
  },
  button: {
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
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  backButtonText: {
    fontSize: 16,
    marginLeft: 6,
    color: "#333",
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 5,
    marginLeft: 2,
  },
});
