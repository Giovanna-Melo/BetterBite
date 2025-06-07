import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ListaDesafios from './screens/ListaDesafios';
import CriarDesafio from './screens/CriarDesafio';
import CheckinDesafio from './screens/CheckinDesafio';
import DetalhesDesafio from './screens/DetalhesDesafio';
import ReceitasScreen from './screens/ReceitasScreen';
import HomeScreen from './screens/HomeScreen';

import { desafiosMock } from './mocks/desafioMock';
import { desafiosUsuariosMock } from './mocks/desafioUsuarioMock';
import { Desafio } from './model/Desafio';

export type RootStackParamList = {
  Home: undefined;
  ListaDesafios: undefined;
  CriarDesafio: undefined;
  CheckinDesafio: undefined;
  DetalhesDesafio: { idDesafio: string };
  Receitas: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [desafios, setDesafios] = useState<Desafio[]>(desafiosMock);

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
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Receitas" component={ReceitasScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
