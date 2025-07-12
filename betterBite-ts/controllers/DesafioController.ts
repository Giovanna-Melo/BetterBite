import { Desafio } from '../model/Desafio';
import { DesafioUsuario } from '../model/DesafioUsuario';
import { RegistroDesafio } from '../model/RegistroDesafio';
import { dbService } from '../database/DatabaseService';

export class DesafioController {

  async buscarPorId(id: string): Promise<Desafio | undefined> {
    return await dbService.getDesafioById(id);
  }

  async registrosDoDesafio(desafioUsuarioId: string): Promise<RegistroDesafio[]> {
    return await dbService.getRegistrosByDesafioUsuarioId(desafioUsuarioId);
  }

  async metaDiariaAtingida(desafioId: string, consumoNoDia: number): Promise<boolean> {
    const desafio = await this.buscarPorId(desafioId);
    if (!desafio) return false;

    if (desafio.tipoMeta === 'quantidade' || desafio.tipoMeta === 'tempo') {
        return consumoNoDia >= desafio.valorMeta;
    }
    
    if (desafio.tipoMeta === 'frequencia') {
        return consumoNoDia > 0;
    }
    return false;
  }

  async calcularEAtualizarProgresso(desafioUsuarioId: string): Promise<number> {
    const desafioUsuario = await dbService.getDesafioUsuarioById(desafioUsuarioId);
    if (!desafioUsuario) return 0;
  
    const desafio = await this.buscarPorId(desafioUsuario.desafioId);
    if (!desafio) return 0;
  
    const registros = await this.registrosDoDesafio(desafioUsuarioId);
  
    const consumoDiarioMap = new Map<string, number>();
    registros.forEach(reg => {
      const dataStr = new Date(reg.data).toISOString().split('T')[0];
      const total = consumoDiarioMap.get(dataStr) ?? 0;
      consumoDiarioMap.set(dataStr, total + reg.consumo);
    });
  
    let diasComMetaAtingida = 0;
    for (const [_, totalConsumoNoDia] of consumoDiarioMap.entries()) {
      if (await this.metaDiariaAtingida(desafio.id, totalConsumoNoDia)) {
        diasComMetaAtingida++;
      }
    }
    
    const totalMetas = desafio.duracao;
    if (totalMetas === 0) return 0;
  
    const progresso = Math.min(100, Math.round((diasComMetaAtingida / totalMetas) * 100));
    
    await dbService.updateDesafioUsuarioProgresso(desafioUsuarioId, progresso);
  
    return progresso;
  }

  async usuarioJaParticipa(usuarioId: string, desafioId: string): Promise<boolean> {
    const participacao = await dbService.getDesafioUsuario(usuarioId, desafioId);
    return !!participacao && participacao.status === 'ativo';
  }
}