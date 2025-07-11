import initSqlJs from 'sql.js';

let db: any = null;

async function initDb() {
  if (!db) {
    const SQL = await initSqlJs({
      locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
    });
    db = new SQL.Database();
  }
  return db;
}

export async function executarQuery(sql: string, params: any[] = []): Promise<any> {
  const database = await initDb();

  let query = sql;
  params.forEach(param => {
    if (typeof param === 'string') {
      query = query.replace('?', `'${param.replace(/'/g, "''")}'`);
    } else {
      query = query.replace('?', param.toString());
    }
  });

  try {
    const result = database.exec(query);
    return result;
  } catch (error) {
    throw error;
  }
}

export default {
  executarQuery,
};
