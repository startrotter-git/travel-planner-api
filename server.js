import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

// CORS設定 - すべてのオリジンを許可
app.use(cors({
  origin: '*',
  methods: ['POST', 'GET', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// ヘルスチェック
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Travel Planner API Server',
    timestamp: new Date().toISOString() 
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Places API: テキスト検索
app.post('/api/places/search', async (req, res) => {
  try {
    const { query, location, radius } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const params = new URLSearchParams({
      query,
      key: GOOGLE_MAPS_API_KEY,
      language: 'ja',
    });

    if (location) params.append('location', location);
    if (radius) params.append('radius', radius);

    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?${params}`
    );

    res.json(response.data);
  } catch (error) {
    console.error('Places search error:', error.message);
    res.status(500).json({ 
      error: 'Failed to search places',
      details: error.response?.data || error.message 
    });
  }
});

// Places API: 場所の詳細
app.post('/api/places/details', async (req, res) => {
  try {
    const { placeId } = req.body;

    if (!placeId) {
      return res.status(400).json({ error: 'Place ID is required' });
    }

    const params = new URLSearchParams({
      place_id: placeId,
      fields: 'name,rating,reviews,formatted_address,opening_hours,price_level,user_ratings_total,geometry',
      key: GOOGLE_MAPS_API_KEY,
      language: 'ja',
    });

    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/details/json?${params}`
    );

    res.json(response.data);
  } catch (error) {
    console.error('Place details error:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch place details',
      details: error.response?.data || error.message 
    });
  }
});

// Directions API: ルート検索
app.post('/api/directions', async (req, res) => {
  try {
    const { origin, destination, mode, waypoints } = req.body;

    if (!origin || !destination) {
      return res.status(400).json({ error: 'Origin and destination are required' });
    }

    const params = new URLSearchParams({
      origin,
      destination,
      mode: mode || 'transit',
      key: GOOGLE_MAPS_API_KEY,
      language: 'ja',
    });

    if (waypoints && waypoints.length > 0) {
      params.append('waypoints', waypoints.join('|'));
    }

    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/directions/json?${params}`
    );

    res.json(response.data);
  } catch (error) {
    console.error('Directions error:', error.message);
    res.status(500).json({ 
      error: 'Failed to get directions',
      details: error.response?.data || error.message 
    });
  }
});

// Distance Matrix API: 複数地点間の距離・時間
app.post('/api/distance-matrix', async (req, res) => {
  try {
    const { origins, destinations, mode } = req.body;

    if (!origins || !destinations) {
      return res.status(400).json({ error: 'Origins and destinations are required' });
    }

    const params = new URLSearchParams({
      origins: Array.isArray(origins) ? origins.join('|') : origins,
      destinations: Array.isArray(destinations) ? destinations.join('|') : destinations,
      mode: mode || 'transit',
      key: GOOGLE_MAPS_API_KEY,
      language: 'ja',
    });

    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/distancematrix/json?${params}`
    );

    res.json(response.data);
  } catch (error) {
    console.error('Distance matrix error:', error.message);
    res.status(500).json({ 
      error: 'Failed to calculate distances',
      details: error.response?.data || error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
});
