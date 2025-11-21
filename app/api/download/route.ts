import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');
    const filename = searchParams.get('filename') || 'album-art.jpg';

    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
    }

    const response = await fetch(imageUrl);
    
    if (!response.ok) {
      throw new Error('Failed to fetch image');
    }

    const imageBuffer = await response.arrayBuffer();
    
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': 'image/jpeg',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json({ error: 'Failed to download image' }, { status: 500 });
  }
}