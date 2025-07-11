// services/database.ts
import { Platform } from 'react-native';
import * as SQLite from 'expo-sqlite';
import initSqlJs from 'sql.js';
import { Desafio } from '../model/Desafio';

let db: any = null;
let SQL: any = null;

// Inicializa o banco de dados, dependendo da plataforma
export async function initDatabase() {
  if (Platform.OS === 'web') {
    if (!SQL) {
      SQL = await initSqlJs({
        locateFile: () => '/sql-wasm.wasm',
      });
    }
    db = new SQL.Database();
    criarTabelaDesafios();
  } else {
    db = SQLite.openDatabase('betterbite.db');
    criarTabelaDesafios();
  }

  return db;
}

// Cria a tabela de desafios se ainda não existir
export function criarTabelaDesafios() {
  if (!db) {
    console.warn("Banco de dados ainda não foi inicializado para criar tabela.");
    return;
  }

  const sql = `
    CREATE TABLE IF NOT EXISTS desafios (
      id TEXT PRIMARY KEY NOT NULL,
      nome TEXT,
      descricao TEXT,
      categoria TEXT,
      tipoMeta TEXT,
      unidade TEXT,
      valorMeta REAL,
      frequencia TEXT,
      duracao INTEGER,
      ativo INTEGER
    );
  `;

  if (Platform.OS === 'web') {
    db.run(sql);
  } else {
    db.transaction(tx => {
      tx.executeSql(sql);
    });
  }
}

// Salva um novo desafio no banco de dados
export async function salvarDesafio(d: Desafio) {
  if (!db) {
    console.warn("Banco de dados ainda não foi inicializado.");
    return;
  }

  const valores = [
    d.id, d.nome, d.descricao, d.categoria, d.tipoMeta,
    d.unidade, d.valorMeta, d.frequencia, d.duracao, d.ativo ? 1 : 0
  ];

  const sql = `
    INSERT INTO desafios (
      id, nome, descricao, categoria, tipoMeta, unidade, valorMeta, frequencia, duracao, ativo
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
  `;

  if (Platform.OS === 'web') {
    db.run(sql, valores);
  } else {
    db.transaction(tx => {
      tx.executeSql(sql, valores);
    });
  }
}

// Lista os desafios salvos no banco
export function listarDesafios(callback: (lista: Desafio[]) => void) {
  if (!db) {
    console.warn("Banco de dados ainda não foi inicializado.");
    callback([]);
    return;
  }

  if (Platform.OS === 'web') {
    const res = db.exec('SELECT * FROM desafios;');
    if (res.length > 0) {
      const values = res[0].values;
      const cols = res[0].columns;
      const mapped = values.map(row => {
        const obj: any = {};
        row.forEach((val, idx) => {
          obj[cols[idx]] = val;
        });
        return obj as Desafio;
      });
      callback(mapped);
    } else {
      callback([]);
    }
  } else {
    db.transaction(tx => {
      tx.executeSql("SELECT * FROM desafios;", [], (_, { rows }) => {
        callback(rows._array);
      });
    });
  }
}

