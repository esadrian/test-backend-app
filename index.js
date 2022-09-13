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

app.get('/api/agify/:name', async (req, res) => {
  const { name } = req.params;
  const response = await axios.get(`https://api.agify.io/?name=${name}`);
  res.json(response.data);
});

// app.get('/api/covid', async (req, res) => {
//   const response = await axios.get(
//     'https://corona.lmao.ninja/v2/continents?yesterday=true&sort'
//   );
//   res.json(response.data);
// });

// app.get('/api/covid/:countries', async (req, res) => {
//   const { countries } = req.params;
//   const response = await axios.get(
//     `https://corona.lmao.ninja/v2/countries/${countries}?yesterday=true&strict=true&query
//     `
//   );
//   res.json(response.data);
// });

app.get('/api/covid/historical', async (req, res) => {
  try {
    const response = await axios.get(`https://api.covidtracking.com/v2/us/daily.json`);
    return res.json(response.data);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: 'Error fetching data' });
  }
});
