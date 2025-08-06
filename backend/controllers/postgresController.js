const sql = require('../config/supabase').default || require('../config/supabase');

exports.testPostgresConnection = async (req, res) => {
  try {
    const result = await sql`SELECT 1 as test`;
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
