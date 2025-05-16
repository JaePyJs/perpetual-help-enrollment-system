const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;

const server = http.createServer((req, res) => {
  // Serve the test-api.html file
  if (req.url === '/' || req.url === '/index.html') {
    fs.readFile(path.join(__dirname, 'test-api.html'), (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading test-api.html');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(PORT, () => {
  console.log(`Test server running at http://localhost:${PORT}/`);
});
