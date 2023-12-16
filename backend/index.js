const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send(`Server is running at http://127.0.0.1:${port}`);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
