import { RegistroDesafio } from '../model/RegistroDesafio';
import { desafioIds } from './desafioMock';

export const registrosDesafioMock: RegistroDesafio[] = [
  // Desafio 0 - "3L de Água por Dia"
  new RegistroDesafio(desafioIds[0], new Date('2025-06-01'), 1, 'Copo 1'),
  new RegistroDesafio(desafioIds[0], new Date('2025-06-01'), 1, 'Copo 2'),
  new RegistroDesafio(desafioIds[0], new Date('2025-06-01'), 1, 'Copo 3'),

  new RegistroDesafio(desafioIds[0], new Date('2025-06-02'), 1, 'Copo 1'),
  new RegistroDesafio(desafioIds[0], new Date('2025-06-02'), 0.5, 'Meio copo 2'),
  new RegistroDesafio(desafioIds[0], new Date('2025-06-02'), 0.5, 'Meio copo 3'),

  // Desafio 1 - "1 Fruta por Dia"
  new RegistroDesafio(desafioIds[1], new Date('2025-06-01'), 1, 'Maçã no café'),
  new RegistroDesafio(desafioIds[1], new Date('2025-06-01'), 1, 'Banana no lanche'),

  new RegistroDesafio(desafioIds[1], new Date('2025-06-02'), 0, 'Não comeu fruta'),

  // Desafio 2 - "Experimente Algo Novo"
  new RegistroDesafio(desafioIds[2], new Date('2025-06-01'), 1, 'Experimentou alimento novo'),

  // Desafio 10 - "Prepare sua Própria Refeição"
  new RegistroDesafio(desafioIds[10], new Date('2025-06-01'), 1, 'Preparou almoço'),
  new RegistroDesafio(desafioIds[10], new Date('2025-06-01'), 1, 'Preparou jantar'),
];
