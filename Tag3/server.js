const http = require("http");
const host = 'localhost';
const port = 8000;
const express = require('express');
const app = express();
const { name } = require('ejs');

app.get('/', (req, res) => {
    res.render("/var/www/html/index.ejs");
});


app.listen(8000);
console.log(`Server is running on http://${host}:${port}`);
