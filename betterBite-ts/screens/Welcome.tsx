import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
  ScrollView,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { Usuario } from '../model/Usuario';

const { width } = Dimensions.get("window");

// Adicionar a prop 'usuario'
type Props = NativeStackScreenProps<RootStackParamList, "Welcome"> & {
  usuario: Usuario | null;
};

export default function Welcome({ navigation, usuario }: Props) {
  // Redireciona se o usuário já estiver logado
  useEffect(() => {
    if (usuario) {
      // Se o usuário existir, vai para a tela principal
      navigation.replace("Home");
    }
  }, [usuario, navigation]); // Executa sempre que 'usuario' muda

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F6FFF6" />
      <View style={styles.header}>
        <Image
          source={require("../assets/better-bite-logo2.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>BetterBite</Text>

        <Text style={styles.secondary}>
          Desafios diários • Receitas saudáveis • Progresso com diversão
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.descriptionText}>
            O BetterBite é um aplicativo que incentiva hábitos alimentares
            saudáveis através de desafios diários, receitas nutritivas e
            acompanhamento do seu progresso. Desenvolvido para apoiar você na
            jornada de uma vida mais equilibrada, com uma interface intuitiva e
            conteúdos que motivam a mudança real no seu dia a dia.
          </Text>
        </View>

        <View style={[styles.section, styles.loginSection]}>
          <Text style={styles.loginPromptText}>Ainda não tem sua conta?</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.buttonText}>Comece já</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Beatriz Costa • Giovanna Melo • Eloisa Santos • 2025
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
    backgroundColor: "#FFF",
    alignItems: "center",
    paddingVertical: 30,
    paddingHorizontal: 24,
  },
  logo: {
    width: width * 0.25,
    height: width * 0.25,
    maxWidth: 130,
    maxHeight: 130,
    marginBottom: 12,
  },
  title: {
    fontSize: 30,
    color: "#2E7D32",
    fontWeight: "bold",
    marginBottom: 10,
    // fontFamily: "Poppins_700Bold",
  },
  secondary: {
    color: "#777",
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 8,
    marginBottom: 0,
    // fontFamily: "Poppins_300Light",
  },

  scrollContent: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },

  section: {
    backgroundColor: "#A5D6A7",
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginBottom: 24,
  },

  descriptionText: {
    fontSize: 16,
    color: "#1B5E20",
    textAlign: "center",
    fontFamily: "Poppins_400Regular",
    lineHeight: 26,
  },

  developersText: {
    fontSize: 14,
    color: "#2E7D32",
    textAlign: "center",
    fontFamily: "Poppins_500Medium",
    marginBottom: 6,
  },

  loginSection: {
    alignItems: "center",
  },

  loginPromptText: {
    fontSize: 16,
    color: "#1B5E20",
    marginBottom: 12,
    fontFamily: "Poppins_500Medium",
  },

  button: {
    backgroundColor: "#2E7D32",
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Poppins_700Bold",
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