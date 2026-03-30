/**
 * Production server entry point
 * Runs the React Router app with SSR
 */

import express from 'express';
import { createRequestHandler } from '@react-router/express';
import * as build from './server-build';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static('public'));

// React Router SSR handler
app.all('*', createRequestHandler({ build }));

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Apex SEO running on port ${PORT}`);
  console.log(`📱 Open http://localhost:${PORT}`);
});
