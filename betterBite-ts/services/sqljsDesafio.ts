// services/sqljsDesafio.ts
import initSqlJs from 'sql.js';
import { Desafio } from '../model/Desafio';

let db: any = null;

// 🔁 Salva o banco no localStorage
function salvarBanco() {
  if (!db) return;
  const data = db.export();
  const base64 = btoa(String.fromCharCode(...data));
  localStorage.setItem('bancoDesafios', base64);
  console.log('💾 Banco salvo no localStorage');
}

// 🔁 Remove o banco do localStorage
export function limparBancoLocal() {
  localStorage.removeItem('bancoDesafios');
  console.log('🧹 Banco removido do localStorage');
}

// 🏁 Cria o banco de dados e a tabela
export async function createDesafioTable() {
  if (db) return;

  const SQL = await initSqlJs({
    locateFile: (file: string) =>
      `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.6.2/${file}`,
  });

  const base64 = localStorage.getItem('bancoDesafios');

  if (base64) {
    const binaryString = atob(base64);
    const byteArray = Uint8Array.from(binaryString, (char) => char.charCodeAt(0));
    db = new SQL.Database(byteArray);
    console.log('🗃️ Banco carregado do localStorage');
  } else {
    db = new SQL.Database();
    console.log('📄 Banco novo criado na memória');
  }

  db.run(`
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
      ehPersonalizavel INTEGER,
      ativo INTEGER
    );
  `);
}

// 📥 Insere um desafio no banco
export async function inserirDesafio(desafio: Desafio): Promise<void> {
  if (!db) await createDesafioTable();

  const stmt = db.prepare(`
    INSERT OR REPLACE INTO desafios (
      id, nome, descricao, categoria, tipoMeta, unidade,
      valorMeta, frequencia, duracao, ehPersonalizavel, ativo
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run([
    desafio.id,
    desafio.nome,
    desafio.descricao,
    desafio.categoria,
    desafio.tipoMeta,
    desafio.unidade,
    desafio.valorMeta,
    desafio.frequencia,
    desafio.duracao,
    desafio.ehPersonalizavel ? 1 : 0,
    desafio.ativo ? 1 : 0,
  ]);

  stmt.free();
  console.log('✅ Desafio inserido via sql.js');

  salvarBanco(); // 💾 salva no localStorage
}

// 📤 Busca todos os desafios
export async function buscarDesafios(): Promise<Desafio[]> {
  if (!db) await createDesafioTable();

  const resultados: Desafio[] = [];
  const stmt = db.prepare('SELECT * FROM desafios');

  while (stmt.step()) {
    const row = stmt.getAsObject();
    resultados.push({
      id: row.id as string,
      nome: row.nome as string,
      descricao: row.descricao as string,
      categoria: row.categoria as string,
      tipoMeta: row.tipoMeta as string,
      unidade: row.unidade as string,
      valorMeta: row.valorMeta as number,
      frequencia: row.frequencia as string,
      duracao: row.duracao as number,
      ehPersonalizavel: row.ehPersonalizavel === 1,
      ativo: row.ativo === 1,
    });
  }

  stmt.free();
  console.log('📄 Lista de desafios buscada:', resultados);
  return resultados;
}
