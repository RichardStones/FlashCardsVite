import express from 'express';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const app = express();
const PORT = 3001;
const DATA_FILE = join(dirname(fileURLToPath(import.meta.url)), 'data.json');

app.use(express.json({ limit: '10mb' }));

// Load all collections
app.get('/api/data', (_req, res) => {
  try {
    const raw = readFileSync(DATA_FILE, 'utf-8');
    res.json(JSON.parse(raw));
  } catch {
    res.json([]);
  }
});

// Save all collections
app.put('/api/data', (req, res) => {
  writeFileSync(DATA_FILE, JSON.stringify(req.body, null, 2));
  res.json({ ok: true });
});

app.listen(PORT, () => console.log(`Data server running on http://localhost:${PORT}`));
