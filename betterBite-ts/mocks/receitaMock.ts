import { Receita } from '../model/Receita';

export const receitasMock: Receita[] = [
  new Receita('Salada Tropical', 'Salada leve com folhas, frutas e castanhas.', 'https://m.media-amazon.com/images/I/615Q1RErf-L._AC_SX569_.jpg', ['alface', 'manga', 'castanha-do-pará'], 'Misture tudo e sirva gelado.', 10, 2, 180, 5, 10, 3),
  new Receita('Omelete de Espinafre', 'Omelete com vegetais verdes.', 'https://boomi.b-cdn.net/wp-content/uploads/2021/09/VT193.jpg', ['ovo', 'espinafre', 'cebola'], 'Bata os ovos, adicione legumes e frite.', 15, 1, 220, 14, 16, 2),
  new Receita('Iogurte com Frutas', 'Lanche saudável e rápido.', 'https://m.media-amazon.com/images/I/71JFk5MeY+L._AC_UF350,350_QL80_.jpg', ['iogurte natural', 'morango', 'banana'], 'Misture o iogurte com as frutas picadas.', 5, 1, 150, 6, 3, 2),
  new Receita('Arroz Integral com Legumes', 'Refeição nutritiva e leve.', 'https://m.media-amazon.com/images/I/71ML1xYWdUL._AC_UF350,350_QL80_.jpg', ['arroz integral', 'cenoura', 'ervilha'], 'Refogue legumes e adicione ao arroz cozido.', 30, 3, 250, 7, 5, 4),
  new Receita('Panqueca de Aveia', 'Panqueca saudável e sem glúten.', 'https://m.media-amazon.com/images/I/51Qt-M2sevL._AC_UF894,1000_QL80_.jpg', ['aveia', 'banana', 'ovo'], 'Misture os ingredientes e frite.', 20, 2, 200, 8, 6, 3),
  new Receita('Smoothie Verde', 'Bebida detox e energética.', 'https://www.vitamixportugal.com/recetas/wp-content/uploads//2022/05/smoothie-verde-para-principiantes.jpg', ['couve', 'maçã', 'limão', 'água'], 'Bata tudo no liquidificador.', 5, 1, 120, 2, 1, 4),
  new Receita('Macarrão de Abobrinha', 'Substituto leve do macarrão tradicional.', 'https://static.itdg.com.br/images/1200-630/fc68fb0d87fdb005523d07d5fc33d918/320760-original.jpg', ['abobrinha', 'molho de tomate', 'alho'], 'Corte a abobrinha em tiras e refogue com molho.', 15, 2, 90, 3, 2, 2)
];