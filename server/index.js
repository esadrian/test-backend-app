const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3200;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.use(cors());

// Import routes
const covidRoutes = require('./routes/covid');
const nameRoutes = require('./routes/name');

// Use routes
app.use('/api/covid', covidRoutes);
app.use('/api', nameRoutes);
