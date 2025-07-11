import initSqlJs from 'sql.js';
import { DesafioUsuario } from '../model/DesafioUsuario';

let db: any = null;

// 🔁 Salva o banco no localStorage
function salvarBanco() {
  if (!db) return;
  const data = db.export();
  const base64 = btoa(String.fromCharCode(...data));
  localStorage.setItem('bancoDesafioUsuario', base64);
  console.log('💾 Banco DesafioUsuario salvo no localStorage');
}

// 🔁 Remove o banco do localStorage
export function limparBancoLocalDesafioUsuario() {
  localStorage.removeItem('bancoDesafioUsuario');
  console.log('🧹 Banco DesafioUsuario removido do localStorage');
}

// 🏁 Cria o banco e tabela se necessário
export async function createDesafioUsuarioTable() {
  if (db) return;

  const SQL = await initSqlJs({
    locateFile: (file) => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.6.2/${file}`,
  });

  const base64 = localStorage.getItem('bancoDesafioUsuario');

  if (base64) {
    const binaryString = atob(base64);
    const byteArray = Uint8Array.from(binaryString, (char) => char.charCodeAt(0));
    db = new SQL.Database(byteArray);
    console.log('🗃️ Banco DesafioUsuario carregado do localStorage');
  } else {
    db = new SQL.Database();
    console.log('📄 Banco DesafioUsuario novo criado na memória');
  }

  db.run(`
    CREATE TABLE IF NOT EXISTS desafioUsuario (
      id TEXT PRIMARY KEY NOT NULL,
      usuarioId TEXT NOT NULL,
      desafioId TEXT NOT NULL,
      dataInicio TEXT NOT NULL,
      dataFim TEXT NOT NULL,
      status TEXT NOT NULL,
      progresso REAL NOT NULL
    );
  `);
}

// 📥 Insere um DesafioUsuario no banco
export async function inserirDesafioUsuario(desafioUsuario: DesafioUsuario): Promise<void> {
  if (!db) await createDesafioUsuarioTable();

  const stmt = db.prepare(`
    INSERT OR REPLACE INTO desafioUsuario (
      id, usuarioId, desafioId, dataInicio, dataFim, status, progresso
    ) VALUES (?, ?, ?, ?, ?, ?, ?);
  `);

  stmt.run([
    desafioUsuario.id,
    desafioUsuario.usuarioId,
    desafioUsuario.desafioId,
    desafioUsuario.dataInicio.toISOString(),
    desafioUsuario.dataFim.toISOString(),
    desafioUsuario.status,
    desafioUsuario.progresso,
  ]);

  stmt.free();
  salvarBanco();
  console.log('✅ DesafioUsuario inserido via sql.js');
}

// 📤 Busca todos os desafios do usuário
export async function buscarDesafiosDoUsuario(usuarioId: string): Promise<DesafioUsuario[]> {
  if (!db) await createDesafioUsuarioTable();

  const resultados: DesafioUsuario[] = [];
  const stmt = db.prepare('SELECT * FROM desafioUsuario WHERE usuarioId = ?');
  stmt.bind([usuarioId]);

  while (stmt.step()) {
    const row = stmt.getAsObject();
    resultados.push(
      new DesafioUsuario(
        row.usuarioId,
        row.desafioId,
        new Date(row.dataInicio),
        new Date(row.dataFim),
        row.status,
        row.progresso
      )
    );
  }

  stmt.free();
  console.log('📄 Lista de DesafioUsuario buscada:', resultados);
  return resultados;
}
