// database/DatabaseService.ts
import * as SQLite from 'expo-sqlite';

const schemaScript = require('./schema.js');
const initialDataScript = require('./initial_data.js');

import { Receita } from '../model/Receita';
import { Desafio } from '../model/Desafio';
import { DesafioUsuario } from '../model/DesafioUsuario';
import { RegistroDesafio } from '../model/RegistroDesafio';
import { TagNutricional } from '../model/TagNutricional';
import { Usuario } from '../model/Usuario';
import { generateUUID } from '../utils/uuidGenerator';

const DATABASE_NAME = 'betterbite.db';

class DatabaseService {
  private db!: SQLite.SQLiteDatabase;

  // ------------------------------- INIT -------------------------------
  public async initDatabase(): Promise<void> {
    try {
      this.db = await SQLite.openDatabaseAsync(DATABASE_NAME);

      const exists = await this.db.getFirstAsync<{ name: string }>(
        `SELECT name FROM sqlite_master WHERE type='table' AND name='usuarios';`
      );

      if (!exists) {
        console.log('Banco vazio ➜ criando tabelas e populando dados…');
        await this.db.withTransactionAsync(async () => {
          await this.db.execAsync(schemaScript);
          await this.db.execAsync(initialDataScript);
        });
        console.log('Banco de dados criado e populado com sucesso.');
      }
    } catch (error) {
      console.error('Erro ao inicializar o banco:', error);
      throw error;
    }
  }

  // ------------------------------- READ (GETTERS) -------------------------------
  public async getReceitas(): Promise<Receita[]> {
    const rows = await this.db.getAllAsync<any>(
      `SELECT r.*, 
              (SELECT json_group_array(t.nome) 
               FROM receita_tags rt JOIN tags t ON rt.tagId = t.id 
               WHERE rt.receitaId = r.id) as tags
       FROM receitas r;`
    );
    return rows.map(r => ({
      ...r,
      ingredientes: r.ingredientes ? JSON.parse(r.ingredientes) : [],
      tags: r.tags ? JSON.parse(r.tags) : [],
    }));
  }
  
  public async getReceitasByTags(tagIds: string[]): Promise<Receita[]> {
    if (tagIds.length === 0) return [];
    const placeholders = tagIds.map(() => '?').join(',');
    const query = `
      SELECT r.*,
             (SELECT json_group_array(t.nome) 
              FROM receita_tags rt JOIN tags t ON rt.tagId = t.id 
              WHERE rt.receitaId = r.id) as tags
      FROM receitas r
      WHERE r.id IN (
          SELECT receitaId 
          FROM receita_tags
          WHERE tagId IN (${placeholders})
      )
    `;
    const rows = await this.db.getAllAsync<any>(query, tagIds);
    return rows.map(r => ({
      ...r,
      ingredientes: JSON.parse(r.ingredientes || '[]'),
      tags: JSON.parse(r.tags || '[]'),
    }));
  }

  public async getDesafios(): Promise<Desafio[]> {
    const rows = await this.db.getAllAsync<any>('SELECT * FROM desafios;');
    return rows.map(r => ({
      ...r,
      ehPersonalizavel: !!r.ehPersonalizavel,
      ativo: !!r.ativo,
    }));
  }
  
  public async getDesafioById(id: string): Promise<Desafio | undefined> {
    const row = await this.db.getFirstAsync<any>('SELECT * FROM desafios WHERE id = ?;', [id]);
    if (!row) return undefined;
    return { ...row, ehPersonalizavel: !!row.ehPersonalizavel, ativo: !!row.ativo };
  }

  public async getDesafiosByUsuarioId(usuarioId: string): Promise<DesafioUsuario[]> {
    const rows = await this.db.getAllAsync<any>('SELECT * FROM desafiosUsuarios WHERE usuarioId = ?;', [usuarioId]);
    return rows.map(r => ({ ...r, dataInicio: new Date(r.dataInicio), dataFim: new Date(r.dataFim) }));
  }

  public async getDesafioUsuario(usuarioId: string, desafioId: string): Promise<DesafioUsuario | undefined> {
    const row = await this.db.getFirstAsync<any>(
        'SELECT * FROM desafiosUsuarios WHERE usuarioId = ? AND desafioId = ?;',
        [usuarioId, desafioId]
    );
    if (!row) return undefined;
    return { ...row, dataInicio: new Date(row.dataInicio), dataFim: new Date(row.dataFim) };
  }
  
  public async getDesafioUsuarioById(id: string): Promise<DesafioUsuario | undefined> {
    const row = await this.db.getFirstAsync<any>('SELECT * FROM desafiosUsuarios WHERE id = ?;', [id]);
    if (!row) return undefined;
    return { ...row, dataInicio: new Date(row.dataInicio), dataFim: new Date(row.dataFim) };
  }
  
  public async getRegistrosByDesafioUsuarioId(desafioUsuarioId: string): Promise<RegistroDesafio[]> {
    const rows = await this.db.getAllAsync<any>('SELECT * FROM registrosDesafio WHERE desafioUsuarioId = ?;', [desafioUsuarioId]);
    return rows.map(r => ({ ...r, id: r.id.toString(), data: new Date(r.data), consumo: r.consumo, observacao: r.observacao }));
  }

  public async getTags(): Promise<TagNutricional[]> {
    return this.db.getAllAsync<TagNutricional>('SELECT * FROM tags;');
  }

  public async getTagById(id: string): Promise<TagNutricional | undefined> {
    const row = await this.db.getFirstAsync<TagNutricional>('SELECT * FROM tags WHERE id = ?;', [id]);
    return row ?? undefined;
  }

  public async getUsuarioById(id: string): Promise<Usuario | undefined> {
      const row = await this.db.getFirstAsync<any>('SELECT * FROM usuarios WHERE id = ?;', [id]);
      if (!row) return undefined;
      return { ...row, dataNascimento: new Date(row.dataNascimento), restricoesAlimentares: JSON.parse(row.restricoesAlimentares || '[]') };
  }
  
  public async getUsuarioByEmail(email: string): Promise<Usuario | undefined> {
    const row = await this.db.getFirstAsync<any>('SELECT * FROM usuarios WHERE email = ?;', [email]);
    if (!row) return undefined;
    return { ...row, dataNascimento: new Date(row.dataNascimento), restricoesAlimentares: JSON.parse(row.restricoesAlimentares || '[]') };
  }

  // ------------------------------- WRITE (ADD/UPDATE) -------------------------------
  public async addDesafio(desafio: Desafio): Promise<void> {
    await this.db.runAsync(
      `INSERT INTO desafios (id, nome, descricao, categoria, tipoMeta, unidade, valorMeta, frequencia, duracao, ehPersonalizavel, ativo)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        desafio.id, desafio.nome, desafio.descricao, desafio.categoria, desafio.tipoMeta,
        desafio.unidade, desafio.valorMeta, desafio.frequencia, desafio.duracao,
        desafio.ehPersonalizavel ? 1 : 0, desafio.ativo ? 1 : 0
      ]
    );
  }

  public async addDesafioUsuario(du: DesafioUsuario): Promise<void> {
    await this.db.runAsync(
      `INSERT INTO desafiosUsuarios (id, usuarioId, desafioId, dataInicio, dataFim, status, progresso)
       VALUES (?, ?, ?, ?, ?, ?, ?);`,
      [ du.id, du.usuarioId, du.desafioId, du.dataInicio.toISOString(), du.dataFim.toISOString(), du.status, du.progresso ]
    );
  }

  public async addRegistroDesafio(rd: RegistroDesafio): Promise<void> {
    await this.db.runAsync(
      `INSERT INTO registrosDesafio (id, desafioUsuarioId, data, consumo, observacao)
       VALUES (?, ?, ?, ?, ?);`,
      [ generateUUID(), rd.desafioUsuarioId, rd.data.toISOString(), rd.consumo, rd.observacao ?? null ]
    );
  }

  public async addUsuario(u: Usuario): Promise<void> {
    await this.db.runAsync(
      `INSERT INTO usuarios (id, nome, email, senhaHash, dataNascimento, genero, peso, altura, restricoesAlimentares)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        u.id, u.nome, u.email, u.senhaHash, u.dataNascimento.toISOString(), u.genero,
        u.peso, u.altura, JSON.stringify(u.restricoesAlimentares)
      ]
    );
  }

  public async updateUsuario(u: Usuario): Promise<void> {
      await this.db.runAsync(
        `UPDATE usuarios SET nome = ?, peso = ?, altura = ?, restricoesAlimentares = ? WHERE id = ?;`,
        [u.nome, u.peso, u.altura, JSON.stringify(u.restricoesAlimentares), u.id]
      );
  }

  public async updateDesafioUsuarioProgresso(id: string, progresso: number): Promise<void> {
      await this.db.runAsync('UPDATE desafiosUsuarios SET progresso = ? WHERE id = ?;', [progresso, id]);
  }
}

export const dbService = new DatabaseService();