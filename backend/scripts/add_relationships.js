const sql = require('../config/supabase');

async function addRelationships() {
  try {
    console.log('Adding relationship columns to product table...');
    
    // Add the new columns if they don't exist
    await sql`
      ALTER TABLE product 
      ADD COLUMN IF NOT EXISTS main_category_id INTEGER REFERENCES main_category(id),
      ADD COLUMN IF NOT EXISTS sub_category_id INTEGER REFERENCES sub_category(id)`;
    
    console.log('✅ Added main_category_id and sub_category_id columns');
    
    // Create indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_product_main_category ON product(main_category_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_product_sub_category ON product(sub_category_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_product_brand ON product(brand_id)`;
    
    console.log('✅ Created indexes');
    
    // Create indexes for boolean flags (only for true values)
    await sql`CREATE INDEX IF NOT EXISTS idx_product_top_products ON product(top_products) WHERE top_products = true`;
    await sql`CREATE INDEX IF NOT EXISTS idx_product_people_preferred ON product(people_preferred) WHERE people_preferred = true`;
    await sql`CREATE INDEX IF NOT EXISTS idx_product_maximum_discount ON product(maximum_discount) WHERE maximum_discount = true`;
    await sql`CREATE INDEX IF NOT EXISTS idx_product_seasonal_medicine ON product(seasonal_medicine) WHERE seasonal_medicine = true`;
    await sql`CREATE INDEX IF NOT EXISTS idx_product_frequently_bought ON product(frequently_bought) WHERE frequently_bought = true`;
    
    console.log('✅ Created boolean flag indexes');
    
    // Create product_disease junction table
    await sql`
      CREATE TABLE IF NOT EXISTS product_disease (
          id SERIAL PRIMARY KEY,
          product_id INTEGER NOT NULL REFERENCES product(id) ON DELETE CASCADE,
          disease_id INTEGER NOT NULL REFERENCES disease(id) ON DELETE CASCADE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(product_id, disease_id)
      )`;
    
    console.log('✅ Created product_disease junction table');
    
    // Create indexes for junction table
    await sql`CREATE INDEX IF NOT EXISTS idx_product_disease_product ON product_disease(product_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_product_disease_disease ON product_disease(disease_id)`;
    
    console.log('✅ Created junction table indexes');
    
    console.log('🎉 Migration completed successfully!');
    
    // Verify the changes
    const columns = await sql`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'product' 
      AND column_name IN ('main_category_id', 'sub_category_id')`;
    
    console.log('New columns:', columns);
    
    // Check if product_disease table exists
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'product_disease'
      )`;
    
    console.log('Product-disease junction table exists:', tableExists[0].exists);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    process.exit(0);
  }
}

addRelationships();