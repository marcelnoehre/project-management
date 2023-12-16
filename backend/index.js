const express = require('express');
const app = express();
const port = 3000;

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const authRouter = require('./src/routes/auth');
app.use('/auth', authRouter);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
