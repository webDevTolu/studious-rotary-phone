const express = require('express');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 6000;

app.listen(PORT, ()=> console.log(`server listening on ${PORT}`));