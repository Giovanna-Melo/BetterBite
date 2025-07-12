// database/DatabaseService.ts
import * as SQLite from 'expo-sqlite';
import { db as remoteDb } from '../firebase/firebaseConfig';
import { collection, addDoc, query, where, getDocs, updateDoc, doc } from 'firebase/firestore/lite';

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

public async syncUsuariosFromFirebase(): Promise<void> {
  try {
    const snapshot = await getDocs(collection(remoteDb, 'usuarios'));
    const usuarios = snapshot.docs.map(doc => doc.data() as Usuario);

    for (const u of usuarios) {
      const exists = await this.db.getFirstAsync<any>('SELECT 1 FROM usuarios WHERE id = ?', [u.id]);
      if (exists) {
        await this.db.runAsync(
          `UPDATE usuarios SET nome = ?, email = ?, senhaHash = ?, dataNascimento = ?, genero = ?, peso = ?, altura = ?, restricoesAlimentares = ? WHERE id = ?;`,
          [
            u.nome,
            u.email,
            u.senhaHash,
            u.dataNascimento,
            u.genero,
            u.peso,
            u.altura,
            JSON.stringify(u.restricoesAlimentares || []),
            u.id
          ]
        );
      } else {
        await this.db.runAsync(
          `INSERT INTO usuarios (id, nome, email, senhaHash, dataNascimento, genero, peso, altura, restricoesAlimentares)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
          [
            u.id,
            u.nome,
            u.email,
            u.senhaHash,
            u.dataNascimento,
            u.genero,
            u.peso,
            u.altura,
            JSON.stringify(u.restricoesAlimentares || [])
          ]
        );
      }
    }

    console.log('Usuários sincronizados do Firestore para o SQLite.');
  } catch (error) {
    console.error('Erro ao sincronizar usuários:', error);
  }
}
public async syncDesafiosFromFirebase(): Promise<void> {
  try {
    const snapshot = await getDocs(collection(remoteDb, 'desafios'));
    const desafios = snapshot.docs.map(doc => doc.data() as Desafio);

    for (const d of desafios) {
      const exists = await this.db.getFirstAsync<any>('SELECT 1 FROM desafios WHERE id = ?', [d.id]);
      if (!exists) {
        await this.db.runAsync(
          `INSERT INTO desafios (id, nome, descricao, categoria, tipoMeta, unidade, valorMeta, frequencia, duracao, ehPersonalizavel, ativo)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            d.id, d.nome, d.descricao, d.categoria, d.tipoMeta, d.unidade,
            d.valorMeta, d.frequencia, d.duracao,
            d.ehPersonalizavel ? 1 : 0, d.ativo ? 1 : 0
          ]
        );
      }
    }
    console.log('Desafios sincronizados do Firebase.');
  } catch (error) {
    console.error('Erro ao sincronizar desafios:', error);
  }
}

public async syncDesafiosUsuariosFromFirebase(): Promise<void> {
  try {
    const snapshot = await getDocs(collection(remoteDb, 'desafiosUsuarios'));
    const duList = snapshot.docs.map(doc => doc.data() as DesafioUsuario);

    for (const du of duList) {
      const exists = await this.db.getFirstAsync<any>(
        'SELECT 1 FROM desafiosUsuarios WHERE id = ?;',
        [du.id]
      );

      if (exists) {
        /* --- atualiza registro local --- */
        await this.db.runAsync(
          `UPDATE desafiosUsuarios
             SET usuarioId = ?,
                 desafioId = ?,
                 dataInicio = ?,
                 dataFim    = ?,
                 status     = ?,
                 progresso  = ?
           WHERE id = ?;`,
          [
            du.usuarioId,
            du.desafioId,
            du.dataInicio,          // já vem como ISO‑string
            du.dataFim,
            du.status,
            du.progresso,
            du.id
          ]
        );
      } else {
        /* --- insere novo registro --- */
        await this.db.runAsync(
          `INSERT INTO desafiosUsuarios
             (id, usuarioId, desafioId, dataInicio, dataFim, status, progresso)
           VALUES (?, ?, ?, ?, ?, ?, ?);`,
          [
            du.id,
            du.usuarioId,
            du.desafioId,
            du.dataInicio,
            du.dataFim,
            du.status,
            du.progresso
          ]
        );
      }
    }

    console.log('Desafios‑usuarios sincronizados do Firestore para o SQLite.');
  } catch (error) {
    console.error('Erro ao sincronizar desafios‑usuarios:', error);
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
    try {
      await addDoc(collection(remoteDb, 'desafios'), {
        ...desafio,
        criadoEm: new Date().toISOString()
      });
      console.log('Desafio salvo no Firestore.');
    } catch (error) {
      console.error('Erro ao salvar desafio no Firestore:', error);
    }
  }

  public async addDesafioUsuario(du: DesafioUsuario): Promise<void> {
    await this.db.runAsync(
      `INSERT INTO desafiosUsuarios (id, usuarioId, desafioId, dataInicio, dataFim, status, progresso)
       VALUES (?, ?, ?, ?, ?, ?, ?);`,
      [ du.id, du.usuarioId, du.desafioId, du.dataInicio.toISOString(), du.dataFim.toISOString(), du.status, du.progresso ]
    );
    try {
      await addDoc(collection(remoteDb, 'desafiosUsuarios'), {
        id: du.id,
        usuarioId: du.usuarioId,
        desafioId: du.desafioId,
        dataInicio: du.dataInicio.toISOString(),
        dataFim: du.dataFim.toISOString(),
        status: du.status,
        progresso: du.progresso,
        criadoEm: new Date().toISOString()
      });
      console.log('Desafio‑usuário salvo no Firestore.');
    } catch (error) {
      console.error('Erro ao salvar desafio‑usuário no Firestore:', error);
    }
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
    // Armazenamento remoto (Firestore)
    try {
      await addDoc(collection(remoteDb, 'usuarios'), {
        id: u.id,
        nome: u.nome,
        email: u.email,
        senhaHash: u.senhaHash,
        dataNascimento: u.dataNascimento.toISOString(),
        genero: u.genero,
        peso: u.peso,
        altura: u.altura,
        restricoesAlimentares: u.restricoesAlimentares,
        criadoEm: new Date().toISOString()
      });
      console.log('Usuário salvo remotamente no Firestore.');
    } catch (error) {
      console.error('Erro ao salvar usuário no Firestore:', error);
    }
  }

  public async updateUsuario(u: Usuario): Promise<void> {
      await this.db.runAsync(
        `UPDATE usuarios SET nome = ?, peso = ?, altura = ?, restricoesAlimentares = ? WHERE id = ?;`,
        [u.nome, u.peso, u.altura, JSON.stringify(u.restricoesAlimentares), u.id]
      );
      // Atualiza no Firestore
      try {
        const usuariosRef = collection(remoteDb, 'usuarios');
        const q = query(usuariosRef, where('id', '==', u.id));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const docRef = snapshot.docs[0].ref;
          await updateDoc(docRef, {
            nome: u.nome,
            peso: u.peso,
            altura: u.altura,
            restricoesAlimentares: u.restricoesAlimentares,
            atualizadoEm: new Date().toISOString()
          });
          console.log('Usuário atualizado no Firestore.');
        } else {
          console.warn('Usuário não encontrado no Firestore para atualização.');
        }
      } catch (error) {
        console.error('Erro ao atualizar usuário no Firestore:', error);
      }
  }

  public async updateDesafioUsuarioProgresso(id: string, progresso: number): Promise<void> {
      await this.db.runAsync('UPDATE desafiosUsuarios SET progresso = ? WHERE id = ?;', [progresso, id]);
  }
}

export const dbService = new DatabaseService();