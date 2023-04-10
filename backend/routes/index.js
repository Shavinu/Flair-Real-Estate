const express = require('express');
const router = express.Router();
const fs = require('fs');

const files = fs.readdirSync(__dirname);

files
    .filter(f => f !== 'index.js')
    .forEach(file => {
        if (file) {
            router.use(`/api/${file.split('.').slice(0, -1).join('.')}`, require(`./${file}`));
        }
    })

module.exports = router;
