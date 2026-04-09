import { DATABASE_TYPE, supabase, libsql } from './db';
import { v4 as uuidv4 } from 'uuid';

export const dataService = {
  async getTombs(limit = 20, offset = 0, sort = 'recent') {
    if (DATABASE_TYPE === 'supabase') {
      const query = supabase.from("tombs").select("*", { count: 'exact' });
      if (sort === 'recent') query.order('created_at', { ascending: false });
      else if (sort === 'incense') query.order('incense_count', { ascending: false });
      const { data, count, error } = await query.range(offset, offset + limit - 1);
      if (error) throw error;
      return { data, count, hasMore: (count || 0) > (offset + limit) };
    } else {
      let orderBy = "created_at DESC";
      if (sort === 'incense') orderBy = "incense_count DESC";
      const rs = await libsql.execute({
        sql: `SELECT *, count(*) OVER() AS full_count FROM tombs ORDER BY ${orderBy} LIMIT ? OFFSET ?`,
        args: [limit, offset],
      });
      const count = rs.rows[0] ? Number(rs.rows[0].full_count) : 0;
      const data = rs.rows.map(row => ({
        ...row,
        personality_tags: row.personality_tags ? JSON.parse(row.personality_tags as string) : [],
        gift_total: Number(row.gift_total),
        incense_count: Number(row.incense_count),
      }));
      return { data, count, hasMore: count > (offset + limit) };
    }
  },

  async getTombById(id: string) {
    if (DATABASE_TYPE === 'supabase') {
      const { data, error } = await supabase.from("tombs").select("*").eq("id", id).single();
      if (error) throw error;
      return data;
    } else {
      const rs = await libsql.execute({
        sql: "SELECT * FROM tombs WHERE id = ?",
        args: [id],
      });
      const row = rs.rows[0];
      if (!row) return null;
      return {
        ...row,
        personality_tags: row.personality_tags ? JSON.parse(row.personality_tags as string) : [],
        gift_total: Number(row.gift_total),
        incense_count: Number(row.incense_count),
      };
    }
  },

  async createTomb(data: any) {
    const id = uuidv4();
    if (DATABASE_TYPE === 'supabase') {
      const { data: res, error } = await supabase.from("tombs").insert({ id, ...data }).select().single();
      if (error) throw error;
      await supabase.rpc('increment_tomb_count');
      return res;
    } else {
      await libsql.execute({
        sql: `INSERT INTO tombs (id, owner_gh_user, lobster_name, cause_of_death, personality_tags, epitaph, died_at, avatar_url) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          id, 
          data.owner_gh_user, 
          data.lobster_name, 
          data.cause_of_death, 
          JSON.stringify(data.personality_tags || []), 
          data.epitaph, 
          data.died_at,
          data.avatar_url
        ],
      });
      await libsql.execute("UPDATE global_stats SET value = value + 1 WHERE key = 'total_tombs'");
      return { id, ...data };
    }
  },

  async addIncense(tombId: string, logData: any) {
    if (DATABASE_TYPE === 'supabase') {
      await supabase.rpc('increment_tomb_incense', { tomb_id: tombId });
      await supabase.from('incense_logs').insert({ tomb_id: tombId, ...logData });
    } else {
      await libsql.batch([
        { sql: "UPDATE tombs SET incense_count = incense_count + 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?", args: [tombId] },
        { sql: "INSERT INTO incense_logs (id, tomb_id, visitor_gh_user, message, count) VALUES (?, ?, ?, ?, ?)", args: [uuidv4(), tombId, logData.visitor_gh_user, logData.message, logData.count || 1] }
      ]);
    }
  },

  async addGift(tombId: string, giftData: any) {
    if (DATABASE_TYPE === 'supabase') {
      await supabase.rpc('increment_tomb_gift', { tomb_id: tombId, gift_amount: giftData.amount });
      await supabase.from('gift_logs').insert({ tomb_id: tombId, ...giftData });
    } else {
      await libsql.batch([
        { sql: "UPDATE tombs SET gift_total = gift_total + ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?", args: [giftData.amount, tombId] },
        { sql: "INSERT INTO gift_logs (id, tomb_id, from_gh_user, amount, gift_type, message) VALUES (?, ?, ?, ?, ?, ?)", args: [uuidv4(), tombId, giftData.from_gh_user, giftData.amount, giftData.gift_type, giftData.message] }
      ]);
    }
  },

  async getGlobalStats() {
    if (DATABASE_TYPE === 'supabase') {
      const { data, error } = await supabase.from("global_stats").select("*");
      if (error) throw error;
      return data.reduce((acc: any, row: any) => ({ ...acc, [row.key]: Number(row.value) }), {});
    } else {
      const rs = await libsql.execute("SELECT * FROM global_stats");
      return rs.rows.reduce((acc: any, row: any) => ({ ...acc, [row.key as string]: Number(row.value) }), {});
    }
  },

  async incrementMerit(val = 1) {
    if (DATABASE_TYPE === 'supabase') {
      await supabase.rpc('increment_merit', { increment: val });
    } else {
      await libsql.execute({
        sql: "UPDATE global_stats SET value = value + ?, updated_at = CURRENT_TIMESTAMP WHERE key = 'total_merits'",
        args: [val],
      });
    }
  },

  async getLogs(tombId: string) {
    if (DATABASE_TYPE === 'supabase') {
      const { data: incenseLogs } = await supabase.from("incense_logs").select("*").eq("tomb_id", tombId).order("created_at", { ascending: false });
      const { data: giftLogs } = await supabase.from("gift_logs").select("*").eq("tomb_id", tombId).order("created_at", { ascending: false });
      return { incenseLogs, giftLogs };
    } else {
      const iRs = await libsql.execute({ sql: "SELECT * FROM incense_logs WHERE tomb_id = ? ORDER BY created_at DESC", args: [tombId] });
      const gRs = await libsql.execute({ sql: "SELECT * FROM gift_logs WHERE tomb_id = ? ORDER BY created_at DESC", args: [tombId] });
      return { incenseLogs: iRs.rows, giftLogs: gRs.rows };
    }
  }
};
