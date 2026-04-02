import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

// Create server.js from server.ts
const serverCode = `
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files from public
app.use(express.static(join(__dirname, '../public')));

// Static files from dist (built React app)
app.use(express.static(join(__dirname)));

// API routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'Apex SEO' });
});

// Webhooks
app.post('/webhooks/app/uninstalled', (req, res) => {
  console.log('App uninstalled:', req.body);
  res.json({ received: true });
});

app.post('/webhooks/products/update', (req, res) => {
  console.log('Product updated:', req.body);
  res.json({ received: true });
});

// SPA fallback - serve React app
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'), (err) => {
    if (err) {
      res.status(404).send('App not built. Run: npm run build');
    }
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(\`🚀 Apex SEO running on http://localhost:\${PORT}\`);
  console.log(\`📱 API: http://localhost:\${PORT}/api/health\`);
  console.log(\`📧 Webhooks ready at http://localhost:\${PORT}/webhooks\`);
});

export default app;
`;

fs.writeFileSync(path.join(distDir, 'server.js'), serverCode);
console.log('✅ Server built to dist/server.js');
