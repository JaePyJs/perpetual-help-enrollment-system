const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  console.log('Root route hit');
  res.json({ message: 'Simple server is working' });
});

app.listen(port, () => {
  console.log(`Simple server listening at http://localhost:${port}`);
});
