import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CriarDesafio from './screens/CriarDesafio';
import ListaDesafios from './screens/ListaDesafios';
import CheckinDesafio from './screens/CheckinDesafio';
import DetalhesDesafio from './screens/DetalhesDesafio'; // ✅ Novo
import { Desafio } from './model/Desafio';

type RegistroDesafio = {
  idDesafio: string;
  data: string;
  cumpriuMeta: boolean;
  observacao?: string;
};

const Stack = createNativeStackNavigator();

export default function App() {
  const [desafios, setDesafios] = useState<Desafio[]>([]);
  const [registros, setRegistros] = useState<RegistroDesafio[]>([]);

  const adicionarRegistro = (registro: RegistroDesafio) => {
    setRegistros((prev) => [...prev, registro]);
  };

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ListaDesafios" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="ListaDesafios">
          {(props) => (
            <ListaDesafios
              {...props}
              desafios={desafios}
              setDesafios={setDesafios}
              registros={registros}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="CriarDesafio">
          {(props) => (
            <CriarDesafio {...props} desafios={desafios} setDesafios={setDesafios} />
          )}
        </Stack.Screen>

        <Stack.Screen name="CheckinDesafio">
          {(props) => (
            <CheckinDesafio
              {...props}
              adicionarRegistro={adicionarRegistro}
              desafios={desafios}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="DetalhesDesafio">
          {(props) => (
            <DetalhesDesafio
              {...props}
              desafios={desafios}
              registros={registros}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

