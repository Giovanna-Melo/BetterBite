import { Desafio } from '../model/Desafio';

export const desafiosMock: Desafio[] = [
  new Desafio('3L de Água por Dia', 'Desafio geral para manter hidratação ideal.', 'água ', 'quantidade', 'litros', 3, 'diario', 7, false, true),
  new Desafio('1 Fruta por Dia', 'Introduza o hábito de consumir ao menos 1 fruta por dia.', 'introdução alimentar ', 'frequencia', 'vezes', 1, 'diario', 7, true, true),
  new Desafio('Experimente Algo Novo', 'Experimente um alimento diferente a cada dia por 5 dias.', 'introdução alimentar ', 'frequencia', 'vezes', 1, 'diario', 5, true, true),
  new Desafio('Reeducação com Lactose', 'Inclua pequenas porções de alimentos com lactose.', 'restrição ', 'quantidade', 'porcoes', 1, 'diario', 5, true, true),
  new Desafio('Café da Manhã Completo', 'Inclua 3 grupos alimentares no café da manhã.', 'refeições ', 'frequencia', 'vezes', 1, 'diario', 7, true, true),
  new Desafio('Refeição sem Ultraprocessados', 'Faça 1 refeição sem produtos ultraprocessados.', 'refeições ', 'frequencia', 'vezes', 1, 'diario', 5, true, true),
  new Desafio('Inclua Leguminosas', 'Adicione feijão, lentilha ou grão-de-bico diariamente.', 'introdução alimentar ', 'frequencia', 'vezes', 1, 'diario', 7, true, true),
  new Desafio('Coma Devagar', 'Leve pelo menos 20 minutos para fazer uma refeição diariamente.', 'bem-estar ', 'frequencia', 'vezes', 1, 'diario', 7, false, true),
  new Desafio('Alimente-se com Cores', 'Monte uma refeição com alimentos de ao menos 3 cores diferentes.', 'refeições ', 'frequencia', 'vezes', 1, 'diario', 5, false, true),
  new Desafio('Chá antes de Dormir', 'Inclua uma xícara de chá calmante (ex: camomila) à noite.', 'bem-estar ', 'frequencia', 'vezes', 1, 'diario', 5, false, true),
  new Desafio('Prepare sua Própria Refeição', 'Cozinhe sua própria refeição pelo menos 1 vez ao dia.', 'refeições ', 'frequencia', 'vezes', 1, 'diario', 7, false, true)
];

export const desafioIds = desafiosMock.map(d => d.id);