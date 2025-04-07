const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/genderize/:name', async (req, res) => {
  const { name } = req.params;
  try {
    const response = await axios.get(`https://api.genderize.io/?name=${name}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching gender data' });
  }
});

router.get('/nationalize/:name', async (req, res) => {
  const { name } = req.params;
  try {
    const response = await axios.get(`https://api.nationalize.io/?name=${name}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching nationality data' });
  }
});

router.get('/agify/:name', async (req, res) => {
  const { name } = req.params;
  try {
    const response = await axios.get(`https://api.agify.io/?name=${name}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching age data' });
  }
});

module.exports = router;
