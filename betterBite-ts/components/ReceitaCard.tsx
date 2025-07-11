import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Receita } from '../model/Receita';

type Props = {
  receita: Receita;
};

export default function ReceitaCard({ receita }: Props) {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  return (
    <ScrollView style={styles.cardContainer} showsVerticalScrollIndicator={true}>
      <View style={styles.imageWrapper}>
        {imageLoading && !imageError && (
          <ActivityIndicator style={styles.activityIndicator} size="large" color="#8BC34A" />
        )}
        {imageError && !imageLoading && (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imageErrorText}>Erro ao carregar imagem</Text>
            <Text style={styles.imageErrorSubText}>Verifique a URL ou conexão.</Text>
          </View>
        )}
        <Image
          source={{ uri: receita.imagemUrl }}
          style={[styles.image, (imageLoading || imageError) && { opacity: 0 }]}
          onLoadEnd={() => setImageLoading(false)}
          onError={(e) => {
            console.error('Erro ao carregar imagem da receita:', e.nativeEvent.error);
            setImageLoading(false);
            setImageError(true);
          }}
        />
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.nome}>{receita.nome}</Text>
        <Text style={styles.descricao}>{receita.descricao}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>✨ Informações Nutricionais (por porção)</Text>
          <Text style={styles.infoItem}>
            <Text style={styles.infoLabel}>Calorias:</Text> {receita.caloriasPorPorcao} kcal
          </Text>
          <Text style={styles.infoItem}>
            <Text style={styles.infoLabel}>Proteínas:</Text> {receita.proteinasPorPorcao} g
          </Text>
          <Text style={styles.infoItem}>
            <Text style={styles.infoLabel}>Gorduras:</Text> {receita.gordurasPorPorcao} g
          </Text>
          <Text style={styles.infoItem}>
            <Text style={styles.infoLabel}>Fibras:</Text> {receita.fibrasPorPorcao} g
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📝 Ingredientes</Text>
          {receita.ingredientes.map((ingrediente, index) => (
            <Text key={index} style={styles.listItem}>• {ingrediente}</Text>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👨‍🍳 Modo de Preparo</Text>
          <Text style={styles.preparo}>{receita.preparo}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⏰ Detalhes Adicionais</Text>
          <Text style={styles.infoItem}>
            <Text style={styles.infoLabel}>Tempo de Preparo:</Text> {receita.tempoPreparoMin} minutos
          </Text>
          <Text style={styles.infoItem}>
            <Text style={styles.infoLabel}>Porções:</Text> {receita.porcoes}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginVertical: 10,
    marginHorizontal: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageWrapper: {
    width: '80%',
    height: 350,
    backgroundColor: '#EEE',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 15,
    marginBottom: 15,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  activityIndicator: {
    position: 'absolute',
    zIndex: 1,
  },
  imagePlaceholder: {
    position: 'absolute',
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: '#F0F0F0',
  },
  imageErrorText: {
    color: '#C00',
    fontWeight: 'bold',
    fontSize: 16,
  },
  imageErrorSubText: {
    color: '#C00',
    fontSize: 12,
    marginTop: 5,
  },
  infoBox: {
    padding: 18,
  },
  nome: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  descricao: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    lineHeight: 24,
  },
  section: {
    marginBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 10,
  },
  infoItem: {
    fontSize: 15,
    color: '#555',
    marginBottom: 5,
  },
  infoLabel: {
    fontWeight: 'bold',
    color: '#333',
  },
  listItem: {
    fontSize: 15,
    color: '#555',
    marginBottom: 3,
    marginLeft: 5,
  },
  preparo: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
  },
});