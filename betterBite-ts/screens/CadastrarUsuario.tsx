import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  Button,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { Usuario } from "../model/Usuario";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = NativeStackScreenProps<RootStackParamList, "CadastrarUsuario"> & {
  setUsuario: (usuario: Usuario) => void;
};

export default function CadastroUsuario({ navigation, setUsuario }: Props) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [genero, setGenero] = useState<"masculino" | "feminino" | "outro">(
    "masculino"
  );
  const [peso, setPeso] = useState("");
  const [altura, setAltura] = useState("");
  const [restricoes, setRestricoes] = useState("");

  const handleSalvar = async () => {
    try {
      const novoUsuario = new Usuario(
        nome,
        email,
        senha,
        new Date(dataNascimento),
        genero,
        parseFloat(peso),
        parseFloat(altura),
        restricoes.split(",").map((r) => r.trim())
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

        <Text style={styles.title}>Cadastro de Usuário</Text>

        <TextInput
          style={styles.input}
          placeholder="Nome"
          value={nome}
          onChangeText={setNome}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />
        <TextInput
          style={styles.input}
          placeholder="Data de Nascimento (YYYY-MM-DD)"
          value={dataNascimento}
          onChangeText={setDataNascimento}
        />

        <Text style={styles.label}>Gênero:</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={genero}
            onValueChange={(itemValue) => setGenero(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Masculino" value="masculino" />
            <Picker.Item label="Feminino" value="feminino" />
            <Picker.Item label="Outro" value="outro" />
          </Picker>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Peso (kg)"
          keyboardType="numeric"
          value={peso}
          onChangeText={setPeso}
        />
        <TextInput
          style={styles.input}
          placeholder="Altura (cm)"
          keyboardType="numeric"
          value={altura}
          onChangeText={setAltura}
        />
        <TextInput
          style={styles.input}
          placeholder="Restrições alimentares (separadas por vírgula)"
          value={restricoes}
          onChangeText={setRestricoes}
        />

        <TouchableOpacity style={styles.button} onPress={handleSalvar}>
          <Text style={styles.buttonText}>Salvar Usuário</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F0F4F8",
    padding: 20,
    flexGrow: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
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
  label: {
    fontWeight: "600",
    marginBottom: 8,
    color: "#2C3E50",
  },
  pickerWrapper: {
    backgroundColor: "#fff",
    borderColor: "#d1d5db",
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 15,
    overflow: "hidden",
    elevation: 1,
  },
  picker: {
    height: 50,
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
});
