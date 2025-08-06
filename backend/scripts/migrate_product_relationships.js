const sql = require('../config/supabase');
const fs = require('fs');
const path = require('path');

async function runMigration() {
  try {
    console.log('Starting product relationships migration...');
    
    // Read and execute the migration SQL
    const migrationPath = path.join(__dirname, '../migrations/add_product_relationships.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Split by semicolon and execute each statement
    const statements = migrationSQL.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        await sql.unsafe(statement);
        console.log('Executed:', statement.substring(0, 50) + '...');
      }
    }
    
    console.log('Migration completed successfully!');
    
    // Verify the changes
    const result = await sql`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'product' 
      AND column_name IN ('main_category_id', 'sub_category_id')`;
    
    console.log('New columns added:', result);
    
    // Check if product_disease table exists
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'product_disease'
      )`;
    
    console.log('Product-disease junction table exists:', tableExists[0].exists);
    
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    process.exit(0);
  }
}

runMigration();