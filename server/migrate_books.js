
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'research.db');

const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      cover TEXT,
      summary TEXT,
      recommendation TEXT,
      date TEXT
    )`, (err) => {
        if (err) {
            console.error('Error creating books table:', err);
        } else {
            console.log('Books table verified/created successfully.');
        }
    });
});

db.close();
