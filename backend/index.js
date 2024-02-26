const express = require('express');

const app = express();
const port = 3000;

const cors = require('cors');
app.use(cors({ origin: 'http://localhost:4200' }));

const bodyParser = require('body-parser');
app.use(bodyParser.json());

var admin = require("firebase-admin");
var serviceAccount = require("./kanban-d66f1-firebase-adminsdk-1xlx0-db55c62e7b.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

app.get('/', (req, res) => {
  res.send(`Server is running at http://localhost:${port}`);
});

const authRouter = require('./src/routes/auth');
app.use('/auth', authRouter);

const projectRouter = require('./src/routes/project');
app.use('/project', projectRouter);

const taskRouter = require('./src/routes/task');
app.use('/task', taskRouter);

const notificationsRouter = require('./src/routes/notifications');
app.use('/notifications', notificationsRouter);

const statsRouter = require('./src/routes/stats');
app.use('/stats', statsRouter);

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

module.exports = app;
