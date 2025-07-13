import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, ScrollView, Image, Alert, ActivityIndicator } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

import { Desafio } from '../model/Desafio';
import { DesafioUsuario } from '../model/DesafioUsuario';
import { RegistroDesafio } from '../model/RegistroDesafio';
import { Usuario } from '../model/Usuario';
import { DesafioController } from '../controllers/DesafioController';
import { NotificacaoController } from '../controllers/NotificacaoController';
import { dbService } from '../database/DatabaseService';
import { RootStackParamList } from '../App';

import { AppColors, AppDimensions, HeaderStyles } from '../constants/AppStyles';

type DetalhesDesafioProps = NativeStackScreenProps<RootStackParamList, 'DetalhesDesafio'>;

export default function DetalhesDesafio({ route, navigation }: DetalhesDesafioProps) {
  const controller = new DesafioController();
  const { idDesafio } = route.params;

  const [loading, setLoading] = useState(true);
  const [desafio, setDesafio] = useState<Desafio | null>(null);
  const [participacao, setParticipacao] = useState<DesafioUsuario | null>(null);
  const [registros, setRegistros] = useState<RegistroDesafio[]>([]);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  
  const carregarDados = useCallback(async () => {
    setLoading(true);
    try {
      const userData = await AsyncStorage.getItem("usuarioLogado");
      if (!userData) {
        navigation.navigate("Login");
        return;
      }
      const loggedUser = JSON.parse(userData);
      setUsuario(loggedUser);

      const desafioData = await controller.buscarPorId(idDesafio);
      setDesafio(desafioData || null);

      if (desafioData && loggedUser) {
        const participacaoData = await dbService.getDesafioUsuario(loggedUser.id, idDesafio);
        setParticipacao(participacaoData || null);

        if (participacaoData) {
          const registrosData = await controller.registrosDoDesafio(participacaoData.id);
          setRegistros(registrosData);
          await controller.calcularEAtualizarProgresso(participacaoData.id);
          const participacaoAtualizada = await dbService.getDesafioUsuarioById(participacaoData.id);
          setParticipacao(participacaoAtualizada ?? null);
        } else {
          setRegistros([]);
        }
      }
    } catch (error) {
      console.error("Erro ao carregar detalhes do desafio:", error);
      Alert.alert("Erro", "Não foi possível carregar os dados do desafio.");
    } finally {
      setLoading(false);
    }
  }, [idDesafio, navigation]);
  
  useFocusEffect(
    useCallback(() => {
        carregarDados();
    }, [carregarDados])
  );

  const notificacaoController = new NotificacaoController();

  const handleReiniciarDesafio = () => {
    if (!participacao || !desafio || !usuario) return;

    Alert.alert(
      "Reiniciar Desafio",
      `Tem a certeza de que quer reiniciar o desafio "${desafio.nome}"? Todo o progresso será apagado.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sim, Reiniciar",
          onPress: async () => {
            try {
              const novaDataFim = new Date(Date.now() + desafio.duracao * 24 * 60 * 60 * 1000);
              await dbService.resetDesafioUsuario(participacao.id, novaDataFim);
              
              await notificacaoController.criarLembretesDeDesafio(
                desafio.nome,
                desafio.id,
                usuario,
                new Date(),
                desafio.duracao
              );

              Alert.alert("Sucesso", "Desafio reiniciado com novas metas e lembretes!");
              carregarDados();
            } catch (error) {
              console.error("Erro ao reiniciar desafio:", error);
              Alert.alert("Erro", "Não foi possível reiniciar o desafio.");
            }
          },
        },
      ]
    );
  };

  const handleParticiparDesafio = async () => {
    if (!usuario || !desafio) return;

    if (participacao) {
      Alert.alert('Informação', 'Você já está participando deste desafio!');
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
      
      setParticipacao(novoDesafioUsuario);
      
      Alert.alert('Sucesso', `Você está participando do desafio "${desafio.nome}"!`);
      
      carregarDados(); // Recarrega os dados para refletir a nova participação na UI
    } catch (error) {
       console.error("Erro ao participar do desafio:", error);
       Alert.alert("Erro", "Não foi possível participar do desafio.");
    }
  };

  const irParaCriarRegistro = () => {
    if (participacao && desafio) {
      navigation.navigate('CriarRegistroDesafio', {
        idDesafioUsuario: participacao.id,
        idDesafio: desafio.id,
      });
    }
  };

  useFocusEffect(
    useCallback(() => {
        carregarDados();
    }, [carregarDados])
  );

  // Agrupa os registros por data para exibição
  const registrosPorData = Array.from(
    registros.reduce((acc, reg) => {
      const dataStr = new Date(reg.data).toISOString().split('T')[0];
      const total = (acc.get(dataStr) || 0) + reg.consumo;
      acc.set(dataStr, total);
      return acc;
    }, new Map<string, number>())
  ).sort((a, b) => (a[0] < b[0] ? 1 : -1));

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={AppColors.primary} />
          <Text>Carregando detalhes...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!desafio) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor={AppColors.background} />
        <View style={HeaderStyles.detailHeader}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={HeaderStyles.backButtonContainer}>
            <Ionicons name="arrow-back" size={AppDimensions.iconSize.large} color={AppColors.textSecondary} />
            <Text style={HeaderStyles.backButtonText}>Voltar</Text>
          </TouchableOpacity>
          <Text style={HeaderStyles.headerTitle}>Desafio não encontrado</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Home')} style={HeaderStyles.appLogoHeaderContainer}>
            <Image
              source={require('../assets/better-bite-logo.png')}
              style={HeaderStyles.appLogoHeader}
              accessibilityLabel="BetterBite Logo"
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const dataInicioFormatada = participacao?.dataInicio
    ? new Date(participacao.dataInicio).toLocaleDateString()
    : 'N/A';
  const dataFimFormatada = participacao?.dataFim
    ? new Date(participacao.dataFim).toLocaleDateString()
    : 'N/A';

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={AppColors.background} />

      <View style={HeaderStyles.detailHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={HeaderStyles.backButtonContainer}>
          <Ionicons name="arrow-back" size={AppDimensions.iconSize.large} color={AppColors.textSecondary} />
          <Text style={HeaderStyles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
        <Text style={HeaderStyles.headerTitle}>{desafio.nome}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={HeaderStyles.appLogoHeaderContainer}>
          <Image
            source={require('../assets/better-bite-logo.png')}
            style={HeaderStyles.appLogoHeader}
            accessibilityLabel="BetterBite Logo"
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.desc}>{desafio.descricao}</Text>

        {!participacao ? (
          <TouchableOpacity style={styles.participarButton} onPress={handleParticiparDesafio}>
            <Text style={styles.participarButtonText}>Participar do Desafio!</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.alreadyParticipatingContainer}>
            <Ionicons name="checkmark-circle-outline" size={AppDimensions.iconSize.large} color={AppColors.primary} />
            <Text style={styles.alreadyParticipatingText}>Você já está participando!</Text>
          </View>
        )}

        {participacao?.progresso === 100 && (
          <TouchableOpacity 
            style={[styles.participarButton, {backgroundColor: AppColors.accentBlue, marginTop: 15}]} 
            onPress={handleReiniciarDesafio}
          >
            <Ionicons name="refresh-outline" size={20} color="#fff" style={{marginRight: 10}} />
            <Text style={styles.participarButtonText}>Reiniciar Desafio</Text>
          </TouchableOpacity>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detalhes do Desafio</Text>
          <Text style={styles.infoText}>Categoria: {desafio.categoria}</Text>
          <Text style={styles.infoText}>Meta: {desafio.valorMeta} {desafio.unidade} por {desafio.frequencia}</Text>
          <Text style={styles.infoText}>Duração: {desafio.duracao} dias</Text>
          <Text style={styles.infoText}>Personalizável: {desafio.ehPersonalizavel ? 'Sim' : 'Não'}</Text>
          <Text style={styles.infoText}>Status: {desafio.ativo ? 'Ativo' : 'Inativo'}</Text>
        </View>

        {participacao && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Sua Participação</Text>
              <Text style={styles.infoText}>Início: {dataInicioFormatada}</Text>
              <Text style={styles.infoText}>Fim: {dataFimFormatada}</Text>
              <Text style={styles.infoText}>Status: {participacao.status}</Text>
            </View>

            <View style={styles.progressBox}>
              <Text style={styles.progressText}>Progresso Geral:</Text>
              <View style={styles.progressBarBackground}>
                <View style={[styles.progressBarFill, { width: `${participacao.progresso}%` }]} />
              </View>
              <Text style={styles.progressPercent}>{participacao.progresso}%</Text>
            </View>
          </>
        )}

        <Text style={styles.subtitle}>Registros de Consumo por Dia:</Text>
        {registrosPorData.length === 0 ? (
          <Text style={styles.semRegistro}>Nenhum registro ainda.</Text>
        ) : (
          registrosPorData.map(([dataStr, totalConsumo]) => (
            <View key={dataStr} style={styles.registroItem}>
              <Text style={styles.registroText}>
                {new Date(`${dataStr}T12:00:00Z`).toLocaleDateString()} - {totalConsumo} {desafio.unidade}
              </Text>
            </View>
          ))
        )}
      </ScrollView>

      {participacao && participacao.status === 'ativo' && (
        <TouchableOpacity style={styles.fab} onPress={irParaCriarRegistro}>
          <Ionicons name="add" size={AppDimensions.iconSize.large} color="#fff" />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    padding: AppDimensions.spacing.medium,
    paddingBottom: AppDimensions.spacing.xLarge * 2,
  },
  desc: {
    fontSize: 16,
    color: AppColors.textSecondary,
    marginBottom: AppDimensions.spacing.medium,
  },
  participarButton: {
    backgroundColor: AppColors.primary,
    paddingVertical: AppDimensions.spacing.medium,
    borderRadius: AppDimensions.borderRadius.medium,
    alignItems: 'center',
    marginBottom: AppDimensions.spacing.large,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  participarButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  alreadyParticipatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.secondary + '1A',
    paddingVertical: AppDimensions.spacing.medium,
    borderRadius: AppDimensions.borderRadius.medium,
    marginBottom: AppDimensions.spacing.large,
  },
  alreadyParticipatingText: {
    color: AppColors.primary,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: AppDimensions.spacing.small,
  },
  section: {
    marginBottom: AppDimensions.spacing.xLarge,
    padding: AppDimensions.spacing.medium,
    backgroundColor: AppColors.cardBackground,
    borderRadius: AppDimensions.borderRadius.medium,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: AppDimensions.spacing.medium,
    color: AppColors.text,
  },
  infoText: {
    fontSize: 15,
    marginBottom: AppDimensions.spacing.small / 2,
    color: AppColors.textSecondary,
  },
  progressBox: {
    marginBottom: AppDimensions.spacing.xLarge,
    paddingHorizontal: AppDimensions.spacing.medium,
  },
  progressText: {
    fontWeight: '600',
    fontSize: 15,
    marginBottom: AppDimensions.spacing.small / 2,
    color: AppColors.text,
  },
  progressBarBackground: {
    width: '100%',
    height: 14,
    backgroundColor: AppColors.border,
    borderRadius: 7,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: AppColors.primary,
  },
  progressPercent: {
    marginTop: AppDimensions.spacing.small / 2,
    fontWeight: 'bold',
    fontSize: 14,
    color: AppColors.text,
    textAlign: 'right',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: AppDimensions.spacing.small,
    color: AppColors.text,
  },
  semRegistro: {
    fontStyle: 'italic',
    color: AppColors.placeholder,
    textAlign: 'center',
    marginTop: AppDimensions.spacing.small,
  },
  registroItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: AppDimensions.spacing.small,
    backgroundColor: AppColors.cardBackground,
    padding: AppDimensions.spacing.small,
    borderRadius: AppDimensions.borderRadius.small,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 0 },
    elevation: 1,
  },
  registroText: {
    fontSize: 15,
    color: AppColors.textSecondary,
  },
  fab: {
    position: 'absolute',
    bottom: AppDimensions.spacing.xLarge,
    right: AppDimensions.spacing.medium,
    backgroundColor: AppColors.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
});