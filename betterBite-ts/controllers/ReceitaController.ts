import { Receita } from '../model/Receita';
import { receitasMock } from '../mocks/receitaMock';

export class ReceitaController {
  private receitas: Receita[];

  constructor() {
    this.receitas = receitasMock;
  }

  listarTodas(): Receita[] {
    return this.receitas;
  }

  buscarPorNomeOuIngrediente(texto: string): Receita[] {
    const query = texto.toLowerCase();
    return this.receitas.filter(
      (r) =>
        r.nome.toLowerCase().includes(query) ||
        r.ingredientes.some((ing) => ing.toLowerCase().includes(query))
    );
  }

  filtrarPorRestricao(restricoes: string[]): Receita[] {
    return this.receitas.filter(
      (r) =>
        !r.ingredientes.some((ing) =>
          restricoes.map((res) => res.toLowerCase()).includes(ing.toLowerCase())
        )
    );
  }
}
