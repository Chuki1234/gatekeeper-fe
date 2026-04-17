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
 * Verify the CafeToolbox JWT from the Authorization header.
 * On success, attaches `req.user` with `{ id, email, ... }`.
 */
async function authMiddleware(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }

  const token = header.slice(7);

  try {
    const { data: { user }, error } = await getClient().auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    req.user = { id: user.id, email: user.email };
    next();
  } catch (err) {
    console.error('[Auth] token verification failed:', err.message);
    return res.status(401).json({ error: 'Authentication failed' });
  }
}

module.exports = authMiddleware;
