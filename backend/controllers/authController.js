const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const sql = require('../config/supabase');

async function login(req, res) {
  const { username, email, password } = req.body;
  if (!password || (!username && !email)) {
    return res.status(400).json({ error: 'Username/email and password required' });
  }
  try {
    const [user] = await sql`
      SELECT * FROM "users" WHERE ${username ? sql`name = ${username}` : sql`email = ${email}`}
    `;
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    if (!['admin', 'limited_admin'].includes(user.role)) {
      return res.status(403).json({ error: 'Forbidden: not an admin' });
    }
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const session_token = crypto.randomBytes(32).toString('hex');
    const expires_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await sql`
      INSERT INTO admin_login (user_id, session_token, expires_at)
      VALUES (${user.id}, ${session_token}, ${expires_at})
    `;

    res.json({
      token: session_token,
      user: {
        id: user.id,
        username: user.name,
        email: user.email,
        role: user.role,
      },
      expires_at,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function logout(req, res) {
  const token = req.headers['authorization']?.replace('Bearer ', '');
  if (!token) return res.status(400).json({ error: 'No token provided' });
  try {
    await sql`DELETE FROM admin_login WHERE session_token = ${token}`;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { login, logout };
