import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import db from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// API Routes

// GET all papers
app.get('/api/papers', (req, res) => {
    db.all("SELECT * FROM papers ORDER BY id DESC", [], (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json(rows);
    });
});

// GET single paper
app.get('/api/papers/:id', (req, res) => {
    const sql = "SELECT * FROM papers WHERE id = ?";
    const params = [req.params.id];
    db.get(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ "error": "Paper not found" });
            return;
        }
        res.json(row);
    });
});

// POST new paper
app.post('/api/papers', upload.single('file'), (req, res) => {
    const { title, topic, abstract, date } = req.body;
    const file = req.file ? req.file.filename : null;
    const type = req.file ? 'PDF' : 'Link';

    const sql = 'INSERT INTO papers (title, topic, abstract, type, file, date) VALUES (?,?,?,?,?,?)';
    const params = [title, topic, abstract, type, file, date];

    db.run(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": { id: result.id, title, topic, abstract, type, file, date }
        });
    });
});

// DELETE paper
app.delete('/api/papers/:id', (req, res) => {
    db.run(
        'DELETE FROM papers WHERE id = ?',
        [req.params.id],
        (err, result) => {
            if (err) {
                res.status(400).json({ "error": err.message });
                return;
            }
            res.json({ "message": "deleted", changes: result.changes });
        }
    );
});

// Cloudflare Metrics Endpoint
app.get('/api/metrics', async (req, res) => {
    const apiToken = process.env.CLOUDFLARE_API_TOKEN;
    const zoneId = process.env.CLOUDFLARE_ZONE_ID;

    if (!apiToken || !zoneId) {
        // Return mock data if not configured, for development
        return res.json({
            viewer: {
                zones: [{
                    httpRequests1dGroups: [
                        { date: { date: '2023-10-26' }, sum: { pageViews: 120, uniqueVisitors: 80 } },
                        { date: { date: '2023-10-27' }, sum: { pageViews: 150, uniqueVisitors: 90 } }
                    ]
                }]
            }
        });
    }

    try {
        const query = `
          query {
            viewer {
              zones(filter: { zoneTag: "${zoneId}" }) {
                httpRequests1dGroups(limit: 7, orderBy: [date_ASC]) {
                  date { date }
                  sum {
                    pageViews
                    uniqueVisitors
                  }
                }
              }
            }
          }
        `;

        const response = await fetch('https://api.cloudflare.com/client/v4/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiToken}`
            },
            body: JSON.stringify({ query })
        });

        const data = await response.json();
        if (data.errors) {
            console.error('Cloudflare API Errors:', data.errors);
            return res.status(500).json({ error: 'Cloudflare API error' });
        }
        res.json(data.data);
    } catch (error) {
        console.error('Metrics fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch metrics' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
