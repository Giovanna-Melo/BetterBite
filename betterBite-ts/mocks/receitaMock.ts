import { Receita } from '../model/Receita';

export const receitasMock: Receita[] = [
  new Receita('Salada Tropical', 'Salada leve com folhas, frutas e castanhas.', 'https://example.com/salada.jpg', ['alface', 'manga', 'castanha-do-pará'], 'Misture tudo e sirva gelado.', 10, 2, 180, 5, 10, 3),
  new Receita('Omelete de Espinafre', 'Omelete com vegetais verdes.', 'https://example.com/omelete.jpg', ['ovo', 'espinafre', 'cebola'], 'Bata os ovos, adicione legumes e frite.', 15, 1, 220, 14, 16, 2),
  new Receita('Iogurte com Frutas', 'Lanche saudável e rápido.', 'https://example.com/iogurte.jpg', ['iogurte natural', 'morango', 'banana'], 'Misture o iogurte com as frutas picadas.', 5, 1, 150, 6, 3, 2),
  new Receita('Arroz Integral com Legumes', 'Refeição nutritiva e leve.', 'https://example.com/arroz.jpg', ['arroz integral', 'cenoura', 'ervilha'], 'Refogue legumes e adicione ao arroz cozido.', 30, 3, 250, 7, 5, 4),
  new Receita('Panqueca de Aveia', 'Panqueca saudável e sem glúten.', 'https://example.com/panqueca.jpg', ['aveia', 'banana', 'ovo'], 'Misture os ingredientes e frite.', 20, 2, 200, 8, 6, 3),
  new Receita('Smoothie Verde', 'Bebida detox e energética.', 'https://example.com/smoothie.jpg', ['couve', 'maçã', 'limão', 'água'], 'Bata tudo no liquidificador.', 5, 1, 120, 2, 1, 4),
  new Receita('Macarrão de Abobrinha', 'Substituto leve do macarrão tradicional.', 'https://example.com/abobrinha.jpg', ['abobrinha', 'molho de tomate', 'alho'], 'Corte a abobrinha em tiras e refogue com molho.', 15, 2, 90, 3, 2, 2)
];