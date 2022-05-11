const express = require('express');
const config = require('config');
const mongoose = require('mongoose');
const PORT = config.get('port') || 5000;
const app = express();
app.use(function (req, res,next) { 
 res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header('Content-Type', 'application/json');
  res.header('Accept', '*/*');
  res.header('Access-Control-Max-Age', 500);
next();
 });
app.use(express.json({extended:true}));
app.use('/api/auth',require('./routes/auth.routes'));
app.use('/api/products',require('./routes/list_products.routes'));

async function start(){
    try {
        await mongoose.connect(config.get('mongoUri'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        app.listen(PORT, () => console.log(`app START on port...${PORT}`));
    } catch (e) {
        console.log('Server Error', e.message);
        process.exit(1);
    }
}

start();
