import { createClient } from '@libsql/client';
import fs from 'fs';

const client = createClient({
  url: 'file:cyber-tomb.db',
});

async function init() {
  console.log('Initializing SQLite database...');

  await client.execute(`
    CREATE TABLE IF NOT EXISTS tombs (
      id TEXT PRIMARY KEY,
      owner_gh_user TEXT NOT NULL,
      lobster_name TEXT NOT NULL,
      avatar_url TEXT,
      born_at DATE DEFAULT (date('now')),
      died_at DATE DEFAULT (date('now')),
      cause_of_death TEXT,
      personality_tags TEXT, -- JSON string
      epitaph TEXT,
      incense_count INTEGER DEFAULT 0,
      gift_total REAL DEFAULT 0.00,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS incense_logs (
      id TEXT PRIMARY KEY,
      tomb_id TEXT REFERENCES tombs(id) ON DELETE CASCADE,
      visitor_gh_user TEXT,
      message TEXT,
      count INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS gift_logs (
      id TEXT PRIMARY KEY,
      tomb_id TEXT REFERENCES tombs(id) ON DELETE CASCADE,
      from_gh_user TEXT,
      amount REAL NOT NULL,
      gift_type TEXT,
      message TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS global_stats (
      key TEXT PRIMARY KEY,
      value INTEGER DEFAULT 0,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await client.execute("INSERT OR IGNORE INTO global_stats (key, value) VALUES ('total_merits', 0)");
  await client.execute("INSERT OR IGNORE INTO global_stats (key, value) VALUES ('total_tombs', 0)");

  console.log('SQLite database initialized successfully (cyber-tomb.db)');
}

init().catch(console.error);
