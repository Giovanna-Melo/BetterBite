import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, SafeAreaView, StatusBar, Image, ScrollView } from 'react-native';
import { Receita } from '../model/Receita';
import { ReceitaController } from '../controllers/ReceitaController';
import ReceitaCard from '../components/ReceitaCard';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import Ionicons from '@expo/vector-icons/Ionicons';
import { TagNutricional } from '../model/TagNutricional';

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
        ? prevTagIds.filter((id) => id !== tagId)
        : [...prevTagIds, tagId]
    );
  };

  const receitasFiltradas = controller.filtrarReceitas(filtro, selectedTagIds);

  if (selecionada) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#f9f9f9" />
        <View style={styles.detailHeader}>
          <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.appLogoMassive}>
            <Image
              source={require('../assets/better-bite-logo.png')}
              style={styles.appLogoMassive}
              accessibilityLabel="BetterBite Logo"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSelecionada(null)} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color="#333" />
            <Text style={styles.backButtonText}>Voltar</Text>
          </TouchableOpacity>
        </View>
        <ReceitaCard receita={selecionada} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f9f9f9" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.appLogoContainerList}>
            <Image
              source={require('../assets/better-bite-logo.png')}
              style={styles.appLogoMassive}
              accessibilityLabel="BetterBite Logo"
            />
        </TouchableOpacity>
        {navigation.canGoBack() && ( 
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonList}>
            <Ionicons name="arrow-back" size={28} color="#333" />
            <Text style={styles.backButtonText}>Voltar</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.title}>Receitas Saudáveis</Text>
        <Image
          source={require('../assets/receitas-logo.png')}
          style={styles.screenLogo}
          accessibilityLabel="Logo Receitas"
        />
        <TextInput
          style={styles.input}
          placeholder="Buscar por nome ou ingrediente..."
          placeholderTextColor="#999"
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
            <ActivityIndicator size="large" color="#8BC34A" />
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
                <Ionicons name="chevron-forward" size={24} color="#888" />
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={true}
            contentContainerStyle={styles.listContentContainer}
            ListEmptyComponent={() => (
              <View style={styles.emptyListContainer}>
                <Ionicons name="sad-outline" size={50} color="#CCC" />
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
    backgroundColor: '#F9F9F9',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    backgroundColor: '#FFF',
    alignItems: 'center',
  },
  appLogoContainerList: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 1,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  appLogoMassive: {
    width: 300,
    height: 100,
    resizeMode: 'contain',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    position: 'absolute',
    right: 10,
    top: 15,
    zIndex: 2,
  },
  backButtonText: {
    fontSize: 17,
    color: '#333',
    marginLeft: 5,
  },
  backButtonList: { 
    position: 'absolute',
    top: 15,
    right: 10,
    zIndex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    marginTop: 20,
    textAlign: 'center',
  },
  screenLogo: {
    width: 150,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    borderColor: '#E0E0E0',
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
    backgroundColor: '#F0F0F0',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tagsScrollViewContent: {
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  tagButton: {
    backgroundColor: '#E0E0E0',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginRight: 10,
    borderColor: '#CCC',
    borderWidth: 1,
  },
  tagButtonSelected: {
    backgroundColor: '#8BC34A',
    borderColor: '#689F38',
  },
  tagButtonText: {
    color: '#555',
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
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  scrollableContentWrapper: {
    flex: 1,
  },
  listContentContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 20,
  },
  itemBox: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  itemContent: {
    flex: 1,
    marginRight: 10,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  itemCalories: {
    fontSize: 14,
    color: '#777',
  },
  itemTagsContainer: { 
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 5,
  },
  itemTagText: { 
      fontSize: 10,
      backgroundColor: '#E6F4E6', 
      color: '#689F38', 
      borderRadius: 5,
      paddingHorizontal: 6,
      paddingVertical: 3,
      marginRight: 5,
      marginBottom: 5,
      fontWeight: 'bold',
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyListText: {
    fontSize: 16,
    color: '#999',
    marginTop: 10,
  },
});