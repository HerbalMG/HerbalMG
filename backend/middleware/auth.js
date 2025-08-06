const sql = require('../config/supabase');

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    // Check if token exists and is valid
    const [session] = await sql`
      SELECT al.*, u.id, u.name, u.email, u.role 
      FROM admin_login al 
      JOIN users u ON al.user_id = u.id 
      WHERE al.session_token = ${token} 
      AND al.expires_at > NOW()
    `;
    
    if (!session) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    
    // Attach user info to request
    req.user = {
      id: session.user_id, // Use user_id from the session, not the session id
      name: session.name,
      email: session.email,
      role: session.role
    };
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Authentication error' });
  }
};
