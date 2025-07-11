// App.tsx
import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet, Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
import { RegistroDesafio } from "./model/RegistroDesafio";
import { DesafioUsuario } from "./model/DesafioUsuario";

// SERVIÇOS LOCAIS
import database from "./services/database"; // banco híbrido inicializador

import {
  buscarDesafios as buscarMobile,
  createDesafioTable as createTableMobile,
} from "./services/sqliteDesafio";

import {
  buscarDesafios as buscarWeb,
  createDesafioTable as createTableWeb,
} from "./services/sqljsDesafio";

import {
  createDesafioUsuarioTable as createDesafioUsuarioTableMobile,
  buscarDesafiosDoUsuario as buscarDesafiosDoUsuarioMobile,
} from "./services/sqliteDesafioUsuario";

import {
  createDesafioUsuarioTable as createDesafioUsuarioTableWeb,
  buscarDesafiosDoUsuario as buscarDesafiosDoUsuarioWeb,
} from "./services/sqljsDesafioUsuario";

export type RootStackParamList = {
  Welcome: undefined;
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

  const [desafios, setDesafios] = useState<Desafio[]>([]);
  const [registrosDesafio, setRegistrosDesafio] = useState<RegistroDesafio[]>([]);
  const [desafiosDoUsuarioState, setDesafiosDoUsuarioState] = useState<DesafioUsuario[]>([]);

  const isWeb = Platform.OS === "web";

  useEffect(() => {
    const carregarDados = async () => {
      try {
        await database.initDatabase();

        const userData = await AsyncStorage.getItem("usuarioLogado");
        if (userData) {
          const userObj = JSON.parse(userData);
          setUsuario(userObj);

          if (isWeb) {
            await createTableWeb();
            const desafiosWeb = await buscarWeb();
            setDesafios(desafiosWeb);

            await createDesafioUsuarioTableWeb();
            const desafiosUsuarioWeb = await buscarDesafiosDoUsuarioWeb(userObj.id);
            setDesafiosDoUsuarioState(desafiosUsuarioWeb);
          } else {
            await createTableMobile();
            buscarMobile((dados) => setDesafios(dados));

            await createDesafioUsuarioTableMobile();
            buscarDesafiosDoUsuarioMobile(userObj.id, (dados) => {
              setDesafiosDoUsuarioState(dados);
            });
          }
        }
      } catch (error) {
        console.error("Erro ao carregar dados iniciais:", error);
      } finally {
        setCarregando(false);
      }
    };

    carregarDados();
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
      <Stack.Navigator initialRouteName={usuario ? "Home" : "Welcome"} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={Welcome} />
        {!usuario ? (
          <>
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
              {(props) => (
                <HomeScreen
                  {...props}
                  usuario={usuario}
                  setUsuario={setUsuario}
                  desafiosDoUsuario={desafiosDoUsuarioState}
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
