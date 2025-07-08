import { Desafio } from '../model/Desafio';
import { DesafioUsuario } from '../model/DesafioUsuario';
import { RegistroDesafio } from '../model/RegistroDesafio';

export class DesafioController {
  constructor(
    private desafiosGerais: Desafio[],
    private desafiosUsuarios: DesafioUsuario[],
    private registrosDesafio: RegistroDesafio[]
  ) {}

  buscarPorId(id: string): Desafio | undefined {
    return this.desafiosGerais.find(d => d.id === id);
  }

  registrosDoDesafio(idDesafio: string): RegistroDesafio[] {
    return this.registrosDesafio.filter(r => r.idDesafio === idDesafio);
  }

  metaDiariaAtingida(desafioId: string, consumoNoDia: number): boolean {
    const desafio = this.buscarPorId(desafioId);
    if (!desafio) return false;

    if (desafio.tipoMeta === 'quantidade' || desafio.tipoMeta === 'tempo') {
        return consumoNoDia >= desafio.valorMeta;
    }
    if (desafio.tipoMeta === 'boolean') {
        return consumoNoDia > 0;
    }
    return false;
  }

  progressoPorDesafio(idDesafio: string): number {
    const desafio = this.buscarPorId(idDesafio);
    if (!desafio) return 0;

    const registros = this.registrosDoDesafio(idDesafio);

    const consumoDiarioMap = new Map<string, number>();
    registros.forEach(reg => {
      const dataStr = reg.data.toISOString().split('T')[0];
      const total = consumoDiarioMap.get(dataStr) ?? 0;
      consumoDiarioMap.set(dataStr, total + reg.consumo);
    });

    let diasComMetaAtingida = 0;
    consumoDiarioMap.forEach((totalConsumoNoDia) => {
      if (this.metaDiariaAtingida(desafio.id, totalConsumoNoDia)) {
        diasComMetaAtingida++;
      }
    });

    const totalDiasComRegistros = consumoDiarioMap.size;
    
    if (totalDiasComRegistros === 0) return 0;

    return Math.min(100, Math.round((diasComMetaAtingida / totalDiasComRegistros) * 100));
  }

  usuarioJaParticipa(usuarioId: string, desafioId: string): boolean {
    return this.desafiosUsuarios.some(
      (du) => du.usuarioId === usuarioId && du.desafioId === desafioId && du.status === 'ativo'
    );
  }
}