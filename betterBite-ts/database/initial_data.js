module.exports = `
-- Tabela: desafios
INSERT INTO desafios (id, nome, descricao, categoria, tipoMeta, unidade, valorMeta, frequencia, duracao, ehPersonalizavel, ativo) VALUES
('d001', '3L de Água por Dia', 'Desafio geral para manter hidratação ideal.', 'água', 'quantidade', 'litros', 3, 'diario', 7, 0, 1),
('d002', '1 Fruta por Dia', 'Introduza o hábito de consumir ao menos 1 fruta por dia.', 'introdução alimentar', 'frequencia', 'vezes', 1, 'diario', 7, 1, 1),
('d003', 'Experimente Algo Novo', 'Experimente um alimento diferente a cada dia por 5 dias.', 'introdução alimentar', 'frequencia', 'vezes', 1, 'diario', 5, 1, 1),
('d004', 'Reeducação com Lactose', 'Inclua pequenas porções de alimentos com lactose.', 'restrição', 'quantidade', 'porcoes', 1, 'diario', 5, 1, 1),
('d005', 'Café da Manhã Completo', 'Inclua 3 grupos alimentares no café da manhã.', 'refeições', 'frequencia', 'vezes', 1, 'diario', 7, 1, 1),
('d006', 'Refeição sem Ultraprocessados', 'Faça 1 refeição sem produtos ultraprocessados.', 'refeições', 'frequencia', 'vezes', 1, 'diario', 5, 1, 1),
('d007', 'Inclua Leguminosas', 'Adicione feijão, lentilha ou grão-de-bico diariamente.', 'introdução alimentar', 'frequencia', 'vezes', 1, 'diario', 7, 1, 1),
('d008', 'Coma Devagar', 'Leve pelo menos 20 minutos para fazer uma refeição diariamente.', 'bem-estar', 'frequencia', 'vezes', 1, 'diario', 7, 0, 1),
('d009', 'Alimente-se com Cores', 'Monte uma refeição com alimentos de ao menos 3 cores diferentes.', 'refeições', 'frequencia', 'vezes', 1, 'diario', 5, 0, 1),
('d010', 'Chá antes de Dormir', 'Inclua uma xícara de chá calmante (ex: camomila) à noite.', 'bem-estar', 'frequencia', 'vezes', 1, 'diario', 5, 0, 1),
('d011', 'Prepare sua Própria Refeição', 'Cozinhe sua própria refeição pelo menos 1 vez ao dia.', 'refeições', 'frequencia', 'vezes', 1, 'diario', 7, 0, 1);

-- Tabela: tags
INSERT INTO tags (id, nome) VALUES
('t01', 'Vegetariano'), ('t02', 'Vegano'), ('t03', 'Sem Glúten'),
('t04', 'Low Carb'), ('t05', 'Rápido'), ('t06', 'Café da Manhã'),
('t07', 'Lanche'), ('t08', 'Almoço/Jantar'), ('t09', 'Detox'),
('t10', 'Bebida'), ('t11', 'Alto em Proteína');

-- Tabela: receitas
INSERT INTO receitas (id, nome, descricao, imagemUrl, ingredientes, preparo, tempoPreparoMin, porcoes, caloriasPorPorcao, proteinasPorPorcao, gordurasPorPorcao, fibrasPorPorcao) VALUES
('r001', 'Salada Tropical', 'Salada leve com folhas, frutas e castanhas.', 'https://m.media-amazon.com/images/I/615Q1RErf-L._AC_SX569_.jpg', '["alface","manga","castanha-do-pará"]', 'Misture tudo e sirva gelado.', 10, 2, 180, 5, 10, 3),
('r002', 'Omelete de Espinafre', 'Omelete com vegetais verdes.', 'https://boomi.b-cdn.net/wp-content/uploads/2021/09/VT193.jpg', '["ovo","espinafre","cebola"]', 'Bata os ovos, adicione legumes e frite.', 15, 1, 220, 14, 16, 2),
('r003', 'Iogurte com Frutas', 'Lanche saudável e rápido.', 'https://m.media-amazon.com/images/I/71JFk5MeY+L._AC_UF350,350_QL80_.jpg', '["iogurte natural","morango","banana"]', 'Misture o iogurte com as frutas picadas.', 5, 1, 150, 6, 3, 2),
('r004', 'Arroz Integral com Legumes', 'Refeição nutritiva e leve.', 'https://m.media-amazon.com/images/I/71ML1xYWdUL._AC_UF350,350_QL80_.jpg', '["arroz integral","cenoura","ervilha"]', 'Refogue legumes e adicione ao arroz cozido.', 30, 3, 250, 7, 5, 4),
('r005', 'Panqueca de Aveia', 'Panqueca saudável e sem glúten.', 'https://m.media-amazon.com/images/I/51Qt-M2sevL._AC_UF894,1000_QL80_.jpg', '["aveia","banana","ovo"]', 'Misture os ingredientes e frite.', 20, 2, 200, 8, 6, 3),
('r006', 'Smoothie Verde', 'Bebida detox e energética.', 'https://www.vitamixportugal.com/recetas/wp-content/uploads//2022/05/smoothie-verde-para-principiantes.jpg', '["couve","maçã","limão","água"]', 'Bata tudo no liquidificador.', 5, 1, 120, 2, 1, 4),
('r007', 'Macarrão de Abobrinha', 'Substituto leve do macarrão tradicional.', 'https://static.itdg.com.br/images/1200-630/fc68fb0d87fdb005523d07d5fc33d918/320760-original.jpg', '["abobrinha","molho de tomate","alho"]', 'Corte a abobrinha em tiras e refogue com molho.', 15, 2, 90, 3, 2, 2);

-- Tabela: receita_tags
INSERT INTO receita_tags (receitaId, tagId) VALUES
('r001', 't01'), ('r001', 't02'), ('r001', 't03'), ('r001', 't04'), ('r001', 't05'),
('r002', 't01'), ('r002', 't05'), ('r002', 't06'), ('r002', 't11'),
('r003', 't01'), ('r003', 't05'), ('r003', 't07'), ('r003', 't03'),
('r004', 't01'), ('r004', 't02'), ('r004', 't03'), ('r004', 't08'),
('r005', 't01'), ('r005', 't06'), ('r005', 't03'),
('r006', 't02'), ('r006', 't03'), ('r006', 't09'), ('r006', 't10'), ('r006', 't05'),
('r007', 't01'), ('r007', 't02'), ('r007', 't04'), ('r007', 't03'), ('r007', 't08');
`;