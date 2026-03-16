const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.resolve(__dirname, '../db/paroquia.db');
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY);

function query(sql) {
  return new Promise((resolve, reject) => {
    db.all(sql, [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

async function main() {
  const tables = await query("SELECT name FROM sqlite_master WHERE type='table'");
  console.log('TABLES:', tables.map(t => t.name).join(', '));

  const tableNames = ['chapels', 'clergy_members', 'content_texts', 'guides', 'events', 'admins', 'pastoralmovements', 'former_priests', 'news'];
  for (const tbl of tableNames) {
    try {
      const rows = await query(`SELECT * FROM "${tbl}" LIMIT 100`);
      console.log('\n=== ' + tbl + ' (' + rows.length + ' rows) ===');
      console.log(JSON.stringify(rows, null, 2));
    } catch (e) {
      // table might not exist or different name
    }
  }

  db.close();
}

main().catch(console.error);
