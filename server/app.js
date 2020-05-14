const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');

const apiRouter = require('./routers/apiRouter');
const authController = require('./controllers/authController');

const app = express();
const port = 3000;

app.use(cookieParser(), express.json(), express.urlencoded({ extended: true }));

app.get('/', (req, res) => res.status(200).sendFile(path.resolve(__dirname, '../index.html')));
app.use("/build", express.static(path.resolve(__dirname, "../build")));

app.get('/authorize', authController.authorize, (req, res) => res.status(200).send("Authorized"));

app.use('/api', apiRouter);

app.use('/', (req, res) => res.status(404).send("Not Found"));
app.use((err, req, res, next) => res.status(500).send("Internal Server Error"));

app.listen(port, () => console.log(`listening on port ${port}...`));
