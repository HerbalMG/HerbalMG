// utils/errorHandlers.js

function handleSlugConflictError(err, res, message) {
  if (err.message.includes('duplicate key value violates unique constraint') && err.message.includes('slug')) {
    return res.status(400).json({ error: message });
  }
  res.status(500).json({ error: err.message });
}

module.exports = { handleSlugConflictError };
