const bcrypt = require('bcryptjs');
const postgres = require('postgres');

// Use your actual connection string or set DATABASE_URL in your .env
const sql = postgres(process.env.DATABASE_URL || 'postgresql://postgres.iaasozzirskirzepbfia:Supabase@DB1@aws-0-ap-south-1.pooler.supabase.com:6543/postgres');

async function createUsers() {
  const users = [
    {
      username: 'admin',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
    },
    {
      username: 'limitedadmin',
      email: 'limited@example.com',
      password: 'limited123',
      role: 'limited_admin',
    },
  ];

  for (const user of users) {
    const hash = await bcrypt.hash(user.password, 10);
    try {
      // Check if user already exists
      const [existing] = await sql`
        SELECT id, name, email, role FROM "users" WHERE email = ${user.email}
      `;
      
      if (existing) {
        console.log(`User already exists: ${user.email} (${existing.role})`);
        continue;
      }

      const [created] = await sql`
        INSERT INTO "users" (name, email, password_hash, role)
        VALUES (${user.username}, ${user.email}, ${hash}, ${user.role})
        RETURNING id, name, email, role
      `;
      
      console.log(`Created user: ${created.name} (${created.role})`);
    } catch (err) {
      console.error(`Error creating user ${user.email}:`, err.message);
    }
  }
  process.exit();
}

createUsers(); 