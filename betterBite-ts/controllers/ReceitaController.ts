import { Receita } from '../model/Receita';
import { TagNutricional } from '../model/TagNutricional';
import { receitasMock } from '../mocks/receitaMock';
import { tagsMock } from '../mocks/tagNutricionalMock'; 

export class ReceitaController {
  private receitas: Receita[];
  private todasTags: TagNutricional[]; 

  constructor() {
    this.receitas = receitasMock;
    this.todasTags = tagsMock;
  }

  listarTodas(): Receita[] {
    return this.receitas;
  }

  listarTodasTagsDisponiveis(): TagNutricional[] {
    return this.todasTags;
  }

  buscarNomeTagPorId(tagId: string): string | undefined {
    return this.todasTags.find(tag => tag.id === tagId)?.nome;
  }

  filtrarReceitas(texto: string, tagIdsSelecionadas: string[]): Receita[] {
    const query = texto.toLowerCase();

    return this.receitas.filter((r) => {
      const matchesSearch =
        r.nome.toLowerCase().includes(query) ||
        r.ingredientes.some((ing) => ing.toLowerCase().includes(query));

      const matchesTags =
        tagIdsSelecionadas.length === 0 || 
        tagIdsSelecionadas.every((selectedTagId) => r.tags.includes(selectedTagId)); 

      return matchesSearch && matchesTags;
    });
  }
}