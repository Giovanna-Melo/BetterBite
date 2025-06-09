import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
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
  const [genero, setGenero] = useState("");
  const [peso, setPeso] = useState("");
  const [altura, setAltura] = useState("");
  const [restricoes, setRestricoes] = useState("");

  const [erros, setErros] = useState<{ [key: string]: string }>({});

  const validarCampos = () => {
    const novosErros: { [key: string]: string } = {};
    if (!nome) novosErros.nome = "Informe o nome.";
    if (!email || !email.includes("@")) novosErros.email = "Email inválido.";
    if (!senha || senha.length < 6) novosErros.senha = "Senha muito curta.";
    if (!dataNascimento || isNaN(Date.parse(dataNascimento)))
      novosErros.dataNascimento = "Data inválida (use YYYY-MM-DD).";
    if (!genero) novosErros.genero = "Selecione um gênero.";
    if (!peso || isNaN(parseFloat(peso))) novosErros.peso = "Peso inválido.";
    if (!altura || isNaN(parseFloat(altura)))
      novosErros.altura = "Altura inválida.";

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSalvar = async () => {
    if (!validarCampos()) return;

    try {
      const novoUsuario = new Usuario(
        nome,
        email,
        senha,
        new Date(dataNascimento.split("/").reverse().join("-")),

        genero as "masculino" | "feminino" | "outro",
        parseFloat(peso),
        parseFloat(altura),
        restricoes ? restricoes.split(",").map((r) => r.trim()) : []
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
    const numeros = texto.replace(/\D/g, "").slice(0, 8); // Apenas números, máx. 8 dígitos
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

  function formatarDataParaISO(data: string): string {
    const [dia, mes, ano] = data.split("/");
    return `${ano}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`;
  }
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
        {erros.nome && <Text style={styles.errorText}>{erros.nome}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        {erros.email && <Text style={styles.errorText}>{erros.email}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Senha"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />
        {erros.senha && <Text style={styles.errorText}>{erros.senha}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Data de Nascimento (yyyy-mm-dd)"
          keyboardType="numeric"
          maxLength={10}
          value={dataNascimento}
          onChangeText={(texto) =>
            setDataNascimento(formatarDataAmericana(texto))
          }
        />

        <Text style={styles.label}>Gênero</Text>
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

        <TextInput
          style={styles.input}
          placeholder="Peso (kg)"
          keyboardType="numeric"
          value={peso}
          onChangeText={setPeso}
        />
        {erros.peso && <Text style={styles.errorText}>{erros.peso}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Altura (cm)"
          keyboardType="numeric"
          value={altura}
          onChangeText={setAltura}
        />
        {erros.altura && <Text style={styles.errorText}>{erros.altura}</Text>}

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
    marginBottom: 10,
    borderColor: "#d1d5db",
    borderWidth: 1,
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
    marginBottom: 10,
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 14,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    fontSize: 14,
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
});
