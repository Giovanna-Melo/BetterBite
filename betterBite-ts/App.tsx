import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

// IMPORTS DE TELAS
import ListaDesafios from "./screens/ListaDesafios";
import CriarDesafio from "./screens/CriarDesafio";
import DetalhesDesafio from "./screens/DetalhesDesafio";
import ReceitasScreen from "./screens/ReceitasScreen";
import HomeScreen from "./screens/HomeScreen";
import CriarRegistro from "./screens/CriarRegistro";
import CadastrarUsuario from "./screens/CadastrarUsuario";
import Login from "./screens/LoginUsuario";
import EditarUsuario from "./screens/EditarUsuario";

// MODELOS E MOCKS
import { Usuario } from "./model/Usuario";
import { Desafio } from "./model/Desafio";
import { RegistroDesafio } from "./model/RegistroDesafio";
import { DesafioUsuario } from "./model/DesafioUsuario";

import { desafiosMock } from "./mocks/desafioMock";
import { desafiosUsuariosMock } from "./mocks/desafioUsuarioMock";
import { registrosDesafioMock } from "./mocks/registroDesafioMock";

export type RootStackParamList = {
  Home: undefined;
  ListaDesafios: undefined;
  CheckinDesafio: { idDesafio: string };
  CriarDesafio: undefined;
  DetalhesDesafio: { idDesafio: string };
  Receitas: undefined;
  CriarRegistroDesafio: { idDesafio: string };
  CadastrarUsuario: undefined;
  Login: undefined;
  EditarUsuario: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);

  const [desafios, setDesafios] = useState<Desafio[]>(desafiosMock);
  const [registrosDesafio, setRegistrosDesafio] = useState<RegistroDesafio[]>(registrosDesafioMock);
  const [desafiosDoUsuarioState, setDesafiosDoUsuarioState] = useState<DesafioUsuario[]>(desafiosUsuariosMock);

  const adicionarRegistroDesafio = (registro: RegistroDesafio) => {
    setRegistrosDesafio((prev) => [...prev, registro]);
  };

  useEffect(() => {
    const carregarUsuario = async () => {
      try {
        const userData = await AsyncStorage.getItem("usuarioLogado");
        if (userData) {
          setUsuario(JSON.parse(userData));
        }
      } catch (error) {
        console.error("Erro ao carregar usuário:", error);
      } finally {
        setCarregando(false);
      }
    };
    carregarUsuario();
  }, []);

  useEffect(() => {
    const salvarUsuario = async () => {
      try {
        if (usuario) {
          await AsyncStorage.setItem("usuarioLogado", JSON.stringify(usuario));
        } else {
          await AsyncStorage.removeItem("usuarioLogado");
        }
      } catch (error) {
        console.error("Erro ao salvar usuário:", error);
      }
    };
    if (!carregando) {
      salvarUsuario();
    }
  }, [usuario, carregando]);

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
        initialRouteName={usuario ? "Home" : "Login"}
        screenOptions={{ headerShown: false }}
      >
        {!usuario ? (
          <>
            <Stack.Screen name="Login">
              {(props) => <Login {...props} setUsuario={setUsuario} />}
            </Stack.Screen>
            <Stack.Screen name="CadastrarUsuario">
              {(props) => (
                <CadastrarUsuario {...props} setUsuario={setUsuario} />
              )}
            </Stack.Screen>
          </>
        ) : (
          <>
            <Stack.Screen name="Home">
              {(props) => (
                <HomeScreen
                  {...props}
                  usuario={usuario}
                  setUsuario={setUsuario}
                  desafiosDoUsuario={desafiosDoUsuarioState.filter(
                    (du) => du.usuarioId === usuario.id
                  )}
                  desafiosGerais={desafios}
                />
              )}
            </Stack.Screen>

            <Stack.Screen name="ListaDesafios">
              {(props) => (
                <ListaDesafios
                  {...props}
                  desafios={desafios}
                  registros={desafiosDoUsuarioState}
                  usuario={usuario}
                  setDesafiosDoUsuarioState={setDesafiosDoUsuarioState}
                />
              )}
            </Stack.Screen>

            <Stack.Screen name="CriarDesafio">
              {(props) => (
                <CriarDesafio
                  {...props}
                  desafios={desafios}
                  setDesafios={setDesafios}
                  usuario={usuario}
                  setDesafiosDoUsuarioState={setDesafiosDoUsuarioState}
                />
              )}
            </Stack.Screen>

            <Stack.Screen name="CheckinDesafio">
              {(props) => (
                <CriarRegistro
                  {...props}
                  registrosDesafio={registrosDesafio}
                  setRegistrosDesafio={setRegistrosDesafio}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="CriarRegistroDesafio">
              {(props) => (
                <CriarRegistro
                  {...props}
                  registrosDesafio={registrosDesafio}
                  setRegistrosDesafio={setRegistrosDesafio}
                />
              )}
            </Stack.Screen>

            <Stack.Screen name="DetalhesDesafio">
              {(props) => (
                <DetalhesDesafio
                  {...props}
                  desafios={desafios}
                  registros={desafiosDoUsuarioState}
                  registrosDesafio={registrosDesafio}
                  usuario={usuario}
                  setDesafiosDoUsuarioState={setDesafiosDoUsuarioState}
                />
              )}
            </Stack.Screen>

            <Stack.Screen name="Receitas" component={ReceitasScreen} />

            <Stack.Screen name="EditarUsuario">
              {(props) => (
                <EditarUsuario
                  {...props}
                  usuario={usuario}
                  setUsuario={setUsuario}
                />
              )}
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F4F8',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: '#333',
  },
});