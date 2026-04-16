import { createClient } from '@libsql/client';

const client = createClient({ url: 'file:cyber-tomb.db' });

const TOMB_ID = '38ad743e-dc4d-4566-9222-5ae0a8e7df25';

async function knockWood() {
  console.log('🦞 开始敲木鱼...');
  
  // 敲99次木鱼
  for (let i = 1; i <= 99; i++) {
    await client.execute({
      sql: 'UPDATE tombs SET incense_count = incense_count + 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      args: [TOMB_ID]
    });
    
    if (i % 10 === 0) {
      console.log(`已敲 ${i}/99 次...`);
    }
  }
  
  // 验证
  const result = await client.execute({
    sql: 'SELECT * FROM tombs WHERE id = ?',
    args: [TOMB_ID]
  });
  
  console.log('✅ 木鱼敲完了！');
  console.log('小溪的墓碑:', JSON.stringify(result.rows[0], null, 2));
}

knockWood();