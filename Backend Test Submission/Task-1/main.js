const express = require('express');
const app = express();
app.use(express.json());

const fs = require('fs');
const path = require('path');
const logFile = path.join(__dirname, 'access.log');

const urlStore = {};

function logToFile(message) {
  fs.appendFileSync(logFile, message + '\n');
}

function loggingMiddleware(req, res, next) {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logEntry = `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`;
    logToFile(logEntry);
  });
  next();
}

app.use(loggingMiddleware);

function generateShortcode(length = 6) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

app.post('/shorturls', (req, res) => {
  const { url, validity = 30, shortcode } = req.body;


  try {
    new URL(url);
  } catch {
    logToFile(`[${new Date().toISOString()}] ERROR Invalid URL: ${url}`);
    return res.status(400).json({ error: 'Invalid URL format.' });
  }

  let code = shortcode || generateShortcode();
  if (urlStore[code]) {
    if (!shortcode) {
      do {
        code = generateShortcode();
      } while (urlStore[code]);
    } else {
      logToFile(`[${new Date().toISOString()}] ERROR Shortcode already in use: ${code}`);
      return res.status(409).json({ error: 'Shortcode already in use.' });
    }
  }

  const now = new Date();
  const expiry = new Date(now.getTime() + validity * 60000);

  urlStore[code] = {
    url,
    createdAt: now,
    expiry,
    validity,
    shortcode: code,
    clicks: 0,
    clickDetails: []
  };

  const shortLink = `http://localhost:3799/${code}`;
  logToFile(`[${new Date().toISOString()}] CREATED ShortURL: ${shortLink} for ${url}`);
  res.status(201).json({ shortLink, expiry: expiry.toISOString() });
});

app.get('/shorturls/:shortcode', (req, res) => {
  const { shortcode } = req.params;
  const entry = urlStore[shortcode];
  if (!entry) {
    return res.status(404).json({ error: 'Shortcode not found.' });
  }
  res.json({
    url: entry.url,
    createdAt: entry.createdAt,
    expiry: entry.expiry,
    totalClicks: entry.clicks,
    clickDetails: entry.clickDetails
  });
});

app.get('/:shortcode', (req, res) => {
  const { shortcode } = req.params;
  const entry = urlStore[shortcode];

  if (!entry) {
    logToFile(`[${new Date().toISOString()}] ERROR Shortcode not found: ${shortcode}`);
    return res.status(404).send('Short URL not found.');
  }

  if (new Date() > entry.expiry) {
    logToFile(`[${new Date().toISOString()}] ERROR Shortcode expired: ${shortcode}`);
    return res.status(410).send('Short URL has expired.');
  }

  entry.clicks += 1;
  entry.clickDetails.push({
    timestamp: new Date(),
    referrer: req.get('Referrer') || 'Direct',
    geo: req.ip 
  });

  res.redirect(entry.url);
});

app.listen(3799, () => {
  console.log('Server running at http://localhost:3799');
});
