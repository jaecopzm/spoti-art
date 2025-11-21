# Quick Setup Guide

## 1. Get Spotify API Credentials

1. Visit [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Log in with your Spotify account
3. Click "Create App"
4. Fill in the form:
   - **App Name**: "Album Art Downloader" (or any name you prefer)
   - **App Description**: "Download album artwork"
   - **Redirect URI**: `http://localhost:3000` (not used but required)
   - **API/SDKs**: Check "Web API"
5. Click "Save"
6. In your new app's dashboard, click "Settings"
7. Copy your **Client ID** and **Client Secret**

## 2. Configure Environment Variables

Create a `.env.local` file in your project root:

```bash
SPOTIFY_CLIENT_ID=your_client_id_here
SPOTIFY_CLIENT_SECRET=your_client_secret_here
```

## 3. Start the Application

```bash
npm run dev
```

That's it! Your Spotify Album Art Downloader is ready to use at http://localhost:3000

## Troubleshooting

- **"Spotify credentials not configured"**: Make sure your `.env.local` file exists and contains valid credentials
- **Search not working**: Check that your Spotify app is not in development mode restrictions
- **Download fails**: Some images might be protected - try different albums