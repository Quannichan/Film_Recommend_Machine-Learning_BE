const express = require("express")
const {Route} = require("./router/route")
const app = express()
const http = require("http")
const server = http.createServer(app);
const port = process.env.PORT
const cors = require("cors");
// const {testConnection} = require("./config/connectSql");
const vf = require("./tools/VectorFilms");

// testConnection();

// const websocket = require("ws")
// const chat_socket = require("../chat/chat_socket")
// const wss = new websocket.Server({server: server, path:'/fammes/api/sk'})
// const bodyParser = require('body-parser');

// wss.on("connection", new chat_socket().connect)
app.set('trust proxy', true);
app.use(express.json({ limit: '300mb' }));
app.use(express.urlencoded({limit: '300mb', extended: true }));
// app.use(requestIp.mw());

// app.use(express.json({ limit: '50mb' }));
// app.use(express.urlencoded({ limit: '50mb', extended: true }));

// app.use(cors()); 
// app.options('*', cors({
//     origin: `https://www.tro24h.com`,
//     methods: ['GET', 'POST', 'PUT', 'DELETE', "OPTIONS"],
//     allowedHeaders: ['Origin', 'Content-Type', 'Accept', 'Tokenizer', 'Authorization'],
//     credentials: true
// }));

app.use(cors({
    // origin: [`http://localhost:5173`, `http://localhost:5174`, 'https://2bdb2c879dff.ngrok-free.app'],
    origin: [
    "http://localhost:5173",
    "http://localhost:5174",
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


vf.init()