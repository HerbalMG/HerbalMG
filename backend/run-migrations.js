   const { Client } = require('pg');
   const fs = require('fs');
   const path = require('path');

   const client = new Client({
     connectionString: process.env.DATABASE_URL, // Use your Supabase connection string
   });

   async function runMigrations() {
     await client.connect();
     const schemaDir = path.join(__dirname, 'schema');
     const files = fs.readdirSync(schemaDir).filter(f => f.endsWith('.sql'));
     for (const file of files) {
       const sql = fs.readFileSync(path.join(schemaDir, file), 'utf8');
       console.log(`Running migration: ${file}`);
       await client.query(sql);
     }
     await client.end();
     console.log('All migrations applied!');
   }

   runMigrations().catch(err => {
     console.error(err);
     process.exit(1);
   });