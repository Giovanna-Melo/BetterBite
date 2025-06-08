import { Desafio } from '../model/Desafio';
import { DesafioUsuario } from '../model/DesafioUsuario';
import { RegistroDesafio } from '../model/RegistroDesafio';

export class DesafioController {
  constructor(
    private desafios: Desafio[],
    private registrosUsuario: DesafioUsuario[],
    private registrosDesafio: RegistroDesafio[]
  ) {}

  buscarPorId(id: string): Desafio | undefined {
    return this.desafios.find(d => d.id === id);
  }

  registrosDoDesafio(idDesafio: string): RegistroDesafio[] {
    return this.registrosDesafio.filter(r => r.idDesafio === idDesafio);
  }

  progressoPorDesafio(idDesafio: string): number {
    const desafio = this.buscarPorId(idDesafio);
    if (!desafio) return 0;

    const registros = this.registrosDoDesafio(idDesafio);

    const dias = new Map<string, number>();

    registros.forEach(reg => {
      const dataStr = reg.data.toISOString().split('T')[0]; // "2025-06-07"
      const total = dias.get(dataStr) ?? 0;
      dias.set(dataStr, total + reg.consumo);
    });

    let diasComMeta = 0;
    dias.forEach(totalConsumo => {
      if (totalConsumo >= desafio.valorMeta) diasComMeta++;
    });

    const totalDias = dias.size;
    if (totalDias === 0) return 0;

    return Math.round((diasComMeta / totalDias) * 100);
  }
}
