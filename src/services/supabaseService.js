const { createClient } = require('@supabase/supabase-js');

let supabase;

function getClient() {
  if (!supabase) {
    supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY,
    );
  }
  return supabase;
}

/**
 * Persist a scan result into the `scans` table.
 * Uses the new schema: id (uuid PK), user_id, target_type, target_name,
 * target_hash, stats, verdict, analysis_id, created_at.
 */
async function saveScan({ user_id, target_type, target_name, target_hash, stats, verdict, analysis_id }) {
  const { data, error } = await getClient()
    .from('scans')
    .insert({
      user_id,
      target_type,
      target_name,
      target_hash: target_hash ?? null,
      stats,
      verdict,
      analysis_id: analysis_id ?? null,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Fetch a single scan by its uuid, scoped to a user.
 */
async function getScanById(scanId, userId) {
  const query = getClient()
    .from('scans')
    .select('*')
    .eq('id', scanId);

  if (userId) query.eq('user_id', userId);

  const { data, error } = await query.single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

/**
 * Fetch recent scans for a specific user.
 */
async function getRecentScans(userId, limit = 20) {
  const { data, error } = await getClient()
    .from('scans')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

module.exports = { saveScan, getScanById, getRecentScans };
