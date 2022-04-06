const { default: axios } = require('axios');
const express = require('express');

const app = express();
const PORT = 3200;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Add this to the bottom of app.js
app.get('/api/genderize/:name', async (req, res) => {
  const { name } = req.params;
  const response = await axios.get(`https://api.genderize.io/?name=${name}`);
  res.json(response.data);
});

app.get('/api/nationalize/:name', async (req, res) => {
  const { name } = req.params;
  const response = await axios.get(`https://api.nationalize.io/?name=${name}`);
  res.json(response.data);
});
