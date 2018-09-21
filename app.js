const express = require('express')
const app = express()

app.use('/', express.static(__dirname));

app.listen(80, () => console.log('DEV Denning online listening on port 80!'))
