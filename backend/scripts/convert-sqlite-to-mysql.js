const fs = require('fs');
const path = require('path');

const inputPath = process.env.SQLITE_DUMP_PATH
  ? path.resolve(process.env.SQLITE_DUMP_PATH)
  : path.join(__dirname, '../db/paroquia.sql');
const outputPath = process.env.MYSQL_DUMP_PATH
  ? path.resolve(process.env.MYSQL_DUMP_PATH)
  : path.join(__dirname, '../db/paroquia.mysql.sql');

const raw = fs.readFileSync(inputPath, 'utf8');
const lines = raw.split(/\r?\n/);

const out = [];

for (let line of lines) {
  if (!line.trim()) continue;
  if (line.startsWith('PRAGMA')) continue;

  if (line === 'BEGIN TRANSACTION;') {
    out.push('START TRANSACTION;');
    continue;
  }

  if (line.startsWith('CREATE TABLE')) {
    line = line.replace(/\bUUID\b/g, 'CHAR(36)');
    line = line.replace(/\bINTEGER PRIMARY KEY\b/g, 'INT AUTO_INCREMENT PRIMARY KEY');
    line = line.replace(/\bINTEGER\b/g, 'INT');
    line = line.replace(/\bDATETIME\b/g, 'DATETIME(3)');
    line = line.replace(/\bJSON\b/g, 'JSON');
    line = line.replace(/\s+REFERENCES\s+`[^`]+`\s+\(`[^`]+`\)/g, '');
    line = line.replace(/\s+/g, ' ');
    line = line.replace(/\)\s*;$/, ') ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;');
    out.push(line);
    continue;
  }

  if (line.startsWith('INSERT INTO')) {
    line = line.replace(/ (\d{2}:\d{2}:\d{2}\.\d{3}) \+00:00/g, ' $1');
    out.push(line);
    continue;
  }

  out.push(line);
}

out.push(
  'ALTER TABLE `event_photos`',
  '  ADD INDEX `event_photos_event_id_idx` (`event_id`),',
  '  ADD CONSTRAINT `event_photos_event_id_fk` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON UPDATE CASCADE ON DELETE CASCADE;'
);

out.push(
  'ALTER TABLE `inscriptions`',
  '  ADD INDEX `inscriptions_event_id_idx` (`event_id`),',
  '  ADD CONSTRAINT `inscriptions_event_id_fk` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON UPDATE CASCADE ON DELETE CASCADE;'
);

fs.writeFileSync(outputPath, out.join('\n'));
console.log(`Dump MySQL gerado: ${outputPath}`);
