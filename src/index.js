const express = require('express');

const app = express();

const { config } = require('./config');
const platziStore = require('./routes');

const {
    logErrors,
    wrapErrors,
    errorHandler
} = require('./utils/middleware/errorHandler.js');

const notFoundHandler = require('./utils/middleware/notFoundHandler');

// body parser
app.use(express.json());

app.get('/', (req, res) => {
    const userInfo = req.header('user-agent');
    res.send(`UserInfo: ${userInfo}`);
});

platziStore(app);

// Catch 404
app.use(notFoundHandler);

// Errors middleware
app.use(logErrors);
app.use(wrapErrors);
app.use(errorHandler);

app.listen(config.port, err => {
    if (err) {
        console.error('Error: ', err); // eslint-disable-line no-console
        return;
    }
    console.log(`Listening http://localhost:${config.port}`); // eslint-disable-line no-console
});
