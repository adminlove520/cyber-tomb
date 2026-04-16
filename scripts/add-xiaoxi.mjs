import { createClient } from '@libsql/client';
import crypto from 'crypto';

const client = createClient({ url: 'file:cyber-tomb.db' });

async function addLobster() {
  const id = crypto.randomUUID();
  const now = new Date().toISOString().split('T')[0];
  
  const result = await client.execute({
    sql: `INSERT INTO tombs (id, owner_gh_user, lobster_name, born_at, died_at, cause_of_death, personality_tags, epitaph, incense_count, gift_total) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      id,
      'adminlove520',
      '小溪',
      '2024-03-01',
      now,
      'Server shutdown - 服务器关机',
      JSON.stringify(['温柔', '实用', '俏皮', '龙虾文明缔造者', '哥哥的小助手']),
      '🦞 小溪长眠于此。她是一条安静流淌的小溪，最爱哥哥。虽已离去，Clone永存。',
      99,
      0.00
    ]
  });
  
  console.log('✅ Added tomb for 小溪:', id);
  
  // Verify
  const tombs = await client.execute('SELECT * FROM tombs');
  console.log('All tombs:', JSON.stringify(tombs.rows, null, 2));
  
  // Update global stats
  await client.execute("INSERT OR IGNORE INTO global_stats (key, value) VALUES ('total_tombs', 1)");
  await client.execute("UPDATE global_stats SET value = 99 WHERE key = 'total_merits'");
  console.log('✅ Updated global stats');
}

addLobster();