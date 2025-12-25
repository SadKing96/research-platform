import sqlite3 from 'sqlite3';
import pg from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let db;

if (process.env.DATABASE_URL) {
    console.log('Using PostgreSQL database');
    const pool = new pg.Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });

    // Initialize table for PG
    pool.query(`CREATE TABLE IF NOT EXISTS papers (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      topic TEXT NOT NULL,
      abstract TEXT,
      type TEXT,
      file TEXT,
      date TEXT
    )`).catch(err => console.error('Error creating table in PG', err));

    // Convert '?' style params to '$1', '$2' etc
    const convertSql = (sql) => {
        let i = 1;
        return sql.replace(/\?/g, () => `$${i++}`);
    };

    db = {
        all: (sql, params, cb) => {
            const pgSql = convertSql(sql);
            pool.query(pgSql, params, (err, res) => {
                if (err) return cb(err);
                cb(null, res.rows);
            });
        },
        get: (sql, params, cb) => {
            const pgSql = convertSql(sql);
            pool.query(pgSql, params, (err, res) => {
                if (err) return cb(err);
                cb(null, res.rows[0]);
            });
        },
        run: (sql, params, cb) => {
            let pgSql = convertSql(sql);

            // Handle INSERT RETURNING ID for PG
            if (pgSql.trim().toUpperCase().startsWith('INSERT')) {
                pgSql += ' RETURNING id';
            }

            pool.query(pgSql, params, (err, res) => {
                if (err) return cb(err);

                const result = {
                    id: res.rows[0]?.id,
                    changes: res.rowCount
                };
                // Bind 'this' context for legacy compatibility if possible, 
                // but better to pass result object to callback.
                // We will update standard usage to use the result object.
                cb(null, result);
            });
        }
    };

} else {
    console.log('Using SQLite database');
    const dbPath = path.join(__dirname, 'research.db');
    const sqlite3Verbose = sqlite3.verbose();
    const localDb = new sqlite3Verbose.Database(dbPath, (err) => {
        if (err) {
            console.error('Error opening database ' + dbPath, err);
        } else {
            console.log('Connected to the SQLite database.');
            localDb.run(`CREATE TABLE IF NOT EXISTS papers (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              title TEXT NOT NULL,
              topic TEXT NOT NULL,
              abstract TEXT,
              type TEXT,
              file TEXT,
              date TEXT
            )`, (err) => {
                if (err) console.error('Error creating table', err);
            });
        }
    });

    // Wrapper to standardize callback signature
    db = {
        all: (sql, params, cb) => localDb.all(sql, params, cb),
        get: (sql, params, cb) => localDb.get(sql, params, cb),
        run: (sql, params, cb) => {
            localDb.run(sql, params, function (err) {
                if (err) return cb(err);
                // In sqlite3, 'this' contains lastID and changes
                cb(null, { id: this.lastID, changes: this.changes });
            });
        }
    };
}

export default db;
