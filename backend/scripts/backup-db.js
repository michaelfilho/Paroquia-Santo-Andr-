const fs = require('fs');
const path = require('path');

const dbPathArg = process.argv[2] || '..\\db\\paroquia.db';
const backupDirArg = process.argv[3] || '..\\db\\backups';

const scriptRoot = __dirname;
const dbFullPath = path.resolve(scriptRoot, dbPathArg);
const backupDir = path.resolve(scriptRoot, backupDirArg);

if (!fs.existsSync(dbFullPath)) {
  throw new Error(`Banco nao encontrado: ${dbFullPath}`);
}

if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

const now = new Date();
const timestamp = now.toISOString().replace(/[-:]/g, '').replace(/\\.\d{3}Z$/, 'Z').replace('T', '-').replace('Z', '');
const backupFile = path.join(backupDir, `paroquia-${timestamp}.db`);

fs.copyFileSync(dbFullPath, backupFile);

console.log(`Backup criado: ${backupFile}`);
