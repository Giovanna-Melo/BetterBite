import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, SafeAreaView, StatusBar, } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HomeSideBar from '../components/HomeSideBar';
import NotificacaoCarousel from '../components/NotificacaoCarousel';
import DesafiosUsuarioList from '../components/DesafiosUsuarioList';

import { Usuario } from '../model/Usuario';
import { desafiosUsuariosMock } from '../mocks/desafioUsuarioMock';
import { desafiosMock } from '../mocks/desafioMock';
import { notificacoesMock } from '../mocks/notificacaoMock';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'> & {
  usuario: Usuario;
  setUsuario: (usuario: Usuario | null) => void;
};

export default function HomeScreen({ navigation, usuario, setUsuario }: Props) {
  const [activeMenu, setActiveMenu] = useState<'desafios' | 'receitas' | null>(null);

  const desafiosDoUsuario = desafiosUsuariosMock.filter(
    (du) => du.usuarioId === usuario.id
  );

  const notificacoesNaoLidas = notificacoesMock.filter(
    (notif) => notif.usuarioId === usuario.id && !notif.lida
  ).sort((a, b) => b.horarioAgendado.getTime() - a.horarioAgendado.getTime());

  const handleLogout = async () => {
    await AsyncStorage.removeItem("usuarioLogado");
    setUsuario(null);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F8F8" />
      <View style={styles.container}>
        <HomeSideBar
          usuario={usuario}
          setUsuario={setUsuario}
          navigation={navigation}
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
          onLogout={handleLogout}
        />

        <ScrollView style={styles.mainContent} showsVerticalScrollIndicator={true}>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={() => navigation.navigate('Home')}>
              <Image
                source={require('../assets/better-bite-logo.png')}
                style={styles.appLogoMassive}
                accessibilityLabel="BetterBite Logo"
              />
            </TouchableOpacity>
          </View>

          <NotificacaoCarousel notificacoes={notificacoesNaoLidas} />

          <DesafiosUsuarioList
            desafiosDoUsuario={desafiosDoUsuario}
            desafiosGerais={desafiosMock}
            navigation={navigation}
          />

          <TouchableOpacity
            style={styles.createChallengeButton}
            onPress={() => navigation.navigate('CriarDesafio')}
          >
            <Ionicons name="add-circle-outline" size={24} color="#FFFFFF" />
            <Text style={styles.createChallengeButtonText}>Criar Novo Desafio</Text>
          </TouchableOpacity>

        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  headerContent: {
    alignItems: 'center',
    marginBottom: 20,
  },
    appLogoMassive: { 
    width: 350, 
    height: 120, 
    resizeMode: 'contain',
  },
  createChallengeButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 15,
    marginTop: 30,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  createChallengeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});