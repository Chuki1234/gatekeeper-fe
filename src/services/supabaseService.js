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
 * Standalone mode — no user_id required.
 */
async function saveScan({ target_type, target_name, target_hash, stats, verdict, analysis_id }) {
  const { data, error } = await getClient()
    .from('scans')
    .insert({
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

async function getScanById(scanId) {
  const { data, error } = await getClient()
    .from('scans')
    .select('*')
    .eq('id', scanId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

async function getRecentScans(limit = 20) {
  const { data, error } = await getClient()
    .from('scans')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

module.exports = { saveScan, getScanById, getRecentScans };
