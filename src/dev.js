const express = require("express")
const {Route} = require("./router/route")
const app = express()
const http = require("http")
const server = http.createServer(app);
const port = process.env.PORT
const cors = require("cors");
const {prisma} = require("./config/connectSql")
const path = require('path');
const rcmt = require("./tools/RecommendTools");

app.set('trust proxy', true);
app.use(express.json({ limit: '999999mb' }));
app.use(express.urlencoded({limit: '999999mb', extended: true }));

app.use(cors({
    origin: [
    "http://localhost:5173",
    "http://100.65.234.124:5173"
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', "OPTIONS"],
    allowedHeaders: ['Origin', 'Content-Type', 'Accept', 'Tokenizer', 'Authorization'],
    credentials: true
}));


app.get("/api/test", (req, res)=>{
    res.send("Hello!")
});

Route(app);

server.listen(port , ()=>{
    console.log(`App running on port ${port}`);
})

// var img_path = path.join(__dirname, "..", "images", "_films_4217.jpg");
// eColPoster.ExtractColor(img_path)
// .then((extract)=>{
//     console.log(extract);
// })

rcmt.init();