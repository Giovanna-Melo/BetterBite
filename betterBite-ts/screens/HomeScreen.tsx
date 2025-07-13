import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, SafeAreaView, StatusBar } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../App';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HomeSideBar from '../components/HomeSideBar';
import NotificacaoCarousel from '../components/NotificacaoCarousel';
import { Usuario } from '../model/Usuario';
import { DesafioUsuario } from '../model/DesafioUsuario';
import { Desafio } from '../model/Desafio';
import { Notificacao } from '../model/Notificacao';
import { dbService } from '../database/DatabaseService';

import { AppColors, AppDimensions } from '../constants/AppStyles';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'> & {
  usuario: Usuario;
  setUsuario: (usuario: Usuario | null) => void;
};

export default function HomeScreen({ navigation, usuario, setUsuario }: Props) {
  const [desafiosDoUsuario, setDesafiosDoUsuario] = useState<DesafioUsuario[]>([]);
  const [desafiosGerais, setDesafiosGerais] = useState<Desafio[]>([]);
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [activeMenu, setActiveMenu] = useState<'desafios' | 'receitas' | null>('desafios');
  
  const carregarDados = useCallback(async () => {
    if (usuario) {
      try {
        const [gerais, doUsuario, notificacoesDeHoje] = await Promise.all([
          dbService.getDesafios(),
          dbService.getDesafiosByUsuarioId(usuario.id),
          dbService.getNotificacoesParaHoje(usuario.id),
        ]);
        setDesafiosGerais(gerais);
        setDesafiosDoUsuario(doUsuario);
        setNotificacoes(notificacoesDeHoje);
      } catch(e) {
        console.error("Erro ao carregar dados da Home:", e);
      }
    }
  }, [usuario]);
  
  useFocusEffect(
    useCallback(() => {
        carregarDados();
    }, [carregarDados])
  );

  const handleLogout = async () => {
    await AsyncStorage.removeItem("usuarioLogado");
    setUsuario(null);
  };

  if (!usuario) {
    return null;
  }
  
    const renderDesafioItem = ({ item }: { item: DesafioUsuario }) => {
    const desafioGeral = desafiosGerais.find(d => d.id === item.desafioId);
    let desafioIcon: any = 'star-outline';
    if (desafioGeral) {
        switch(desafioGeral.categoria) {
            case 'alimentacao': desafioIcon = 'restaurant-outline'; break;
            case 'exercicio': desafioIcon = 'barbell-outline'; break;
            case 'bem-estar': desafioIcon = 'happy-outline'; break;
            case 'restrição': desafioIcon = 'alert-circle-outline'; break;
            default: desafioIcon = 'star-outline';
        }
    }

    return (
      <TouchableOpacity
        style={styles.desafioParticipandoCard}
        onPress={() => navigation.navigate('DetalhesDesafio', { idDesafio: item.desafioId })}
      >
        <View style={styles.desafioIconPlaceholder}>
            <Ionicons name={desafioIcon} size={AppDimensions.iconSize.xLarge} color={AppColors.secondary} />
        </View>
        <View style={styles.desafioParticipandoInfo}>
          <Text style={styles.desafioParticipandoTitle}>{desafioGeral?.nome || 'Desafio Desconhecido'}</Text>
          <Text style={styles.desafioParticipandoProgress}>Progresso: {Math.round(item.progresso)}%</Text>
          <Text style={styles.desafioParticipandoDays}>Status: {item.status}</Text>
        </View>
        <Ionicons name="chevron-forward" size={AppDimensions.iconSize.medium} color={AppColors.darkGray} />
      </TouchableOpacity>
    );
  };

  const ListHeader = () => (
    <View>
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
      <NotificacaoCarousel notificacoes={notificacoes} /> 
      <Text style={styles.sectionTitle}>🚀 Meus Desafios</Text>
    </View>
  );

  const ListFooter = () => (
    <TouchableOpacity
      style={styles.createChallengeButton}
      onPress={() => navigation.navigate('CriarDesafio')}
    >
      <Ionicons name="add-circle-outline" size={AppDimensions.iconSize.large} color="#FFFFFF" />
      <Text style={styles.createChallengeButtonText}>Criar Novo Desafio</Text>
    </TouchableOpacity>
  );

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

        <FlatList
          data={desafiosDoUsuario}
          keyExtractor={(item) => item.id}
          renderItem={renderDesafioItem}
          ListHeaderComponent={ListHeader}
          ListFooterComponent={ListFooter}
          style={styles.mainContent}
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={true}
          ListEmptyComponent={() => (
            <View style={styles.emptyListContainer}>
              <Ionicons name="nutrition-outline" size={AppDimensions.iconSize.xLarge + 10} color={AppColors.lightGray} />
              <Text style={styles.emptyListText}>Você não está participando de nenhum desafio. Que tal começar um novo?</Text>
            </View>
          )}
        />
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
  desafioParticipandoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.cardBackground,
    borderRadius: AppDimensions.borderRadius.medium,
    padding: AppDimensions.spacing.medium,
    marginBottom: AppDimensions.spacing.medium,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  desafioIconPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: AppDimensions.borderRadius.small,
    backgroundColor: AppColors.secondary + '1A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: AppDimensions.spacing.medium,
  },
  desafioParticipandoInfo: {
    flex: 1,
  },
  desafioParticipandoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: AppColors.text,
    marginBottom: AppDimensions.spacing.small / 2,
  },
  desafioParticipandoProgress: {
    fontSize: 14,
    color: AppColors.darkGray,
  },
  desafioParticipandoDays: {
    fontSize: 12,
    color: AppColors.placeholder,
    marginTop: AppDimensions.spacing.small / 2,
  },
  emptyListContainer: {
    alignItems: 'center',
    padding: AppDimensions.spacing.large,
    backgroundColor: AppColors.cardBackground,
    borderRadius: AppDimensions.borderRadius.medium,
    marginTop: AppDimensions.spacing.xLarge,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  emptyListText: {
    fontSize: 16,
    color: AppColors.placeholder,
    textAlign: 'center',
    marginTop: AppDimensions.spacing.medium,
    marginBottom: AppDimensions.spacing.medium,
  },
  listContentContainer: {
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: 0,
  }
});