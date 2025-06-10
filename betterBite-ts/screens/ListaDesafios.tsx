import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, Image, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import Ionicons from '@expo/vector-icons/Ionicons';

import { Desafio } from '../model/Desafio';
import { DesafioUsuario } from '../model/DesafioUsuario';
import { Usuario } from '../model/Usuario';
import { DesafioController } from '../controllers/DesafioController';

import { AppColors, AppDimensions, HeaderStyles } from '../constants/AppStyles';

type Props = NativeStackScreenProps<RootStackParamList, 'ListaDesafios'> & {
  desafios: Desafio[];
  registros: DesafioUsuario[];
  usuario: Usuario;
  setDesafiosDoUsuarioState: React.Dispatch<React.SetStateAction<DesafioUsuario[]>>;
};

export default function ListaDesafios({ navigation, desafios, registros, usuario, setDesafiosDoUsuarioState }: Props) {
  const [loading, setLoading] = useState(true);
  const controller = new DesafioController(desafios, registros, []); 

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  const renderDesafioItem = ({ item }: { item: Desafio }) => {
    let desafioIcon: any = 'star-outline';
    switch(item.categoria) {
            case 'introdução alimentar':
              desafioIcon = 'leaf-outline';
              break;
            case 'refeições': 
                desafioIcon = 'restaurant-outline';
                break;
            case 'bem-estar':
                desafioIcon = 'happy-outline';
                break;
            case 'restrição':
                desafioIcon = 'alert-circle-outline';
                break;
            default:
                desafioIcon = 'star-outline';
    }

    return (
      <TouchableOpacity
        style={styles.desafioCard}
        onPress={() => navigation.navigate('DetalhesDesafio', { idDesafio: item.id })}
      >
        <View style={styles.desafioCardIconPlaceholder}>
            <Ionicons name={desafioIcon} size={AppDimensions.iconSize.xLarge} color={AppColors.secondary} />
        </View>
        <View style={styles.desafioCardInfo}>
          <Text style={styles.desafioCardTitle}>{item.nome}</Text>
          <Text style={styles.desafioCardDesc}>{item.descricao}</Text>
          <Text style={styles.desafioCardMeta}>
            Meta: {item.valorMeta} {item.unidade} por {item.frequencia} ({item.duracao} dias)
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={AppDimensions.iconSize.medium} color={AppColors.darkGray} />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={AppColors.background} />
      <View style={HeaderStyles.detailHeader}>
        {navigation.canGoBack() && (
          <TouchableOpacity onPress={() => navigation.goBack()} style={HeaderStyles.backButtonContainer}>
            <Ionicons name="arrow-back" size={AppDimensions.iconSize.large} color={AppColors.textSecondary} />
            <Text style={HeaderStyles.backButtonText}>Voltar</Text>
          </TouchableOpacity>
        )}
        <Text style={HeaderStyles.headerTitle}> Todos os Desafios</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={HeaderStyles.appLogoHeaderContainer}>
          <Image
            source={require('../assets/better-bite-logo.png')}
            style={HeaderStyles.appLogoHeader}
            accessibilityLabel="BetterBite Logo"
          />
        </TouchableOpacity>
      </View>
      
      <View style={styles.contentWrapper}>
        <Image
          source={require('../assets/desafios-logo.png')}
          style={styles.screenLogo}
          accessibilityLabel="Logo Desafios"
        />
      </View>

      <View style={styles.scrollableContentWrapper}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={AppColors.secondary} />
            <Text style={styles.loadingText}>Carregando desafios...</Text>
          </View>
        ) : (
          <FlatList
            data={desafios}
            keyExtractor={(item) => item.id}
            renderItem={renderDesafioItem}
            showsVerticalScrollIndicator={true}
            contentContainerStyle={styles.listContentContainer}
            ListEmptyComponent={() => (
              <View style={styles.emptyListContainer}>
                <Ionicons name="sad-outline" size={AppDimensions.iconSize.xLarge + 10} color={AppColors.lightGray} />
                <Text style={styles.emptyListText}>Nenhum desafio disponível no momento.</Text>
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  contentWrapper: {
    paddingHorizontal: AppDimensions.spacing.medium,
    paddingTop: AppDimensions.spacing.medium,
    alignItems: 'center',
    backgroundColor: AppColors.cardBackground,
    paddingBottom: AppDimensions.spacing.medium,
  },
  screenLogo: {
    width: 150,
    height: 100,
    resizeMode: 'contain',
    marginBottom: AppDimensions.spacing.medium,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: AppDimensions.spacing.small,
    fontSize: 16,
    color: AppColors.darkGray,
  },
  scrollableContentWrapper: {
    flex: 1,
  },
  listContentContainer: {
    paddingHorizontal: AppDimensions.spacing.medium,
    paddingTop: AppDimensions.spacing.small,
    paddingBottom: AppDimensions.spacing.medium,
  },
  desafioCard: {
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
  desafioCardIconPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: AppDimensions.borderRadius.small,
    backgroundColor: AppColors.secondary + '1A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: AppDimensions.spacing.medium,
  },
  desafioCardInfo: {
    flex: 1,
  },
  desafioCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: AppColors.text,
    marginBottom: AppDimensions.spacing.small / 2,
  },
  desafioCardDesc: {
    fontSize: 14,
    color: AppColors.textSecondary,
    marginBottom: AppDimensions.spacing.small / 4,
  },
  desafioCardMeta: {
    fontSize: 12,
    color: AppColors.darkGray,
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: AppDimensions.spacing.xLarge,
    backgroundColor: AppColors.cardBackground,
    borderRadius: AppDimensions.borderRadius.medium,
    padding: AppDimensions.spacing.large,
  },
  emptyListText: {
    fontSize: 16,
    color: AppColors.placeholder,
    marginTop: AppDimensions.spacing.medium,
    textAlign: 'center',
  },
});