import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HomeSideBar from '../components/HomeSideBar';
import NotificacaoCarousel from '../components/NotificacaoCarousel';
import DesafiosUsuarioList from '../components/DesafiosUsuarioList';

import { Usuario } from '../model/Usuario';
import { DesafioUsuario } from '../model/DesafioUsuario';
import { Desafio } from '../model/Desafio';
import { notificacoesMock } from '../mocks/notificacaoMock';

import { AppColors, AppDimensions, HeaderStyles } from '../constants/AppStyles';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'> & {
  usuario: Usuario;
  setUsuario: (usuario: Usuario | null) => void;
  desafiosDoUsuario: DesafioUsuario[];
  desafiosGerais: Desafio[]; 
};

export default function HomeScreen({ navigation, usuario, setUsuario, desafiosDoUsuario, desafiosGerais }: Props) {
  const [activeMenu, setActiveMenu] = useState<'desafios' | 'receitas' | null>(null);

  const notificacoesNaoLidas = notificacoesMock.filter(
    (notif) => notif.usuarioId === usuario.id && !notif.lida
  ).sort((a, b) => b.horarioAgendado.getTime() - a.horarioAgendado.getTime());

  const handleLogout = async () => {
    await AsyncStorage.removeItem("usuarioLogado");
    setUsuario(null);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={AppColors.background} />
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
          <View style={styles.homeHeader}> 
            <TouchableOpacity onPress={() => navigation.navigate('Home')}>
              <Image
                source={require('../assets/better-bite-logo.png')}
                style={styles.appLogoHome}
                accessibilityLabel="BetterBite Logo"
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Olá, {usuario.nome.split(' ')[0]}!</Text>
          <Text style={styles.sectionSubtitle}>Seu guia para hábitos saudáveis.</Text>

          <NotificacaoCarousel notificacoes={notificacoesNaoLidas} />

          <DesafiosUsuarioList
            desafiosDoUsuario={desafiosDoUsuario}
            desafiosGerais={desafiosGerais}
            navigation={navigation}
          />

          <TouchableOpacity
            style={styles.createChallengeButton}
            onPress={() => navigation.navigate('CriarDesafio')}
          >
            <Ionicons name="add-circle-outline" size={AppDimensions.iconSize.large} color="#FFFFFF" />
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
    backgroundColor: AppColors.background,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: AppDimensions.spacing.medium,
    paddingTop: AppDimensions.spacing.medium,
  },
  homeHeader: {
    alignItems: 'center',
    marginBottom: AppDimensions.spacing.large,
    paddingVertical: AppDimensions.spacing.small,
  },
  appLogoHome: {
    width: AppDimensions.logo.medium.width * 1.2,
    height: AppDimensions.logo.medium.height * 1.2,
    resizeMode: 'contain',
  },
  sectionTitle: {
    fontSize: AppDimensions.iconSize.large,
    fontWeight: 'bold',
    color: AppColors.text,
    marginBottom: AppDimensions.spacing.small,
    marginTop: AppDimensions.spacing.medium,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: AppColors.darkGray,
    marginBottom: AppDimensions.spacing.large,
    textAlign: 'center',
  },
  createChallengeButton: {
    backgroundColor: AppColors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: AppDimensions.spacing.medium,
    borderRadius: AppDimensions.borderRadius.large,
    marginTop: AppDimensions.spacing.xLarge,
    marginBottom: AppDimensions.spacing.medium,
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
    marginLeft: AppDimensions.spacing.small,
  },
});