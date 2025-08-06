-- Add proper relationships to product table
-- First, add the foreign key columns
ALTER TABLE product 
ADD COLUMN IF NOT EXISTS main_category_id INTEGER REFERENCES main_category(id),
ADD COLUMN IF NOT EXISTS sub_category_id INTEGER REFERENCES sub_category(id),
ADD COLUMN IF NOT EXISTS disease_id INTEGER REFERENCES disease(id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_product_main_category ON product(main_category_id);
CREATE INDEX IF NOT EXISTS idx_product_sub_category ON product(sub_category_id);
CREATE INDEX IF NOT EXISTS idx_product_disease ON product(disease_id);
CREATE INDEX IF NOT EXISTS idx_product_brand ON product(brand_id);

-- Create indexes for boolean flags
CREATE INDEX IF NOT EXISTS idx_product_top_products ON product(top_products) WHERE top_products = true;
CREATE INDEX IF NOT EXISTS idx_product_people_preferred ON product(people_preferred) WHERE people_preferred = true;
CREATE INDEX IF NOT EXISTS idx_product_maximum_discount ON product(maximum_discount) WHERE maximum_discount = true;
CREATE INDEX IF NOT EXISTS idx_product_seasonal_medicine ON product(seasonal_medicine) WHERE seasonal_medicine = true;
CREATE INDEX IF NOT EXISTS idx_product_frequently_bought ON product(frequently_bought) WHERE frequently_bought = true;

-- Create a junction table for product-disease relationships (many-to-many)
CREATE TABLE IF NOT EXISTS product_disease (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES product(id) ON DELETE CASCADE,
    disease_id INTEGER NOT NULL REFERENCES disease(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(product_id, disease_id)
);

CREATE INDEX IF NOT EXISTS idx_product_disease_product ON product_disease(product_id);
CREATE INDEX IF NOT EXISTS idx_product_disease_disease ON product_disease(disease_id);