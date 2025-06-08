import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
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
import { desafiosMock } from "./mocks/desafioMock";
import { desafiosUsuariosMock } from "./mocks/desafioUsuarioMock";
import { registrosDesafioMock } from "./mocks/registroDesafioMock";
import { Desafio } from "./model/Desafio";
import { RegistroDesafio } from "./model/RegistroDesafio";

export type RootStackParamList = {
  Home: undefined;
  ListaDesafios: undefined;
  CriarDesafio: undefined;
  CheckinDesafio: undefined;
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

  console.log("Estado atual do usuario no App:", usuario);
  const [carregando, setCarregando] = useState(true);
  const [desafios, setDesafios] = useState<Desafio[]>(desafiosMock);
  const [registrosDesafio, setRegistrosDesafio] =
    useState<RegistroDesafio[]>(registrosDesafioMock);
  const [registros, setRegistros] =
    useState<RegistroDesafio[]>(desafiosUsuariosMock);

  const adicionarRegistro = (registro: RegistroDesafio) => {
    setRegistros((prev) => [...prev, registro]);
  };
  // Carregar usuário salvo
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

  // Salvar usuário no AsyncStorage
  useEffect(() => {
    const salvarUsuario = async () => {
      if (usuario) {
        await AsyncStorage.setItem("usuarioLogado", JSON.stringify(usuario));
      } else {
        await AsyncStorage.removeItem("usuarioLogado");
      }
    };
    salvarUsuario();
  }, [usuario]);
  useEffect(() => {
    console.log("Estado do usuário mudou:", usuario);
  }, [usuario]);
  // Tela de carregamento
  if (carregando) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Carregando...</Text>
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
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="ListaDesafios">
              {(props) => (
                <ListaDesafios
                  {...props}
                  desafios={desafios}
                  registros={desafiosUsuariosMock}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="CriarDesafio">
              {(props) => (
                <CriarDesafio
                  {...props}
                  desafios={desafios}
                  setDesafios={setDesafios}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="DetalhesDesafio">
              {(props) => (
                <DetalhesDesafio
                  {...props}
                  desafios={desafios}
                  registros={desafiosUsuariosMock}
                  registrosDesafio={registrosDesafio}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="Receitas" component={ReceitasScreen} />
            <Stack.Screen name="CriarRegistroDesafio">
              {(props) => (
                <CriarRegistro
                  {...props}
                  registrosDesafio={registrosDesafio}
                  setRegistrosDesafio={setRegistrosDesafio}
                />
              )}
            </Stack.Screen>
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
