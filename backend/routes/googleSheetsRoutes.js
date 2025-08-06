const express = require('express');
const router = express.Router();
const getSheetsClient = require('../config/googleSheets');

const SPREADSHEET_ID = '131HPWm3xMiKbbBRAFBDhHQ35NPDhsik2VDeCd0vUC5A';

// Read data from any sheet
router.get('/sheet/:sheetName', async (req, res) => {
  try {
    const sheets = await getSheetsClient();
    const sheetName = req.params.sheetName;
    const range = `${sheetName}!A1:Z1000`; // adjust range as needed

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range,
    });

    res.json(response.data.values || []);
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to read sheet data');
  }
});

// Append a row to a sheet
router.post('/sheet/:sheetName', async (req, res) => {
  try {
    const sheets = await getSheetsClient();
    const sheetName = req.params.sheetName;
    const values = req.body.values; // Expect an array of values

    if (!Array.isArray(values)) {
      return res.status(400).send('Request body must have a "values" array');
    }

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A1`,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: { values: [values] },
    });

    res.json({ updatedRange: response.data.updates.updatedRange });
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to append data');
  }
});

module.exports = router;