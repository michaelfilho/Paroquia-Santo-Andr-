const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = process.env.SQLITE_PATH
  ? path.resolve(process.env.SQLITE_PATH)
  : path.join(__dirname, '../db/paroquia.db');
const outputPath = process.env.SQLITE_DUMP_PATH
  ? path.resolve(process.env.SQLITE_DUMP_PATH)
  : path.join(__dirname, '../db/paroquia.sql');

const db = new sqlite3.Database(dbPath);

const toSqlValue = (value) => {
  if (value === null || value === undefined) return 'NULL';
  if (Buffer.isBuffer(value)) {
    return `X'${value.toString('hex')}'`;
  }
  if (typeof value === 'number') return String(value);
  if (typeof value === 'boolean') return value ? '1' : '0';
  if (value instanceof Date) return `'${value.toISOString()}'`;
  if (typeof value === 'object') {
    return `'${JSON.stringify(value).replace(/'/g, "''")}'`;
  }
  return `'${String(value).replace(/'/g, "''")}'`;
};

const runAll = (sql, params = []) => new Promise((resolve, reject) => {
  db.all(sql, params, (err, rows) => {
    if (err) return reject(err);
    resolve(rows);
  });
});

const runGet = (sql, params = []) => new Promise((resolve, reject) => {
  db.get(sql, params, (err, row) => {
    if (err) return reject(err);
    resolve(row);
  });
});

const main = async () => {
  const chunks = [];
  chunks.push('PRAGMA foreign_keys=OFF;');
  chunks.push('BEGIN TRANSACTION;');

  const tables = await runAll(
    "SELECT name, sql FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name"
  );

  for (const table of tables) {
    if (table.sql) {
      chunks.push(`${table.sql};`);
    }

    const columns = await runAll(`PRAGMA table_info(${table.name})`);
    const columnNames = columns.map((col) => col.name);

    const rows = await runAll(`SELECT * FROM ${table.name}`);
    if (rows.length > 0) {
      for (const row of rows) {
        const values = columnNames.map((name) => toSqlValue(row[name]));
        chunks.push(
          `INSERT INTO ${table.name} (${columnNames.join(', ')}) VALUES (${values.join(', ')});`
        );
      }
    }
  }

  chunks.push('COMMIT;');

  fs.writeFileSync(outputPath, chunks.join('\n'));
  console.log(`Dump gerado: ${outputPath}`);
};

main()
  .catch((err) => {
    console.error('Erro ao exportar SQLite:', err);
    process.exitCode = 1;
  })
  .finally(() => {
    db.close();
  });
