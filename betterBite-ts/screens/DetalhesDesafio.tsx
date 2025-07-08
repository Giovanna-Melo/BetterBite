import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, ScrollView, Image, Alert } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { Desafio } from '../model/Desafio';
import { DesafioUsuario } from '../model/DesafioUsuario';
import { RegistroDesafio } from '../model/RegistroDesafio';
import { Usuario } from '../model/Usuario';
import { DesafioController } from '../controllers/DesafioController';

import { RootStackParamList } from '../App';

import { AppColors, AppDimensions, HeaderStyles } from '../constants/AppStyles';

interface Props {
  desafios: Desafio[];
  registros: DesafioUsuario[];
  registrosDesafio: RegistroDesafio[];
  usuario: Usuario;
  setDesafiosDoUsuarioState: React.Dispatch<React.SetStateAction<DesafioUsuario[]>>;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'DetalhesDesafio'>;

export default function DetalhesDesafio({ desafios, registros, registrosDesafio, usuario, setDesafiosDoUsuarioState }: Props) {
  const route = useRoute<RouteProp<RootStackParamList, 'DetalhesDesafio'>>();
  const navigation = useNavigation<NavigationProp>();

  const controller = new DesafioController(desafios, registros, registrosDesafio);
  const desafio = controller.buscarPorId(route.params.idDesafio);

  const [isParticipating, setIsParticipating] = useState(false);

  useEffect(() => {
    if (desafio && usuario) {
      const alreadyParticipates = controller.usuarioJaParticipa(usuario.id, desafio.id);
      setIsParticipating(alreadyParticipates);
    }
  }, [desafio, usuario, registros]);

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

  const progressoGeral = controller.progressoPorDesafio(desafio.id);
  const registrosLista = controller.registrosDoDesafio(desafio.id);

  function irParaCriarRegistro() {
    navigation.navigate('CriarRegistroDesafio', { idDesafio: desafio!.id });
  }

  const handleParticiparDesafio = () => {
    if (!usuario) {
      Alert.alert('Erro', 'Você precisa estar logado para participar de um desafio.');
      return;
    }
    if (isParticipating) {
      Alert.alert('Informação', 'Você já está participando deste desafio!');
      return;
    }

    const novoDesafioUsuario = new DesafioUsuario(
      usuario.id,
      desafio.id,
      new Date(),
      new Date(Date.now() + desafio.duracao * 24 * 60 * 60 * 1000),
      'ativo',
      0
    );

    setDesafiosDoUsuarioState((prev) => [...prev, novoDesafioUsuario]);
    setIsParticipating(true);
    Alert.alert('Sucesso', `Você está participando do desafio "${desafio.nome}"!`);
    navigation.navigate('Home');
  };

  const registrosPorData = Array.from(
    registrosLista.reduce((acc, reg) => {
      const dataStr = reg.data.toISOString().split('T')[0];
      const total = (acc.get(dataStr) || 0) + reg.consumo;
      acc.set(dataStr, total);
      return acc;
    }, new Map<string, number>())
  ).sort((a, b) => (a[0] < b[0] ? 1 : -1));

  const registroUsuarioAtivo = registros.find(r => r.desafioId === desafio.id);
  const dataInicioFormatada = registroUsuarioAtivo?.dataInicio
    ? registroUsuarioAtivo.dataInicio.toLocaleDateString()
    : 'N/A';
  const dataFimFormatada = registroUsuarioAtivo?.dataFim
    ? registroUsuarioAtivo.dataFim.toLocaleDateString()
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

        {!isParticipating ? (
          <TouchableOpacity style={styles.participarButton} onPress={handleParticiparDesafio}>
            <Text style={styles.participarButtonText}>Participar do Desafio!</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.alreadyParticipatingContainer}>
            <Ionicons name="checkmark-circle-outline" size={AppDimensions.iconSize.large} color={AppColors.primary} />
            <Text style={styles.alreadyParticipatingText}>Você já está participando!</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detalhes do Desafio</Text>
          <Text style={styles.infoText}>
            Categoria: {desafio.categoria}
          </Text>
          <Text style={styles.infoText}>
            Meta: {desafio.valorMeta} {desafio.unidade} por {desafio.frequencia}
          </Text>
          <Text style={styles.infoText}>
            Duração: {desafio.duracao} {desafio.frequencia === 'diario' ? 'dias' : desafio.frequencia === 'semanal' ? 'semanas' : 'meses'}
          </Text>
          <Text style={styles.infoText}>
            Personalizável: {desafio.ehPersonalizavel ? 'Sim' : 'Não'}
          </Text>
          <Text style={styles.infoText}>
            Status: {desafio.ativo ? 'Ativo' : 'Inativo'}
          </Text>
        </View>

        {registroUsuarioAtivo && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sua Participação</Text>
            <Text style={styles.infoText}>Início: {dataInicioFormatada}</Text>
            <Text style={styles.infoText}>Fim: {dataFimFormatada}</Text>
            <Text style={styles.infoText}>Status: {registroUsuarioAtivo.status === 'ativo' ? 'Ativo' : registroUsuarioAtivo.status === 'completo' ? 'Concluído' : 'Falhou'}</Text>
          </View>
        )}

        <View style={styles.progressBox}>
          <Text style={styles.progressText}>Progresso Geral:</Text>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: `${progressoGeral}%` }]} />
          </View>
          <Text style={styles.progressPercent}>{progressoGeral}%</Text>
        </View>

        <Text style={styles.subtitle}>Registros de Consumo por Dia:</Text>
        {registrosPorData.length === 0 ? (
          <Text style={styles.semRegistro}>Nenhum registro ainda.</Text>
        ) : (
          registrosPorData.map(([dataStr, totalConsumo]) => (
            <View key={dataStr} style={styles.registroItem}>
              <Text style={styles.registroText}>
                {new Date(dataStr).toLocaleDateString()} - {totalConsumo} {desafio.unidade}
              </Text>
              <Text style={{ color: controller.metaDiariaAtingida(desafio.id, totalConsumo) ? AppColors.primary : AppColors.error }}>
                {controller.metaDiariaAtingida(desafio.id, totalConsumo) ? '✅ Meta Atingida' : '❌ Meta Não Atingida'}
              </Text>
            </View>
          ))
        )}
      </ScrollView>

      {isParticipating && (
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