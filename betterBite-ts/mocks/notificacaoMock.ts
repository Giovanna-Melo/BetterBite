import { Notificacao } from '../model/Notificacao';
import { usuarioIds } from './usuarioMock'; 

export const notificacoesMock: Notificacao[] = [
  new Notificacao(
    usuarioIds[0],
    'Lembrete: Beba 2L de água hoje!',
    new Date(Date.now() + 1000 * 60 * 60),
    'lembrete',
    false
  ),
  new Notificacao(
    usuarioIds[0],
    'Parabéns! Você completou o Desafio Sem Açúcar!',
    new Date(Date.now() - 1000 * 60 * 60 * 24),
    'novaMeta',
    false
  ),
  new Notificacao(
    usuarioIds[1],
    'Alerta: Agende seu check-in do Desafio das Frutas.',
    new Date(Date.now() + 1000 * 60 * 30),
    'alerta',
    false
  ),
  new Notificacao(
    usuarioIds[2],
    'Você tem uma nova meta de hidratação disponível.',
    new Date(Date.now() - 1000 * 60 * 60 * 48),
    'novaMeta',
    true 
  ),
  new Notificacao(
    usuarioIds[0], 
    'Não esqueça de registrar seu café da manhã saudável!',
    new Date(Date.now() + 1000 * 60 * 15), 
    'lembrete',
    false
  ),
];