# URL Shortener with Logging Middleware

This project is a simple Express.js application that provides a URL shortening service with built-in logging middleware. All requests and important events are logged to an `access.log` file.

## Features

- Shorten URLs with optional custom shortcodes
- Set validity (in minutes) for each short URL
- Redirect to original URLs using the shortcode
- View details and statistics for each shortcode
- Logs all requests and errors to `access.log`

## Endpoints

### 1. Create a Short URL

**POST** `/shorturls`

**Body:**
```json
{
  "url": "https://example.com",
  "validity": 30,         // (optional, in minutes, default: 30)
  "shortcode": "custom"   // (optional, custom shortcode)
}
```

**Response:**
```json
{
  "shortLink": "http://localhost:3799/abc123",
  "expiry": "2024-06-01T12:34:56.789Z"
}
```

### 2. Get Short URL Details

**GET** `/shorturls/:shortcode`

**Response:**
```json
{
  "url": "https://example.com",
  "createdAt": "2024-06-01T12:00:00.000Z",
  "expiry": "2024-06-01T12:30:00.000Z",
  "totalClicks": 2,
  "clickDetails": [
    {
      "timestamp": "2024-06-01T12:01:00.000Z",
      "referrer": "Direct",
      "geo": "::1"
    }
  ]
}
```

### 3. Redirect to Original URL

**GET** `/:shortcode`

- Redirects to the original URL if the shortcode is valid and not expired.
- Returns 404 if not found, 410 if expired.

## Logging

- All requests are logged with method, URL, status, and response time.
- Errors and important events (like URL creation) are logged with timestamps.
- Logs are stored in `access.log` in the project directory.
![GET](https://github.com/user-attachments/assets/c86f2947-6299-464e-8d82-f5269334579f)

## How to Run

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the server:
   ```bash
   node main.js
   ```
3. The server will run at [http://localhost:3799](http://localhost:3799)

## Notes

- All data is stored in memory; restarting the server will clear all short URLs.
- The service is for demonstration and testing purposes. 

![POST ](https://github.com/user-attachments/assets/87e59595-0227-411d-96b0-002176de671a)

![GET](https://github.com/user-attachments/assets/7c29eff5-77e7-4440-9b6b-acec56939766)
