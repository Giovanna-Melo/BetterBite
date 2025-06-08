import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ListaDesafios from './screens/ListaDesafios';
import CriarDesafio from './screens/CriarDesafio';
import CheckinDesafio from './screens/CheckinDesafio';
import DetalhesDesafio from './screens/DetalhesDesafio';
import ReceitasScreen from './screens/ReceitasScreen';
import HomeScreen from './screens/HomeScreen';
import CriarRegistro from './screens/CriarRegistro';

import { desafiosMock } from './mocks/desafioMock';
import { desafiosUsuariosMock } from './mocks/desafioUsuarioMock';
import { registrosDesafioMock } from './mocks/registroDesafioMock';

import { Desafio } from './model/Desafio';
import { RegistroDesafio } from './model/RegistroDesafio';

export type RootStackParamList = {
  Home: undefined;
  ListaDesafios: undefined;
  CriarDesafio: undefined;
  CheckinDesafio: undefined;
  DetalhesDesafio: { idDesafio: string };
  Receitas: undefined;
  CriarRegistroDesafio: { idDesafio: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [desafios, setDesafios] = useState<Desafio[]>(desafiosMock);
  const [registrosDesafio, setRegistrosDesafio] = useState<RegistroDesafio[]>(registrosDesafioMock);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
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
        <Stack.Screen name="CheckinDesafio">
          {(props) => (
            <CheckinDesafio
              {...props}
              desafios={desafios}
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
