const sql = require('../config/supabase');
const { generateSlug, isNumericId } = require('../utils/slugUtils');

exports.getAllDiseases = async (req, res) => {
  try {
    const diseases = await sql`SELECT * FROM disease ORDER BY id DESC`;
    res.json(diseases);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getDiseaseByIdentifier = async (req, res) => {
  try {
    const identifier = req.params.identifier;
    let disease;

    if (isNumericId(identifier)) {
      [disease] = await sql`SELECT * FROM disease WHERE id = ${identifier}`;
    } else {
      [disease] = await sql`SELECT * FROM disease WHERE slug = ${identifier}`;
    }

    if (!disease) return res.status(404).json({ error: 'Disease not found' });
    res.json(disease);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createDisease = async (req, res) => {
  const { name, slug } = req.body;
  try {
    const finalSlug = slug || generateSlug(name);
    const [disease] = await sql`
      INSERT INTO disease (name, slug) VALUES (${name}, ${finalSlug}) RETURNING *`;
    res.status(201).json(disease);
  } catch (err) {
    if (
      err.message.includes('duplicate key value violates unique constraint') &&
      err.message.includes('slug')
    ) {
      res.status(400).json({
        error:
          'A disease with this slug already exists. Please choose a different name or provide a custom slug.',
      });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
};

exports.updateDisease = async (req, res) => {
  const { name, slug } = req.body;
  try {
    const identifier = req.params.identifier;
    const finalSlug = slug || generateSlug(name);
    let whereClause;

    if (isNumericId(identifier)) {
      whereClause = sql`id = ${identifier}`;
    } else {
      whereClause = sql`slug = ${identifier}`;
    }

    const [disease] = await sql`
      UPDATE disease
      SET name=${name}, slug=${finalSlug}, updated_at=NOW()
      WHERE ${whereClause} RETURNING *`;

    if (!disease) return res.status(404).json({ error: 'Disease not found' });
    res.json(disease);
  } catch (err) {
    if (
      err.message.includes('duplicate key value violates unique constraint') &&
      err.message.includes('slug')
    ) {
      res.status(400).json({ error: 'A disease with this slug already exists. Please choose a different slug.' });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
};

exports.deleteDisease = async (req, res) => {
  try {
    const identifier = req.params.identifier;
    let whereClause;

    if (isNumericId(identifier)) {
      whereClause = sql`id = ${identifier}`;
    } else {
      whereClause = sql`slug = ${identifier}`;
    }

    const [disease] = await sql`DELETE FROM disease WHERE ${whereClause} RETURNING *`;
    if (!disease) return res.status(404).json({ error: 'Disease not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
