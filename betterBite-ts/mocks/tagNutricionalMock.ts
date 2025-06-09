import { TagNutricional } from '../model/TagNutricional';

export const tagsMock: TagNutricional[] = [
  new TagNutricional('Vegetariano'),
  new TagNutricional('Vegano'),
  new TagNutricional('Sem Glúten'),
  new TagNutricional('Low Carb'),
  new TagNutricional('Rápido'),
  new TagNutricional('Café da Manhã'),
  new TagNutricional('Lanche'),
  new TagNutricional('Almoço/Jantar'),
  new TagNutricional('Detox'),
  new TagNutricional('Bebida'),
  new TagNutricional('Alto em Proteína'),
];

export const tagNameToIdMap = new Map<string, string>(
  tagsMock.map(tag => [tag.nome, tag.id])
);