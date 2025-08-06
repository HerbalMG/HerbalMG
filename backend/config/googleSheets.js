// googleSheets.js
const { google } = require('googleapis');
const path = require('path');


const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, '../json/herbalmg-9a3e8-c15a18ff5a68.json'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

async function getSheetsClient() {
  const client = await auth.getClient();
  return google.sheets({ version: 'v4', auth: client });
}

module.exports = getSheetsClient;
