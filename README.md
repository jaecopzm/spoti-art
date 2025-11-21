# Spotify Album Art Downloader

A modern web application built with Next.js that allows users to search for albums on Spotify and download high-quality album artwork.

## Features

- 🎵 Search albums, artists, and songs using Spotify's API
- 🖼️ View high-quality album artwork
- ⬇️ Download album art in original resolution
- 📱 Responsive design that works on all devices
- ⚡ Fast and intuitive user interface
- 🎨 Beautiful gradient background and modern UI

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
npm install
```

### 2. Set up Spotify API Credentials

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app or use an existing one
3. Copy your Client ID and Client Secret
4. Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

5. Add your Spotify credentials to `.env.local`:

```env
SPOTIFY_CLIENT_ID=your_spotify_client_id_here
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here
```

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## How to Use

1. Enter an album name, artist, or song in the search bar
2. Browse through the search results
3. Click the download button on any album to save the artwork
4. Click the external link icon to open the album in Spotify

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **API**: Spotify Web API
- **TypeScript**: Full type safety

## API Endpoints

- `GET /api/spotify/search` - Search for albums using Spotify API
- `GET /api/download` - Download album artwork

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── spotify/search/route.ts    # Spotify search API
│   │   └── download/route.ts          # Image download API
│   ├── globals.css                    # Global styles
│   ├── layout.tsx                     # Root layout
│   └── page.tsx                       # Main page
├── components/
│   ├── SearchBar.tsx                  # Search input component
│   └── AlbumCard.tsx                  # Album display component
├── types/
│   └── spotify.ts                     # TypeScript interfaces
└── .env.example                       # Environment variables template
```

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is for educational purposes. Make sure to comply with Spotify's Terms of Service when using their API.
