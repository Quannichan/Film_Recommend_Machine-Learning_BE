const express = require("express")
const {Route} = require("./router/route")
const app = express()
const http = require("http")
const server = http.createServer(app)
const port = process.env.PORT
const {testConnection} = require("./config/connectSql");

testConnection();

app.set('trust proxy', true);
app.use(express.json({ limit: '300mb' }));
app.use(express.urlencoded({limit: '300mb', extended: true }));

Route(app);

server.listen(port , ()=>{
    console.log(`App running on port ${port}`);
})