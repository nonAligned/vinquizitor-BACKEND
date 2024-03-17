const http = require('http');
const app = require('./app');
const mongoose = require('mongoose');
require('dotenv').config();

const server = http.createServer(app);

//CONNECTING TO DB
mongoose.set('strictQuery', true);
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to DB;' + " Mongoose version: " + mongoose.version))
.catch(err => console.log(`Connection to DB failed: ${err}`));

server.listen(process.env.PORT, () => console.log(`Server running on port: http://localhost:${process.env.PORT};`));