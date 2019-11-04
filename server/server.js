require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const PORT = parseInt(process.argv[2] || process.env.APP_PORT) || 3000;
const app = express();
const API_URL = '/api';

app.use(cors());
app.use(express.static(__dirname + '/public'));
app.use(morgan('combined'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Please see routes/search.js for /search API
require('./routes/search')(app, API_URL);
// Please see routes/books.js for /book API
require('./routes/books')(app, API_URL);

app.use((req, resp) => {
    resp.status(404).type('text/html')
    .json({message: `Not found: ${req.originalUrl}`});
});

app.listen(PORT, () => {
    console.log(`Application started at port ${PORT} on ${new Date()}`)
});

