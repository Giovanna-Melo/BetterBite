import { Desafio } from '../model/Desafio';
import { v4 as uuidv4 } from 'uuid';

export const desafioIds = [uuidv4(), uuidv4(), uuidv4(), uuidv4(), uuidv4(), uuidv4(), uuidv4()];

export const desafiosMock: Desafio[] = [
  new Desafio('3L de Água por Dia', 'Desafio geral para manter hidratação ideal.', 'agua', 'quantidade', 'litros', 3, 'diario', 7, false, true),
  new Desafio('1 Fruta por Dia', 'Introduza o hábito de consumir ao menos 1 fruta por dia.', 'refeicoes', 'frequencia', 'vezes', 1, 'diario', 7, true, true),
  new Desafio('Experimente Algo Novo', 'Experimente um alimento diferente a cada dia por 5 dias.', 'refeicoes', 'frequencia', 'vezes', 1, 'diario', 5, true, true),
  new Desafio('Reeducação com Lactose', 'Inclua pequenas porções de alimentos com lactose.', 'restricao', 'quantidade', 'porcoes', 1, 'diario', 5, true, true),
  new Desafio('Café da Manhã Completo', 'Inclua 3 grupos alimentares no café da manhã.', 'refeicoes', 'frequencia', 'vezes', 1, 'diario', 7, true, true),
  new Desafio('Refeição sem Ultraprocessados', 'Faça 1 refeição sem produtos ultraprocessados.', 'restricao', 'frequencia', 'vezes', 1, 'diario', 5, true, true),
  new Desafio('Inclua Leguminosas', 'Adicione feijão, lentilha ou grão-de-bico diariamente.', 'refeicoes', 'frequencia', 'vezes', 1, 'diario', 7, true, true),
  new Desafio('Coma Devagar', 'Leve pelo menos 20 minutos para fazer uma refeição diariamente.', 'refeicoes', 'frequencia', 'vezes', 1, 'diario', 7, false, true),
  new Desafio('Alimente-se com Cores', 'Monte uma refeição com alimentos de ao menos 3 cores diferentes.', 'refeicoes', 'frequencia', 'vezes', 1, 'diario', 5, false, true),
  new Desafio('Chá antes de Dormir', 'Inclua uma xícara de chá calmante (ex: camomila) à noite.', 'refeicoes', 'frequencia', 'vezes', 1, 'diario', 5, false, true),
  new Desafio('Prepare sua Própria Refeição', 'Cozinhe sua própria refeição pelo menos 1 vez ao dia.', 'refeicoes', 'frequencia', 'vezes', 1, 'diario', 7, false, true)
];