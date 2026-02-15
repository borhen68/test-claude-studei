import Database from 'better-sqlite3';
import postgres from 'postgres';

async function migrateAuth() {
  console.log('🔧 Starting auth migration...\n');

  if (process.env.DATABASE_URL) {
    // PostgreSQL migration
    console.log('📊 Using PostgreSQL database');
    const client = postgres(process.env.DATABASE_URL);

    try {
      // Create users table
      await client`
        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          email VARCHAR(255) NOT NULL UNIQUE,
          password TEXT NOT NULL,
          name VARCHAR(255),
          email_verified BOOLEAN NOT NULL DEFAULT FALSE,
          email_verification_token VARCHAR(255),
          email_verification_expires TIMESTAMP,
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW()
        )
      `;
      console.log('✓ Users table created');

      // Create sessions table
      await client`
        CREATE TABLE IF NOT EXISTS sessions (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          token VARCHAR(500) NOT NULL UNIQUE,
          expires_at TIMESTAMP NOT NULL,
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
        )
      `;
      console.log('✓ Sessions table created');

      // Create password_resets table
      await client`
        CREATE TABLE IF NOT EXISTS password_resets (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          token VARCHAR(255) NOT NULL UNIQUE,
          expires_at TIMESTAMP NOT NULL,
          used BOOLEAN NOT NULL DEFAULT FALSE,
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
        )
      `;
      console.log('✓ Password resets table created');

      // Add user_id to books table if it doesn't exist
      await client`
        DO $$ 
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'books' AND column_name = 'user_id'
          ) THEN
            ALTER TABLE books ADD COLUMN user_id UUID REFERENCES users(id) ON DELETE CASCADE;
          END IF;
        END $$;
      `;
      console.log('✓ Books table updated with user_id');

      await client.end();
    } catch (error) {
      console.error('❌ PostgreSQL migration failed:', error);
      await client.end();
      process.exit(1);
    }
  } else {
    // SQLite migration
    console.log('📦 Using SQLite database (local fallback)');
    const sqlite = new Database('frametale.db');

    try {
      // Create users table
      sqlite.exec(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
          email TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL,
          name TEXT,
          email_verified INTEGER NOT NULL DEFAULT 0,
          email_verification_token TEXT,
          email_verification_expires TEXT,
          created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
        CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      `);
      console.log('✓ Users table created');

      // Create sessions table
      sqlite.exec(`
        CREATE TABLE IF NOT EXISTS sessions (
          id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
          user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          token TEXT NOT NULL UNIQUE,
          expires_at TEXT NOT NULL,
          created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
        CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
        CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
      `);
      console.log('✓ Sessions table created');

      // Create password_resets table
      sqlite.exec(`
        CREATE TABLE IF NOT EXISTS password_resets (
          id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
          user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          token TEXT NOT NULL UNIQUE,
          expires_at TEXT NOT NULL,
          used INTEGER NOT NULL DEFAULT 0,
          created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
        CREATE INDEX IF NOT EXISTS idx_password_resets_token ON password_resets(token);
      `);
      console.log('✓ Password resets table created');

      // Check if books table exists and add user_id column
      const tableExists = sqlite.prepare(`
        SELECT name FROM sqlite_master WHERE type='table' AND name='books'
      `).get();

      if (tableExists) {
        const columnExists = sqlite.prepare(`
          SELECT COUNT(*) as count FROM pragma_table_info('books') WHERE name='user_id'
        `).get() as { count: number };

        if (columnExists.count === 0) {
          sqlite.exec(`ALTER TABLE books ADD COLUMN user_id TEXT REFERENCES users(id) ON DELETE CASCADE`);
          console.log('✓ Books table updated with user_id');
        } else {
          console.log('✓ Books table already has user_id column');
        }
      } else {
        console.log('⚠ Books table not found - will be created on first use');
      }

      sqlite.close();
    } catch (error) {
      console.error('❌ SQLite migration failed:', error);
      sqlite.close();
      process.exit(1);
    }
  }

  console.log('\n✅ Auth migration completed successfully!');
  console.log('\nNext steps:');
  console.log('1. Set JWT_SECRET in your .env file');
  console.log('2. Start the dev server: npm run dev');
  console.log('3. Visit http://localhost:3000/signup to create an account');
}

migrateAuth();
