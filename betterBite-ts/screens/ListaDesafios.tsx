import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, Image, ActivityIndicator, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../App';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Desafio } from '../model/Desafio';
import { DesafioUsuario } from '../model/DesafioUsuario';
import { Usuario } from '../model/Usuario';
import { dbService } from '../database/DatabaseService';

import { AppColors, AppDimensions, HeaderStyles } from '../constants/AppStyles';

type Props = NativeStackScreenProps<RootStackParamList, 'ListaDesafios'> & {
  usuario: Usuario;
  desafios: Desafio[];
  registros: DesafioUsuario[];
  setDesafiosDoUsuarioState: React.Dispatch<React.SetStateAction<DesafioUsuario[]>>;
};

export default function ListaDesafios({ navigation }: Props) {
  const [loading, setLoading] = useState(true);
  const [desafios, setDesafios] = useState<Desafio[]>([]);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [participandoIds, setParticipandoIds] = useState<Set<string>>(new Set());

  const carregarDados = useCallback(async () => {
    setLoading(true);
    let user: Usuario | null = usuario;

    // Garante que temos o objeto do usuário antes de prosseguir
    if (!user) {
      try {
        const userData = await AsyncStorage.getItem("usuarioLogado");
        if (userData) {
          user = JSON.parse(userData);
          setUsuario(user);
        } else {
          // Se não há usuário, não há o que carregar. Redireciona para o login.
          navigation.navigate("Login");
          setLoading(false);
          return;
        }
      } catch (e) {
        console.error("Falha ao buscar usuário no AsyncStorage", e);
        setLoading(false);
        return;
      }
    }
  
    try {
      // Com o usuário garantido, busca os dados do banco
      const todosDesafios = await dbService.getDesafios();
      setDesafios(todosDesafios);

      if (user) {
        const desafiosDoUsuario = await dbService.getDesafiosByUsuarioId(user.id);
        setParticipandoIds(new Set(desafiosDoUsuario.map(d => d.desafioId)));
      }
    } catch (error) {
      console.error("Erro ao carregar desafios:", error);
      Alert.alert("Erro", "Não foi possível carregar os desafios.");
    } finally {
      setLoading(false);
    }
  }, [usuario, navigation]);

  useFocusEffect(
    useCallback(() => {
      carregarDados();
    }, [carregarDados])
  );
  
  const handleParticipar = async (desafio: Desafio) => {
    if (!usuario) {
      Alert.alert("Erro", "Usuário não encontrado. Tente fazer login novamente.");
      return;
    }
    if (participandoIds.has(desafio.id)) {
      Alert.alert("Atenção", "Você já está participando deste desafio.");
      return;
    }

    try {
      const novoDesafioUsuario = new DesafioUsuario(
        usuario.id,
        desafio.id,
        new Date(),
        new Date(Date.now() + desafio.duracao * 24 * 60 * 60 * 1000),
        'ativo',
        0
      );
      await dbService.addDesafioUsuario(novoDesafioUsuario);
      Alert.alert("Sucesso!", `Você agora está participando do desafio: ${desafio.nome}`);
      carregarDados(); // Recarrega os dados para atualizar a UI
    } catch (error) {
      console.error("Erro ao participar do desafio:", error);
      Alert.alert("Erro", "Não foi possível participar do desafio.");
    }
  };

  const renderDesafioItem = ({ item }: { item: Desafio }) => {
    const jaParticipa = participandoIds.has(item.id);
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
        <TouchableOpacity 
          style={[styles.actionButton, jaParticipa && styles.disabledButton]} 
          onPress={() => !jaParticipa && handleParticipar(item)}
          disabled={jaParticipa}
        >
          <Ionicons name={jaParticipa ? "checkmark-done-outline" : "add-circle-outline"} size={AppDimensions.iconSize.medium} color={"#fff"} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };
  
  if (loading) {
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={AppColors.primary} />
                <Text style={styles.loadingText}>Carregando...</Text>
            </View>
        </SafeAreaView>
    );
  }

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
  actionButton: {
    padding: AppDimensions.spacing.small,
    backgroundColor: AppColors.primary,
    borderRadius: 50,
    marginLeft: AppDimensions.spacing.small,
  },
  disabledButton: {
    backgroundColor: AppColors.lightGray,
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