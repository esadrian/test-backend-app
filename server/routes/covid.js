const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/historical', async (req, res) => {
  try {
    const response = await axios.get(
      'https://api.covidtracking.com/v2/us/daily.json'
    );
    res.json(response.data.data); // v2 API wraps data in a 'data' property
  } catch (error) {
    console.error('COVID API Error:', error);
    res.status(500).json({ error: 'Error fetching COVID data' });
  }
});

module.exports = router;
