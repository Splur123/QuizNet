require('dotenv').config();
const bodyparser = require('body-parser');
const express = require('express');
const hubRoutes = require('./Routes/hubRoutes');

const app = express();
const PORT = process.env.PORT || 3000

app.set('view engine', 'ejs');
app.set('views', 'Views');

app.use(bodyparser.urlencoded());
app.use(express.static('Public'));
app.use(hubRoutes);

app.listen(PORT, () =>{
    console.log('welcome to the hub on port', PORT);
});