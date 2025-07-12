import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { dbService } from "./database/DatabaseService";

// TELAS
import ListaDesafios from "./screens/ListaDesafios";
import CriarDesafio from "./screens/CriarDesafio";
import DetalhesDesafio from "./screens/DetalhesDesafio";
import ReceitasScreen from "./screens/ReceitasScreen";
import HomeScreen from "./screens/HomeScreen";
import CriarRegistro from "./screens/CriarRegistro";
import CadastrarUsuario from "./screens/CadastrarUsuario";
import Login from "./screens/LoginUsuario";
import EditarUsuario from "./screens/EditarUsuario";
import Welcome from "./screens/Welcome";

// MODELOS
import { Usuario } from "./model/Usuario";
import { Desafio } from "./model/Desafio";
import { DesafioUsuario } from "./model/DesafioUsuario";

export type RootStackParamList = {
  Welcome: undefined;
  Home: undefined;
  ListaDesafios: undefined;
  CriarDesafio: undefined;
  DetalhesDesafio: { idDesafio: string };
  Receitas: undefined;
  CriarRegistroDesafio: { idDesafioUsuario: string; idDesafio: string };
  CadastrarUsuario: undefined;
  Login: undefined;
  EditarUsuario: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);

  const [desafios, setDesafios] = useState<Desafio[]>([]);
  const [registros, setRegistros] = useState<DesafioUsuario[]>([]);
  const [desafiosDoUsuario, setDesafiosDoUsuario] = useState<DesafioUsuario[]>([]);

  useEffect(() => {
    const setup = async () => {
      try {
        await dbService.initDatabase();
        await dbService.syncUsuariosFromFirebase();
        await dbService.syncDesafiosFromFirebase();
        await dbService.syncDesafiosUsuariosFromFirebase();
        const userData = await AsyncStorage.getItem("usuarioLogado");
        if (userData) {
          const loggedUser = JSON.parse(userData);
          const userFromDb = await dbService.getUsuarioById(loggedUser.id);
          setUsuario(userFromDb || null);
        }
      } catch (error) {
        console.error("Erro no setup inicial:", error);
      } finally {
        setCarregando(false);
      }
    };
    setup();
  }, []);

  const handleDesafioCriado = () => {
    console.log("Desafio criado");
  };

  if (carregando) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Carregando BetterBite...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={usuario ? "Home" : "Welcome"}
        screenOptions={{ headerShown: false }}
      >
        {!usuario ? (
          <>
            <Stack.Screen name="Welcome">
              {(props) => <Welcome {...props} usuario={usuario} />}
            </Stack.Screen>
            <Stack.Screen name="Login">
              {(props) => <Login {...props} setUsuario={setUsuario} />}
            </Stack.Screen>
            <Stack.Screen name="CadastrarUsuario">
              {(props) => <CadastrarUsuario {...props} setUsuario={setUsuario} />}
            </Stack.Screen>
          </>
        ) : (
          <>
            <Stack.Screen name="Home">
              {(props) => <HomeScreen {...props} usuario={usuario} setUsuario={setUsuario} />}
            </Stack.Screen>
            <Stack.Screen name="ListaDesafios">
              {(props) => (
                <ListaDesafios
                  {...props}
                  usuario={usuario}
                  desafios={desafios}
                  registros={registros}
                  setDesafiosDoUsuarioState={setDesafiosDoUsuario}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="CriarDesafio">
              {(props) => (
                <CriarDesafio {...props} usuario={usuario} onDesafioCriado={handleDesafioCriado} />
              )}
            </Stack.Screen>
            <Stack.Screen name="CriarRegistroDesafio" component={CriarRegistro} />
            <Stack.Screen name="DetalhesDesafio" component={DetalhesDesafio} />
            <Stack.Screen name="Receitas" component={ReceitasScreen} />
            <Stack.Screen name="EditarUsuario">
              {(props) => <EditarUsuario {...props} usuario={usuario} setUsuario={setUsuario} />}
            </Stack.Screen>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F0F4F8",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: "#333",
  },
});
