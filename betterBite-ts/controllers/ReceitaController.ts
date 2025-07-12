import { Receita } from '../model/Receita';
import { TagNutricional } from '../model/TagNutricional';
import { dbService } from '../database/DatabaseService';

export class ReceitaController {
  
  async listarTodas(): Promise<Receita[]> {
    return await dbService.getReceitas();
  }

  async listarTodasTagsDisponiveis(): Promise<TagNutricional[]> {
    return await dbService.getTags();
  }

  async buscarNomeTagPorId(tagId: string): Promise<string | undefined> {
    const tag = await dbService.getTagById(tagId);
    return tag?.nome;
  }

  async filtrarReceitas(texto: string, tagIdsSelecionadas: string[]): Promise<Receita[]> {
    const todasReceitas = await this.listarTodas();
    const query = texto.toLowerCase();

    const receitasFiltradasPorTexto = !query ? todasReceitas : todasReceitas.filter((r: Receita) =>
        r.nome.toLowerCase().includes(query) ||
        (r.ingredientes && r.ingredientes.some((ing: string) => ing.toLowerCase().includes(query)))
    );

    if (tagIdsSelecionadas.length === 0) {
        return receitasFiltradasPorTexto;
    }

    const receitasComTags = await dbService.getReceitasByTags(tagIdsSelecionadas);
    const idsReceitasComTags = new Set(receitasComTags.map(r => r.id));

    return receitasFiltradasPorTexto.filter(r => idsReceitasComTags.has(r.id));
  }
}