export interface SpotifyImage {
  url: string;
  height: number;
  width: number;
}

export interface SpotifyArtist {
  id: string;
  name: string;
  type: string;
  uri: string;
}

export interface SpotifyAlbum {
  id: string;
  name: string;
  artists: SpotifyArtist[];
  images: SpotifyImage[];
  release_date: string;
  total_tracks: number;
  type: string;
  uri: string;
  external_urls: {
    spotify: string;
  };
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: SpotifyArtist[];
  album: SpotifyAlbum;
  duration_ms: number;
  explicit: boolean;
  external_urls: {
    spotify: string;
  };
}

export interface SpotifyArtistFull extends SpotifyArtist {
  images: SpotifyImage[];
  followers: {
    total: number;
  };
  genres: string[];
  popularity: number;
  external_urls: {
    spotify: string;
  };
}

export interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string;
  images: SpotifyImage[];
  owner: {
    id: string;
    display_name: string;
  };
  tracks: {
    total: number;
  };
  followers?: {
    total: number;
  };
  public: boolean;
  uri: string;
  external_urls: {
    spotify: string;
  };
}

export interface SpotifySearchResponse {
  albums?: {
    items: SpotifyAlbum[];
    total: number;
  };
  artists?: {
    items: SpotifyArtistFull[];
    total: number;
  };
  tracks?: {
    items: SpotifyTrack[];
    total: number;
  };
  playlists?: {
    items: SpotifyPlaylist[];
    total: number;
  };
}