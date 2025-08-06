const getSheetsClient = require('../config/googleSheets');

const SPREADSHEET_ID = '131HPWm3xMiKbbBRAFBDhHQ35NPDhsik2VDeCd0vUC5A'; // Your actual sheet ID

async function getSheetIdByName(sheetName) {
  const sheets = await getSheetsClient();
  const meta = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
  const sheet = meta.data.sheets.find(s => s.properties.title === sheetName);
  if (!sheet) throw new Error(`Sheet "${sheetName}" not found`);
  return sheet.properties.sheetId;
}

async function appendCustomer(customer) {
  const sheets = await getSheetsClient();
  const values = [
    customer.customer_id,
    customer.name,
    customer.email,
    customer.mobile,
    customer.address,
    customer.active ? 'Active' : 'Inactive',
  ];
  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Customers!A1',
    valueInputOption: 'RAW',
    insertDataOption: 'INSERT_ROWS',
    requestBody: { values: [values] },
  });
}

async function findCustomerRowIndex(customer_id) {
  const sheets = await getSheetsClient();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Customers!A:A',
  });
  const rows = res.data.values || [];
  for (let i = 0; i < rows.length; i++) {
    if (rows[i][0] === customer_id) return i + 1;
  }
  return -1;
}

async function updateCustomer(customer, rowIndex) {
  const sheets = await getSheetsClient();
  const values = [
    customer.customer_id,
    customer.name,
    customer.email,
    customer.mobile,
    customer.address,
    customer.active ? 'Active' : 'Inactive',
  ];
  const range = `Customers!A${rowIndex}:F${rowIndex}`;
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range,
    valueInputOption: 'RAW',
    requestBody: { values: [values] },
  });
}

async function deleteCustomerRow(rowIndex) {
  const sheets = await getSheetsClient();
  const sheetId = await getSheetIdByName('Customers');
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    requestBody: {
      requests: [
        {
          deleteDimension: {
            range: {
              sheetId,
              dimension: 'ROWS',
              startIndex: rowIndex - 1,
              endIndex: rowIndex,
            },
          },
        },
      ],
    },
  });
}

module.exports = {
  getSheetsClient,
  appendCustomer,
  findCustomerRowIndex,
  updateCustomer,
  deleteCustomerRow,
};
