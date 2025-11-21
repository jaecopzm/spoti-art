import { NextRequest, NextResponse } from 'next/server';

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

async function getSpotifyToken() {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    throw new Error('Failed to get Spotify token');
  }

  const data = await response.json();
  return data.access_token;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const type = searchParams.get('type') || 'album';
    const limit = searchParams.get('limit') || '20';
    const market = searchParams.get('market');

    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }

    if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
      return NextResponse.json({ error: 'Spotify credentials not configured' }, { status: 500 });
    }

    const token = await getSpotifyToken();
    
    let searchUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=${type}&limit=${limit}`;
    if (market) {
      searchUrl += `&market=${market}`;
    }
    
    const response = await fetch(searchUrl, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to search Spotify');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Spotify search error:', error);
    return NextResponse.json({ error: 'Failed to search Spotify' }, { status: 500 });
  }
}