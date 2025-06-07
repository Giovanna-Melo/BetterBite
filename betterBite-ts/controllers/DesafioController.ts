import { Desafio } from '../model/Desafio';
import { DesafioUsuario } from '../model/DesafioUsuario';

export class DesafioController {
  constructor(
    private desafios: Desafio[],
    private registros: DesafioUsuario[]
  ) {}

  listarTodos(): Desafio[] {
    return this.desafios;
  }

  buscarPorId(id: string): Desafio | undefined {
    return this.desafios.find(d => d.id === id);
  }

  progressoPorDesafio(desafioId: string): number {
    const registros = this.registros.filter(r => r.desafioId === desafioId);
    const total = registros.length;
    const cumpridos = registros.filter(r => r.status).length;
    return total > 0 ? Math.round((cumpridos / total) * 100) : 0;
  }

  registrosDoDesafio(desafioId: string): DesafioUsuario[] {
    return this.registros.filter(r => r.desafioId === desafioId);
  }
}