import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, SafeAreaView, StatusBar, Image, ScrollView } from 'react-native';
import { Receita } from '../model/Receita';
import { ReceitaController } from '../controllers/ReceitaController';
import ReceitaCard from '../components/ReceitaCard';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import Ionicons from '@expo/vector-icons/Ionicons';
import { TagNutricional } from '../model/TagNutricional';

import { AppColors, AppDimensions, HeaderStyles } from '../constants/AppStyles';

type Props = NativeStackScreenProps<RootStackParamList, 'Receitas'>;

export default function ReceitasScreen({ navigation }: Props) {
  const controller = new ReceitaController();
  const [receitas, setReceitas] = useState<Receita[]>([]);
  const [filtro, setFiltro] = useState<string>('');
  const [selecionada, setSelecionada] = useState<Receita | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [availableTags, setAvailableTags] = useState<TagNutricional[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const todas = controller.listarTodas();
      setReceitas(todas);
      setAvailableTags(controller.listarTodasTagsDisponiveis());
      setLoading(false);
    }, 1000);
  }, []);

  const toggleTag = (tagId: string) => {
    setSelectedTagIds((prevTagIds) =>
      prevTagIds.includes(tagId)
        ? prevTagIds.filter((t) => t !== tagId)
        : [...prevTagIds, tagId]
    );
  };

  const receitasFiltradas = controller.filtrarReceitas(filtro, selectedTagIds);

  if (selecionada) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor={AppColors.background} />
        <View style={HeaderStyles.detailHeader}>
          <TouchableOpacity onPress={() => setSelecionada(null)} style={HeaderStyles.backButtonContainer}>
            <Ionicons name="arrow-back" size={AppDimensions.iconSize.large} color={AppColors.textSecondary} />
            <Text style={HeaderStyles.backButtonText}>Voltar</Text>
          </TouchableOpacity>
          <Text style={HeaderStyles.headerTitle}>Detalhes da Receita</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Home')} style={HeaderStyles.appLogoHeaderContainer}>
            <Image
              source={require('../assets/better-bite-logo.png')}
              style={HeaderStyles.appLogoHeader}
              accessibilityLabel="BetterBite Logo"
            />
          </TouchableOpacity>
        </View>
        <ReceitaCard receita={selecionada} />
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
        <Text style={HeaderStyles.headerTitle}>Receitas Saudáveis</Text>
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
          source={require('../assets/receitas-logo.png')}
          style={styles.screenLogo}
          accessibilityLabel="Logo Receitas"
        />
        <TextInput
          style={styles.input}
          placeholder="Buscar por nome ou ingrediente..."
          placeholderTextColor={AppColors.placeholder}
          value={filtro}
          onChangeText={setFiltro}
        />
      </View>

      <View style={styles.tagsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={true} contentContainerStyle={styles.tagsScrollViewContent}>
          {availableTags.map((tag) => (
            <TouchableOpacity
              key={tag.id}
              style={[
                styles.tagButton,
                selectedTagIds.includes(tag.id) ? styles.tagButtonSelected : {}
              ]}
              onPress={() => toggleTag(tag.id)}
            >
              <Text style={[
                styles.tagButtonText,
                selectedTagIds.includes(tag.id) ? styles.tagButtonTextSelected : {}
              ]}>
                {tag.nome}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.scrollableContentWrapper}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={AppColors.secondary} />
            <Text style={styles.loadingText}>Carregando receitas...</Text>
          </View>
        ) : (
          <FlatList
            data={receitasFiltradas}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.itemBox} onPress={() => setSelecionada(item)}>
                <View style={styles.itemContent}>
                  <Text style={styles.itemTitle}>{item.nome}</Text>
                  {item.caloriasPorPorcao && (
                    <Text style={styles.itemCalories}>
                      🔥 {item.caloriasPorPorcao} kcal por porção
                    </Text>
                  )}
                  {item.tags.length > 0 && (
                      <View style={styles.itemTagsContainer}>
                          {item.tags.map(tagId => (
                              <Text key={tagId} style={styles.itemTagText}>
                                  {controller.buscarNomeTagPorId(tagId)}
                              </Text>
                          ))}
                      </View>
                  )}
                </View>
                <Ionicons name="chevron-forward" size={AppDimensions.iconSize.medium} color={AppColors.darkGray} />
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={true}
            contentContainerStyle={styles.listContentContainer}
            ListEmptyComponent={() => (
              <View style={styles.emptyListContainer}>
                <Ionicons name="sad-outline" size={AppDimensions.iconSize.xLarge + 10} color={AppColors.lightGray} />
                <Text style={styles.emptyListText}>Nenhuma receita encontrada para os filtros aplicados.</Text>
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
  title: {
    fontSize: AppDimensions.iconSize.large,
    fontWeight: 'bold',
    color: AppColors.text,
    marginBottom: AppDimensions.spacing.small,
    marginTop: AppDimensions.spacing.medium,
    textAlign: 'center',
  },
  screenLogo: {
    width: 150,
    height: 100,
    resizeMode: 'contain',
    marginBottom: AppDimensions.spacing.medium,
  },
  input: {
    backgroundColor: AppColors.inputBackground,
    borderRadius: AppDimensions.borderRadius.medium,
    paddingHorizontal: AppDimensions.spacing.medium,
    paddingVertical: AppDimensions.spacing.small + 2,
    fontSize: 16,
    borderColor: AppColors.border,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    width: '100%',
  },
  tagsContainer: {
    height: 60,
    backgroundColor: AppColors.extraLightGray,
    paddingVertical: AppDimensions.spacing.small,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.border,
  },
  tagsScrollViewContent: {
    paddingHorizontal: AppDimensions.spacing.medium,
    alignItems: 'center',
  },
  tagButton: {
    backgroundColor: AppColors.lightGray,
    borderRadius: AppDimensions.borderRadius.large,
    paddingVertical: AppDimensions.spacing.small,
    paddingHorizontal: AppDimensions.spacing.medium,
    marginRight: AppDimensions.spacing.small,
    borderColor: AppColors.border,
    borderWidth: 1,
  },
  tagButtonSelected: {
    backgroundColor: AppColors.primary,
    borderColor: AppColors.primary,
  },
  tagButtonText: {
    color: AppColors.textSecondary,
    fontWeight: 'bold',
    fontSize: 14,
  },
  tagButtonTextSelected: {
    color: '#FFFFFF',
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
  itemBox: {
    backgroundColor: AppColors.cardBackground,
    padding: AppDimensions.spacing.medium,
    borderRadius: AppDimensions.borderRadius.medium,
    marginBottom: AppDimensions.spacing.medium,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  itemContent: {
    flex: 1,
    marginRight: AppDimensions.spacing.small,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: AppColors.text,
    marginBottom: AppDimensions.spacing.small / 2,
  },
  itemCalories: {
    fontSize: 14,
    color: AppColors.textSecondary,
  },
  itemTagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: AppDimensions.spacing.small,
  },
  itemTagText: {
      fontSize: 10,
      backgroundColor: AppColors.secondary + '1A',
      color: AppColors.secondary,
      borderRadius: AppDimensions.borderRadius.small,
      paddingHorizontal: AppDimensions.spacing.small,
      paddingVertical: AppDimensions.spacing.small / 2,
      marginRight: AppDimensions.spacing.small / 2,
      marginBottom: AppDimensions.spacing.small / 2,
      fontWeight: 'bold',
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